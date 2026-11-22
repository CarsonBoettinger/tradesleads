import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase";
import { generateAndStoreAiPhotos } from "@/lib/sites/ai-images";
import { generateAndStoreHeroVideo } from "@/lib/sites/ai-video";
import {
  DEFAULT_THEME,
  pickPrimaryColor,
  themeFromPrimary,
} from "@/lib/sites/color-theory";
import {
  buildImageAlt,
  isUsablePhoto,
  optimizeImageBuffer,
  sampleImageColors,
  scoreJobPhoto,
} from "@/lib/sites/image-process";
import { searchBrandWebImages } from "@/lib/sites/web-images";
import type { BrandProfilePayload, SiteTheme } from "@/lib/sites/types";

export function deriveTheme(
  payload: BrandProfilePayload,
  logoColors: string[] = [],
): SiteTheme {
  // Logo colors win - CSS scrapes often pick random greens/yellows from themes.
  const primary = pickPrimaryColor(
    logoColors.length > 0
      ? logoColors
      : [
          ...(payload.palette ?? []),
          payload.colors?.primary ?? "",
          payload.colors?.secondary ?? "",
          payload.colors?.accent ?? "",
        ],
  );

  return themeFromPrimary(primary, payload.fonts?.[0] ?? null);
}

function looksDecorative(url: string) {
  return /template-|deco|spacer|pixel|blank|1x1|icon|sprite|light\.png|shadow|button|arrow|favicon|emoji|ui[_-]?kit|postcard|flyer|banner|collage|lmresized|logo|og-image|opengraph|social-share|screen[-_]?shot|istock|stock|shutterstock|unsplash|tarion|layer_1|cropped\d/i.test(
    url,
  );
}

function isPlacesUrl(url: string) {
  return /places\.googleapis\.com|googleusercontent\.com|ggpht\.com/i.test(url);
}

/** URL-level prior: gallery/project photos beat logos and marketing cards. */
function urlJobBoost(url: string) {
  let score = 0;
  if (
    /gallery|project|portfolio|our-work|homes?|exterior|build|construction|completed|listing|mls|remax|zolo|realtor|\/uploads\/.*IMG_/i.test(
      url,
    )
  ) {
    score += 45;
  }
  // Camera uploads and WP scaled originals are usually real job photos.
  if (/\/IMG_\d+|\/DSC_?\d+|\/P\d{6,}|-scaled\.(jpe?g|webp)/i.test(url)) {
    score += 55;
  }
  if (isPlacesUrl(url)) score += 12;
  if (
    /livabl|realtor\.ca|remax|zolo|myseashore|wp-content\/uploads|gta-homes|listing/i.test(
      url,
    )
  ) {
    score += 28;
  }
  if (
    /logo|icon|favicon|sprite|header|banner|flyer|about|team|office|desk|floor\b|badge|screen[-_]?shot|istock|stock|cropped\d|layer_1|floor[\s_-]?plan/i.test(
      url,
    )
  ) {
    score -= 70;
  }
  return score;
}

export async function cacheRemoteAsset(input: {
  brandId: string;
  sourceUrl: string;
  kind: "logo" | "hero" | "gallery" | "og" | "other";
  attribution?: string;
  usageNotes?: string;
  altText?: string;
  isPrimary?: boolean;
  sortOrder?: number;
  requirePhotoQuality?: boolean;
  minJobScore?: number;
}) {
  const admin = getSupabaseAdmin();
  try {
    const response = await fetch(input.sourceUrl, {
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; KalvezSiteBot/1.0; +https://kalvez.com)",
        Accept: "image/*,*/*",
      },
    });
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") || "";
    const rawBuffer = Buffer.from(await response.arrayBuffer());
    if (rawBuffer.byteLength < 200 || rawBuffer.byteLength > 12_000_000) {
      return null;
    }
    // Some CDNs serve photos as application/octet-stream; accept when bytes look like an image.
    const looksLikeImage =
      contentType.startsWith("image/") ||
      contentType.includes("octet-stream") ||
      contentType.includes("binary") ||
      !contentType;
    if (contentType && !looksLikeImage) return null;

    let jobScore = 0;
    if (input.requirePhotoQuality !== false && input.kind !== "logo") {
      const quality = await isUsablePhoto(rawBuffer, {
        minWidth: input.kind === "hero" ? 700 : 560,
        minHeight: input.kind === "hero" ? 420 : 360,
      });
      jobScore = quality.jobScore + urlJobBoost(input.sourceUrl);
      const minScore = input.minJobScore ?? 40;
      if (!quality.ok || jobScore < minScore) return null;
    }

    const optimized = await optimizeImageBuffer({
      buffer: rawBuffer,
      kind: input.kind,
      sourceUrl: input.sourceUrl,
    });
    if (!optimized) return null;

    const path = `${input.brandId}/${input.kind}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${optimized.extension}`;

    const { error: uploadError } = await admin.storage
      .from("brand-assets")
      .upload(path, optimized.buffer, {
        contentType: optimized.contentType,
        upsert: false,
      });
    if (uploadError) return null;

    const { data: publicData } = admin.storage
      .from("brand-assets")
      .getPublicUrl(path);

    const { data, error } = await admin
      .from("brand_assets")
      .insert({
        brand_id: input.brandId,
        kind: input.kind,
        storage_path: path,
        public_url: publicData.publicUrl,
        source_url: input.sourceUrl,
        attribution: input.attribution ?? null,
        usage_notes:
          input.usageNotes ??
          `Optimized ${optimized.extension.toUpperCase()} ${optimized.width}x${optimized.height}`,
        width: optimized.width,
        height: optimized.height,
        is_primary: input.isPrimary ?? false,
        sort_order: input.sortOrder ?? 0,
      })
      .select("*")
      .single();

    if (error) return null;
    return {
      ...data,
      dominantColors: optimized.dominantColors,
      altText: input.altText ?? null,
      jobScore,
    };
  } catch {
    return null;
  }
}

export async function extractAndCacheAssets(input: {
  brandId: string;
  payload: BrandProfilePayload;
  placesPhotoUrls: string[];
  businessName: string;
  trade: string | null;
  town: string | null;
}) {
  const admin = getSupabaseAdmin();
  await admin.from("brand_assets").delete().eq("brand_id", input.brandId);

  const logoUrl = input.payload.logoCandidates?.[0] ?? null;
  const cached: Array<
    Record<string, unknown> & {
      dominantColors?: string[];
      altText?: string | null;
      kind?: string;
      jobScore?: number;
    }
  > = [];
  let logoColors: string[] = [];

  if (logoUrl) {
    try {
      const logoRes = await fetch(logoUrl, {
        cache: "no-store",
        signal: AbortSignal.timeout(12_000),
      });
      if (logoRes.ok) {
        const buf = Buffer.from(await logoRes.arrayBuffer());
        logoColors = await sampleImageColors(buf, 6);
      }
    } catch {
      // continue
    }

    const logo = await cacheRemoteAsset({
      brandId: input.brandId,
      sourceUrl: logoUrl,
      kind: "logo",
      attribution: `From ${input.businessName} website`,
      usageNotes: "Cached + optimized from business website",
      altText: buildImageAlt({
        businessName: input.businessName,
        trade: input.trade,
        town: input.town,
        kind: "logo",
      }),
      isPrimary: true,
      sortOrder: 0,
      requirePhotoQuality: false,
    });
    if (logo) {
      cached.push(logo);
      if (logo.dominantColors?.length) {
        logoColors = [...new Set([...logo.dominantColors, ...logoColors])];
      }
    }
  }

  // Web image search fills gaps when the business site has no project photos.
  let webImageUrls: string[] = [];
  try {
    const webHits = await searchBrandWebImages({
      businessName: input.businessName,
      trade: input.trade,
      town: input.town,
    });
    webImageUrls = webHits.map((h) => h.imageUrl);
  } catch (error) {
    console.warn(
      "[web-images] search failed",
      error instanceof Error ? error.message : error,
    );
  }

  // Rank candidates: gallery/project URLs, web search, then Places; skip logos/flyers.
  const rankedSources = [
    ...(input.payload.imageCandidates ?? []),
    ...webImageUrls,
    ...input.placesPhotoUrls,
  ]
    .filter((url) => url !== logoUrl)
    .filter((url) => !looksDecorative(url));

  const uniqueSources = [...new Set(rankedSources)].sort(
    (a, b) => urlJobBoost(b) - urlJobBoost(a),
  );

  const hasOpenAi = Boolean(process.env.OPENAI_API_KEY?.trim());
  // Prefer real job photos whenever they score well; AI only fills gaps.
  const maxRemotePhotos = 8;

  const scoredCandidates: Array<{
    url: string;
    score: number;
    width: number;
    height: number;
  }> = [];
  for (const sourceUrl of uniqueSources.slice(0, 36)) {
    try {
      const response = await fetch(sourceUrl, {
        cache: "no-store",
        redirect: "follow",
        signal: AbortSignal.timeout(12_000),
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; KalvezSiteBot/1.0; +https://kalvez.com)",
          Accept: "image/*,*/*",
        },
      });
      if (!response.ok) continue;
      const contentType = response.headers.get("content-type") || "";
      const rawBuffer = Buffer.from(await response.arrayBuffer());
      if (rawBuffer.byteLength < 8_000) continue;
      const looksLikeImage =
        contentType.startsWith("image/") ||
        contentType.includes("octet-stream") ||
        contentType.includes("binary") ||
        !contentType;
      if (contentType && !looksLikeImage) continue;
      const quality = await scoreJobPhoto(rawBuffer);
      const score = quality.jobScore + urlJobBoost(sourceUrl);
      if (!quality.ok || score < 40) continue;
      scoredCandidates.push({
        url: sourceUrl,
        score,
        width: quality.width,
        height: quality.height,
      });
    } catch {
      // skip
    }
  }

  scoredCandidates.sort((a, b) => b.score - a.score);

  // Hero prefers landscape job photos; gallery keeps overall score order.
  const landscape = scoredCandidates.filter(
    (c) => c.width / Math.max(c.height, 1) >= 1.15,
  );
  const heroUrl =
    landscape[0]?.url ?? scoredCandidates[0]?.url ?? null;
  const ordered = heroUrl
    ? [
        scoredCandidates.find((c) => c.url === heroUrl)!,
        ...scoredCandidates.filter((c) => c.url !== heroUrl),
      ]
    : scoredCandidates;

  let order = 1;
  let galleryIndex = 0;
  for (const candidate of ordered.slice(0, maxRemotePhotos)) {
    const kind = order === 1 ? "hero" : "gallery";
    const altText = buildImageAlt({
      businessName: input.businessName,
      trade: input.trade,
      town: input.town,
      kind,
      index: kind === "gallery" ? galleryIndex : undefined,
    });
    const fromPlaces = isPlacesUrl(candidate.url);
    const fromWebSearch = webImageUrls.includes(candidate.url);
    const asset = await cacheRemoteAsset({
      brandId: input.brandId,
      sourceUrl: candidate.url,
      kind,
      attribution: fromPlaces
        ? "Google Places photo"
        : fromWebSearch
          ? "Public web image search"
          : `From ${input.businessName} website`,
      usageNotes: fromPlaces
        ? "Optimized Places job photo; subject to Google Maps Platform terms"
        : fromWebSearch
          ? "Optimized project photo found via public image search"
          : "Optimized job/project photo from public website",
      altText,
      isPrimary: kind === "hero",
      sortOrder: order,
      requirePhotoQuality: true,
      minJobScore: 40,
    });
    if (asset) {
      cached.push(asset);
      if (kind === "gallery") galleryIndex += 1;
      order += 1;
    }
  }

  const photoCount = cached.filter((a) => a.kind !== "logo").length;
  const needed = hasOpenAi ? Math.max(0, 4 - photoCount) : Math.max(0, 4 - photoCount);
  if (needed > 0) {
    const aiPhotos = await generateAndStoreAiPhotos({
      brandId: input.brandId,
      businessName: input.businessName,
      trade: input.trade,
      town: input.town,
      needed,
      startOrder: order,
    });
    cached.push(...aiPhotos);
  }

  // Ensure one hero exists even if AI was unavailable.
  const hasHero = cached.some((a) => a.kind === "hero");
  if (!hasHero) {
    const firstGallery = cached.find((a) => a.kind === "gallery" && a.id);
    if (firstGallery?.id) {
      await admin
        .from("brand_assets")
        .update({ kind: "hero", is_primary: true, sort_order: 1 })
        .eq("id", firstGallery.id as string);
      firstGallery.kind = "hero";
      firstGallery.is_primary = true;
      firstGallery.sort_order = 1;
    }
  }

  const heroStill = cached.find(
    (a) => a.kind === "hero" && typeof a.public_url === "string",
  );
  if (heroStill?.public_url) {
    try {
      const heroVideo = await generateAndStoreHeroVideo({
        brandId: input.brandId,
        imageUrl: heroStill.public_url as string,
        businessName: input.businessName,
        trade: input.trade,
        town: input.town,
      });
      if (heroVideo) {
        cached.push(heroVideo);
      } else {
        console.warn("[hero-video] skipped for brand", input.brandId);
      }
    } catch (error) {
      console.warn(
        "[hero-video] unexpected error",
        error instanceof Error ? error.message : error,
      );
    }
  }

  return { assets: cached, logoColors };
}

export { DEFAULT_THEME };
