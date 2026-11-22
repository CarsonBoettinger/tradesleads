import { parseEmail, parsePhone } from "@/lib/contact";
import {
  enforceKeyedRateLimit,
  enforceRateLimit,
  honeypotTripped,
  readJsonBody,
  rejectCrossOrigin,
} from "@/lib/http-guard";
import {
  findExistingLead,
  findExistingReportForLead,
  leadLinkedToOtherPlace,
  LEAD_TAG_REPORT,
} from "@/lib/leads";
import { clampText, isUuid, safeEqual } from "@/lib/report/security";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { PresenceReportRow, ScorePayload } from "@/lib/report/types";

function scoreResponse(scorePayload: ScorePayload, reused = false) {
  return {
    ok: true,
    unlocked: true,
    reused,
    score: scorePayload.score,
    keywords: scorePayload.keywords,
    web: scorePayload.web,
    competitors: scorePayload.competitors,
  };
}

async function markReportUnlocked(input: {
  reportId: string;
  unlockToken: string;
  leadId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}) {
  const supabase = getSupabaseAdmin();
  return supabase
    .from("presence_reports")
    .update({
      status: "unlocked",
      lead_id: input.leadId,
      contact_first_name: input.firstName,
      contact_last_name: input.lastName,
      contact_email: input.email,
      contact_phone: input.phone,
      unlocked_at: new Date().toISOString(),
    })
    .eq("id", input.reportId)
    .eq("unlock_token", input.unlockToken)
    .in("status", ["ready", "unlocked"]);
}

export async function POST(request: Request) {
  const crossOrigin = await rejectCrossOrigin(request, { requireOrigin: true });
  if (crossOrigin) return crossOrigin;

  const limited = await enforceRateLimit({
    request,
    key: "report-unlock",
    limit: 10,
    windowMs: 60_000,
    message: "Too many unlock attempts. Try again shortly.",
  });
  if (limited) return limited;

  const parsedBody = await readJsonBody(request, 8_192);
  if (!parsedBody.ok) return parsedBody.response;

  if (honeypotTripped(parsedBody.body)) {
    return Response.json({
      ok: true,
      unlocked: true,
      reused: false,
      score: null,
      keywords: null,
      web: null,
      competitors: [],
    });
  }

  const raw = (parsedBody.body ?? {}) as Record<string, unknown>;

  const turnstile = await verifyTurnstile({
    token: raw.turnstileToken,
    request,
  });
  if (!turnstile.ok) return turnstile.response;

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
  const emailRaw = clampText(
    typeof raw.email === "string" ? raw.email : "",
    160,
  );
  const phoneRaw = clampText(
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

  const emailParsed = parseEmail(emailRaw);
  if (!emailParsed.ok) {
    return Response.json({ error: emailParsed.error }, { status: 400 });
  }
  const phoneParsed = parsePhone(phoneRaw);
  if (!phoneParsed.ok) {
    return Response.json({ error: phoneParsed.error }, { status: 400 });
  }
  if (!consent) {
    return Response.json({ error: "Consent is required." }, { status: 400 });
  }

  const email = emailParsed.email;
  const phone = phoneParsed.phone;

  const emailLimited = await enforceKeyedRateLimit({
    key: `report-unlock-email:${email}`,
    limit: 5,
    windowMs: 60 * 60_000,
    message: "Too many unlock attempts for this email. Try again later.",
  });
  if (emailLimited) return emailLimited;

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

    const currentScore = row.score_payload as ScorePayload;

    if (row.status === "unlocked" && row.lead_id) {
      return Response.json(scoreResponse(currentScore));
    }

    const matchedLead = await findExistingLead({
      email,
      phoneDigits: phoneParsed.digits,
      placeId: row.place_id,
    });

    // Only reuse a lead for the same place. DB triggers reject linking one lead
    // to reports for different businesses, and block place reassignment after CRM activity.
    let reusableLead = matchedLead;
    if (matchedLead) {
      const placeMismatch =
        Boolean(matchedLead.place_id) &&
        Boolean(row.place_id) &&
        matchedLead.place_id !== row.place_id;
      const linkedElsewhere = row.place_id
        ? await leadLinkedToOtherPlace(matchedLead.id, row.place_id)
        : false;
      if (placeMismatch || linkedElsewhere) {
        reusableLead = null;
      }
    }

    if (reusableLead) {
      const existingReport = await findExistingReportForLead({
        leadId: reusableLead.id,
        placeId: row.place_id,
        reportId: reusableLead.report_id,
      });

      // Same business already reported for this lead: reuse that report card.
      if (
        existingReport &&
        existingReport.report.place_id === row.place_id &&
        existingReport.report.id !== row.id
      ) {
        const { error: reuseUpdateError } = await markReportUnlocked({
          reportId,
          unlockToken,
          leadId: reusableLead.id,
          firstName,
          lastName,
          email,
          phone,
        });
        if (reuseUpdateError) {
          console.error("Report unlock update failed:", reuseUpdateError);
          return Response.json(
            { error: "Could not unlock report." },
            { status: 500 },
          );
        }
        return Response.json(scoreResponse(existingReport.scorePayload, true));
      }

      const { error: leadUpdateError } = await supabase
        .from("leads")
        .update({
          first_name: firstName,
          last_name: lastName,
          phone,
          business: row.business_name,
          town: row.town || "Unknown",
          trade: row.trade,
          place_id: row.place_id,
          report_id: row.id,
          consent: true,
        })
        .eq("id", reusableLead.id);

      if (leadUpdateError) {
        console.error("Lead update from report failed:", leadUpdateError);
        // Fall through to insert a fresh lead for this place.
      } else {
        const { error: updateError } = await markReportUnlocked({
          reportId,
          unlockToken,
          leadId: reusableLead.id,
          firstName,
          lastName,
          email,
          phone,
        });

        if (updateError) {
          console.error("Report unlock update failed:", updateError);
          return Response.json(
            { error: "Could not unlock report." },
            { status: 500 },
          );
        }

        return Response.json(scoreResponse(currentScore, true));
      }
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

    const { error: updateError } = await markReportUnlocked({
      reportId,
      unlockToken,
      leadId: lead.id,
      firstName,
      lastName,
      email,
      phone,
    });

    if (updateError) {
      console.error("Report unlock update failed:", updateError);
      return Response.json(
        { error: "Could not unlock report." },
        { status: 500 },
      );
    }

    return Response.json(scoreResponse(currentScore));
  } catch (error) {
    console.error("Report unlock failed:", error);
    return Response.json(
      { error: "Could not unlock report." },
      { status: 500 },
    );
  }
}
