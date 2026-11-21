import "server-only";

import { getPlaceDetails } from "@/lib/report/places";
import { inferTrade, isReportTrade } from "@/lib/report/keywords";
import type { PlaceDetails, ReportTrade } from "@/lib/report/types";
import type { BrandProfilePayload } from "@/lib/sites/types";

export type ExtendedPlaceDetails = PlaceDetails & {
  editorialSummary: string | null;
  weekdayDescriptions: string[];
  photoNames: string[];
};

const SOCIAL_HOSTS = [
  "facebook.com",
  "instagram.com",
  "linkedin.com",
  "x.com",
  "twitter.com",
  "youtube.com",
  "tiktok.com",
  "yelp.com",
];

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function stripTags(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function placesFetchRaw(path: string, fieldMask: string) {
  const key = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!key) throw new Error("GOOGLE_PLACES_API_KEY is not set.");
  const response = await fetch(`https://places.googleapis.com/v1${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": fieldMask,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Places API ${response.status}: ${text.slice(0, 240)}`);
  }
  return response.json() as Promise<Record<string, unknown>>;
}

export async function getExtendedPlaceDetails(
  placeId: string,
): Promise<ExtendedPlaceDetails> {
  const base = await getPlaceDetails(placeId);
  try {
    const id = placeId.startsWith("places/") ? placeId : `places/${placeId}`;
    const place = await placesFetchRaw(
      `/${id}`,
      "editorialSummary,regularOpeningHours,photos",
    );
    const editorial = place.editorialSummary as
      | Record<string, unknown>
      | undefined;
    const hours = place.regularOpeningHours as
      | { weekdayDescriptions?: string[] }
      | undefined;
    const photos = Array.isArray(place.photos) ? place.photos : [];
    const photoNames = photos
      .map((photo) => asString((photo as Record<string, unknown>).name))
      .filter((name): name is string => Boolean(name))
      .slice(0, 8);

    return {
      ...base,
      editorialSummary: asString(editorial?.text) ?? asString(editorial?.overview),
      weekdayDescriptions: Array.isArray(hours?.weekdayDescriptions)
        ? hours!.weekdayDescriptions!.filter(
            (d): d is string => typeof d === "string",
          )
        : [],
      photoNames,
    };
  } catch {
    return {
      ...base,
      editorialSummary: null,
      weekdayDescriptions: [],
      photoNames: [],
    };
  }
}

export function placesPhotoMediaUrl(photoName: string, maxWidth = 1920) {
  const key = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!key) return null;
  const name = photoName.startsWith("places/")
    ? photoName
    : photoName;
  return `https://places.googleapis.com/v1/${name}/media?maxWidthPx=${maxWidth}&key=${key}`;
}

export type WebsiteBrandSignals = {
  url: string;
  title: string | null;
  h1: string | null;
  metaDescription: string | null;
  colors: string[];
  logoCandidates: string[];
  imageCandidates: string[];
  fonts: string[];
  socialLinks: string[];
  serviceHints: string[];
};

function absolutize(base: string, href: string | null) {
  if (!href) return null;
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

function normalizeCssHex(value: string) {
  const raw = value.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(raw)) return raw;
  if (/^#[0-9a-f]{3}$/.test(raw)) {
    return `#${raw
      .slice(1)
      .split("")
      .map((c) => c + c)
      .join("")}`;
  }
  return null;
}

function extractColors(html: string) {
  const found = new Set<string>();
  const push = (value: string | null | undefined) => {
    const hex = value ? normalizeCssHex(value) : null;
    if (hex) found.add(hex);
  };

  push(
    asString(
      html.match(
        /<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i,
      )?.[1],
    ),
  );
  push(
    asString(
      html.match(
        /<meta[^>]+name=["']msapplication-TileColor["'][^>]+content=["']([^"']+)["']/i,
      )?.[1],
    ),
  );

  for (const match of html.matchAll(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g)) {
    push(`#${match[1]}`);
    if (found.size >= 40) break;
  }
  for (const match of html.matchAll(
    /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/g,
  )) {
    const r = Number(match[1]);
    const g = Number(match[2]);
    const b = Number(match[3]);
    if ([r, g, b].every((n) => n >= 0 && n <= 255)) {
      push(
        `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`,
      );
    }
    if (found.size >= 48) break;
  }
  return [...found];
}

async function fetchTextLimited(url: string, bytes = 250_000) {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(8_000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; KalvezSiteBot/1.0; +https://kalvez.com)",
        Accept: "text/html,text/css,*/*",
      },
    });
    if (!response.ok) return null;
    return (await response.text()).slice(0, bytes);
  } catch {
    return null;
  }
}

function extractImageSrcs(html: string, baseUrl: string) {
  const urls: string[] = [];
  for (const match of html.matchAll(
    /(?:src|data-src|data-lazy-src)=["']([^"']+\.(?:jpg|jpeg|png|gif|webp)(?:\?[^"']*)?)["']/gi,
  )) {
    const abs = absolutize(baseUrl, match[1] ?? null);
    if (abs) urls.push(abs);
  }
  for (const match of html.matchAll(
    /url\((['"]?)([^)'"]+\.(?:jpg|jpeg|png|gif|webp)(?:\?[^)'"]*)?)\1\)/gi,
  )) {
    const abs = absolutize(baseUrl, match[2] ?? null);
    if (abs) urls.push(abs);
  }
  return urls;
}

async function fetchWordpressMedia(siteUrl: string) {
  try {
    const origin = new URL(siteUrl).origin;
    const response = await fetch(
      `${origin}/wp-json/wp/v2/media?per_page=40&media_type=image`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(8_000),
        headers: {
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (compatible; KalvezSiteBot/1.0; +https://kalvez.com)",
        },
      },
    );
    if (!response.ok) return [] as string[];
    const items = (await response.json()) as Array<{
      source_url?: string;
      alt_text?: string;
      title?: { rendered?: string };
      mime_type?: string;
    }>;
    if (!Array.isArray(items)) return [];

    return items
      .map((item) => {
        const url = asString(item.source_url);
        const label = `${item.alt_text ?? ""} ${item.title?.rendered ?? ""}`;
        if (!url) return null;
        if (!/\.(jpe?g|png|webp)(\?|$)/i.test(url)) return null;
        if (
          /logo|icon|favicon|screenshot|screen[-_ ]?shot|istock|stock|tarion|badge|sprite/i.test(
            `${url} ${label}`,
          )
        ) {
          return null;
        }
        return url;
      })
      .filter((url): url is string => Boolean(url))
      .slice(0, 30);
  } catch {
    return [];
  }
}

function extractFonts(html: string) {
  const fonts = new Set<string>();
  const family = html.matchAll(/font-family\s*:\s*([^;}{]+)/gi);
  for (const match of family) {
    const first = (match[1] ?? "")
      .split(",")[0]
      ?.replace(/['"]/g, "")
      .trim();
    if (
      first &&
      first.length > 1 &&
      !/inherit|initial|sans-serif|serif|monospace|system-ui/i.test(first)
    ) {
      fonts.add(first);
    }
    if (fonts.size >= 5) break;
  }
  return [...fonts];
}

export async function inspectWebsiteBrand(
  url: string,
): Promise<WebsiteBrandSignals | null> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; KalvezSiteBot/1.0; +https://kalvez.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!response.ok) return null;
    const finalUrl = response.url || url;
    const html = (await response.text()).slice(0, 500_000);

    const title =
      asString(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]) ??
      null;
    const h1Raw = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
    const h1 = h1Raw ? stripTags(h1Raw).slice(0, 200) : null;
    const metaDescription =
      asString(
        html.match(
          /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
        )?.[1],
      ) ??
      asString(
        html.match(
          /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i,
        )?.[1],
      );

    const logoFromAttrs = [
      absolutize(
        finalUrl,
        asString(
          html.match(
            /<img[^>]+(?:id|class|alt)=["'][^"']*logo[^"']*["'][^>]+src=["']([^"']+)["']/i,
          )?.[1],
        ),
      ),
      absolutize(
        finalUrl,
        asString(
          html.match(
            /<img[^>]+src=["']([^"']+)["'][^>]*(?:id|class|alt)=["'][^"']*logo[^"']*["']/i,
          )?.[1],
        ),
      ),
    ];

    // Many trade sites use filenames like logo_dark.png with empty alt/class.
    const logoFromSrc = [
      ...html.matchAll(
        /(?:src|data-src)=["']([^"']*logo[^"']*\.(?:png|jpe?g|webp|gif|svg)[^"']*)["']/gi,
      ),
    ]
      .map((m) => absolutize(finalUrl, m[1] ?? null))
      .filter((href): href is string => Boolean(href))
      .filter((href) => !/favicon|apple-touch|sprite|icon[_-]?set/i.test(href));

    const logoCandidates = [
      ...logoFromAttrs,
      ...logoFromSrc,
      absolutize(
        finalUrl,
        asString(
          html.match(
            /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
          )?.[1],
        ),
      ),
      absolutize(
        finalUrl,
        asString(
          html.match(
            /<link[^>]+rel=["'](?:apple-touch-icon|icon|shortcut icon)["'][^>]+href=["']([^"']+)["']/i,
          )?.[1],
        ),
      ),
    ].filter((v): v is string => Boolean(v));

    const imageCandidates = [
      ...logoCandidates,
      ...extractImageSrcs(html, finalUrl),
    ];

    // Prefer gallery / project / portfolio pages for real job photos.
    const galleryLinks = [
      ...html.matchAll(/href=["']([^"']+)["']/gi),
    ]
      .map((m) => absolutize(finalUrl, m[1] ?? null))
      .filter((href): href is string => Boolean(href))
      .filter((href) => {
        try {
          return new URL(href).origin === new URL(finalUrl).origin;
        } catch {
          return false;
        }
      })
      .filter((href) =>
        /gallery|project|portfolio|our-work|ourwork|photos?|images?|homes?|builds?|completed/i.test(
          href,
        ),
      )
      .slice(0, 6);

    // Follow same-origin iframes / linked CSS for richer brand assets (old builder sites).
    const sameOriginExtras = [
      ...galleryLinks,
      ...[...html.matchAll(/<iframe[^>]+src=["']([^"']+)["']/gi)].map((m) =>
        absolutize(finalUrl, m[1] ?? null),
      ),
      ...[...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi)].map(
        (m) => absolutize(finalUrl, m[1] ?? null),
      ),
    ]
      .filter((href): href is string => Boolean(href))
      .filter((href) => {
        try {
          return new URL(href).origin === new URL(finalUrl).origin;
        } catch {
          return false;
        }
      })
      .slice(0, 10);

    const extraColors: string[] = [];
    const galleryImages: string[] = [];
    for (const extraUrl of sameOriginExtras) {
      const extraHtml = await fetchTextLimited(extraUrl, 400_000);
      if (!extraHtml) continue;
      const imgs = extractImageSrcs(extraHtml, extraUrl);
      imageCandidates.push(...imgs);
      if (
        /gallery|project|portfolio|our-work|photos?|images?|homes?/i.test(
          extraUrl,
        )
      ) {
        galleryImages.push(...imgs);
      }
      extraColors.push(...extractColors(extraHtml));
    }

    // WordPress media library often holds the real job photos not embedded on the homepage.
    const wpMedia = await fetchWordpressMedia(finalUrl);
    galleryImages.unshift(...wpMedia);
    imageCandidates.push(...wpMedia);

    const socialLinks = [
      ...html.matchAll(/href=["'](https?:\/\/[^"']+)["']/gi),
    ]
      .map((m) => m[1]!)
      .filter((href) =>
        SOCIAL_HOSTS.some((host) => href.toLowerCase().includes(host)),
      )
      .slice(0, 10);

    const serviceHints = [
      ...html.matchAll(
        /<(?:li|h2|h3)[^>]*>\s*([^<]{3,60}(?:repair|install|service|cleaning|plumbing|roofing|electrical|hvac|contract|build|renovat)[^<]{0,40})\s*<\/(?:li|h2|h3)>/gi,
      ),
    ]
      .map((m) => stripTags(m[1] ?? "").slice(0, 80))
      .filter(Boolean)
      .slice(0, 12);

    const colors = [...new Set([...extractColors(html), ...extraColors])];

    return {
      url: finalUrl,
      title: title ? stripTags(title).slice(0, 160) : null,
      h1,
      metaDescription,
      colors,
      logoCandidates: [...new Set(logoCandidates)],
      // Gallery-page images first, then other page images.
      imageCandidates: [
        ...new Set([
          ...galleryImages.filter((src) => !/\.svg(\?|$)/i.test(src)),
          ...imageCandidates.filter((src) => !/\.svg(\?|$)/i.test(src)),
        ]),
      ]
        .filter((src) => !/logo|favicon|icon|sprite|avatar|badge/i.test(src))
        .slice(0, 40),
      fonts: extractFonts(html),
      socialLinks: [...new Set(socialLinks)],
      serviceHints: [...new Set(serviceHints)],
    };
  } catch {
    return null;
  }
}

export function resolveTrade(input: {
  types?: string[];
  name?: string;
  trade?: string | null;
}): ReportTrade {
  if (input.trade && isReportTrade(input.trade)) return input.trade;
  return inferTrade({ types: input.types, name: input.name });
}

export function buildBrandProfilePayload(input: {
  place: ExtendedPlaceDetails;
  web: WebsiteBrandSignals | null;
  serviceAreas: string[];
}): BrandProfilePayload {
  const services = [
    ...new Set([
      ...(input.web?.serviceHints ?? []),
      ...input.place.types
        .filter((t) => !t.includes("point_of_interest") && !t.includes("establishment"))
        .map((t) => t.replace(/_/g, " ")),
    ]),
  ].slice(0, 16);

  return {
    hours: input.place.weekdayDescriptions,
    services,
    serviceAreas: input.serviceAreas,
    description: input.place.editorialSummary ?? input.web?.metaDescription,
    reviews: input.place.reviews.map((r) => ({
      author: r.author,
      rating: r.rating,
      text: r.text,
    })),
    socialLinks: input.web?.socialLinks ?? [],
    colors: {
      primary: input.web?.colors[0] ?? null,
      secondary: input.web?.colors[1] ?? null,
      accent: input.web?.colors[2] ?? null,
    },
    palette: input.web?.colors ?? [],
    logoCandidates: input.web?.logoCandidates ?? [],
    imageCandidates: input.web?.imageCandidates ?? [],
    fonts: input.web?.fonts ?? [],
    rawHtmlSignals: {
      title: input.web?.title ?? null,
      h1: input.web?.h1 ?? null,
      metaDescription: input.web?.metaDescription ?? null,
    },
  };
}
