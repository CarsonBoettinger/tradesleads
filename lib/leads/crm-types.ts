export const LEAD_STATUSES = ["new", "contacted", "booked", "closed"] as const;
export type BrandLeadStatus = (typeof LEAD_STATUSES)[number];

export const CHECKLIST_KEYS = [
  "called",
  "quoted",
  "scheduled",
  "followed_up",
] as const;
export type ChecklistKey = (typeof CHECKLIST_KEYS)[number];

export type LeadChecklist = Record<ChecklistKey, boolean>;

export const DEFAULT_CHECKLIST: LeadChecklist = {
  called: false,
  quoted: false,
  scheduled: false,
  followed_up: false,
};

export const CHECKLIST_LABELS: Record<ChecklistKey, string> = {
  called: "Called",
  quoted: "Quoted",
  scheduled: "Scheduled",
  followed_up: "Followed up",
};

export const STATUS_LABELS: Record<BrandLeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  booked: "Booked",
  closed: "Closed",
};

export type BrandLeadChannel = "manual" | "phone" | "import" | string;

export type BrandLead = {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  comments: string | null;
  source: string | null;
  status: BrandLeadStatus;
  channel: BrandLeadChannel | null;
  checklist: LeadChecklist;
  brandId: string;
};

export type LeadActivity = {
  id: string;
  createdAt: string;
  leadId: string;
  userId: string;
  type: "call" | "note" | "status_change";
  disposition: string | null;
  sentiment: string | null;
  notes: string | null;
  outcomeSummary: string | null;
  actorName: string | null;
};

export function isLeadStatus(value: unknown): value is BrandLeadStatus {
  return (
    typeof value === "string" &&
    LEAD_STATUSES.includes(value as BrandLeadStatus)
  );
}

export function channelLabel(channel: BrandLeadChannel | null, source: string | null) {
  if (channel === "phone" || source === "phone") return "Phone";
  if (channel === "manual" || (source && source.startsWith("site:"))) {
    return "Website";
  }
  if (channel === "import") return "Import";
  return "Lead";
}
