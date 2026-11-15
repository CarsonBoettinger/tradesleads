import { LEAD_TAG_REPORT } from "@/lib/leads";
import { clientIp, rateLimit } from "@/lib/report/rate-limit";
import { clampText, isUuid, safeEqual } from "@/lib/report/security";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { PresenceReportRow, ScorePayload } from "@/lib/report/types";

export async function POST(request: Request) {
  const limited = rateLimit({
    key: `report-unlock:${clientIp(request)}`,
    limit: 10,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return Response.json(
      { error: "Too many unlock attempts. Try again shortly." },
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
  const reportId = clampText(
    typeof raw.reportId === "string" ? raw.reportId : "",
    64,
  );
  const unlockToken = clampText(
    typeof raw.unlockToken === "string" ? raw.unlockToken : "",
    128,
  );
  const firstName = clampText(
    typeof raw.firstName === "string" ? raw.firstName : "",
    80,
  );
  const lastName = clampText(
    typeof raw.lastName === "string" ? raw.lastName : "",
    80,
  );
  const email = clampText(
    typeof raw.email === "string" ? raw.email : "",
    160,
  ).toLowerCase();
  const phone = clampText(
    typeof raw.phone === "string" ? raw.phone : "",
    40,
  );
  const consent = raw.consent === true || raw.consent === "yes";

  if (!isUuid(reportId) || unlockToken.length < 32) {
    return Response.json({ error: "Missing report credentials." }, { status: 400 });
  }
  if (!firstName) {
    return Response.json({ error: "First name is required." }, { status: 400 });
  }
  if (!lastName) {
    return Response.json({ error: "Last name is required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (phone.replace(/\D/g, "").length < 7) {
    return Response.json(
      { error: "A valid phone number is required." },
      { status: 400 },
    );
  }
  if (!consent) {
    return Response.json({ error: "Consent is required." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("presence_reports")
      .select("*")
      .eq("id", reportId)
      .maybeSingle();

    if (error) {
      console.error("Unlock lookup failed:", error);
      return Response.json({ error: "Could not unlock report." }, { status: 500 });
    }
    if (!data || !safeEqual(String(data.unlock_token ?? ""), unlockToken)) {
      return Response.json({ error: "Report not found." }, { status: 404 });
    }

    const row = data as PresenceReportRow;
    if (row.status !== "ready" && row.status !== "unlocked") {
      return Response.json(
        { error: "The scan is still running. Try again in a moment." },
        { status: 409 },
      );
    }
    if (!row.score_payload) {
      return Response.json(
        { error: "Report scores are not ready yet." },
        { status: 409 },
      );
    }

    let leadId = row.lead_id;
    const scorePayload = row.score_payload as ScorePayload;

    if (row.status === "unlocked" && leadId) {
      return Response.json({
        ok: true,
        unlocked: true,
        score: scorePayload.score,
        keywords: scorePayload.keywords,
        web: scorePayload.web,
        competitors: scorePayload.competitors,
      });
    }

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        business: row.business_name,
        town: row.town || "Unknown",
        trade: row.trade,
        best_time: "Morning",
        source: "Presence report",
        comments: `Unlocked digital presence report ${row.id}`,
        consent: true,
        tags: [LEAD_TAG_REPORT],
        direction: "inbound",
        channel: "presence_report",
        place_id: row.place_id,
        report_id: row.id,
      })
      .select("id")
      .single();

    if (leadError || !lead) {
      console.error("Lead insert from report failed:", leadError);
      return Response.json(
        { error: "Could not save your details." },
        { status: 500 },
      );
    }

    leadId = lead.id;

    const { error: updateError } = await supabase
      .from("presence_reports")
      .update({
        status: "unlocked",
        lead_id: leadId,
        contact_first_name: firstName,
        contact_last_name: lastName,
        contact_email: email,
        contact_phone: phone,
        unlocked_at: new Date().toISOString(),
      })
      .eq("id", reportId)
      .eq("unlock_token", unlockToken)
      .in("status", ["ready", "unlocked"]);

    if (updateError) {
      console.error("Report unlock update failed:", updateError);
      return Response.json(
        { error: "Could not unlock report." },
        { status: 500 },
      );
    }

    return Response.json({
      ok: true,
      unlocked: true,
      score: scorePayload.score,
      keywords: scorePayload.keywords,
      web: scorePayload.web,
      competitors: scorePayload.competitors,
    });
  } catch (error) {
    console.error("Report unlock failed:", error);
    return Response.json(
      { error: "Could not unlock report." },
      { status: 500 },
    );
  }
}
