import "server-only";

import { placesConfigured } from "@/lib/report/places";

export function isProductionRuntime() {
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.CONTEXT === "production" ||
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
  return placesConfigured();
}

export function shouldUseReportDemoData() {
  if (allowReportDemoMode()) return true;
  if (isProductionRuntime()) return false;
  return !reportProvidersReady();
}

export function missingReportProviderMessage() {
  if (placesConfigured()) return null;
  return "Report providers are not configured. Set GOOGLE_PLACES_API_KEY.";
}

/** Cap Places keyword searches per report. Default 3, max 5. */
export function reportKeywordLimit() {
  const raw = Number(
    process.env.REPORT_KEYWORD_LIMIT ??
      process.env.SERPAPI_KEYWORD_LIMIT ??
      "3",
  );
  if (!Number.isFinite(raw)) return 3;
  return Math.max(1, Math.min(5, Math.round(raw)));
}
