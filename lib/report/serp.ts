import type { KeywordRank } from "@/lib/report/types";

function apiKey() {
  return process.env.SERPAPI_API_KEY?.trim() || "";
}

export function serpConfigured() {
  return Boolean(apiKey());
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

async function serpJson(params: Record<string, string>) {
  const key = apiKey();
  if (!key) throw new Error("SERPAPI_API_KEY is not set.");

  const url = new URL("https://serpapi.com/search.json");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("api_key", key);

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`SerpAPI ${response.status}: ${text.slice(0, 240)}`);
  }
  return response.json() as Promise<Record<string, unknown>>;
}

function findLocalPosition(
  data: Record<string, unknown>,
  businessName: string,
): number | null {
  const local =
    (data.local_results as Array<Record<string, unknown>> | undefined) ??
    (
      data.local_pack as
        | { places?: Array<Record<string, unknown>> }
        | undefined
    )?.places ??
    [];

  for (let i = 0; i < local.length; i += 1) {
    const title = String(local[i]?.title ?? local[i]?.name ?? "");
    if (namesMatch(title, businessName)) return i + 1;
  }
  return null;
}

function findOrganicPosition(
  data: Record<string, unknown>,
  businessName: string,
  website: string | null,
): number | null {
  const organic =
    (data.organic_results as Array<Record<string, unknown>> | undefined) ?? [];
  const host = website
    ? (() => {
        try {
          return new URL(website).hostname.replace(/^www\./, "");
        } catch {
          return null;
        }
      })()
    : null;

  for (let i = 0; i < organic.length; i += 1) {
    const item = organic[i];
    const title = String(item?.title ?? "");
    const link = String(item?.link ?? "");
    if (namesMatch(title, businessName)) return i + 1;
    if (host && link.includes(host)) return i + 1;
  }
  return null;
}

export async function rankKeyword(input: {
  keyword: string;
  businessName: string;
  website: string | null;
  lat: number | null;
  lng: number | null;
}): Promise<KeywordRank> {
  const params: Record<string, string> = {
    engine: "google",
    q: input.keyword,
    hl: "en",
    gl: "us",
    num: "10",
  };

  if (input.lat != null && input.lng != null) {
    // ~25-mile service area framing (wider than city-block zoom).
    params.ll = `@${input.lat},${input.lng},11z`;
  }

  const data = await serpJson(params);
  const mapPackPosition = findLocalPosition(data, input.businessName);
  const organicPosition = findOrganicPosition(
    data,
    input.businessName,
    input.website,
  );

  return {
    keyword: input.keyword,
    mapPackPosition,
    organicPosition,
    inMapPack: mapPackPosition != null && mapPackPosition <= 3,
  };
}

export async function rankKeywords(input: {
  keywords: string[];
  businessName: string;
  website: string | null;
  lat: number | null;
  lng: number | null;
  limit?: number;
}): Promise<KeywordRank[]> {
  // Hard cap - each keyword is one SerpAPI search credit.
  const limit = Math.max(1, Math.min(input.limit ?? 3, 5));
  const selected = input.keywords.slice(0, limit);
  const results: KeywordRank[] = [];

  // SerpAPI is rate-limited; keep sequential for reliability.
  for (const keyword of selected) {
    try {
      results.push(
        await rankKeyword({
          keyword,
          businessName: input.businessName,
          website: input.website,
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
