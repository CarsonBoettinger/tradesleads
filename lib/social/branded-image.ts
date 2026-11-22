import "server-only";

import sharp from "sharp";
import { getSupabaseAdmin } from "@/lib/supabase";
import { DEFAULT_THEME } from "@/lib/sites/color-theory";
import type { SiteTheme } from "@/lib/sites/types";

const OUTPUT_SIZE = 1080;
const BAR_HEIGHT = 168;

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function normalizeTheme(theme: Partial<SiteTheme> | null | undefined): SiteTheme {
  return {
    primary: theme?.primary || DEFAULT_THEME.primary,
    secondary: theme?.secondary || DEFAULT_THEME.secondary,
    accent: theme?.accent || DEFAULT_THEME.accent,
    background: theme?.background || DEFAULT_THEME.background,
    surface: theme?.surface || DEFAULT_THEME.surface,
    text: theme?.text || DEFAULT_THEME.text,
    muted: theme?.muted || DEFAULT_THEME.muted,
    fontFamily: theme?.fontFamily || DEFAULT_THEME.fontFamily,
  };
}

async function fetchBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

function buildOverlaySvg(input: {
  width: number;
  height: number;
  theme: SiteTheme;
  businessName: string;
  hasLogo: boolean;
}) {
  const name = escapeXml(input.businessName.slice(0, 42));
  const logoSlot = input.hasLogo ? BAR_HEIGHT - 48 : 28;
  const textX = logoSlot + (input.hasLogo ? 20 : 0);
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${input.width}" height="${input.height}" viewBox="0 0 ${input.width} ${input.height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${escapeXml(input.theme.secondary)}" stop-opacity="0"/>
      <stop offset="55%" stop-color="${escapeXml(input.theme.secondary)}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${escapeXml(input.theme.secondary)}" stop-opacity="0.92"/>
    </linearGradient>
  </defs>
  <rect x="0" y="${input.height - BAR_HEIGHT - 72}" width="${input.width}" height="${BAR_HEIGHT + 72}" fill="url(#fade)"/>
  <rect x="0" y="${input.height - BAR_HEIGHT}" width="${input.width}" height="${BAR_HEIGHT}" fill="${escapeXml(input.theme.primary)}"/>
  <rect x="0" y="${input.height - BAR_HEIGHT}" width="${input.width}" height="6" fill="${escapeXml(input.theme.accent)}"/>
  <text x="${textX}" y="${input.height - 72}" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="700">${name}</text>
  <text x="${textX}" y="${input.height - 36}" fill="${escapeXml(input.theme.accent)}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="600">Local trade · Book today</text>
</svg>`);
}

/**
 * Compose a square social image with brand color bar + optional logo.
 * Uploads to brand-assets and returns the public URL + asset id.
 */
export async function composeAndStoreBrandedSocialImage(input: {
  brandId: string;
  businessName: string;
  sourceUrl: string;
  theme: Partial<SiteTheme> | null | undefined;
  logoUrl?: string | null;
  sortOrder?: number;
}): Promise<{ imageAssetId: string; imageUrl: string } | null> {
  const theme = normalizeTheme(input.theme);
  const source = await fetchBuffer(input.sourceUrl);
  if (!source) return null;

  let resized: Buffer;
  try {
    resized = await sharp(source, { animated: false, failOn: "none" })
      .rotate()
      .resize(OUTPUT_SIZE, OUTPUT_SIZE, { fit: "cover", position: "centre" })
      .jpeg({ quality: 88, mozjpeg: true })
      .toBuffer();
  } catch {
    return null;
  }

  let logoPng: Buffer | null = null;
  if (input.logoUrl) {
    const logoRaw = await fetchBuffer(input.logoUrl);
    if (logoRaw) {
      try {
        logoPng = await sharp(logoRaw, { animated: false, failOn: "none" })
          .resize(96, 96, {
            fit: "inside",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .png()
          .toBuffer();
      } catch {
        logoPng = null;
      }
    }
  }

  const overlay = buildOverlaySvg({
    width: OUTPUT_SIZE,
    height: OUTPUT_SIZE,
    theme,
    businessName: input.businessName,
    hasLogo: Boolean(logoPng),
  });

  const composites: Array<{ input: Buffer; top: number; left: number }> = [
    { input: overlay, top: 0, left: 0 },
  ];
  if (logoPng) {
    composites.push({
      input: logoPng,
      top: OUTPUT_SIZE - BAR_HEIGHT + 36,
      left: 28,
    });
  }

  const composed = await sharp(resized)
    .composite(composites)
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();

  const admin = getSupabaseAdmin();
  const path = `${input.brandId}/social-branded-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.jpg`;

  const { error: uploadError } = await admin.storage
    .from("brand-assets")
    .upload(path, composed, {
      contentType: "image/jpeg",
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
      kind: "other",
      storage_path: path,
      public_url: publicData.publicUrl,
      source_url: input.sourceUrl,
      attribution: "Branded social composite",
      usage_notes: `Social branded JPEG ${OUTPUT_SIZE}x${OUTPUT_SIZE}`,
      width: OUTPUT_SIZE,
      height: OUTPUT_SIZE,
      is_primary: false,
      sort_order: input.sortOrder ?? 900,
    })
    .select("id, public_url")
    .single();

  if (error || !data?.public_url) return null;

  return {
    imageAssetId: data.id as string,
    imageUrl: data.public_url as string,
  };
}
