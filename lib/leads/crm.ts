import "server-only";

import { parseEmail, parsePhone } from "@/lib/contact";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  CHECKLIST_KEYS,
  CHECKLIST_LABELS,
  DEFAULT_CHECKLIST,
  LEAD_STATUSES,
  type BrandLead,
  type BrandLeadStatus,
  type ChecklistKey,
  type LeadActivity,
  type LeadChecklist,
} from "@/lib/leads/crm-types";

export type {
  BrandLead,
  BrandLeadStatus,
  ChecklistKey,
  LeadActivity,
  LeadChecklist,
} from "@/lib/leads/crm-types";
export {
  CHECKLIST_KEYS,
  CHECKLIST_LABELS,
  DEFAULT_CHECKLIST,
  LEAD_STATUSES,
  isLeadStatus,
} from "@/lib/leads/crm-types";

type LeadRow = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  comments: string | null;
  source: string | null;
  status: string;
  channel: string | null;
  checklist: unknown;
  brand_id: string;
};

type ActivityRow = {
  id: string;
  created_at: string;
  lead_id: string;
  user_id: string;
  type: string;
  disposition: string | null;
  sentiment: string | null;
  notes: string | null;
  outcome_summary: string | null;
  actor_name: string | null;
};

function normalizeChecklist(raw: unknown): LeadChecklist {
  const base = { ...DEFAULT_CHECKLIST };
  if (!raw || typeof raw !== "object") return base;
  const obj = raw as Record<string, unknown>;
  for (const key of CHECKLIST_KEYS) {
    if (typeof obj[key] === "boolean") base[key] = obj[key];
  }
  return base;
}

function mapLead(row: LeadRow): BrandLead {
  const status = LEAD_STATUSES.includes(row.status as BrandLeadStatus)
    ? (row.status as BrandLeadStatus)
    : "new";
  return {
    id: row.id,
    createdAt: row.created_at,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    comments: row.comments,
    source: row.source,
    status,
    channel: row.channel,
    checklist: normalizeChecklist(row.checklist),
    brandId: row.brand_id,
  };
}

function mapActivity(row: ActivityRow): LeadActivity {
  const type =
    row.type === "call" || row.type === "status_change" ? row.type : "note";
  return {
    id: row.id,
    createdAt: row.created_at,
    leadId: row.lead_id,
    userId: row.user_id,
    type,
    disposition: row.disposition,
    sentiment: row.sentiment,
    notes: row.notes,
    outcomeSummary: row.outcome_summary,
    actorName: row.actor_name,
  };
}

const LEAD_SELECT =
  "id, created_at, first_name, last_name, email, phone, comments, source, status, channel, checklist, brand_id";

export async function listBrandLeads(input: {
  brandId: string;
  status?: BrandLeadStatus | null;
}): Promise<BrandLead[]> {
  const admin = getSupabaseAdmin();
  let query = admin
    .from("leads")
    .select(LEAD_SELECT)
    .eq("brand_id", input.brandId)
    .order("created_at", { ascending: false });

  if (input.status) {
    query = query.eq("status", input.status);
  }

  const { data, error } = await query;
  if (error) {
    console.error("listBrandLeads failed:", error);
    throw new Error("Could not load leads.");
  }
  return ((data ?? []) as LeadRow[]).map(mapLead);
}

export async function getBrandLead(
  brandId: string,
  leadId: string,
): Promise<BrandLead | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("leads")
    .select(LEAD_SELECT)
    .eq("brand_id", brandId)
    .eq("id", leadId)
    .maybeSingle();

  if (error) {
    console.error("getBrandLead failed:", error);
    throw new Error("Could not load lead.");
  }
  return data ? mapLead(data as LeadRow) : null;
}

export type CreatePhoneLeadInput = {
  brandId: string;
  brandName: string;
  brandTown: string | null;
  brandTrade: string | null;
  brandPlaceId: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  comments?: string | null;
};

export function parsePhoneLeadBody(body: unknown):
  | {
      ok: true;
      data: {
        firstName: string;
        lastName: string;
        phone: string;
        email: string | null;
        comments: string | null;
      };
    }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }
  const raw = body as Record<string, unknown>;

  const name =
    typeof raw.name === "string"
      ? raw.name.trim().slice(0, 120)
      : [
          typeof raw.firstName === "string" ? raw.firstName.trim() : "",
          typeof raw.lastName === "string" ? raw.lastName.trim() : "",
        ]
          .filter(Boolean)
          .join(" ");

  const [firstName, ...rest] = name.split(/\s+/).filter(Boolean);
  const lastName =
    (typeof raw.lastName === "string" && raw.lastName.trim()) ||
    rest.join(" ") ||
    "-";

  if (!firstName) {
    return { ok: false, error: "Name is required." };
  }

  const phoneRaw = typeof raw.phone === "string" ? raw.phone : "";
  const phoneParsed = parsePhone(phoneRaw);
  if (!phoneParsed.ok) return { ok: false, error: phoneParsed.error };

  let email: string | null = null;
  const emailRaw = typeof raw.email === "string" ? raw.email.trim() : "";
  if (emailRaw) {
    const emailParsed = parseEmail(emailRaw);
    if (!emailParsed.ok) return { ok: false, error: emailParsed.error };
    email = emailParsed.email;
  }

  const comments =
    typeof raw.comments === "string"
      ? raw.comments.trim().slice(0, 2000) || null
      : null;

  return {
    ok: true,
    data: {
      firstName: firstName.slice(0, 80),
      lastName: lastName.slice(0, 80),
      phone: phoneParsed.phone,
      email,
      comments,
    },
  };
}

export async function createPhoneLead(
  input: CreatePhoneLeadInput,
): Promise<BrandLead> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("leads")
    .insert({
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email || "",
      phone: input.phone,
      business: input.brandName,
      town: input.brandTown ?? "",
      trade: input.brandTrade ?? "",
      best_time: "Anytime",
      comments: input.comments,
      consent: true,
      source: "phone",
      tags: ["phone"],
      direction: "inbound",
      channel: "phone",
      place_id: input.brandPlaceId,
      brand_id: input.brandId,
      status: "new",
      checklist: DEFAULT_CHECKLIST,
    })
    .select(LEAD_SELECT)
    .single();

  if (error || !data) {
    console.error("createPhoneLead failed:", error);
    throw new Error("Could not create lead.");
  }
  return mapLead(data as LeadRow);
}

export async function updateBrandLead(input: {
  brandId: string;
  leadId: string;
  status?: BrandLeadStatus;
  checklist?: Partial<LeadChecklist>;
  userId: string;
  actorName: string | null;
}): Promise<BrandLead> {
  const existing = await getBrandLead(input.brandId, input.leadId);
  if (!existing) throw new Error("Lead not found.");

  const admin = getSupabaseAdmin();
  const patch: Record<string, unknown> = {};
  const activities: Array<{
    lead_id: string;
    user_id: string;
    type: string;
    notes: string | null;
    outcome_summary: string | null;
    actor_name: string | null;
  }> = [];

  if (input.status && input.status !== existing.status) {
    patch.status = input.status;
    activities.push({
      lead_id: input.leadId,
      user_id: input.userId,
      type: "status_change",
      notes: null,
      outcome_summary: `Status changed to ${input.status}`,
      actor_name: input.actorName,
    });
  }

  if (input.checklist) {
    const next = { ...existing.checklist };
    const changed: string[] = [];
    for (const key of CHECKLIST_KEYS) {
      if (
        typeof input.checklist[key] === "boolean" &&
        input.checklist[key] !== next[key]
      ) {
        next[key] = input.checklist[key]!;
        changed.push(
          `${CHECKLIST_LABELS[key]}: ${next[key] ? "done" : "undone"}`,
        );
      }
    }
    if (changed.length) {
      patch.checklist = next;
      activities.push({
        lead_id: input.leadId,
        user_id: input.userId,
        type: "note",
        notes: changed.join("; "),
        outcome_summary: "Checklist updated",
        actor_name: input.actorName,
      });
    }
  }

  if (Object.keys(patch).length === 0) {
    return existing;
  }

  const { data, error } = await admin
    .from("leads")
    .update(patch)
    .eq("id", input.leadId)
    .eq("brand_id", input.brandId)
    .select(LEAD_SELECT)
    .single();

  if (error || !data) {
    console.error("updateBrandLead failed:", error);
    throw new Error("Could not update lead.");
  }

  if (activities.length) {
    const { error: actError } = await admin
      .from("lead_activities")
      .insert(activities);
    if (actError) {
      console.error("Lead activity insert failed:", actError);
    }
  }

  return mapLead(data as LeadRow);
}

export async function listLeadActivities(
  brandId: string,
  leadId: string,
): Promise<LeadActivity[]> {
  const lead = await getBrandLead(brandId, leadId);
  if (!lead) throw new Error("Lead not found.");

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("lead_activities")
    .select(
      "id, created_at, lead_id, user_id, type, disposition, sentiment, notes, outcome_summary, actor_name",
    )
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listLeadActivities failed:", error);
    throw new Error("Could not load activities.");
  }
  return ((data ?? []) as ActivityRow[]).map(mapActivity);
}

export async function addLeadNote(input: {
  brandId: string;
  leadId: string;
  userId: string;
  actorName: string | null;
  notes: string;
}): Promise<LeadActivity> {
  const lead = await getBrandLead(input.brandId, input.leadId);
  if (!lead) throw new Error("Lead not found.");

  const notes = input.notes.trim().slice(0, 2000);
  if (!notes) throw new Error("Note is required.");

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("lead_activities")
    .insert({
      lead_id: input.leadId,
      user_id: input.userId,
      type: "note",
      notes,
      outcome_summary: "Note added",
      actor_name: input.actorName,
    })
    .select(
      "id, created_at, lead_id, user_id, type, disposition, sentiment, notes, outcome_summary, actor_name",
    )
    .single();

  if (error || !data) {
    console.error("addLeadNote failed:", error);
    throw new Error("Could not add note.");
  }
  return mapActivity(data as ActivityRow);
}
