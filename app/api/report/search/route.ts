import {
  missingReportProviderMessage,
  shouldUseReportDemoData,
} from "@/lib/report/config";
import { demoSearch } from "@/lib/report/demo-data";
import { searchPlaces } from "@/lib/report/places";
import { clientIp, rateLimit } from "@/lib/report/rate-limit";
import { clampText } from "@/lib/report/security";

export async function POST(request: Request) {
  const limited = rateLimit({
    key: `report-search:${clientIp(request)}`,
    limit: 30,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return Response.json(
      { error: "Too many searches. Try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = (body ?? {}) as Record<string, unknown>;
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
