import { findExistingLead, parseDemoLead, toLeadRow } from "@/lib/leads";
import { nationalPhoneDigits } from "@/lib/contact";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parseDemoLead(body);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

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
