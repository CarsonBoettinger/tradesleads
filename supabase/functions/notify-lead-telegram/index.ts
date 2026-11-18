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

const MAX_BODY_BYTES = 16_384;

function leadHeadline(tags: string[] | null | undefined) {
  if (tags?.includes("report")) return "📊 Presence report lead - call them";
  if (tags?.includes("free demo")) return "📞 Free demo lead - call them";
  return "📞 Inbound lead - call them";
}

function clamp(value: string | null | undefined, max: number) {
  if (!value) return "";
  return value.trim().slice(0, max);
}

function formatMessage(lead: LeadRecord) {
  const lines = [
    leadHeadline(lead.tags),
    "",
    `${clamp(lead.first_name, 80)} ${clamp(lead.last_name, 80)}`.trim(),
    clamp(lead.business, 160),
    `${clamp(lead.trade, 80)} · ${clamp(lead.town, 120)}`,
    "",
    `📱 ${clamp(lead.phone, 40)}`,
    `✉️ ${clamp(lead.email, 160)}`,
    `🕐 Best time: ${clamp(lead.best_time, 40)}`,
  ];

  if (lead.tags?.length) {
    lines.push(`🏷️ Tag: ${lead.tags.slice(0, 8).join(", ")}`);
  }
  if (lead.source) lines.push(`🔎 Heard via: ${clamp(lead.source, 80)}`);
  if (lead.comments) {
    lines.push("", `Notes: ${clamp(lead.comments, 500)}`);
  }

  return lines.filter((line, index) => line !== "" || index === 1).join("\n");
}

function secretsMatch(provided: string | null, expected: string | undefined) {
  if (!provided || !expected) return false;
  const left = new TextEncoder().encode(provided);
  const right = new TextEncoder().encode(expected);
  if (left.length !== right.length) return false;

  let diff = 0;
  for (let i = 0; i < left.length; i += 1) {
    diff |= left[i]! ^ right[i]!;
  }
  return diff === 0;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const expectedSecret = Deno.env.get("LEAD_WEBHOOK_SECRET");
  const providedSecret = req.headers.get("x-webhook-secret");

  if (!secretsMatch(providedSecret, expectedSecret)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return new Response(JSON.stringify({ error: "Payload too large" }), {
      status: 413,
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

  let text: string;
  try {
    text = await req.text();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (text.length > MAX_BODY_BYTES) {
    return new Response(JSON.stringify({ error: "Payload too large" }), {
      status: 413,
      headers: { "Content-Type": "application/json" },
    });
  }

  let payload: { record?: LeadRecord; type?: string };
  try {
    payload = JSON.parse(text) as { record?: LeadRecord; type?: string };
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
