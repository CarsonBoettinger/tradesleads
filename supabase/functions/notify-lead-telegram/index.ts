import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

type LeadRecord = {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  business?: string;
  town?: string;
  trade?: string;
  best_time?: string;
  source?: string | null;
  comments?: string | null;
  tags?: string[] | null;
};

function leadHeadline(tags: string[] | null | undefined) {
  if (tags?.includes("report")) return "📊 Presence report lead - call them";
  if (tags?.includes("free demo")) return "📞 Free demo lead - call them";
  return "📞 Inbound lead - call them";
}

function formatMessage(lead: LeadRecord) {
  const lines = [
    leadHeadline(lead.tags),
    "",
    `${lead.first_name ?? ""} ${lead.last_name ?? ""}`.trim(),
    lead.business ?? "",
    `${lead.trade ?? ""} · ${lead.town ?? ""}`,
    "",
    `📱 ${lead.phone ?? ""}`,
    `✉️ ${lead.email ?? ""}`,
    `🕐 Best time: ${lead.best_time ?? ""}`,
  ];

  if (lead.tags?.length) lines.push(`🏷️ Tag: ${lead.tags.join(", ")}`);
  if (lead.source) lines.push(`🔎 Heard via: ${lead.source}`);
  if (lead.comments) {
    lines.push("", `Notes: ${lead.comments}`);
  }

  return lines.filter((line, index) => line !== "" || index === 1).join("\n");
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const expectedSecret = Deno.env.get("LEAD_WEBHOOK_SECRET");
  const providedSecret = req.headers.get("x-webhook-secret");

  if (!expectedSecret || providedSecret !== expectedSecret) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");

  if (!token || !chatId) {
    return new Response(
      JSON.stringify({ error: "Missing Telegram secrets" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  let payload: { record?: LeadRecord; type?: string };
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const lead = payload.record;
  if (!lead) {
    return new Response(JSON.stringify({ error: "Missing lead record" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const telegramRes = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: formatMessage(lead),
        disable_web_page_preview: true,
      }),
    },
  );

  if (!telegramRes.ok) {
    const detail = await telegramRes.text();
    console.error("Telegram error:", detail);
    return new Response(JSON.stringify({ error: "Telegram send failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (lead.id && supabaseUrl && serviceKey) {
    const supabase = createClient(supabaseUrl, serviceKey);
    const { error } = await supabase
      .from("leads")
      .update({ telegram_sent_at: new Date().toISOString() })
      .eq("id", lead.id);

    if (error) {
      console.error("Could not mark telegram_sent_at:", error);
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
