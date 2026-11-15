import type { ReportTrade } from "@/lib/report/types";

const TRADE_KEYWORDS: Record<ReportTrade, string[]> = {
  Plumber: [
    "plumber near me",
    "emergency plumber",
    "drain cleaning",
    "water heater repair",
    "leak repair",
    "bathroom plumber",
    "pipe repair",
    "clogged drain",
    "boiler repair",
    "plumbing company",
  ],
  Roofer: [
    "roofer near me",
    "roof repair",
    "roof replacement",
    "emergency roof repair",
    "leak repair roof",
    "shingle roofing",
    "flat roof repair",
    "roof inspection",
    "storm damage roof",
    "roofing company",
  ],
  Electrician: [
    "electrician near me",
    "emergency electrician",
    "electrical repair",
    "panel upgrade",
    "outlet installation",
    "lighting installation",
    "ceiling fan install",
    "ev charger install",
    "rewiring",
    "electrical company",
  ],
  HVAC: [
    "hvac near me",
    "ac repair",
    "furnace repair",
    "hvac installation",
    "air conditioning service",
    "heat pump repair",
    "duct cleaning",
    "thermostat install",
    "emergency hvac",
    "heating and cooling",
  ],
  Builder: [
    "builder near me",
    "home remodeling",
    "home addition",
    "kitchen remodel",
    "bathroom remodel",
    "general contractor",
    "home renovation",
    "custom home builder",
    "deck builder",
    "construction company",
  ],
  Landscaper: [
    "landscaper near me",
    "lawn care",
    "landscape design",
    "tree trimming",
    "sod installation",
    "hardscaping",
    "mulch and beds",
    "irrigation install",
    "yard cleanup",
    "landscaping company",
  ],
  "Another trade": [
    "contractor near me",
    "home services",
    "local contractor",
    "handyman services",
    "home repair",
    "property maintenance",
    "remodeling services",
    "local tradesman",
    "service company",
    "home improvement",
  ],
};

const AVG_JOB_VALUE: Record<ReportTrade, number> = {
  Plumber: 450,
  Roofer: 3200,
  Electrician: 550,
  HVAC: 1800,
  Builder: 8500,
  Landscaper: 900,
  "Another trade": 700,
};

export const REPORT_TRADES = Object.keys(TRADE_KEYWORDS) as ReportTrade[];

export function isReportTrade(value: string): value is ReportTrade {
  return value in TRADE_KEYWORDS;
}

/** Infer trade from Google Places types / business name when the UI has no trade picker. */
export function inferTrade(input: {
  types?: string[];
  name?: string;
}): ReportTrade {
  const haystack = [
    ...(input.types ?? []),
    input.name ?? "",
  ]
    .join(" ")
    .toLowerCase();

  if (/plumb/.test(haystack)) return "Plumber";
  if (/roof/.test(haystack)) return "Roofer";
  if (/electric/.test(haystack)) return "Electrician";
  if (/hvac|heating|cooling|air_conditioning|furnace/.test(haystack)) {
    return "HVAC";
  }
  if (
    /general_contractor|builder|construct|remodel|contracting|contractor/.test(
      haystack,
    )
  ) {
    return "Builder";
  }
  if (/landscap|lawn|garden/.test(haystack)) return "Landscaper";
  return "Another trade";
}

/** Text queries that find real peers when Nearby type filters are unavailable. */
export function competitorQueriesForTrade(trade: ReportTrade): string[] {
  switch (trade) {
    case "Plumber":
      return ["plumber", "plumbing company", "emergency plumber"];
    case "Roofer":
      return ["roofer", "roofing company", "roof repair"];
    case "Electrician":
      return ["electrician", "electrical contractor", "electrical company"];
    case "HVAC":
      return ["hvac contractor", "heating and cooling", "air conditioning repair"];
    case "Builder":
      return ["general contractor", "home builder", "construction company"];
    case "Landscaper":
      return ["landscaper", "lawn care", "landscaping company"];
    default:
      return ["contractor", "home services", "handyman"];
  }
}

export function keywordsForTrade(trade: ReportTrade, town: string | null) {
  const base = TRADE_KEYWORDS[trade];
  if (!town?.trim()) return base;
  const place = town.trim();
  return base.map((keyword) =>
    keyword.includes("near me")
      ? keyword.replace("near me", `in ${place}`)
      : `${keyword} ${place}`,
  );
}

function servicePhrasesForTrade(trade: ReportTrade) {
  return TRADE_KEYWORDS[trade].map((keyword) =>
    keyword.replace(/\s+near me$/i, "").trim(),
  );
}

/**
 * Spread limited SerpAPI checks across the service area:
 * primary phrase in home + surrounding towns, then secondary phrases in home town.
 */
export function keywordsForServiceArea(
  trade: ReportTrade,
  towns: string[],
  limit = 3,
): string[] {
  const phrases = servicePhrasesForTrade(trade);
  const uniqueTowns = [...new Set(towns.map((t) => t.trim()).filter(Boolean))];
  const results: string[] = [];
  const seen = new Set<string>();

  const push = (keyword: string) => {
    const key = keyword.toLowerCase();
    if (seen.has(key) || results.length >= limit) return;
    seen.add(key);
    results.push(keyword);
  };

  const primary = phrases[0] ?? "contractor";
  for (const town of uniqueTowns) {
    push(`${primary} in ${town}`);
  }

  const home = uniqueTowns[0];
  if (home) {
    for (const phrase of phrases.slice(1, 4)) {
      push(`${phrase} in ${home}`);
    }
  }

  if (!results.length) {
    return phrases.slice(0, limit);
  }

  return results.slice(0, limit);
}

export function avgJobValue(trade: ReportTrade) {
  return AVG_JOB_VALUE[trade];
}
