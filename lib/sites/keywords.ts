import "server-only";

import {
  keywordsForServiceArea,
  keywordsForTrade,
} from "@/lib/report/keywords";
import { resolveServiceAreaTowns } from "@/lib/report/service-area";
import type { ReportTrade } from "@/lib/report/types";
import type { SiteKeywords } from "@/lib/sites/types";

export async function buildSiteKeywords(input: {
  trade: ReportTrade;
  town: string | null;
  lat: number | null;
  lng: number | null;
  serviceHints?: string[];
}): Promise<SiteKeywords & { towns: string[] }> {
  const towns = await resolveServiceAreaTowns({
    homeTown: input.town,
    lat: input.lat,
    lng: input.lng,
  });

  const primaryTown = towns[0] ?? input.town ?? "your area";
  const tradeKeywords = keywordsForTrade(input.trade, primaryTown);
  const areaKeywords = keywordsForServiceArea(input.trade, towns, 8);

  const serviceKeywords = (input.serviceHints ?? [])
    .slice(0, 6)
    .map((service) =>
      primaryTown
        ? `${service} ${primaryTown}`.replace(/\s+/g, " ").trim()
        : service,
    );

  const secondary = [
    ...new Set([...tradeKeywords.slice(1), ...areaKeywords, ...serviceKeywords]),
  ].slice(0, 10);

  return {
    primary: tradeKeywords[0] ?? `${input.trade} ${primaryTown}`.trim(),
    secondary,
    serviceAreas: towns.length ? towns : primaryTown ? [primaryTown] : [],
    towns,
  };
}
