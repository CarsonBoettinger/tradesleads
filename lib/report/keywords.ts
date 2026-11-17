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
    "general contractor near me",
    "home remodeling",
    "home addition",
    "kitchen remodel",
    "bathroom remodel",
    "home renovation",
    "custom home builder",
    "deck builder",
    "framing contractor",
    "construction company",
  ],
  Painter: [
    "painter near me",
    "house painter",
    "interior painting",
    "exterior painting",
    "cabinet painting",
    "drywall repair",
    "painting contractor",
    "commercial painting",
    "trim painting",
    "painting company",
  ],
  Flooring: [
    "flooring near me",
    "hardwood flooring",
    "tile installation",
    "vinyl plank flooring",
    "floor refinishing",
    "carpet installation",
    "laminate flooring",
    "flooring contractor",
    "tile contractor",
    "flooring company",
  ],
  Concrete: [
    "concrete contractor near me",
    "concrete driveway",
    "foundation repair",
    "concrete patio",
    "masonry contractor",
    "brick repair",
    "concrete flatwork",
    "stamp concrete",
    "retaining wall",
    "concrete company",
  ],
  Fencing: [
    "fence company near me",
    "fence installation",
    "fence repair",
    "wood fence",
    "vinyl fence",
    "privacy fence",
    "chain link fence",
    "gate installation",
    "fencing contractor",
    "fence builders",
  ],
  Carpenter: [
    "carpenter near me",
    "custom carpentry",
    "cabinet maker",
    "trim carpenter",
    "deck building",
    "finish carpentry",
    "built in cabinets",
    "door installation",
    "millwork",
    "carpentry company",
  ],
  Landscaper: [
    "landscaper near me",
    "lawn care",
    "landscape design",
    "sod installation",
    "hardscaping",
    "mulch and beds",
    "irrigation install",
    "yard cleanup",
    "lawn maintenance",
    "landscaping company",
  ],
  "Tree service": [
    "tree service near me",
    "tree removal",
    "tree trimming",
    "stump grinding",
    "emergency tree removal",
    "arborist",
    "tree pruning",
    "storm damage tree",
    "tree cutting",
    "tree company",
  ],
  "Snow removal": [
    "snow removal near me",
    "snow plowing",
    "driveway snow removal",
    "commercial snow removal",
    "ice management",
    "salt and sanding",
    "parking lot snow removal",
    "snow clearing",
    "winter maintenance",
    "snow plow service",
  ],
  "Pressure washing": [
    "pressure washing near me",
    "power washing",
    "soft washing",
    "driveway cleaning",
    "house washing",
    "deck cleaning",
    "patio cleaning",
    "fence washing",
    "commercial pressure washing",
    "roof soft wash",
  ],
  "Window cleaning": [
    "window cleaning near me",
    "window washer",
    "residential window cleaning",
    "storefront window cleaning",
    "high rise window cleaning",
    "post construction cleaning",
    "exterior window cleaning",
    "glass cleaning service",
    "window cleaning company",
    "commercial window cleaning",
  ],
  "Commercial cleaning": [
    "commercial cleaning near me",
    "office cleaning",
    "janitorial service",
    "industrial cleaning",
    "warehouse cleaning",
    "night cleaning service",
    "building cleaning",
    "facility cleaning",
    "commercial cleaners",
    "cleaning company",
  ],
  "Gutter cleaning": [
    "gutter cleaning near me",
    "gutter cleaners",
    "gutter guard installation",
    "leaf guard",
    "gutter maintenance",
    "downspout cleaning",
    "clogged gutter",
    "gutter repair",
    "eavestrough cleaning",
    "gutter company",
  ],
  "Pest control": [
    "pest control near me",
    "exterminator",
    "termite control",
    "rodent control",
    "bed bug treatment",
    "ant control",
    "wasp nest removal",
    "pest inspection",
    "wildlife removal",
    "pest control company",
  ],
  "Pool service": [
    "pool service near me",
    "pool cleaning",
    "pool maintenance",
    "pool repair",
    "spa service",
    "pool opening",
    "pool closing",
    "green pool clean",
    "pool equipment repair",
    "pool company",
  ],
  "Junk removal": [
    "junk removal near me",
    "junk hauling",
    "debris removal",
    "estate cleanout",
    "garage cleanout",
    "appliance removal",
    "construction debris removal",
    "dumpster rental",
    "trash removal",
    "junk removal company",
  ],
  "Auto repair": [
    "auto repair near me",
    "car mechanic",
    "brake repair",
    "oil change",
    "engine repair",
    "transmission repair",
    "truck repair",
    "diesel repair",
    "mobile mechanic",
    "auto repair shop",
  ],
  "Auto detailing": [
    "auto detailing near me",
    "car detailing",
    "mobile detailing",
    "paint correction",
    "ceramic coating",
    "interior car detailing",
    "car wash detail",
    "fleet detailing",
    "car polish",
    "detailing company",
  ],
  Towing: [
    "towing near me",
    "tow truck",
    "emergency towing",
    "roadside assistance",
    "car towing",
    "truck towing",
    "flatbed towing",
    "vehicle recovery",
    "24 hour towing",
    "towing company",
  ],
  Welding: [
    "welding near me",
    "mobile welding",
    "welding fabrication",
    "custom fabrication",
    "metal fabrication",
    "sheet metal",
    "machine shop",
    "aluminum welding",
    "structural welding",
    "welding company",
  ],
  Solar: [
    "solar installation near me",
    "solar panels",
    "solar installer",
    "residential solar",
    "solar panel cleaning",
    "solar battery storage",
    "commercial solar",
    "solar company",
    "pv installation",
    "solar energy company",
  ],
  "Appliance repair": [
    "appliance repair near me",
    "washer repair",
    "dryer repair",
    "refrigerator repair",
    "dishwasher repair",
    "oven repair",
    "stove repair",
    "appliance technician",
    "same day appliance repair",
    "appliance repair company",
  ],
  Moving: [
    "movers near me",
    "moving company",
    "local movers",
    "furniture movers",
    "apartment movers",
    "office moving",
    "packing and moving",
    "labor only movers",
    "long distance movers",
    "moving help",
  ],
  Locksmith: [
    "locksmith near me",
    "emergency locksmith",
    "car lockout",
    "house lockout",
    "lock change",
    "rekey locks",
    "key duplication",
    "safe opening",
    "commercial locksmith",
    "locksmith company",
  ],
  "Another trade": [
    "home services near me",
    "local service company",
    "property maintenance",
    "handyman services",
    "home repair",
    "service contractor",
    "local tradesman",
    "maintenance company",
    "home improvement",
    "skilled trade services",
  ],
};

const AVG_JOB_VALUE: Record<ReportTrade, number> = {
  Plumber: 450,
  Roofer: 3200,
  Electrician: 550,
  HVAC: 1800,
  Builder: 8500,
  Painter: 1200,
  Flooring: 2800,
  Concrete: 4500,
  Fencing: 2200,
  Carpenter: 1800,
  Landscaper: 900,
  "Tree service": 1400,
  "Snow removal": 250,
  "Pressure washing": 550,
  "Window cleaning": 280,
  "Commercial cleaning": 400,
  "Gutter cleaning": 220,
  "Pest control": 350,
  "Pool service": 300,
  "Junk removal": 450,
  "Auto repair": 500,
  "Auto detailing": 250,
  Towing: 150,
  Welding: 800,
  Solar: 12000,
  "Appliance repair": 220,
  Moving: 900,
  Locksmith: 180,
  "Another trade": 700,
};

export const REPORT_TRADES = Object.keys(TRADE_KEYWORDS) as ReportTrade[];

export function isReportTrade(value: string): value is ReportTrade {
  return value in TRADE_KEYWORDS;
}

type TradeRule = { trade: ReportTrade; pattern: RegExp };

/**
 * More specific niches first. Names like "pressure washing contractor"
 * must not fall through to Builder.
 */
const TRADE_INFER_RULES: TradeRule[] = [
  { trade: "Pressure washing", pattern: /pressure\s*wash|power\s*wash|soft\s*wash|house\s*wash|driveway\s*clean|deck\s*clean|patio\s*clean|fence\s*wash|graffiti|awning\s*clean|fleet\s*wash|dumpster\s*pad/ },
  { trade: "Gutter cleaning", pattern: /gutter\s*clean|gutter\s*guard|eavestrough|leaf\s*guard/ },
  { trade: "Window cleaning", pattern: /window\s*clean|window\s*wash|glass\s*clean/ },
  { trade: "Commercial cleaning", pattern: /janitorial|commercial\s*clean|office\s*clean|industrial\s*clean|facility\s*clean|building\s*clean(?!ing\s*and)|maid\s*service|house\s*clean/ },
  { trade: "Solar", pattern: /solar\s*panel|solar\s*install|solar\s*energy|\bsolar\b|photovoltaic|\bpv\b/ },
  { trade: "Appliance repair", pattern: /appliance\s*repair|appliance\s*tech|washer\s*repair|dryer\s*repair|refrigerator\s*repair/ },
  { trade: "Pest control", pattern: /pest\s*control|exterminat|termite|rodent\s*control|bed\s*bug|wildlife\s*removal/ },
  { trade: "Pool service", pattern: /pool\s*service|pool\s*clean|pool\s*repair|pool\s*mainten|spa\s*service/ },
  { trade: "Junk removal", pattern: /junk\s*remov|junk\s*haul|debris\s*remov|dumpster\s*rental|trash\s*remov|haul\s*away|cleanout/ },
  { trade: "Snow removal", pattern: /snow\s*remov|snow\s*plow|ice\s*manag|winter\s*mainten/ },
  { trade: "Tree service", pattern: /tree\s*service|tree\s*remov|tree\s*trimm|stump\s*grind|arborist|tree\s*cut/ },
  { trade: "Auto detailing", pattern: /auto\s*detail|car\s*detail|mobile\s*detail|ceramic\s*coat|paint\s*correct/ },
  { trade: "Towing", pattern: /\btowing\b|\btow\s*truck\b|roadside\s*assist|vehicle\s*recovery/ },
  { trade: "Auto repair", pattern: /auto\s*repair|car\s*repair|car_repair|mechanic|brake\s*repair|diesel\s*repair|truck\s*repair|body\s*shop|tire\s*shop|windshield|mobile\s*mechanic/ },
  { trade: "Moving", pattern: /\bmovers?\b|moving\s*compan|moving_compan|pack(?:ing)?\s*(?:and|&)\s*mov/ },
  { trade: "Locksmith", pattern: /locksmith|lock.?smith|rekey|lock.?out/ },
  { trade: "Welding", pattern: /weld(?:ing|er)?|fabricat|machine\s*shop|sheet\s*metal/ },
  { trade: "Plumber", pattern: /plumb/ },
  { trade: "Roofer", pattern: /roof/ },
  { trade: "Electrician", pattern: /electric/ },
  { trade: "HVAC", pattern: /hvac|heating|cooling|air_conditioning|furnace|heat\s*pump/ },
  { trade: "Painter", pattern: /paint(?:er|ing)|drywall/ },
  { trade: "Flooring", pattern: /flooring|hardwood|tile\s*(?:install|contract)|carpet\s*install|vinyl\s*plank/ },
  { trade: "Concrete", pattern: /concrete|masonry|foundation|brick\s*(?:work|lay|mason)|paver\s*install|flatwork/ },
  { trade: "Fencing", pattern: /fenc(?:e|ing)|gate\s*install/ },
  { trade: "Carpenter", pattern: /carpent|cabinetr|millwork|furniture\s*mak|woodwork/ },
  { trade: "Landscaper", pattern: /landscap|lawn|garden|irrigation|hardscap|sod\b/ },
  {
    trade: "Builder",
    pattern:
      /general_contractor|general\s*contract|\bbuilders?\b|\bcontracting\b|home\s*build|remodel|renovat|custom\s*home|construct|framing|excavation|demolition|paving|siding|insulation|deck\s*build/,
  },
];

/** Infer trade from Google Places types / business name when the UI has no trade picker. */
export function inferTrade(input: {
  types?: string[];
  name?: string;
}): ReportTrade {
  const haystack = [...(input.types ?? []), input.name ?? ""]
    .join(" ")
    .toLowerCase();

  for (const rule of TRADE_INFER_RULES) {
    if (rule.pattern.test(haystack)) return rule.trade;
  }

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
    case "Painter":
      return ["house painter", "painting contractor", "painting company"];
    case "Flooring":
      return ["flooring company", "tile contractor", "hardwood flooring"];
    case "Concrete":
      return ["concrete contractor", "masonry contractor", "foundation repair"];
    case "Fencing":
      return ["fence company", "fence installation", "fencing contractor"];
    case "Carpenter":
      return ["carpenter", "custom carpentry", "cabinet maker"];
    case "Landscaper":
      return ["landscaper", "lawn care", "landscaping company"];
    case "Tree service":
      return ["tree service", "tree removal", "tree trimming"];
    case "Snow removal":
      return ["snow removal", "snow plowing", "commercial snow removal"];
    case "Pressure washing":
      return ["pressure washing", "power washing", "soft washing"];
    case "Window cleaning":
      return ["window cleaning", "window washer", "commercial window cleaning"];
    case "Commercial cleaning":
      return ["commercial cleaning", "janitorial service", "office cleaning"];
    case "Gutter cleaning":
      return ["gutter cleaning", "gutter cleaners", "gutter guard installation"];
    case "Pest control":
      return ["pest control", "exterminator", "termite control"];
    case "Pool service":
      return ["pool service", "pool cleaning", "pool maintenance"];
    case "Junk removal":
      return ["junk removal", "junk hauling", "dumpster rental"];
    case "Auto repair":
      return ["auto repair", "car mechanic", "auto repair shop"];
    case "Auto detailing":
      return ["auto detailing", "car detailing", "mobile detailing"];
    case "Towing":
      return ["towing", "tow truck", "emergency towing"];
    case "Welding":
      return ["welding", "mobile welding", "metal fabrication"];
    case "Solar":
      return ["solar installation", "solar installer", "solar panels"];
    case "Appliance repair":
      return ["appliance repair", "washer repair", "appliance technician"];
    case "Moving":
      return ["movers", "moving company", "local movers"];
    case "Locksmith":
      return ["locksmith", "emergency locksmith", "lock change"];
    default:
      return ["home services", "local service company", "property maintenance"];
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
 * Spread limited Places keyword checks across the service area:
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

  const primary = phrases[0] ?? "home services";
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
