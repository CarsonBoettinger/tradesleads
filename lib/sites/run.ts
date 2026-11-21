import "server-only";

import { resolveServiceAreaTowns } from "@/lib/report/service-area";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  deriveTheme,
  extractAndCacheAssets,
} from "@/lib/sites/brand-extract";
import { scrubSiteCopy } from "@/lib/sites/copy";
import { buildImageAlt } from "@/lib/sites/image-process";
import {
  buildBrandProfilePayload,
  getExtendedPlaceDetails,
  inspectWebsiteBrand,
  placesPhotoMediaUrl,
  resolveTrade,
} from "@/lib/sites/collect";
import { estimateCostUsd, generateSiteContent } from "@/lib/sites/content";
import { appendJobLog, setJobPhase, updateJob } from "@/lib/sites/jobs";
import { buildSiteKeywords } from "@/lib/sites/keywords";
import { runSiteQa } from "@/lib/sites/qa";

export async function runGeneration(jobId: string) {
  const admin = getSupabaseAdmin();
  const { data: job, error: jobError } = await admin
    .from("generation_jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (jobError || !job) {
    throw new Error(jobError?.message ?? "Generation job not found.");
  }

  if (job.status === "ready") {
    return;
  }

  const brandId = job.brand_id as string;
  const { data: brand, error: brandError } = await admin
    .from("brands")
    .select("*")
    .eq("id", brandId)
    .single();

  if (brandError || !brand) {
    throw new Error(brandError?.message ?? "Brand not found.");
  }

  try {
    await updateJob(jobId, {
      status: "running",
      phase: "fetch",
      attempts: (job.attempts ?? 0) + 1,
      started_at: new Date().toISOString(),
      error_message: null,
    });
    await appendJobLog({
      jobId,
      brandId,
      phase: "fetch",
      message: "Fetching business information",
    });

    if (!brand.place_id) {
      throw new Error("Brand is missing a Google Place ID.");
    }

    const place = await getExtendedPlaceDetails(brand.place_id);
    const trade = resolveTrade({
      types: place.types,
      name: place.name,
      trade: brand.trade,
    });

    const web = place.website ? await inspectWebsiteBrand(place.website) : null;

    const towns = await resolveServiceAreaTowns({
      homeTown: place.town,
      lat: place.lat,
      lng: place.lng,
    });

    const existingProfile = await admin
      .from("brand_profiles")
      .select("payload")
      .eq("brand_id", brandId)
      .maybeSingle();
    const existingPayload =
      (existingProfile.data?.payload as Record<string, unknown> | null) ?? {};
    const existingHours = existingPayload.hours;

    const payload = buildBrandProfilePayload({
      place,
      web,
      serviceAreas: towns,
    });
    // Keep dashboard-edited hours when present; otherwise use Places hours.
    if (Array.isArray(existingHours) && existingHours.length > 0) {
      payload.hours = existingHours as typeof payload.hours;
    }

    await admin.from("brands").update({
      name: place.name || brand.name,
      trade,
      phone: place.phone,
      website: place.website,
      address: place.address,
      town: place.town,
      lat: place.lat,
      lng: place.lng,
      maps_uri: place.mapsUri,
      updated_at: new Date().toISOString(),
    }).eq("id", brandId);

    await admin.from("brand_profiles").upsert(
      {
        brand_id: brandId,
        place_id: place.placeId,
        payload,
        source_urls: [
          place.website,
          place.mapsUri,
          ...(web?.socialLinks ?? []),
        ].filter(Boolean),
        fetched_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "brand_id" },
    );

    await setJobPhase(jobId, brandId, "brand", "Extracting brand identity");
    const placesPhotoUrls = place.photoNames
      .map((name) => placesPhotoMediaUrl(name))
      .filter((url): url is string => Boolean(url));

    let assets: Array<{
      kind: string;
      public_url?: string | null;
      altText?: string | null;
    }> = [];
    let logoColors: string[] = [];
    try {
      const extracted = await extractAndCacheAssets({
        brandId,
        payload,
        placesPhotoUrls,
        businessName: place.name,
        trade,
        town: place.town,
      });
      assets = extracted.assets.map((asset) => ({
        kind: String(asset.kind ?? "other"),
        public_url:
          typeof asset.public_url === "string" ? asset.public_url : null,
        altText: asset.altText ?? null,
      }));
      logoColors = extracted.logoColors;
    } catch (error) {
      await appendJobLog({
        jobId,
        brandId,
        phase: "brand",
        level: "warn",
        message: "Asset extraction partially failed; continuing with theme only",
        meta: {
          error: error instanceof Error ? error.message : "unknown",
        },
      });
    }

    const theme = deriveTheme(payload, logoColors);

    await setJobPhase(
      jobId,
      brandId,
      "keywords",
      "Analyzing services and keywords",
    );
    const keywords = await buildSiteKeywords({
      trade,
      town: place.town,
      lat: place.lat,
      lng: place.lng,
      serviceHints: payload.services,
    });

    await setJobPhase(jobId, brandId, "content", "Generating SEO content");
    const generated = await generateSiteContent({
      businessName: place.name,
      trade,
      town: place.town,
      phone: place.phone,
      address: place.address,
      keywords,
      payload,
    });

    await setJobPhase(jobId, brandId, "build", "Building website");
    await setJobPhase(jobId, brandId, "assets", "Optimizing assets");

    const hasLogo = assets.some((a) => a.kind === "logo");
    const galleryAlts: Record<string, string> = {
      logo:
        assets.find((a) => a.kind === "logo")?.altText ||
        buildImageAlt({
          businessName: place.name,
          trade,
          town: place.town,
          kind: "logo",
        }),
      hero:
        assets.find((a) => a.kind === "hero")?.altText ||
        buildImageAlt({
          businessName: place.name,
          trade,
          town: place.town,
          kind: "hero",
        }),
      about:
        buildImageAlt({
          businessName: place.name,
          trade,
          town: place.town,
          kind: "gallery",
          index: 0,
        }),
    };
    assets
      .filter((a) => a.kind === "gallery")
      .forEach((asset, index) => {
        galleryAlts[`gallery-${index}`] =
          asset.altText ||
          buildImageAlt({
            businessName: place.name,
            trade,
            town: place.town,
            kind: "gallery",
            index,
          });
      });

    const contentWithAlts = scrubSiteCopy({
      ...generated.content,
      about: {
        ...generated.content.about,
        heading: "About Us",
      },
      nav: {
        links: [
          { label: "Services", href: "/#services" },
          { label: "About Us", href: "/about" },
          { label: "Gallery", href: "/#gallery" },
          { label: "Areas", href: "/#areas" },
          { label: "FAQ", href: "/#faq" },
          { label: "Contact", href: "/#contact" },
        ],
      },
      imageAlts: {
        ...(generated.content.imageAlts ?? {}),
        ...galleryAlts,
      },
    });
    const seoClean = scrubSiteCopy(generated.seo);

    const qaItems = runSiteQa({
      content: contentWithAlts,
      seo: seoClean,
      theme,
      hasLogo,
      hasContactPhone: Boolean(place.phone),
    });

    await setJobPhase(jobId, brandId, "qa", "Running quality checks");

    await admin.from("site_configs").upsert(
      {
        brand_id: brandId,
        template_id: "trade-local-v1",
        theme,
        content: contentWithAlts,
        seo: seoClean,
        keywords: {
          primary: keywords.primary,
          secondary: keywords.secondary,
          serviceAreas: keywords.serviceAreas,
        },
        qa: { items: qaItems },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "brand_id" },
    );

    const cost = estimateCostUsd(
      generated.promptTokens,
      generated.completionTokens,
    );

    await updateJob(jobId, {
      status: "ready",
      phase: "ready",
      completed_at: new Date().toISOString(),
      prompt_tokens: generated.promptTokens,
      completion_tokens: generated.completionTokens,
      estimated_cost_usd: Number(cost.toFixed(6)),
      qa: { items: qaItems },
      error_message: null,
    });

    await admin
      .from("brands")
      .update({ status: "ready", updated_at: new Date().toISOString() })
      .eq("id", brandId);

    await appendJobLog({
      jobId,
      brandId,
      phase: "ready",
      message: generated.usedAi
        ? "Website ready (AI content)"
        : "Website ready (fallback content)",
      meta: {
        promptTokens: generated.promptTokens,
        completionTokens: generated.completionTokens,
        estimatedCostUsd: cost,
        assetCount: assets.length,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Generation failed.";
    await updateJob(jobId, {
      status: "failed",
      phase: "failed",
      error_message: message,
      completed_at: new Date().toISOString(),
    });
    await admin
      .from("brands")
      .update({ status: "failed", updated_at: new Date().toISOString() })
      .eq("id", brandId);
    await appendJobLog({
      jobId,
      brandId,
      phase: "failed",
      level: "error",
      message,
    });
  }
}
