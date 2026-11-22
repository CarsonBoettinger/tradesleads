import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase";
import { buildImageAlt, optimizeImageBuffer } from "@/lib/sites/image-process";

async function generateOpenAiImage(prompt: string): Promise<Buffer | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  const model =
    process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-1";

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        size: "1536x1024",
        quality: "high",
      }),
    });

    if (!response.ok) {
      // Fallback to dall-e-3 if gpt-image model unavailable
      const fallback = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt,
            size: "1792x1024",
            quality: "hd",
            response_format: "b64_json",
          }),
        },
      );
      if (!fallback.ok) return null;
      const json = (await fallback.json()) as {
        data?: Array<{ b64_json?: string; url?: string }>;
      };
      const b64 = json.data?.[0]?.b64_json;
      if (b64) return Buffer.from(b64, "base64");
      const url = json.data?.[0]?.url;
      if (!url) return null;
      const img = await fetch(url);
      if (!img.ok) return null;
      return Buffer.from(await img.arrayBuffer());
    }

    const json = (await response.json()) as {
      data?: Array<{ b64_json?: string; url?: string }>;
    };
    const b64 = json.data?.[0]?.b64_json;
    if (b64) return Buffer.from(b64, "base64");
    const url = json.data?.[0]?.url;
    if (!url) return null;
    const img = await fetch(url);
    if (!img.ok) return null;
    return Buffer.from(await img.arrayBuffer());
  } catch {
    return null;
  }
}

export async function generateAndStoreAiPhotos(input: {
  brandId: string;
  businessName: string;
  trade: string | null;
  town: string | null;
  needed: number;
  startOrder: number;
  /** Optional brand palette hexes — woven into scene color cues only (no text/logos). */
  brandColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  } | null;
}): Promise<
  Array<Record<string, unknown> & { altText?: string | null; kind?: string }>
> {
  if (input.needed <= 0) return [];

  const admin = getSupabaseAdmin();
  const trade = (input.trade ?? "home services").toLowerCase();
  const place = input.town ?? "Ontario";
  const colorCue = [
    input.brandColors?.primary,
    input.brandColors?.secondary,
    input.brandColors?.accent,
  ]
    .filter(Boolean)
    .slice(0, 3)
    .join(", ");
  const paletteHint = colorCue
    ? ` Subtle environmental color accents inspired by brand palette ${colorCue} (truck accents, door trim, or landscaping tones only — never text, logos, or watermark).`
    : "";
  const prompts = [
    `Photorealistic wide exterior photo of a finished custom home built by a ${trade} in ${place}, Ontario, Canada. Golden hour, landscaped lawn, no text, no logos, no watermarks, no UI, high detail.${paletteHint}`,
    `Photorealistic street-view photo of a completed residential house project in ${place}. Natural daylight, realistic materials, no people faces, no text, no logos.${paletteHint}`,
    `Photorealistic close-up of quality ${trade} craftsmanship on a finished home exterior in ${place}. No text, no logos, no people faces.${paletteHint}`,
    `Photorealistic unmarked work truck for a local ${trade} company parked at a residential driveway in ${place}. No readable text or logos.${paletteHint}`,
    `Photorealistic active ${trade} job site with clean framing or finished siding on a home in ${place}. Natural light, no text, no logos.${paletteHint}`,
  ];

  const stored = [];
  let order = input.startOrder;
  for (let i = 0; i < input.needed; i += 1) {
    const prompt = prompts[i % prompts.length]!;
    const raw = await generateOpenAiImage(prompt);
    if (!raw) continue;

    const kind = order === 1 ? "hero" : "gallery";
    const optimized = await optimizeImageBuffer({
      buffer: raw,
      kind,
    });
    if (!optimized) continue;

    const path = `${input.brandId}/${kind}-ai-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${optimized.extension}`;

    const { error: uploadError } = await admin.storage
      .from("brand-assets")
      .upload(path, optimized.buffer, {
        contentType: optimized.contentType,
        upsert: false,
      });
    if (uploadError) continue;

    const { data: publicData } = admin.storage
      .from("brand-assets")
      .getPublicUrl(path);

    const altText = buildImageAlt({
      businessName: input.businessName,
      trade: input.trade,
      town: input.town,
      kind,
      index: kind === "gallery" ? Math.max(0, order - 2) : undefined,
    });

    const { data, error } = await admin
      .from("brand_assets")
      .insert({
        brand_id: input.brandId,
        kind,
        storage_path: path,
        public_url: publicData.publicUrl,
        source_url: null,
        attribution: "AI-generated for site preview",
        usage_notes: `AI-generated ${optimized.extension.toUpperCase()} ${optimized.width}x${optimized.height}`,
        width: optimized.width,
        height: optimized.height,
        is_primary: kind === "hero",
        sort_order: order,
      })
      .select("*")
      .single();

    if (error || !data) continue;
    stored.push({ ...data, altText, kind });
    order += 1;
  }

  return stored;
}
