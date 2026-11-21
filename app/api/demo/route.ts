import { findExistingLead, parseDemoLead, toLeadRow } from "@/lib/leads";
import { nationalPhoneDigits } from "@/lib/contact";
import {
  enforceKeyedRateLimit,
  enforceRateLimit,
  honeypotTripped,
  readJsonBody,
  rejectCrossOrigin,
} from "@/lib/http-guard";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const crossOrigin = rejectCrossOrigin(request, { requireOrigin: true });
  if (crossOrigin) return crossOrigin;

  const limited = await enforceRateLimit({
    request,
    key: "demo",
    limit: 5,
    windowMs: 15 * 60_000,
    message: "Too many demo requests. Try again later.",
  });
  if (limited) return limited;

  const parsedBody = await readJsonBody(request, 16_384);
  if (!parsedBody.ok) return parsedBody.response;

  // Bots that fill the honeypot get a quiet success — no DB write / Telegram.
  if (honeypotTripped(parsedBody.body)) {
    return Response.json({ ok: true, duplicate: false });
  }

  const raw = (parsedBody.body ?? {}) as Record<string, unknown>;
  const turnstile = await verifyTurnstile({
    token: raw.turnstileToken,
    request,
  });
  if (!turnstile.ok) return turnstile.response;

  const parsed = parseDemoLead(parsedBody.body);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const emailLimited = await enforceKeyedRateLimit({
    key: `demo-email:${parsed.data.email}`,
    limit: 3,
    windowMs: 60 * 60_000,
    message: "Too many demo requests for this email. Try again later.",
  });
  if (emailLimited) return emailLimited;

  try {
    const supabase = getSupabaseAdmin();
    const existing = await findExistingLead({
      email: parsed.data.email,
      phoneDigits: nationalPhoneDigits(parsed.data.phone),
    });

    if (existing) {
      const { error } = await supabase
        .from("leads")
        .update({
          first_name: parsed.data.firstName,
          last_name: parsed.data.lastName,
          phone: parsed.data.phone,
          business: parsed.data.business,
          town: parsed.data.town,
          trade: parsed.data.trade,
          best_time: parsed.data.time,
          source: parsed.data.source || null,
          comments: parsed.data.comments || null,
          consent: parsed.data.consent,
        })
        .eq("id", existing.id);

      if (error) {
        console.error("Failed to update duplicate demo lead:", error);
        return Response.json(
          { error: "Could not save the demo request." },
          { status: 500 },
        );
      }

      return Response.json({
        ok: true,
        duplicate: true,
        reportId: existing.report_id,
      });
    }

    const { error } = await supabase.from("leads").insert(toLeadRow(parsed.data));

    if (error) {
      console.error("Failed to insert lead:", error);
      return Response.json(
        { error: "Could not save the demo request." },
        { status: 500 },
      );
    }

    // Telegram is sent by the Supabase Edge Function trigger on insert.
    return Response.json({ ok: true, duplicate: false });
  } catch (error) {
    console.error("Demo submit failed:", error);
    return Response.json(
      { error: "Could not save the demo request." },
      { status: 500 },
    );
  }
}
