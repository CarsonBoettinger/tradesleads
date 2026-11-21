import "server-only";

import { staffEmailAllowlist } from "@/lib/supabase/env";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Profile, ProfileRole } from "@/lib/sites/types";

export async function getSessionUser() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function ensureProfile(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
  app_metadata?: Record<string, unknown> | null;
}): Promise<Profile> {
  const admin = getSupabaseAdmin();
  const email = user.email?.toLowerCase() ?? null;
  const allowlist = staffEmailAllowlist();
  const shouldBeStaff = Boolean(email && allowlist.has(email));

  const { data: existing } = await admin
    .from("profiles")
    .select("id, email, full_name, role, must_change_password")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) {
    const nextRole: ProfileRole =
      shouldBeStaff && existing.role !== "staff" ? "staff" : existing.role;
    if (shouldBeStaff && existing.role !== "staff") {
      await admin
        .from("profiles")
        .update({ role: "staff", email, updated_at: new Date().toISOString() })
        .eq("id", user.id);
    }
    return {
      id: existing.id,
      email: existing.email,
      full_name: existing.full_name,
      role: nextRole,
      must_change_password: Boolean(existing.must_change_password),
    };
  }

  const fullName =
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null) ||
    (email ? email.split("@")[0] : null);

  const role: ProfileRole = shouldBeStaff ? "staff" : "client";
  const mustChangePassword = Boolean(user.app_metadata?.must_change_password);
  const { data, error } = await admin
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email,
        full_name: fullName,
        role,
        must_change_password: mustChangePassword,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select("id, email, full_name, role, must_change_password")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not create profile.");
  }

  return {
    ...(data as Omit<Profile, "must_change_password">),
    must_change_password: Boolean(data.must_change_password),
  };
}

export function userMustChangePassword(user: {
  app_metadata?: Record<string, unknown> | null;
}) {
  return Boolean(user.app_metadata?.must_change_password);
}

export async function clearMustChangePassword(userId: string) {
  const admin = getSupabaseAdmin();
  const { data: authUser, error: getError } =
    await admin.auth.admin.getUserById(userId);
  if (getError) throw getError;

  const nextMetadata = {
    ...(authUser.user.user_metadata ?? {}),
  };
  delete nextMetadata.temporary_password;

  const { error: authError } = await admin.auth.admin.updateUserById(userId, {
    app_metadata: { must_change_password: false },
    user_metadata: nextMetadata,
  });
  if (authError) throw authError;

  const { error } = await admin
    .from("profiles")
    .update({
      must_change_password: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
  if (error) throw error;
}

export async function requireDashboardUser() {
  const user = await getSessionUser();
  if (!user) return null;
  const profile = await ensureProfile(user);
  return { user, profile };
}

export async function requireStaff() {
  const session = await requireDashboardUser();
  if (!session || session.profile.role !== "staff") return null;
  return session;
}
