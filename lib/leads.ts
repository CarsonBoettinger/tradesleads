import "server-only";

import {
  nationalPhoneDigits,
  normalizeEmail,
  parseEmail,
  parsePhone,
} from "@/lib/contact";
import { REPORT_TRADES } from "@/lib/report/keywords";
import type { PresenceReportRow, ScorePayload } from "@/lib/report/types";
import { getSupabaseAdmin } from "@/lib/supabase";

export type DemoLeadInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  business: string;
  town: string;
  trade: string;
  time: string;
  source: string;
  comments: string;
  consent: boolean;
};

export const LEAD_TAG_FREE_DEMO = "free demo";
export const LEAD_TAG_REPORT = "report";

export type LeadTag = typeof LEAD_TAG_FREE_DEMO | typeof LEAD_TAG_REPORT;

export type LeadDirection = "inbound" | "outbound";

export type LeadChannel =
  | "free_demo"
  | "presence_report"
  | "manual"
  | "import"
  | "phone";

export type DemoLeadRow = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  business: string;
  town: string;
  trade: string;
  best_time: string;
  source: string | null;
  comments: string | null;
  consent: boolean;
  tags: LeadTag[];
  direction: LeadDirection;
  channel: LeadChannel;
  place_id: string | null;
  report_id: string | null;
};

const trades = new Set<string>(REPORT_TRADES);

const times = new Set(["Morning", "Afternoon", "Evening"]);

const sources = new Set([
  "Google",
  "A neighbour",
  "Another owner",
  "Somewhere else",
]);

function trim(value: unknown, max = 160) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function parseDemoLead(body: unknown):
  | { ok: true; data: DemoLeadInput }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const raw = body as Record<string, unknown>;
  const data: DemoLeadInput = {
    firstName: trim(raw.firstName, 80),
    lastName: trim(raw.lastName, 80),
    email: trim(raw.email, 160),
    phone: trim(raw.phone, 40),
    business: trim(raw.business, 160),
    town: trim(raw.town, 120),
    trade: trim(raw.trade, 80),
    time: trim(raw.time, 40),
    source: trim(raw.source, 80),
    comments: trim(raw.comments, 1_000),
    consent: raw.consent === true || raw.consent === "yes",
  };

  if (!data.firstName) return { ok: false, error: "First name is required." };
  if (!data.lastName) return { ok: false, error: "Last name is required." };

  const emailParsed = parseEmail(data.email);
  if (!emailParsed.ok) return { ok: false, error: emailParsed.error };
  data.email = emailParsed.email;

  const phoneParsed = parsePhone(data.phone);
  if (!phoneParsed.ok) return { ok: false, error: phoneParsed.error };
  data.phone = phoneParsed.phone;

  if (!data.business) return { ok: false, error: "Business name is required." };
  if (!data.town) return { ok: false, error: "Town is required." };
  if (!trades.has(data.trade)) return { ok: false, error: "Choose a trade." };
  if (!times.has(data.time)) return { ok: false, error: "Choose a time." };
  if (data.source && !sources.has(data.source)) {
    return { ok: false, error: "Choose a valid source." };
  }
  if (!data.consent) {
    return { ok: false, error: "Consent is required." };
  }

  return { ok: true, data };
}

export function toLeadRow(data: DemoLeadInput): DemoLeadRow {
  return {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone,
    business: data.business,
    town: data.town,
    trade: data.trade,
    best_time: data.time,
    source: data.source || null,
    comments: data.comments || null,
    consent: data.consent,
    tags: [LEAD_TAG_FREE_DEMO],
    direction: "inbound",
    channel: "free_demo",
    place_id: null,
    report_id: null,
  };
}

export type LeadMatch = {
  id: string;
  email: string;
  phone: string;
  place_id: string | null;
  report_id: string | null;
  business: string;
};

function phoneMatches(stored: string, digits: string) {
  return nationalPhoneDigits(stored) === digits;
}

/** Find an existing lead by email, preferring same place / phone when possible. */
export async function findExistingLead(input: {
  email: string;
  phoneDigits: string;
  placeId?: string | null;
}): Promise<LeadMatch | null> {
  const supabase = getSupabaseAdmin();
  const email = normalizeEmail(input.email);

  const { data, error } = await supabase
    .from("leads")
    .select("id, email, phone, place_id, report_id, business, created_at")
    .ilike("email", email)
    .order("created_at", { ascending: false })
    .limit(25);

  if (error) {
    console.error("Lead duplicate lookup failed:", error);
    return null;
  }

  const rows = (data ?? []) as Array<LeadMatch & { created_at: string }>;
  if (!rows.length) return null;

  if (input.placeId) {
    const samePlace = rows.find((row) => row.place_id === input.placeId);
    if (samePlace) return samePlace;
  }

  const samePhone = rows.find((row) =>
    phoneMatches(row.phone, input.phoneDigits),
  );
  if (samePhone) return samePhone;

  return rows[0] ?? null;
}

/**
 * True when this lead is already attached to a presence report for a different
 * Google place. DB triggers forbid sharing one lead across places.
 */
export async function leadLinkedToOtherPlace(
  leadId: string,
  placeId: string,
): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("presence_reports")
    .select("id")
    .eq("lead_id", leadId)
    .not("place_id", "is", null)
    .neq("place_id", placeId)
    .limit(1);

  if (error) {
    console.error("Lead place conflict lookup failed:", error);
    // Fail closed: create a new lead rather than risk a trigger exception.
    return true;
  }

  return Boolean(data?.length);
}

/** Load the best existing scored report for a lead / place. */
export async function findExistingReportForLead(input: {
  leadId: string;
  placeId?: string | null;
  reportId?: string | null;
}): Promise<{
  report: PresenceReportRow;
  scorePayload: ScorePayload;
} | null> {
  const supabase = getSupabaseAdmin();

  if (input.reportId) {
    const { data } = await supabase
      .from("presence_reports")
      .select("*")
      .eq("id", input.reportId)
      .maybeSingle();
    const row = data as PresenceReportRow | null;
    // Only reuse when the stored report is for the same place (or place unknown).
    if (
      row?.score_payload &&
      (!input.placeId || !row.place_id || row.place_id === input.placeId)
    ) {
      return { report: row, scorePayload: row.score_payload as ScorePayload };
    }
  }

  const { data, error } = await supabase
    .from("presence_reports")
    .select("*")
    .eq("lead_id", input.leadId)
    .not("score_payload", "is", null)
    .in("status", ["ready", "unlocked"])
    .order("updated_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Existing report lookup failed:", error);
    return null;
  }

  const rows = (data ?? []) as PresenceReportRow[];
  const preferred =
    (input.placeId
      ? rows.find((row) => row.place_id === input.placeId)
      : null) ??
    rows[0] ??
    null;
  if (!preferred?.score_payload) return null;
  return {
    report: preferred,
    scorePayload: preferred.score_payload as ScorePayload,
  };
}
