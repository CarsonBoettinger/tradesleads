import "server-only";

import { competitorQueriesForTrade } from "@/lib/report/keywords";
import {
  SERVICE_AREA_METERS,
  SERVICE_AREA_MILES,
} from "@/lib/report/service-area";
import type {
  CompetitorItem,
  PlaceCandidate,
  PlaceDetails,
  ReportTrade,
  ReviewItem,
} from "@/lib/report/types";

const PLACES_BASE = "https://places.googleapis.com/v1";

/** Table A types safe for Nearby Search `includedTypes`. */
const NEARBY_TYPES: Partial<Record<ReportTrade, string[]>> = {
  Plumber: ["plumber"],
  Roofer: ["roofing_contractor"],
  Electrician: ["electrician"],
  Painter: ["painter"],
  Locksmith: ["locksmith"],
  Moving: ["moving_company"],
  "Auto repair": ["car_repair"],
  "Auto detailing": ["car_wash"],
  Towing: ["tow_truck_agency"],
};

/** Used to drop obvious non-trade results after search. */
const JUNK_TYPES = new Set([
  "supermarket",
  "grocery_store",
  "convenience_store",
  "department_store",
  "shopping_mall",
  "restaurant",
  "cafe",
  "bar",
  "meal_takeaway",
  "gas_station",
  "bank",
  "atm",
  "pharmacy",
  "drugstore",
  "hospital",
  "school",
  "church",
  "lodging",
  "hotel",
  "park",
  "parking",
  "car_dealer",
  "car_repair",
  "transit_station",
  "bus_station",
  "train_station",
]);

/** Table A only - safe for Nearby Search excludedTypes. */
const NEARBY_EXCLUDED_TYPES = [
  "supermarket",
  "grocery_store",
  "restaurant",
  "cafe",
  "gas_station",
  "bank",
  "hospital",
  "school",
  "hotel",
  "park",
];

function apiKey() {
  return process.env.GOOGLE_PLACES_API_KEY?.trim() || "";
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function placesConfigured() {
  return Boolean(apiKey());
}

async function placesFetch(path: string, init?: RequestInit) {
  const key = apiKey();
  if (!key) throw new Error("GOOGLE_PLACES_API_KEY is not set.");

  const response = await fetch(`${PLACES_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Places API ${response.status}: ${text.slice(0, 240)}`);
  }

  return response.json();
}

function mapCandidate(place: Record<string, unknown>): PlaceCandidate {
  const location = (place.location ?? {}) as Record<string, unknown>;
  const displayName = (place.displayName ?? {}) as Record<string, unknown>;
  return {
    placeId: String(place.id ?? "").replace(/^places\//, ""),
    name: asString(displayName.text) ?? "Business",
    address: asString(place.formattedAddress) ?? "",
    lat: asNumber(location.latitude),
    lng: asNumber(location.longitude),
    rating: asNumber(place.rating),
    reviewCount: asNumber(place.userRatingCount),
    types: Array.isArray(place.types)
      ? place.types.filter((t): t is string => typeof t === "string")
      : [],
  };
}

const PLACE_LIST_MASK =
  "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.types,places.primaryType";

export async function searchPlaces(query: string): Promise<PlaceCandidate[]> {
  return searchTextRanked({
    textQuery: query,
    pageSize: 8,
  });
}

/** Places Text Search ranked by relevance, optionally biased to a service area. */
export async function searchTextRanked(input: {
  textQuery: string;
  lat?: number | null;
  lng?: number | null;
  radiusMeters?: number;
  pageSize?: number;
}): Promise<PlaceCandidate[]> {
  const textQuery = input.textQuery.trim();
  if (!textQuery) return [];

  const body: Record<string, unknown> = {
    textQuery,
    pageSize: Math.max(1, Math.min(input.pageSize ?? 20, 20)),
    languageCode: "en",
    regionCode: "US",
    rankPreference: "RELEVANCE",
  };

  if (
    input.lat != null &&
    input.lng != null &&
    Number.isFinite(input.lat) &&
    Number.isFinite(input.lng)
  ) {
    body.locationBias = {
      circle: {
        center: { latitude: input.lat, longitude: input.lng },
        radius: input.radiusMeters ?? SERVICE_AREA_METERS,
      },
    };
  }

  const data = (await placesFetch("/places:searchText", {
    method: "POST",
    headers: {
      "X-Goog-FieldMask": PLACE_LIST_MASK,
    },
    body: JSON.stringify(body),
  })) as { places?: Array<Record<string, unknown>> };

  return (data.places ?? [])
    .map(mapCandidate)
    .filter((p) => Boolean(p.placeId));
}

function extractTown(address: string | null) {
  if (!address) return null;
  const parts = address.split(",").map((p) => p.trim());
  if (parts.length >= 3) return parts[parts.length - 3] ?? parts[1] ?? null;
  return parts[1] ?? parts[0] ?? null;
}

function reviewText(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    return asString((value as Record<string, unknown>).text) ?? "";
  }
  return "";
}

function mapReviews(raw: unknown): ReviewItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, 8).map((item) => {
    const review = item as Record<string, unknown>;
    const author =
      asString(
        (review.authorAttribution as Record<string, unknown> | undefined)
          ?.displayName,
      ) ?? "Customer";
    return {
      author,
      rating: asNumber(review.rating) ?? 5,
      text: reviewText(review.text) || reviewText(review.originalText),
      relativeTime: asString(review.relativePublishTimeDescription),
    };
  });
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails> {
  const id = placeId.startsWith("places/") ? placeId : `places/${placeId}`;
  const place = (await placesFetch(`/${id}`, {
    method: "GET",
    headers: {
      "X-Goog-FieldMask":
        "id,displayName,formattedAddress,location,websiteUri,nationalPhoneNumber,internationalPhoneNumber,rating,userRatingCount,reviews,googleMapsUri,types,primaryType",
    },
  })) as Record<string, unknown>;

  const displayName = (place.displayName ?? {}) as Record<string, unknown>;
  const location = (place.location ?? {}) as Record<string, unknown>;
  const address = asString(place.formattedAddress);
  const types = Array.isArray(place.types)
    ? place.types.filter((t): t is string => typeof t === "string")
    : [];
  const primaryType = asString(place.primaryType);
  if (primaryType && !types.includes(primaryType)) types.unshift(primaryType);

  return {
    placeId: String(place.id ?? placeId).replace(/^places\//, ""),
    name: asString(displayName.text) ?? "Business",
    address: address ?? "",
    town: extractTown(address),
    lat: asNumber(location.latitude),
    lng: asNumber(location.longitude),
    website: asString(place.websiteUri),
    phone:
      asString(place.nationalPhoneNumber) ??
      asString(place.internationalPhoneNumber),
    rating: asNumber(place.rating),
    reviewCount: asNumber(place.userRatingCount),
    reviews: mapReviews(place.reviews),
    mapsUri: asString(place.googleMapsUri),
    types,
  };
}

/** Types that are peers for a trade and should not be treated as junk. */
const TRADE_ALLOWED_TYPES: Partial<Record<ReportTrade, string[]>> = {
  "Auto repair": ["car_repair", "car_dealer"],
  "Auto detailing": ["car_wash", "car_repair"],
  Towing: ["tow_truck_agency", "car_repair"],
};

function isJunkPlace(place: PlaceCandidate, trade?: ReportTrade) {
  const allowed = new Set(TRADE_ALLOWED_TYPES[trade ?? "Another trade"] ?? []);
  return place.types.some(
    (type) => JUNK_TYPES.has(type) && !allowed.has(type),
  );
}

function competitorScore(place: PlaceCandidate) {
  const reviews = place.reviewCount ?? 0;
  const rating = place.rating ?? 0;
  return reviews * 2 + rating * 10;
}

function milesBetween(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.min(1, Math.sqrt(h)));
}

async function searchNearbyByType(input: {
  lat: number;
  lng: number;
  types: string[];
}): Promise<PlaceCandidate[]> {
  const data = (await placesFetch("/places:searchNearby", {
    method: "POST",
    headers: { "X-Goog-FieldMask": PLACE_LIST_MASK },
    body: JSON.stringify({
      maxResultCount: 12,
      locationRestriction: {
        circle: {
          center: { latitude: input.lat, longitude: input.lng },
          radius: SERVICE_AREA_METERS,
        },
      },
      includedTypes: input.types,
      excludedTypes: NEARBY_EXCLUDED_TYPES,
    }),
  })) as { places?: Array<Record<string, unknown>> };

  return (data.places ?? []).map(mapCandidate);
}

async function searchCompetitorsByText(input: {
  lat: number;
  lng: number;
  queries: string[];
  towns: string[];
}): Promise<PlaceCandidate[]> {
  const results: PlaceCandidate[] = [];
  const towns = input.towns.length ? input.towns.slice(0, 3) : [null];
  const query = input.queries[0];
  if (!query) return results;

  // One Places text query per nearby town to cover the service area.
  for (const town of towns) {
    const textQuery = town ? `${query} near ${town}` : `${query} near me`;
    try {
      const data = (await placesFetch("/places:searchText", {
        method: "POST",
        headers: { "X-Goog-FieldMask": PLACE_LIST_MASK },
        body: JSON.stringify({
          textQuery,
          pageSize: 8,
          locationBias: {
            circle: {
              center: { latitude: input.lat, longitude: input.lng },
              radius: SERVICE_AREA_METERS,
            },
          },
        }),
      })) as { places?: Array<Record<string, unknown>> };
      results.push(...(data.places ?? []).map(mapCandidate));
    } catch (error) {
      console.error(`Competitor text search failed for "${textQuery}":`, error);
    }
  }

  return results;
}

export async function findNearbyCompetitors(input: {
  lat: number;
  lng: number;
  trade: ReportTrade;
  excludePlaceId: string;
  towns?: string[];
}): Promise<CompetitorItem[]> {
  const nearbyTypes = NEARBY_TYPES[input.trade];
  let places: PlaceCandidate[] = [];

  if (nearbyTypes?.length) {
    try {
      places = await searchNearbyByType({
        lat: input.lat,
        lng: input.lng,
        types: nearbyTypes,
      });
    } catch (error) {
      console.error("Nearby competitor search failed:", error);
    }
  }

  if (places.length < 4) {
    const textPlaces = await searchCompetitorsByText({
      lat: input.lat,
      lng: input.lng,
      queries: competitorQueriesForTrade(input.trade),
      towns: input.towns?.length
        ? input.towns
        : [],
    });
    places = [...places, ...textPlaces];
  }

  const origin = { lat: input.lat, lng: input.lng };
  const seen = new Set<string>();
  return places
    .filter((p) => {
      if (!p.placeId || p.placeId === input.excludePlaceId) return false;
      if (seen.has(p.placeId)) return false;
      if (isJunkPlace(p, input.trade)) return false;
      if (p.lat != null && p.lng != null) {
        if (milesBetween(origin, { lat: p.lat, lng: p.lng }) > SERVICE_AREA_MILES) {
          return false;
        }
      }
      seen.add(p.placeId);
      return true;
    })
    .sort((a, b) => competitorScore(b) - competitorScore(a))
    .slice(0, 6)
    .map((p) => ({
      placeId: p.placeId,
      name: p.name,
      address: p.address,
      rating: p.rating,
      reviewCount: p.reviewCount,
      lat: p.lat,
      lng: p.lng,
    }));
}
