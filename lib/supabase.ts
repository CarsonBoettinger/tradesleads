import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

function isProductionRuntime() {
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production"
  );
}

/**
 * Server-only Supabase client.
 * Production requires SUPABASE_SERVICE_ROLE_KEY so RLS is bypassed safely.
 * Local/dev may fall back to the anon key with a warning.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
  }

  if (!serviceRole) {
    if (isProductionRuntime()) {
      throw new Error(
        "Missing SUPABASE_SERVICE_ROLE_KEY. Required in production for server writes.",
      );
    }
    if (!anon) {
      throw new Error(
        "Missing Supabase keys. Set SUPABASE_SERVICE_ROLE_KEY (preferred) or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
    }
    console.warn(
      "[supabase] SUPABASE_SERVICE_ROLE_KEY is not set; using anon key. Report writes need service role or open RLS.",
    );
  }

  const key = serviceRole || anon!;

  if (!client) {
    client = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return client;
}
