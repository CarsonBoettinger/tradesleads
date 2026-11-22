import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";

/** Featured trades with long-form guides in content/trades/{slug}.md */
export const TRADE_GUIDE_SLUGS = [
  "plumbers",
  "hvac",
  "roofers",
  "electricians",
  "general-contractors",
  "landscapers",
] as const;

export type TradeGuideSlug = (typeof TRADE_GUIDE_SLUGS)[number];

export function hasTradeGuide(slug: string): slug is TradeGuideSlug {
  return (TRADE_GUIDE_SLUGS as readonly string[]).includes(slug);
}

export function getTradeGuideMarkdown(slug: string): string | null {
  if (!hasTradeGuide(slug)) return null;

  try {
    return readFileSync(
      join(process.cwd(), "content/trades", `${slug}.md`),
      "utf8",
    ).trim();
  } catch {
    return null;
  }
}
