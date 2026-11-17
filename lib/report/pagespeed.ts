import type { WebsiteCheck, WebSignals } from "@/lib/report/types";

function apiKey() {
  return (
    process.env.PAGESPEED_API_KEY?.trim() ||
    process.env.GOOGLE_PLACES_API_KEY?.trim() ||
    ""
  );
}

export function pagespeedConfigured() {
  return Boolean(apiKey());
}

function categoryScore(
  categories: Record<string, unknown> | undefined,
  key: string,
) {
  const value = categories?.[key] as { score?: number } | undefined;
  if (typeof value?.score !== "number") return null;
  return Math.round(value.score * 100);
}

function auditScore(
  audits: Record<string, { score?: number | null }>,
  key: string,
) {
  const score = audits[key]?.score;
  return typeof score === "number" ? score : null;
}

function stripTags(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function keywordTokens(input: {
  businessName?: string | null;
  tradeKeywords?: string[];
}) {
  const fromName = (input.businessName ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !/(inc|llc|ltd|corp|company|the|and)/.test(w));

  const fromTrade = (input.tradeKeywords ?? [])
    .slice(0, 3)
    .flatMap((keyword) =>
      keyword
        .toLowerCase()
        .replace(/\bin\b.+$/, "")
        .replace(/near me/g, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3),
    );

  return [...new Set([...fromTrade, ...fromName])].slice(0, 8);
}

async function inspectHtmlChecks(input: {
  url: string;
  businessName?: string | null;
  tradeKeywords?: string[];
}): Promise<{
  hasH1: boolean | null;
  h1Text: string | null;
  h1HasKeyword: boolean | null;
}> {
  try {
    const response = await fetch(input.url, {
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; KalvezReportBot/1.0; +https://kalvez.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!response.ok) {
      return { hasH1: null, h1Text: null, h1HasKeyword: null };
    }

    const html = (await response.text()).slice(0, 400_000);
    const match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    if (!match) {
      return { hasH1: false, h1Text: null, h1HasKeyword: false };
    }

    const h1Text = stripTags(match[1] ?? "");
    const tokens = keywordTokens(input);
    const haystack = h1Text.toLowerCase();
    const h1HasKeyword =
      tokens.length === 0
        ? null
        : tokens.some((token) => haystack.includes(token));

    return { hasH1: true, h1Text, h1HasKeyword };
  } catch {
    return { hasH1: null, h1Text: null, h1HasKeyword: null };
  }
}

function emptyWeb(url: string | null, hasHttps = false): WebSignals {
  return {
    url,
    overall: null,
    performance: null,
    accessibility: null,
    bestPractices: null,
    seo: null,
    mobileFriendly: null,
    hasHttps,
    loadMs: null,
    screenshot: null,
    checks: [],
  };
}

function buildChecks(input: {
  hasHttps: boolean;
  mobileFriendly: boolean | null;
  performance: number | null;
  loadMs: number | null;
  contrastScore: number | null;
  hasH1: boolean | null;
  h1Text: string | null;
  h1HasKeyword: boolean | null;
}): WebsiteCheck[] {
  const speedPass =
    input.performance == null && input.loadMs == null
      ? null
      : (input.performance ?? 0) >= 50 ||
        (input.loadMs != null && input.loadMs <= 4000);

  return [
    {
      id: "https",
      label: "Secure HTTPS",
      pass: input.hasHttps,
      detail: input.hasHttps
        ? "Site loads over HTTPS."
        : "Listing website is not using HTTPS.",
    },
    {
      id: "h1",
      label: "H1 headline present",
      pass: input.hasH1,
      detail:
        input.hasH1 === null
          ? "Could not read the page HTML."
          : input.hasH1
            ? `Found H1: “${(input.h1Text ?? "").slice(0, 80)}”`
            : "No H1 tag found on the homepage.",
    },
    {
      id: "h1-keyword",
      label: "H1 includes a service keyword",
      pass: input.h1HasKeyword,
      detail:
        input.h1HasKeyword === null
          ? "Could not verify keyword match."
          : input.h1HasKeyword
            ? "H1 mentions your trade or business terms."
            : "H1 does not clearly include a service keyword homeowners search for.",
    },
    {
      id: "contrast",
      label: "Text contrast looks readable",
      pass:
        input.contrastScore == null ? null : input.contrastScore >= 0.9,
      detail:
        input.contrastScore == null
          ? "Contrast check unavailable."
          : input.contrastScore >= 0.9
            ? "PageSpeed contrast check passed."
            : "Some text may be hard to read against the background.",
    },
    {
      id: "speed",
      label: "Mobile site speed",
      pass: speedPass,
      detail:
        input.loadMs != null
          ? `Interactive in about ${Math.round(input.loadMs / 100) / 10}s.`
          : input.performance != null
            ? `Performance score ${input.performance}/100.`
            : "Speed metrics unavailable.",
    },
    {
      id: "mobile",
      label: "Mobile-friendly layout",
      pass: input.mobileFriendly,
      detail:
        input.mobileFriendly == null
          ? "Mobile check unavailable."
          : input.mobileFriendly
            ? "Viewport and mobile layout look usable."
            : "Mobile layout needs work - people bounce before calling.",
    },
  ];
}

function averageScores(scores: Array<number | null>) {
  const present = scores.filter((n): n is number => typeof n === "number");
  if (!present.length) return null;
  return Math.round(present.reduce((a, b) => a + b, 0) / present.length);
}

export async function scanWebsite(
  url: string | null,
  options?: {
    businessName?: string | null;
    tradeKeywords?: string[];
  },
): Promise<WebSignals> {
  if (!url) return emptyWeb(null);

  let normalized = url.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }

  const hasHttps = normalized.startsWith("https://");
  const key = apiKey();
  const htmlChecks = await inspectHtmlChecks({
    url: normalized,
    businessName: options?.businessName,
    tradeKeywords: options?.tradeKeywords,
  });

  if (!key) {
    const checks = buildChecks({
      hasHttps,
      mobileFriendly: null,
      performance: null,
      loadMs: null,
      contrastScore: null,
      hasH1: htmlChecks.hasH1,
      h1Text: htmlChecks.h1Text,
      h1HasKeyword: htmlChecks.h1HasKeyword,
    });
    return {
      ...emptyWeb(normalized, hasHttps),
      checks,
    };
  }

  const endpoint = new URL(
    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
  );
  endpoint.searchParams.set("url", normalized);
  endpoint.searchParams.set("strategy", "mobile");
  endpoint.searchParams.set("category", "performance");
  endpoint.searchParams.append("category", "accessibility");
  endpoint.searchParams.append("category", "best-practices");
  endpoint.searchParams.append("category", "seo");
  endpoint.searchParams.set("key", key);

  const response = await fetch(endpoint, { cache: "no-store" });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PageSpeed ${response.status}: ${text.slice(0, 240)}`);
  }

  const data = (await response.json()) as {
    lighthouseResult?: {
      categories?: Record<string, unknown>;
      audits?: Record<
        string,
        {
          numericValue?: number;
          score?: number | null;
          details?: { data?: string };
        }
      >;
    };
  };

  const categories = data.lighthouseResult?.categories;
  const audits = data.lighthouseResult?.audits ?? {};
  const performance = categoryScore(categories, "performance");
  const accessibility = categoryScore(categories, "accessibility");
  const bestPractices = categoryScore(categories, "best-practices");
  const seo = categoryScore(categories, "seo");
  const loadMs =
    typeof audits["interactive"]?.numericValue === "number"
      ? Math.round(audits["interactive"].numericValue)
      : typeof audits["speed-index"]?.numericValue === "number"
        ? Math.round(audits["speed-index"].numericValue)
        : null;

  const viewportScore = auditScore(audits, "viewport");
  const mobileFriendly =
    typeof viewportScore === "number" ? viewportScore >= 0.9 : null;
  const contrastScore = auditScore(audits, "color-contrast");
  const screenshotData = audits["final-screenshot"]?.details?.data;
  const screenshot =
    typeof screenshotData === "string" && screenshotData.startsWith("data:")
      ? screenshotData
      : null;

  const checks = buildChecks({
    hasHttps,
    mobileFriendly,
    performance,
    loadMs,
    contrastScore,
    hasH1: htmlChecks.hasH1,
    h1Text: htmlChecks.h1Text,
    h1HasKeyword: htmlChecks.h1HasKeyword,
  });

  return {
    url: normalized,
    overall: averageScores([performance, accessibility, bestPractices, seo]),
    performance,
    accessibility,
    bestPractices,
    seo,
    mobileFriendly,
    hasHttps,
    loadMs,
    screenshot,
    checks,
  };
}
