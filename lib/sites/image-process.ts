import "server-only";

import sharp from "sharp";

export type OptimizedImage = {
  buffer: Buffer;
  contentType: string;
  extension: "webp" | "png" | "jpg";
  width: number;
  height: number;
  dominantColors: string[];
};

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0"))
    .join("")}`;
}

function colorScore(r: number, g: number, b: number) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  if (lum > 0.92 || lum < 0.06) return -1;
  return sat * 2 + (1 - Math.abs(lum - 0.42));
}

/** Sample dominant usable brand colors from an image buffer. */
export async function sampleImageColors(
  input: Buffer,
  limit = 5,
): Promise<string[]> {
  try {
    const { data, info } = await sharp(input)
      .resize(48, 48, { fit: "inside" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const buckets = new Map<string, { count: number; r: number; g: number; b: number; score: number }>();
    const channels = info.channels;
    for (let i = 0; i < data.length; i += channels) {
      const a = channels === 4 ? data[i + 3]! : 255;
      if (a < 200) continue;
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;
      const score = colorScore(r, g, b);
      if (score < 0.25) continue;
      const key = `${Math.round(r / 16)}-${Math.round(g / 16)}-${Math.round(b / 16)}`;
      const existing = buckets.get(key);
      if (existing) {
        existing.count += 1;
        existing.r += r;
        existing.g += g;
        existing.b += b;
      } else {
        buckets.set(key, { count: 1, r, g, b, score });
      }
    }

    return [...buckets.values()]
      .map((bucket) => ({
        hex: rgbToHex(
          bucket.r / bucket.count,
          bucket.g / bucket.count,
          bucket.b / bucket.count,
        ),
        weight: bucket.count * bucket.score,
      }))
      .sort((a, b) => b.weight - a.weight)
      .map((item) => item.hex)
      .filter((hex, index, arr) => arr.indexOf(hex) === index)
      .slice(0, limit);
  } catch {
    return [];
  }
}

export type PhotoQuality = {
  ok: boolean;
  width: number;
  height: number;
  /** Higher = more likely a real outdoor job/home photo. */
  jobScore: number;
};

/**
 * Score whether an image looks like a real job/home photo vs logo, flyer, or webpage screenshot.
 * Job photos tend to have natural color diversity, outdoor sky/ground structure, and fewer flat panels.
 */
export async function scoreJobPhoto(buffer: Buffer): Promise<PhotoQuality> {
  try {
    const meta = await sharp(buffer, { animated: false, failOn: "none" }).metadata();
    const width = meta.width ?? 0;
    const height = meta.height ?? 0;
    if (width < 8 || height < 8) {
      return { ok: false, width, height, jobScore: -1 };
    }

    const ratio = width / Math.max(height, 1);
    if (ratio > 2.55 || ratio < 0.48) {
      return { ok: false, width, height, jobScore: -1 };
    }

    const { data, info } = await sharp(buffer)
      .resize(96, 96, { fit: "fill" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const channels = info.channels;
    const w = info.width;
    const h = info.height;
    const colorKeys = new Set<string>();
    let sum = 0;
    let pixels = 0;
    let whiteish = 0;
    let skyish = 0;
    let earthish = 0;
    let saturatedFlat = 0;
    const greys: number[] = [];

    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const i = (y * w + x) * channels;
        const a = channels === 4 ? data[i + 3]! : 255;
        if (a < 200) continue;
        const r = data[i]!;
        const g = data[i + 1]!;
        const b = data[i + 2]!;
        const grey = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
        greys.push(grey);
        sum += grey;
        pixels += 1;
        colorKeys.add(
          `${Math.round(r / 24)}-${Math.round(g / 24)}-${Math.round(b / 24)}`,
        );

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const sat = max === 0 ? 0 : (max - min) / max;
        if (grey > 235 && sat < 0.12) whiteish += 1;
        // Sky-ish blues in the upper third
        if (y < h * 0.38 && b > r + 12 && b > g && b > 110) skyish += 1;
        // Grass / dirt / siding in the lower half
        if (y > h * 0.45 && ((g > r + 8 && g > b + 8) || (r > 70 && g > 55 && b < 90))) {
          earthish += 1;
        }
        // Large saturated panels (flyer / brand block)
        if (sat > 0.55 && grey > 40 && grey < 210) saturatedFlat += 1;
      }
    }

    if (pixels < 80) return { ok: false, width, height, jobScore: -1 };

    const mean = sum / pixels;
    let variance = 0;
    for (const grey of greys) {
      const d = grey - mean;
      variance += d * d;
    }
    variance /= pixels;

    const whiteRatio = whiteish / pixels;
    const skyRatio = skyish / pixels;
    const earthRatio = earthish / pixels;
    const flatSatRatio = saturatedFlat / pixels;

    // Reject flat icons, UI sheets, and posterized graphics.
    if (variance < 240) return { ok: false, width, height, jobScore: -1 };
    if (colorKeys.size < 12 && variance < 1000) {
      return { ok: false, width, height, jobScore: -1 };
    }
    // Webpage screenshots / logo cards are mostly white with a small content island.
    if (whiteRatio > 0.55 && colorKeys.size < 28) {
      return { ok: false, width, height, jobScore: -1 };
    }
    // Marketing graphics with huge flat brand color fields.
    if (flatSatRatio > 0.42 && skyRatio < 0.04) {
      return { ok: false, width, height, jobScore: -1 };
    }

    let jobScore =
      Math.min(colorKeys.size, 40) * 0.9 +
      Math.min(variance / 40, 35) +
      skyRatio * 120 +
      earthRatio * 90 -
      whiteRatio * 80 -
      flatSatRatio * 70;

    // Prefer landscape outdoor photos typical of finished homes / job sites.
    if (ratio >= 1.2 && ratio <= 1.85) jobScore += 22;
    // Tall phone selfies / cropped banners are usually weaker hero choices.
    if (ratio < 0.85) jobScore -= 18;
    if (skyRatio > 0.05 && earthRatio > 0.08) jobScore += 28;
    if (meta.hasAlpha && whiteRatio > 0.2) jobScore -= 25;

    const ok = jobScore >= 28;
    return { ok, width, height, jobScore };
  } catch {
    return { ok: false, width: 0, height: 0, jobScore: -1 };
  }
}

/** Reject icons, UI chrome, flyers, and tiny assets that look bad on a marketing site. */
export async function isUsablePhoto(
  buffer: Buffer,
  opts?: { minWidth?: number; minHeight?: number },
): Promise<PhotoQuality> {
  const scored = await scoreJobPhoto(buffer);
  const minW = opts?.minWidth ?? 640;
  const minH = opts?.minHeight ?? 420;
  if (scored.width < minW || scored.height < minH) {
    return { ...scored, ok: false };
  }
  return scored;
}

/**
 * Optimize and optionally upscale images for web/SEO.
 * - Converts photos to WebP
 * - Upscales small photos toward a target width
 * - Preserves transparency for logos as PNG when needed
 */
export async function optimizeImageBuffer(input: {
  buffer: Buffer;
  kind: "logo" | "hero" | "gallery" | "og" | "other";
  sourceUrl?: string;
}): Promise<OptimizedImage | null> {
  try {
    const image = sharp(input.buffer, { animated: false, failOn: "none" });
    const meta = await image.metadata();
    const width = meta.width ?? 0;
    const height = meta.height ?? 0;
    if (width < 8 || height < 8) return null;

    if (input.kind !== "logo") {
      const quality = await isUsablePhoto(input.buffer, {
        minWidth: input.kind === "hero" ? 700 : 560,
        minHeight: input.kind === "hero" ? 420 : 360,
      });
      if (!quality.ok) return null;
    }

    const dominantColors = await sampleImageColors(input.buffer);
    const isLogo = input.kind === "logo";
    const targetWidth = isLogo ? 800 : input.kind === "hero" || input.kind === "og" ? 1920 : 1600;
    const shouldUpscale = !isLogo && width > 0 && width < targetWidth * 0.85;

    let pipeline = sharp(input.buffer, { animated: false, failOn: "none" }).rotate();

    if (shouldUpscale || width > targetWidth) {
      pipeline = pipeline.resize({
        width: Math.min(Math.max(width, targetWidth), targetWidth),
        withoutEnlargement: !shouldUpscale,
        kernel: shouldUpscale ? sharp.kernel.lanczos3 : sharp.kernel.lanczos3,
        fit: "inside",
      });
    }

    if (isLogo && (meta.hasAlpha || meta.format === "gif" || meta.format === "png")) {
      const buffer = await pipeline.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
      const outMeta = await sharp(buffer).metadata();
      return {
        buffer,
        contentType: "image/png",
        extension: "png",
        width: outMeta.width ?? width,
        height: outMeta.height ?? height,
        dominantColors,
      };
    }

    const buffer = await pipeline
      .webp({ quality: 82, effort: 4 })
      .toBuffer();
    const outMeta = await sharp(buffer).metadata();
    return {
      buffer,
      contentType: "image/webp",
      extension: "webp",
      width: outMeta.width ?? width,
      height: outMeta.height ?? height,
      dominantColors,
    };
  } catch {
    return null;
  }
}

export function buildImageAlt(input: {
  businessName: string;
  trade: string | null;
  town: string | null;
  kind: string;
  index?: number;
}) {
  const trade = (input.trade ?? "local service").toLowerCase();
  const place = input.town ? ` in ${input.town}` : "";
  switch (input.kind) {
    case "logo":
      return `${input.businessName} logo`;
    case "hero":
      return `${input.businessName} ${trade} team${place}`;
    case "gallery":
      return `${input.businessName} ${trade} project photo${place}${
        input.index != null ? ` ${input.index + 1}` : ""
      }`;
    case "og":
      return `${input.businessName} ${trade}${place}`;
    default:
      return `${input.businessName} ${trade} photo${place}`;
  }
}
