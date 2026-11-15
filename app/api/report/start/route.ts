import { randomBytes } from "node:crypto";
import { after } from "next/server";
import {
  missingReportProviderMessage,
  shouldUseReportDemoData,
} from "@/lib/report/config";
import { inferTrade } from "@/lib/report/keywords";
import { clientIp, rateLimit } from "@/lib/report/rate-limit";
import { runPresenceReport } from "@/lib/report/run";
import {
  clampText,
  isValidPlaceId,
} from "@/lib/report/security";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const limited = rateLimit({
    key: `report-start:${clientIp(request)}`,
    limit: 8,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return Response.json(
      { error: "Too many report scans. Try again shortly." },
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
    ? raw.types.filter((item): item is string => typeof item === "string")
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
