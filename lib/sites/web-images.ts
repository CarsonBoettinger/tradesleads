import "server-only";

export type WebImageHit = {
  imageUrl: string;
  pageUrl: string;
  title: string;
  width: number;
  height: number;
  score: number;
};

function nameTokens(businessName: string) {
  return (
    businessName
      .toLowerCase()
      .replace(/\b(inc|incorporated|ltd|limited|llc|corp|co|the|and|&)\b/g, " ")
      .match(/[a-z0-9]{3,}/g) ?? []
  );
}

const BLOCKED_HOSTS =
  /findagrave|ancestry|obituar|cemetery|legacy\.com|pinterest\.|ebay\.|etsy\.|aliexpress|wikipedia|wikimedia|imdb\.|reddit\.|tiktok\.|youtube\.com\/watch/i;

function mentionsBusiness(text: string, tokens: string[]) {
  if (!tokens.length) return false;
  const hay = text.toLowerCase();
  if (BLOCKED_HOSTS.test(hay)) return false;
  // Require the distinctive first token (e.g. "beisel") so we don't pull rival builders.
  if (!hay.includes(tokens[0]!)) return false;
  const hits = tokens.filter((t) => hay.includes(t)).length;
  // Surname-only hits (graves, directories) need a trade/build context or a second name token.
  if (hits >= Math.min(2, tokens.length)) return true;
  return /contract|build|home|house|construct|renovat|livabl|realtor|listing|project|develop|roof|plumb|hvac|electric/i.test(
    hay,
  );
}

function unwrapImageUrl(raw: string) {
  try {
    const url = new URL(raw);
    // Next.js image optimizer / CDN wrappers
    const nested =
      url.searchParams.get("url") ||
      url.searchParams.get("image") ||
      url.searchParams.get("src");
    if (nested) {
      try {
        return decodeURIComponent(nested);
      } catch {
        return nested;
      }
    }
    return url.toString();
  } catch {
    return raw;
  }
}

function isJunkImage(url: string, title: string) {
  const hay = `${url} ${title}`.toLowerCase();
  if (BLOCKED_HOSTS.test(hay)) return true;
  return /logo|favicon|icon|sprite|avatar|badge|tarion|flyer|postcard|banner|ad[-_ ]?1|template-|deco|watermark|stock|istock|shutterstock|floor[\s_-]?plan|elevation|elev\.|map[-_]?pin|qr[-_]?code|headstone|gravestone|cemetery|\.gif(\?|$)/i.test(
    hay,
  );
}

function scoreHit(input: {
  imageUrl: string;
  pageUrl: string;
  title: string;
  width: number;
  height: number;
  tokens: string[];
}) {
  const blob = `${input.title} ${input.pageUrl} ${input.imageUrl}`;
  if (!mentionsBusiness(blob, input.tokens)) return -1;
  if (isJunkImage(input.imageUrl, input.title)) return -1;
  if (input.width < 700 || input.height < 420) return -1;

  let score = 40;
  if (mentionsBusiness(input.title, input.tokens)) score += 50;
  if (
    /livabl|realtor|remax|zolo|listing|homes?|build|project|gallery|seashore|myseashore|wp-content\/uploads/i.test(
      `${input.pageUrl} ${input.imageUrl}`,
    )
  ) {
    score += 35;
  }
  if (/facebook\.com|instagram\.com|fbsbx\.com/i.test(input.pageUrl)) {
    // FB crawler media often 403s for bots; keep as weak signal only.
    score -= 15;
  }
  const aspect = input.width / Math.max(input.height, 1);
  if (aspect >= 1.2 && aspect <= 2.4) score += 12;
  if (input.width >= 1200) score += 10;
  if (input.width * input.height >= 1_200_000) score += 8;
  return score;
}

async function searchDuckDuckGoImages(query: string): Promise<
  Array<{
    image: string;
    url: string;
    title: string;
    width: number;
    height: number;
  }>
> {
  const home = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html",
    },
  });
  if (!home.ok) return [];
  const html = await home.text();
  const vqd =
    html.match(/vqd=["']([^"']+)["']/)?.[1] ??
    html.match(/vqd=([\d-]+)/)?.[1];
  if (!vqd) return [];

  const imgRes = await fetch(
    `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${encodeURIComponent(vqd)}&f=,,,,,&p=1`,
    {
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://duckduckgo.com/",
        Accept: "application/json",
      },
    },
  );
  if (!imgRes.ok) return [];
  const json = (await imgRes.json()) as {
    results?: Array<{
      image?: string;
      url?: string;
      title?: string;
      width?: number;
      height?: number;
    }>;
  };
  return (json.results ?? [])
    .map((r) => ({
      image: typeof r.image === "string" ? r.image : "",
      url: typeof r.url === "string" ? r.url : "",
      title: typeof r.title === "string" ? r.title : "",
      width: Number(r.width) || 0,
      height: Number(r.height) || 0,
    }))
    .filter((r) => r.image.startsWith("http"));
}

async function searchGoogleCseImages(query: string): Promise<
  Array<{
    image: string;
    url: string;
    title: string;
    width: number;
    height: number;
  }>
> {
  const cx =
    process.env.GOOGLE_CSE_ID?.trim() ||
    process.env.GOOGLE_CUSTOM_SEARCH_CX?.trim();
  const key =
    process.env.GOOGLE_CSE_API_KEY?.trim() ||
    process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!cx || !key) return [];

  const params = new URLSearchParams({
    key,
    cx,
    q: query,
    searchType: "image",
    num: "10",
    safe: "active",
    imgType: "photo",
    imgSize: "large",
    gl: "ca",
    hl: "en",
  });
  const res = await fetch(
    `https://www.googleapis.com/customsearch/v1?${params.toString()}`,
    { cache: "no-store", signal: AbortSignal.timeout(15_000) },
  );
  if (!res.ok) return [];
  const json = (await res.json()) as {
    items?: Array<{
      link?: string;
      title?: string;
      image?: {
        contextLink?: string;
        width?: number;
        height?: number;
      };
    }>;
  };
  return (json.items ?? [])
    .map((item) => ({
      image: typeof item.link === "string" ? item.link : "",
      url:
        typeof item.image?.contextLink === "string"
          ? item.image.contextLink
          : "",
      title: typeof item.title === "string" ? item.title : "",
      width: Number(item.image?.width) || 0,
      height: Number(item.image?.height) || 0,
    }))
    .filter((r) => r.image.startsWith("http"));
}

async function harvestPageImages(pageUrl: string, limit = 10) {
  try {
    const host = new URL(pageUrl).hostname;
    if (/facebook\.com|instagram\.com|youtube\.com|tiktok\.com/i.test(host)) {
      return [] as string[];
    }
    const res = await fetch(pageUrl, {
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; KalvezSiteBot/1.0; +https://kalvez.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!res.ok) return [];
    const html = (await res.text()).slice(0, 450_000);
    const found = new Set<string>();
    for (const match of html.matchAll(
      /(?:src|data-src|content)=["'](https?:\/\/[^"']+\.(?:jpe?g|png|webp)(?:\?[^"']*)?)["']/gi,
    )) {
      const raw = match[1];
      if (!raw) continue;
      const cleaned = raw.split(" ")[0]!;
      if (isJunkImage(cleaned, "")) continue;
      found.add(cleaned);
      if (found.size >= limit) break;
    }
    return [...found];
  } catch {
    return [];
  }
}

/**
 * Find public project/listing photos for a brand via Google CSE (preferred)
 * or DuckDuckGo image search (fallback). Used when the business website is thin.
 */
export async function searchBrandWebImages(input: {
  businessName: string;
  trade: string | null;
  town: string | null;
}): Promise<WebImageHit[]> {
  const tokens = nameTokens(input.businessName);
  if (!tokens.length) return [];

  const trade = (input.trade ?? "home builder").toLowerCase();
  const town = input.town ?? "";
  const queries = [
    `"${input.businessName}"`,
    `${input.businessName} ${town}`.trim(),
    `${input.businessName} ${trade} home OR house OR project`.trim(),
  ].filter((q, i, arr) => arr.indexOf(q) === i);

  const rawHits: Array<{
    image: string;
    url: string;
    title: string;
    width: number;
    height: number;
  }> = [];

  for (const query of queries.slice(0, 2)) {
    try {
      const cse = await searchGoogleCseImages(query);
      rawHits.push(...cse);
    } catch {
      // optional
    }
    try {
      const ddg = await searchDuckDuckGoImages(query);
      rawHits.push(...ddg);
    } catch {
      // optional
    }
  }

  const ranked = new Map<string, WebImageHit>();
  for (const hit of rawHits) {
    const imageUrl = unwrapImageUrl(hit.image);
    const score = scoreHit({
      imageUrl,
      pageUrl: hit.url,
      title: hit.title,
      width: hit.width,
      height: hit.height,
      tokens,
    });
    if (score < 40) continue;
    const prev = ranked.get(imageUrl);
    if (!prev || score > prev.score) {
      ranked.set(imageUrl, {
        imageUrl,
        pageUrl: hit.url,
        title: hit.title,
        width: hit.width,
        height: hit.height,
        score,
      });
    }
  }

  // Project names from matched titles (e.g. "Seashore by Beisel") unlock related microsite photos.
  const stop = new Set([
    ...tokens,
    "inc",
    "ltd",
    "home",
    "homes",
    "house",
    "houses",
    "with",
    "from",
    "photo",
    "photos",
    "image",
    "images",
    "ontario",
    "canada",
    "ripley",
    "kincardine",
    "contracting",
    "construction",
    "builder",
    "builders",
    "mariposa",
  ]);
  const projectTokens = new Set<string>();
  for (const hit of ranked.values()) {
    for (const word of hit.title.toLowerCase().match(/[a-z]{5,}/g) ?? []) {
      if (!stop.has(word)) projectTokens.add(word);
    }
  }
  for (const hit of rawHits) {
    const imageUrl = unwrapImageUrl(hit.image);
    if (ranked.has(imageUrl) || isJunkImage(imageUrl, hit.title)) continue;
    const blob = `${hit.title} ${hit.url} ${imageUrl}`.toLowerCase();
    if (BLOCKED_HOSTS.test(blob)) continue;
    const linked = [...projectTokens].some((t) => blob.includes(t));
    if (!linked) continue;
    if (
      !/home|house|exterior|interior|kitchen|build|project|listing|livabl|wp-content\/uploads/i.test(
        blob,
      )
    ) {
      continue;
    }
    if (hit.width > 0 && (hit.width < 700 || hit.height < 420)) continue;
    ranked.set(imageUrl, {
      imageUrl,
      pageUrl: hit.url,
      title: hit.title,
      width: hit.width || 1600,
      height: hit.height || 900,
      score: 62,
    });
  }

  // Harvest a few strong source pages (developer microsites, news, listings).
  const pageCandidates = [...ranked.values()]
    .filter((h) => mentionsBusiness(h.title, tokens) || h.score >= 62)
    .sort((a, b) => b.score - a.score)
    .map((h) => h.pageUrl)
    .filter(Boolean);
  const uniquePages = [...pageCandidates];
  // If a project token appears in a result host (e.g. myseashore.ca + "Seashore"), harvest it.
  for (const hit of rawHits) {
    for (const candidate of [hit.url, hit.image]) {
      try {
        const host = new URL(candidate).hostname;
        const compact = host.replace(/\./g, "");
        if ([...projectTokens].some((t) => compact.includes(t))) {
          uniquePages.push(`https://${host}/`);
          uniquePages.push(`https://${host}/homes/`);
        }
      } catch {
        // ignore
      }
    }
  }
  for (const pageUrl of [...new Set(uniquePages)].slice(0, 5)) {
    const extras = await harvestPageImages(pageUrl, 10);
    for (const imageUrl of extras) {
      if (ranked.has(imageUrl) || isJunkImage(imageUrl, "")) continue;
      ranked.set(imageUrl, {
        imageUrl,
        pageUrl,
        title: `${input.businessName} project photo`,
        width: 1600,
        height: 900,
        score: 68,
      });
    }
  }

  return [...ranked.values()].sort((a, b) => b.score - a.score).slice(0, 16);
}
