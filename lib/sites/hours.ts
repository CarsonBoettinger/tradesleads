import type { BrandProfilePayload } from "@/lib/sites/types";

export type OpeningHoursLine = {
  label: string;
  value: string;
};

export const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type WeekDay = (typeof WEEK_DAYS)[number];

export type DayHoursRow = {
  day: WeekDay;
  open: string;
  close: string;
  closed: boolean;
};

const DEFAULT_OPEN = "8:00 AM";
const DEFAULT_CLOSE = "5:00 PM";

/** 15-minute steps for time selects. */
export const HOUR_TIME_OPTIONS: string[] = (() => {
  const options: string[] = [];
  for (let minutes = 0; minutes < 24 * 60; minutes += 15) {
    const h24 = Math.floor(minutes / 60);
    const m = minutes % 60;
    const period = h24 >= 12 ? "PM" : "AM";
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    options.push(
      `${h12}:${String(m).padStart(2, "0")} ${period}`,
    );
  }
  return options;
})();

function normalizeDayName(raw: string): WeekDay | null {
  const cleaned = raw.trim().toLowerCase();
  for (const day of WEEK_DAYS) {
    if (day.toLowerCase() === cleaned) return day;
    if (day.toLowerCase().startsWith(cleaned.slice(0, 3))) return day;
  }
  return null;
}

function parseRange(value: string): { open: string; close: string; closed: boolean } {
  const cleaned = value.replace(/\u2013|\u2014/g, "-").trim();
  if (!cleaned || /^closed$/i.test(cleaned)) {
    return { open: DEFAULT_OPEN, close: DEFAULT_CLOSE, closed: true };
  }
  const parts = cleaned.split(/\s*-\s*/);
  if (parts.length >= 2) {
    return {
      open: normalizeTimeToken(parts[0]!) || DEFAULT_OPEN,
      close: normalizeTimeToken(parts.slice(1).join("-")) || DEFAULT_CLOSE,
      closed: false,
    };
  }
  return { open: DEFAULT_OPEN, close: DEFAULT_CLOSE, closed: false };
}

/** Best-effort match to a known select option. */
function normalizeTimeToken(raw: string): string {
  const t = raw.trim().replace(/\./g, "").toUpperCase();
  if (!t) return "";
  const match = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match) return raw.trim();
  let hour = Number(match[1]);
  const minute = Number(match[2] ?? "0");
  let period = (match[3] ?? "").toUpperCase();
  if (!period) {
    // Assume 24h input
    period = hour >= 12 ? "PM" : "AM";
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
  }
  const snapped = Math.round(minute / 15) * 15;
  const m = snapped === 60 ? 0 : snapped;
  let h = hour;
  let p = period;
  if (snapped === 60) {
    if (h === 11) {
      h = 12;
      p = p === "AM" ? "PM" : "AM";
    } else if (h === 12) {
      h = 1;
    } else {
      h += 1;
    }
  }
  return `${h}:${String(m).padStart(2, "0")} ${p}`;
}

/** Normalize Places weekday strings or structured hours into display rows. */
export function normalizeOpeningHours(
  hours: BrandProfilePayload["hours"] | null | undefined,
): OpeningHoursLine[] {
  if (!hours || !Array.isArray(hours) || hours.length === 0) return [];

  return hours
    .map((entry) => {
      if (typeof entry === "string") {
        const cleaned = entry.replace(/\u2013|\u2014/g, "-").trim();
        if (!cleaned) return null;
        const split = cleaned.match(/^([^:]+):\s*(.+)$/);
        if (split) {
          return { label: split[1]!.trim(), value: split[2]!.trim() };
        }
        return { label: cleaned, value: "" };
      }
      if (entry && typeof entry === "object") {
        const day = String(entry.day ?? "").trim();
        const open = String(entry.open ?? "").trim();
        const close = String(entry.close ?? "").trim();
        if (!day) return null;
        if (!open && !close) return { label: day, value: "Closed" };
        return {
          label: day,
          value: [open, close].filter(Boolean).join(" - "),
        };
      }
      return null;
    })
    .filter((row): row is OpeningHoursLine => Boolean(row));
}

/** Convert textarea lines back into payload hours strings. */
export function parseHoursTextarea(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.replace(/\u2013|\u2014/g, "-").trim())
    .filter(Boolean)
    .slice(0, 14);
}

export function hoursToTextarea(
  hours: BrandProfilePayload["hours"] | null | undefined,
): string {
  return dayRowsToTextarea(hoursToDayRows(hours));
}

/** Always returns Sunday–Saturday with times filled (defaults when unknown). */
export function hoursToDayRows(
  hours: BrandProfilePayload["hours"] | null | undefined,
): DayHoursRow[] {
  const byDay = new Map<WeekDay, DayHoursRow>();

  for (const line of normalizeOpeningHours(hours)) {
    const day = normalizeDayName(line.label);
    if (!day) continue;
    const range = parseRange(line.value);
    byDay.set(day, { day, ...range });
  }

  return WEEK_DAYS.map((day) => {
    const existing = byDay.get(day);
    if (existing) return existing;
    return {
      day,
      open: DEFAULT_OPEN,
      close: DEFAULT_CLOSE,
      closed: false,
    };
  });
}

export function dayRowsToTextarea(rows: DayHoursRow[]): string {
  return rows
    .map((row) =>
      row.closed
        ? `${row.day}: Closed`
        : `${row.day}: ${row.open} - ${row.close}`,
    )
    .join("\n");
}

export function dayRowsToPayload(rows: DayHoursRow[]): Array<{
  day: string;
  open: string;
  close: string;
}> {
  return rows.map((row) =>
    row.closed
      ? { day: row.day, open: "", close: "" }
      : { day: row.day, open: row.open, close: row.close },
  );
}
