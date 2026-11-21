import type { SocialPostFrequency } from "@/lib/social/types";

/** Build local wall-clock Date parts in a timezone. */
function partsInTz(date: Date, timeZone: string) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "short",
  });
  const bits = Object.fromEntries(
    fmt.formatToParts(date).map((p) => [p.type, p.value]),
  );
  return {
    year: Number(bits.year),
    month: Number(bits.month),
    day: Number(bits.day),
    hour: Number(bits.hour === "24" ? "0" : bits.hour),
    minute: Number(bits.minute),
    second: Number(bits.second),
    weekday: bits.weekday ?? "Mon",
  };
}

/** Approximate UTC instant for a local civil time in `timeZone`. */
export function zonedTimeToUtc(
  parts: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute?: number;
    second?: number;
  },
  timeZone: string,
): Date {
  const utcGuess = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute ?? 0,
    parts.second ?? 0,
  );
  const asLocal = partsInTz(new Date(utcGuess), timeZone);
  const localAsUtc = Date.UTC(
    asLocal.year,
    asLocal.month - 1,
    asLocal.day,
    asLocal.hour,
    asLocal.minute,
    asLocal.second,
  );
  const offset = localAsUtc - utcGuess;
  return new Date(utcGuess - offset);
}

function weekdayIndex(weekday: string): number {
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[weekday] ?? 1;
}

function isPostingDay(frequency: SocialPostFrequency, weekday: string): boolean {
  const idx = weekdayIndex(weekday);
  switch (frequency) {
    case "daily":
      return true;
    case "weekdays":
      return idx >= 1 && idx <= 5;
    case "3x_week":
      return idx === 1 || idx === 3 || idx === 5;
    case "weekly":
      return idx === 1;
    default:
      return true;
  }
}

function addDaysCivil(
  year: number,
  month: number,
  day: number,
  add: number,
): { year: number; month: number; day: number } {
  const d = new Date(Date.UTC(year, month - 1, day + add));
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}

/**
 * Next posting slots from `from` (exclusive of past) through look-ahead window.
 * Returns ISO UTC timestamps.
 */
export function computeScheduleSlots(input: {
  frequency: SocialPostFrequency;
  timezone: string;
  preferredHour: number;
  lookAheadDays: number;
  from?: Date;
}): string[] {
  const from = input.from ?? new Date();
  const startParts = partsInTz(from, input.timezone);
  const slots: string[] = [];
  const horizon = Math.max(1, input.lookAheadDays);

  for (let offset = 0; offset <= horizon + 14 && slots.length < 60; offset += 1) {
    const civil = addDaysCivil(
      startParts.year,
      startParts.month,
      startParts.day,
      offset,
    );
    const probe = zonedTimeToUtc(
      { ...civil, hour: 12, minute: 0, second: 0 },
      input.timezone,
    );
    const probeParts = partsInTz(probe, input.timezone);
    if (!isPostingDay(input.frequency, probeParts.weekday)) continue;

    const slot = zonedTimeToUtc(
      {
        year: civil.year,
        month: civil.month,
        day: civil.day,
        hour: input.preferredHour,
        minute: 0,
        second: 0,
      },
      input.timezone,
    );

    if (slot.getTime() <= from.getTime()) continue;

    const daysAhead =
      (slot.getTime() - from.getTime()) / (24 * 60 * 60 * 1000);
    if (daysAhead > horizon) break;

    slots.push(slot.toISOString());
  }

  return slots;
}

export function slotKey(iso: string): string {
  return iso.slice(0, 13); // YYYY-MM-DDTHH
}
