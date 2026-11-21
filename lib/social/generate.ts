import "server-only";

import { generateAndStoreAiPhotos } from "@/lib/sites/ai-images";
import { getBrandAssets, getBrandById, getBrandProfile, getSiteConfig } from "@/lib/sites/brands";
import { listActiveConnectionsForBrand } from "@/lib/social/connections";
import {
  createPendingPost,
  listOccupiedSlots,
  listRecentCaptions,
} from "@/lib/social/posts";
import { computeScheduleSlots, slotKey } from "@/lib/social/schedule";
import {
  getOrCreateSettings,
  listEnabledSettings,
} from "@/lib/social/settings";
import type { SocialPlatform } from "@/lib/social/types";

async function generateCaption(input: {
  businessName: string;
  trade: string | null;
  town: string | null;
  services: string[];
  keywords: string[];
  recent: string[];
}): Promise<{ caption: string; model: string | null }> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model =
    process.env.OPENAI_SOCIAL_MODEL?.trim() ||
    process.env.OPENAI_SITE_MODEL?.trim() ||
    "gpt-4.1-mini";

  const fallback = fallbackCaption(input);

  if (!apiKey) {
    return { caption: fallback, model: null };
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.8,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You write short Facebook/Instagram captions for local Canadian trade businesses.
Return JSON: {"caption":"..."}.
Rules: 1-3 short sentences + optional soft CTA. Mention the trade/town naturally. No hashtag spam (max 3). No fake reviews, prices, or urgency scams. Plain friendly voice. No exclamation overload.`,
          },
          {
            role: "user",
            content: JSON.stringify({
              businessName: input.businessName,
              trade: input.trade,
              town: input.town,
              services: input.services.slice(0, 8),
              keywords: input.keywords.slice(0, 8),
              avoidRepeating: input.recent.slice(0, 8),
            }),
          },
        ],
      }),
    });
    if (!res.ok) return { caption: fallback, model: null };
    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = json.choices?.[0]?.message?.content;
    if (!raw) return { caption: fallback, model: null };
    const parsed = JSON.parse(raw) as { caption?: string };
    const caption = parsed.caption?.trim();
    if (!caption) return { caption: fallback, model: null };
    return { caption: caption.slice(0, 2200), model };
  } catch {
    return { caption: fallback, model: null };
  }
}

function fallbackCaption(input: {
  businessName: string;
  trade: string | null;
  town: string | null;
}): string {
  const trade = input.trade ?? "home services";
  const town = input.town ?? "your area";
  return `${input.businessName} — reliable ${trade} for homes in ${town}. Local crew, clear communication, work done right. Message us to book.`;
}

async function pickImage(brandId: string, businessName: string, trade: string | null, town: string | null) {
  const assets = await getBrandAssets(brandId);
  const usable = assets.filter(
    (a) =>
      a.public_url &&
      (a.kind === "gallery" || a.kind === "hero" || a.kind === "og"),
  );
  if (usable.length > 0) {
    const pick = usable[Math.floor(Math.random() * usable.length)]!;
    return {
      imageAssetId: pick.id as string,
      imageUrl: pick.public_url as string,
      source: "brand_asset" as const,
    };
  }

  const generated = await generateAndStoreAiPhotos({
    brandId,
    businessName,
    trade,
    town,
    needed: 1,
    startOrder: assets.length + 1,
  });
  const first = generated[0];
  if (first?.public_url) {
    return {
      imageAssetId: (first.id as string) ?? null,
      imageUrl: first.public_url as string,
      source: "ai" as const,
    };
  }

  return { imageAssetId: null, imageUrl: null, source: "none" as const };
}

export async function generatePostsForBrand(brandId: string): Promise<{
  created: number;
  skipped: string | null;
}> {
  const brand = await getBrandById(brandId);
  if (!brand) return { created: 0, skipped: "brand_not_found" };

  const connections = await listActiveConnectionsForBrand(brandId);
  if (connections.length === 0) {
    return { created: 0, skipped: "no_connections" };
  }

  const settings = await getOrCreateSettings(brandId);
  if (!settings.enabled) return { created: 0, skipped: "disabled" };

  const platforms = connections.map((c) => c.platform) as SocialPlatform[];
  const occupied = new Set(
    (await listOccupiedSlots(brandId)).map((iso) => slotKey(iso)),
  );
  const slots = computeScheduleSlots({
    frequency: settings.frequency,
    timezone: settings.timezone,
    preferredHour: settings.preferredHour,
    lookAheadDays: settings.lookAheadDays,
  }).filter((iso) => !occupied.has(slotKey(iso)));

  if (slots.length === 0) return { created: 0, skipped: "pipeline_full" };

  const [profile, config, recent] = await Promise.all([
    getBrandProfile(brandId),
    getSiteConfig(brandId),
    listRecentCaptions(brandId),
  ]);

  const profileServices = profile?.payload?.services ?? [];
  const contentServices = (config?.content?.services ?? [])
    .map((s) => s.name)
    .filter(Boolean);
  const services = [...profileServices, ...contentServices].filter(
    (v, i, arr) => arr.indexOf(v) === i,
  );

  const keywords = [
    config?.keywords?.primary,
    ...(config?.keywords?.secondary ?? []),
  ].filter((v): v is string => Boolean(v));

  let created = 0;
  // Cap per run so cron stays responsive.
  for (const scheduledFor of slots.slice(0, 7)) {
    const { caption, model } = await generateCaption({
      businessName: brand.name,
      trade: brand.trade,
      town: brand.town,
      services,
      keywords,
      recent,
    });
    recent.unshift(caption);

    const image = await pickImage(
      brandId,
      brand.name,
      brand.trade,
      brand.town,
    );
    if (!image.imageUrl) {
      // Meta photo posts need a public image URL.
      continue;
    }

    await createPendingPost({
      brandId,
      caption,
      imageAssetId: image.imageAssetId,
      imageUrl: image.imageUrl,
      platforms,
      scheduledFor,
      generationMeta: {
        model,
        imageSource: image.source,
        generatedAt: new Date().toISOString(),
      },
    });
    created += 1;
  }

  return { created, skipped: created === 0 ? "no_images" : null };
}

export async function runSocialGeneratePass(): Promise<{
  brands: number;
  created: number;
  details: Array<{ brandId: string; created: number; skipped: string | null }>;
}> {
  const settings = await listEnabledSettings();
  const details: Array<{
    brandId: string;
    created: number;
    skipped: string | null;
  }> = [];
  let created = 0;

  for (const row of settings) {
    try {
      const result = await generatePostsForBrand(row.brandId);
      details.push({ brandId: row.brandId, ...result });
      created += result.created;
    } catch (err) {
      details.push({
        brandId: row.brandId,
        created: 0,
        skipped: err instanceof Error ? err.message : "error",
      });
    }
  }

  return { brands: settings.length, created, details };
}
