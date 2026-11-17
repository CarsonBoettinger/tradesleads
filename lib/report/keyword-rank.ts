import { placesConfigured, searchTextRanked } from "@/lib/report/places";
import { SERVICE_AREA_METERS } from "@/lib/report/service-area";
import type { KeywordRank } from "@/lib/report/types";

export function localSearchConfigured() {
  return placesConfigured();
}

function normalizeName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function namesMatch(a: string, b: string) {
  const left = normalizeName(a);
  const right = normalizeName(b);
  if (!left || !right) return false;
  return left === right || left.includes(right) || right.includes(left);
}

/**
 * Rank a trade keyword with in-house Google Places Text Search
 * (local results proxy for the old SerpAPI map pack check).
 */
export async function rankKeyword(input: {
  keyword: string;
  businessName: string;
  placeId: string | null;
  lat: number | null;
  lng: number | null;
}): Promise<KeywordRank> {
  const places = await searchTextRanked({
    textQuery: input.keyword,
    lat: input.lat,
    lng: input.lng,
    radiusMeters: SERVICE_AREA_METERS,
    pageSize: 20,
  });

  let mapPackPosition: number | null = null;
  const targetPlaceId = input.placeId?.replace(/^places\//, "") ?? null;

  for (let i = 0; i < places.length; i += 1) {
    const candidate = places[i];
    if (targetPlaceId && candidate.placeId === targetPlaceId) {
      mapPackPosition = i + 1;
      break;
    }
    if (namesMatch(candidate.name, input.businessName)) {
      mapPackPosition = i + 1;
      break;
    }
  }

  return {
    keyword: input.keyword,
    mapPackPosition,
    // Organic web SERP is not available from Places; scoring treats this as local-only.
    organicPosition: null,
    inMapPack: mapPackPosition != null && mapPackPosition <= 3,
  };
}

export async function rankKeywords(input: {
  keywords: string[];
  businessName: string;
  placeId: string | null;
  lat: number | null;
  lng: number | null;
  limit?: number;
}): Promise<KeywordRank[]> {
  const limit = Math.max(1, Math.min(input.limit ?? 3, 5));
  const selected = input.keywords.slice(0, limit);
  const results: KeywordRank[] = [];

  // Keep sequential to stay gentle on Places quotas.
  for (const keyword of selected) {
    try {
      results.push(
        await rankKeyword({
          keyword,
          businessName: input.businessName,
          placeId: input.placeId,
          lat: input.lat,
          lng: input.lng,
        }),
      );
    } catch (error) {
      console.error("Keyword rank failed:", keyword, error);
      results.push({
        keyword,
        mapPackPosition: null,
        organicPosition: null,
        inMapPack: false,
      });
    }
  }

  return results;
}
