import { placesConfigured } from "@/lib/report/places";
import { serpConfigured } from "@/lib/report/serp";

export function isProductionRuntime() {
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production"
  );
}

/** Demo data only when explicitly forced, and never silently in production. */
export function allowReportDemoMode() {
  if (process.env.REPORT_DEMO_MODE === "1") {
    // Staging/preview can opt in; production needs an explicit override flag.
    if (isProductionRuntime() && process.env.REPORT_DEMO_MODE_ALLOW_PROD !== "1") {
      return false;
    }
    return true;
  }
  return false;
}

export function reportProvidersReady() {
  return placesConfigured() && serpConfigured();
}

export function shouldUseReportDemoData() {
  if (allowReportDemoMode()) return true;
  if (isProductionRuntime()) return false;
  return !reportProvidersReady();
}

export function missingReportProviderMessage() {
  const missing: string[] = [];
  if (!placesConfigured()) missing.push("GOOGLE_PLACES_API_KEY");
  if (!serpConfigured()) missing.push("SERPAPI_API_KEY");
  if (!missing.length) return null;
  return `Report providers are not configured. Set ${missing.join(" and ")}.`;
}

/** Cap SerpAPI calls per report. Default 3 (each keyword = 1 search). */
export function serpKeywordLimit() {
  const raw = Number(process.env.SERPAPI_KEYWORD_LIMIT ?? "3");
  if (!Number.isFinite(raw)) return 3;
  return Math.max(1, Math.min(5, Math.round(raw)));
}
