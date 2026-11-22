import { randomBytes } from "node:crypto";
import { after } from "next/server";
import {
  missingReportProviderMessage,
  shouldUseReportDemoData,
} from "@/lib/report/config";
import {
  enforceKeyedRateLimit,
  enforceRateLimit,
  readJsonBody,
  rejectCrossOrigin,
} from "@/lib/http-guard";
import { inferTrade } from "@/lib/report/keywords";
import { runPresenceReport } from "@/lib/report/run";
import {
  clampText,
  isValidPlaceId,
} from "@/lib/report/security";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const crossOrigin = await rejectCrossOrigin(request, { requireOrigin: true });
  if (crossOrigin) return crossOrigin;

  const limited = await enforceRateLimit({
    request,
    key: "report-start",
    limit: 3,
    windowMs: 60_000,
    message: "Too many report scans. Try again shortly.",
  });
  if (limited) return limited;

  const hourLimited = await enforceRateLimit({
    request,
    key: "report-start-hour",
    limit: 10,
    windowMs: 60 * 60_000,
    message: "Hourly scan limit reached. Try again later.",
  });
  if (hourLimited) return hourLimited;

  const globalLimited = await enforceKeyedRateLimit({
    key: `report-start:global:day:${new Date().toISOString().slice(0, 10)}`,
    limit: 500,
    windowMs: 24 * 60 * 60_000,
    message: "Report capacity reached for today. Try again tomorrow.",
  });
  if (globalLimited) return globalLimited;

  const parsedBody = await readJsonBody(request, 8_192);
  if (!parsedBody.ok) return parsedBody.response;

  const raw = (parsedBody.body ?? {}) as Record<string, unknown>;

  const turnstile = await verifyTurnstile({
    token: raw.turnstileToken,
    request,
  });
  if (!turnstile.ok) return turnstile.response;

  const placeId = clampText(
    typeof raw.placeId === "string" ? raw.placeId : "",
    256,
  );
  const businessName = clampText(
    typeof raw.businessName === "string" ? raw.businessName : "",
    160,
  );
  const address = clampText(
    typeof raw.address === "string" ? raw.address : "",
    240,
  );
  const types = Array.isArray(raw.types)
    ? raw.types
        .filter((item): item is string => typeof item === "string")
        .slice(0, 20)
        .map((item) => clampText(item, 64))
    : [];
  const trade = inferTrade({ types, name: businessName });
  const lat = typeof raw.lat === "number" && Number.isFinite(raw.lat) ? raw.lat : null;
  const lng = typeof raw.lng === "number" && Number.isFinite(raw.lng) ? raw.lng : null;

  if (!isValidPlaceId(placeId)) {
    return Response.json({ error: "Select a business." }, { status: 400 });
  }
  if (!businessName) {
    return Response.json({ error: "Business name is required." }, { status: 400 });
  }

  const placeLimited = await enforceKeyedRateLimit({
    key: `report-start:place:${placeId}`,
    limit: 1,
    windowMs: 15 * 60_000,
    message: "This business was scanned recently. Try again in a few minutes.",
  });
  if (placeLimited) return placeLimited;

  if (!shouldUseReportDemoData()) {
    const missing = missingReportProviderMessage();
    if (missing) {
      return Response.json({ error: missing }, { status: 503 });
    }
  }

  try {
    const supabase = getSupabaseAdmin();
    const unlockToken = randomBytes(32).toString("hex");

    const { data, error } = await supabase
      .from("presence_reports")
      .insert({
        unlock_token: unlockToken,
        status: "queued",
        phase: "queued",
        place_id: placeId,
        business_name: businessName,
        formatted_address: address || null,
        trade,
        lat,
        lng,
        public_payload: {
          businessName,
          address: address || null,
          town: null,
          trade,
          lat,
          lng,
          website: null,
          rating: null,
          reviewCount: null,
          mapsUri: null,
          competitors: [],
          reviews: [],
          web: null,
          keywordsPreview: [],
          teaser: {
            competitorHint: "Finding you on the map…",
            reviewHint: "Reviews come next.",
            webHint: "Website scan queued.",
          },
        },
      })
      .select("id, unlock_token")
      .single();

    if (error || !data) {
      console.error("Failed to create report:", error);
      return Response.json(
        { error: "Could not start the report." },
        { status: 500 },
      );
    }

    after(async () => {
      try {
        await runPresenceReport(data.id);
      } catch (err) {
        console.error("Background report scan failed:", err);
      }
    });

    return Response.json({
      reportId: data.id,
      unlockToken: data.unlock_token,
    });
  } catch (error) {
    console.error("Report start failed:", error);
    const message =
      error instanceof Error && error.message.includes("SUPABASE_SERVICE_ROLE_KEY")
        ? "Server database is not configured for reports."
        : "Could not start the report.";
    return Response.json({ error: message }, { status: 500 });
  }
}
