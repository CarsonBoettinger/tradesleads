import { clientIp, rateLimit } from "@/lib/report/rate-limit";
import { isUuid, safeEqual } from "@/lib/report/security";
import { getSupabaseAdmin } from "@/lib/supabase";
import type {
  PresenceReportRow,
  PublicReportPayload,
  ScorePayload,
} from "@/lib/report/types";

export async function GET(request: Request) {
  const limited = rateLimit({
    key: `report-status:${clientIp(request)}`,
    limit: 120,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return Response.json(
      { error: "Too many requests. Try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  const { searchParams } = new URL(request.url);
  const reportId = searchParams.get("reportId")?.trim() ?? "";
  const unlockToken = searchParams.get("token")?.trim() ?? "";

  if (!isUuid(reportId) || unlockToken.length < 32) {
    return Response.json({ error: "Missing report credentials." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("presence_reports")
      .select(
        "id, status, phase, business_name, formatted_address, trade, unlock_token, public_payload, score_payload, error_message",
      )
      .eq("id", reportId)
      .maybeSingle();

    if (error) {
      console.error("Report status failed:", error);
      return Response.json({ error: "Could not load report." }, { status: 500 });
    }
    if (!data || !safeEqual(String(data.unlock_token ?? ""), unlockToken)) {
      return Response.json({ error: "Report not found." }, { status: 404 });
    }

    const row = data as Pick<
      PresenceReportRow,
      | "id"
      | "status"
      | "phase"
      | "business_name"
      | "formatted_address"
      | "trade"
      | "public_payload"
      | "score_payload"
      | "error_message"
    >;
    const unlocked = row.status === "unlocked";
    const publicPayload = row.public_payload as PublicReportPayload;
    const scorePayload = unlocked
      ? (row.score_payload as ScorePayload | null)
      : null;

    return Response.json({
      reportId: row.id,
      status: row.status,
      phase: row.phase,
      businessName: row.business_name,
      address: row.formatted_address,
      trade: row.trade,
      unlocked,
      public: publicPayload,
      score: scorePayload?.score ?? null,
      keywords: scorePayload?.keywords ?? null,
      error: row.error_message,
    });
  } catch (error) {
    console.error("Report status failed:", error);
    return Response.json({ error: "Could not load report." }, { status: 500 });
  }
}
