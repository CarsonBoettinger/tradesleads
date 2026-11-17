/** Realistic trade service area used for competitors + keyword checks. */
export const SERVICE_AREA_MILES = 25;
export const SERVICE_AREA_METERS = Math.round(SERVICE_AREA_MILES * 1609.344);

export function extractTownFromAddress(address: string | null | undefined) {
  if (!address?.trim()) return null;
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length >= 3) return parts[parts.length - 3] ?? parts[1] ?? null;
  if (parts.length === 2) return parts[0] ?? null;
  return parts[0] ?? null;
}

function normalizeTown(value: string) {
  return value
    .toLowerCase()
    .replace(/\b(township|town|city|village|municipality)\b/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCaseTown(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function isPlausibleTownName(value: string) {
  const cleaned = value.trim();
  if (cleaned.length < 2 || cleaned.length > 40) return false;
  if (/^\d/.test(cleaned)) return false;
  if (/\b(street|road|ave|avenue|blvd|drive|lane|hwy|highway|unit|suite)\b/i.test(cleaned)) {
    return false;
  }
  return true;
}

/**
 * Discover nearby place names within ~25 miles via OpenStreetMap Nominatim.
 * Falls back gracefully if the request fails.
 */
export async function discoverNearbyTowns(input: {
  lat: number;
  lng: number;
  homeTown?: string | null;
  limit?: number;
}): Promise<string[]> {
  const limit = input.limit ?? 4;
  const delta = SERVICE_AREA_MILES / 69; // rough degrees latitude
  const lngDelta = delta / Math.max(Math.cos((input.lat * Math.PI) / 180), 0.2);
  const viewbox = [
    input.lng - lngDelta,
    input.lat + delta,
    input.lng + lngDelta,
    input.lat - delta,
  ].join(",");

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "0");
    url.searchParams.set("limit", String(Math.max(limit * 3, 8)));
    url.searchParams.set("bounded", "1");
    url.searchParams.set("viewbox", viewbox);
    url.searchParams.set("featuretype", "city");
    url.searchParams.set("q", "town");

    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(7000),
      headers: {
        "User-Agent": "KalvezPresenceReport/1.0 (local trade lead magnet)",
        Accept: "application/json",
      },
    });
    if (!response.ok) return [];

    const data = (await response.json()) as Array<{
      name?: string;
      display_name?: string;
      type?: string;
      class?: string;
    }>;

    const towns: string[] = [];
    const seen = new Set<string>();
    const homeKey = input.homeTown ? normalizeTown(input.homeTown) : "";

    for (const item of data) {
      const raw = (item.name || item.display_name?.split(",")[0] || "").trim();
      if (!isPlausibleTownName(raw)) continue;
      const key = normalizeTown(raw);
      if (!key || key === homeKey || seen.has(key)) continue;
      // Prefer settlements over roads/POIs.
      if (item.class && !["place", "boundary"].includes(item.class)) continue;
      seen.add(key);
      towns.push(titleCaseTown(raw));
      if (towns.length >= limit) break;
    }

    return towns;
  } catch (error) {
    console.error("Nearby town discovery failed:", error);
    return [];
  }
}

/** Build unique service-area towns: home + competitors + nearby discovery. */
export async function resolveServiceAreaTowns(input: {
  lat: number | null;
  lng: number | null;
  homeTown: string | null;
  competitorAddresses?: string[];
}): Promise<string[]> {
  const towns: string[] = [];
  const seen = new Set<string>();

  const push = (value: string | null | undefined) => {
    if (!value?.trim() || !isPlausibleTownName(value)) return;
    const key = normalizeTown(value);
    if (!key || seen.has(key)) return;
    seen.add(key);
    towns.push(titleCaseTown(value.trim()));
  };

  push(input.homeTown);

  for (const address of input.competitorAddresses ?? []) {
    push(extractTownFromAddress(address));
  }

  if (input.lat != null && input.lng != null && towns.length < 3) {
    const discovered = await discoverNearbyTowns({
      lat: input.lat,
      lng: input.lng,
      homeTown: input.homeTown,
      limit: 4,
    });
    for (const town of discovered) push(town);
  }

  return towns.slice(0, 5);
}
