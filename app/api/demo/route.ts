import { parseDemoLead, toLeadRow } from "@/lib/leads";
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
    const { error } = await supabase.from("leads").insert(toLeadRow(parsed.data));

    if (error) {
      console.error("Failed to insert lead:", error);
      return Response.json(
        { error: "Could not save the demo request." },
        { status: 500 },
      );
    }

    // Telegram is sent by the Supabase Edge Function trigger on insert.
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Demo submit failed:", error);
    return Response.json(
      { error: "Could not save the demo request." },
      { status: 500 },
    );
  }
}
