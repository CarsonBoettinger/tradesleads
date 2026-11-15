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
};

const trades = new Set([
  "Plumber",
  "Roofer",
  "Electrician",
  "HVAC",
  "Builder",
  "Landscaper",
  "Another trade",
]);

const times = new Set(["Morning", "Afternoon", "Evening"]);

const sources = new Set([
  "Google",
  "A neighbour",
  "Another owner",
  "Somewhere else",
]);

function trim(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function parseDemoLead(body: unknown):
  | { ok: true; data: DemoLeadInput }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const raw = body as Record<string, unknown>;
  const data: DemoLeadInput = {
    firstName: trim(raw.firstName),
    lastName: trim(raw.lastName),
    email: trim(raw.email),
    phone: trim(raw.phone),
    business: trim(raw.business),
    town: trim(raw.town),
    trade: trim(raw.trade),
    time: trim(raw.time),
    source: trim(raw.source),
    comments: trim(raw.comments),
    consent: raw.consent === true || raw.consent === "yes",
  };

  if (!data.firstName) return { ok: false, error: "First name is required." };
  if (!data.lastName) return { ok: false, error: "Last name is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { ok: false, error: "A valid email is required." };
  }
  if (data.phone.replace(/\D/g, "").length < 7) {
    return { ok: false, error: "A valid phone number is required." };
  }
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
  };
}
