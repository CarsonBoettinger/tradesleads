import "server-only";

import type { SiteTheme } from "@/lib/sites/types";

export type Rgb = { r: number; g: number; b: number };
export type Hsl = { h: number; s: number; l: number };

const DEFAULT_THEME: SiteTheme = {
  primary: "#1d4f7c",
  secondary: "#0f2d4a",
  accent: "#c9851a",
  background: "#f5f7fb",
  surface: "#ffffff",
  text: "#14233a",
  muted: "#5a6b82",
  fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
};

export function hexToRgb(hex: string): Rgb | null {
  const clean = hex.replace("#", "").trim().toLowerCase();
  if (clean.length === 3) {
    return hexToRgb(
      `#${clean
        .split("")
        .map((c) => c + c)
        .join("")}`,
    );
  }
  if (!/^[0-9a-f]{6}$/.test(clean)) return null;
  const n = Number.parseInt(clean, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((n) =>
      Math.max(0, Math.min(255, Math.round(n)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

export function normalizeHex(value: string) {
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

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: h * 360, s, l };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const hh = ((h % 360) + 360) % 360;
  if (s <= 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hk = hh / 360;
  const channel = (t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  return {
    r: Math.round(channel(hk + 1 / 3) * 255),
    g: Math.round(channel(hk) * 255),
    b: Math.round(channel(hk - 1 / 3) * 255),
  };
}

export function hslToHex(hsl: Hsl) {
  const { r, g, b } = hslToRgb(hsl);
  return rgbToHex(r, g, b);
}

export function relativeLuminance(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

export function isNearWhiteOrBlack(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;
  const { s } = rgbToHsl(rgb);
  const L = relativeLuminance(hex);
  if (L > 0.9) return true;
  // Keep dark saturated navies; only drop near-black greys.
  if (L < 0.05 && s < 0.22) return true;
  return false;
}

/** Prefer saturated brand colors from logos/CSS (including dark navy). */
export function scoreBrandColor(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return -1;
  if (isNearWhiteOrBlack(hex)) return -1;
  const { h, s, l } = rgbToHsl(rgb);
  // Soft-penalize neon yellows that win on saturation but make poor primaries.
  const huePenalty =
    rgb.r > 200 && rgb.g > 160 && rgb.b < 90 ? 0.55 : 0;
  // Dark saturated blues/navies are excellent trade primaries.
  const navyBonus = h >= 195 && h <= 250 && s > 0.35 && l < 0.35 ? 0.85 : 0;
  const lightTarget = l < 0.28 ? 0.28 : 0.38;
  return s * 2.2 + (1 - Math.abs(l - lightTarget)) + navyBonus - huePenalty;
}

/**
 * Build a full site palette from one primary using color theory:
 * - secondary: darker shade (monochrome)
 * - accent: warm gold CTA (navy when primary is already gold)
 * - background/surface/text/muted: tinted neutrals of the same hue family
 */
export function themeFromPrimary(
  primaryHex: string,
  fontFamily?: string | null,
): SiteTheme {
  const primary = normalizeHex(primaryHex) ?? DEFAULT_THEME.primary;
  const rgb = hexToRgb(primary) ?? { r: 29, g: 79, b: 124 };
  const { h, s, l } = rgbToHsl(rgb);

  const primarySat = Math.min(0.78, Math.max(0.28, s || 0.45));
  // Lift very dark logo navies into a usable UI primary without washing them out.
  const primaryLight = Math.min(0.48, Math.max(0.22, l < 0.18 ? 0.28 : l));
  const lockedPrimary = hslToHex({
    h,
    s: primarySat,
    l: primaryLight,
  });

  // Dark shade for footer / strong brand blocks
  const secondary = hslToHex({
    h,
    s: Math.min(0.7, primarySat * 0.95),
    l: Math.max(0.12, primaryLight * 0.42),
  });

  // Trade CTAs: warm gold/amber pairs with red, navy, and green.
  // Never use complementary cyan — that is what made red+mint palettes.
  // If the brand primary is already gold, use navy so buttons still contrast.
  const primaryIsGold =
    h >= 28 && h <= 62 && primarySat > 0.35 && primaryLight > 0.3;
  const accent = primaryIsGold
    ? hslToHex({ h: 212, s: 0.55, l: 0.34 })
    : hslToHex({ h: 42, s: 0.78, l: 0.52 });

  const background = hslToHex({
    h,
    s: Math.min(0.12, primarySat * 0.18),
    l: 0.97,
  });
  const surface = "#ffffff";
  const text = hslToHex({
    h,
    s: Math.min(0.4, primarySat * 0.55),
    l: 0.16,
  });
  const muted = hslToHex({
    h,
    s: Math.min(0.18, primarySat * 0.28),
    l: 0.42,
  });

  return {
    primary: lockedPrimary,
    secondary,
    accent,
    background,
    surface,
    text,
    muted,
    fontFamily: fontFamily
      ? `${fontFamily}, system-ui, sans-serif`
      : DEFAULT_THEME.fontFamily,
  };
}

export function pickPrimaryColor(candidates: string[]) {
  const ranked = [...new Set(candidates)]
    .map((value) => normalizeHex(value))
    .filter((hex): hex is string => Boolean(hex))
    .map((hex) => ({ hex, score: scoreBrandColor(hex) }))
    .filter((c) => c.score > 0.35)
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.hex ?? DEFAULT_THEME.primary;
}

export { DEFAULT_THEME };
