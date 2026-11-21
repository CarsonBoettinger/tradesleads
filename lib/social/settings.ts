import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase";
import type {
  SocialPostFrequency,
  SocialPostSettings,
} from "@/lib/social/types";

type SettingsRow = {
  id: string;
  brand_id: string;
  frequency: SocialPostFrequency;
  timezone: string;
  preferred_hour: number;
  enabled: boolean;
  look_ahead_days: number;
  cadence_confirmed: boolean;
};

const SELECT =
  "id, brand_id, frequency, timezone, preferred_hour, enabled, look_ahead_days, cadence_confirmed";

function toSettings(row: SettingsRow): SocialPostSettings {
  return {
    id: row.id,
    brandId: row.brand_id,
    frequency: row.frequency,
    timezone: row.timezone,
    preferredHour: row.preferred_hour,
    enabled: row.enabled,
    lookAheadDays: row.look_ahead_days,
    cadenceConfirmed: Boolean(row.cadence_confirmed),
  };
}

const DEFAULTS: Omit<SocialPostSettings, "id" | "brandId"> = {
  frequency: "daily",
  timezone: "America/Toronto",
  preferredHour: 10,
  enabled: true,
  lookAheadDays: 7,
  cadenceConfirmed: false,
};

export async function getOrCreateSettings(
  brandId: string,
): Promise<SocialPostSettings> {
  const admin = getSupabaseAdmin();
  const { data: existing, error } = await admin
    .from("social_post_settings")
    .select(SELECT)
    .eq("brand_id", brandId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (existing) return toSettings(existing as SettingsRow);

  const { data, error: insertError } = await admin
    .from("social_post_settings")
    .insert({
      brand_id: brandId,
      frequency: DEFAULTS.frequency,
      timezone: DEFAULTS.timezone,
      preferred_hour: DEFAULTS.preferredHour,
      enabled: DEFAULTS.enabled,
      look_ahead_days: DEFAULTS.lookAheadDays,
      cadence_confirmed: DEFAULTS.cadenceConfirmed,
    })
    .select(SELECT)
    .single();

  if (insertError || !data) {
    throw new Error(insertError?.message ?? "Could not create social settings.");
  }
  return toSettings(data as SettingsRow);
}

export async function updateSettings(
  brandId: string,
  patch: Partial<{
    frequency: SocialPostFrequency;
    timezone: string;
    preferredHour: number;
    enabled: boolean;
    lookAheadDays: number;
    cadenceConfirmed: boolean;
  }>,
): Promise<SocialPostSettings> {
  await getOrCreateSettings(brandId);
  const admin = getSupabaseAdmin();
  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (patch.frequency) update.frequency = patch.frequency;
  if (patch.timezone) update.timezone = patch.timezone;
  if (typeof patch.preferredHour === "number") {
    update.preferred_hour = patch.preferredHour;
  }
  if (typeof patch.enabled === "boolean") update.enabled = patch.enabled;
  if (typeof patch.lookAheadDays === "number") {
    update.look_ahead_days = patch.lookAheadDays;
  }
  if (typeof patch.cadenceConfirmed === "boolean") {
    update.cadence_confirmed = patch.cadenceConfirmed;
  }

  const { data, error } = await admin
    .from("social_post_settings")
    .update(update)
    .eq("brand_id", brandId)
    .select(SELECT)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not update social settings.");
  }
  return toSettings(data as SettingsRow);
}

export async function listEnabledSettings(): Promise<SocialPostSettings[]> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("social_post_settings")
    .select(SELECT)
    .eq("enabled", true)
    .eq("cadence_confirmed", true);

  if (error) throw new Error(error.message);
  return ((data as SettingsRow[] | null) ?? []).map(toSettings);
}
