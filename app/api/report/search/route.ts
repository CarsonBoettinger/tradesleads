import {
  missingReportProviderMessage,
  shouldUseReportDemoData,
} from "@/lib/report/config";
import { demoSearch } from "@/lib/report/demo-data";
import { searchPlaces } from "@/lib/report/places";
import {
  enforceRateLimit,
  readJsonBody,
  rejectCrossOrigin,
} from "@/lib/http-guard";
import { clampText } from "@/lib/report/security";
import { verifyTurnstile } from "@/lib/security/turnstile";

export async function POST(request: Request) {
  const crossOrigin = await rejectCrossOrigin(request, { requireOrigin: true });
  if (crossOrigin) return crossOrigin;

  const limited = await enforceRateLimit({
    request,
    key: "report-search",
    limit: 20,
    windowMs: 60_000,
    message: "Too many searches. Try again shortly.",
  });
  if (limited) return limited;

  const hourLimited = await enforceRateLimit({
    request,
    key: "report-search-hour",
    limit: 100,
    windowMs: 60 * 60_000,
    message: "Search limit reached. Try again later.",
  });
  if (hourLimited) return hourLimited;

  const parsedBody = await readJsonBody(request, 4_096);
  if (!parsedBody.ok) return parsedBody.response;

  const raw = (parsedBody.body ?? {}) as Record<string, unknown>;

  const turnstile = await verifyTurnstile({
    token: raw.turnstileToken,
    request,
  });
  if (!turnstile.ok) return turnstile.response;

  const query = clampText(
    typeof raw.query === "string" ? raw.query : "",
    120,
  );

  if (query.length < 3) {
    return Response.json(
      { error: "Enter at least 3 characters of your business name." },
      { status: 400 },
    );
  }

  const useDemo = shouldUseReportDemoData();
  if (!useDemo) {
    const missing = missingReportProviderMessage();
    if (missing) {
      return Response.json({ error: missing }, { status: 503 });
    }
  }

  try {
    const results = useDemo
      ? demoSearch(query, "Another trade")
      : await searchPlaces(query);

    return Response.json({ results, demo: useDemo });
  } catch (error) {
    console.error("Report search failed:", error);
    return Response.json(
      { error: "Could not search businesses right now." },
      { status: 500 },
    );
  }
}
