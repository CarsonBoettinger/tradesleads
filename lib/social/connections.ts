import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase";
import { decryptToken, encryptToken } from "@/lib/social/tokens";
import type {
  SocialConnectionPublic,
  SocialPlatform,
} from "@/lib/social/types";

type ConnectionRow = {
  id: string;
  brand_id: string;
  platform: SocialPlatform;
  page_id: string;
  page_name: string | null;
  ig_user_id: string | null;
  access_token_encrypted: string;
  token_expires_at: string | null;
  status: "active" | "revoked" | "expired";
  created_at: string;
};

function toPublic(row: ConnectionRow): SocialConnectionPublic {
  return {
    id: row.id,
    brandId: row.brand_id,
    platform: row.platform,
    pageId: row.page_id,
    pageName: row.page_name,
    igUserId: row.ig_user_id,
    status: row.status,
    tokenExpiresAt: row.token_expires_at,
    createdAt: row.created_at,
  };
}

export async function listConnectionsPublic(
  brandId: string,
): Promise<SocialConnectionPublic[]> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("social_connections")
    .select(
      "id, brand_id, platform, page_id, page_name, ig_user_id, access_token_encrypted, token_expires_at, status, created_at",
    )
    .eq("brand_id", brandId)
    .order("platform");

  if (error) throw new Error(error.message);
  return (data as ConnectionRow[] | null)?.map(toPublic) ?? [];
}

export async function upsertConnection(input: {
  brandId: string;
  platform: SocialPlatform;
  pageId: string;
  pageName: string | null;
  igUserId: string | null;
  accessToken: string;
  tokenExpiresAt: string | null;
  connectedBy: string;
}) {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("social_connections")
    .upsert(
      {
        brand_id: input.brandId,
        platform: input.platform,
        page_id: input.pageId,
        page_name: input.pageName,
        ig_user_id: input.igUserId,
        access_token_encrypted: encryptToken(input.accessToken),
        token_expires_at: input.tokenExpiresAt,
        connected_by: input.connectedBy,
        status: "active",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "brand_id,platform" },
    )
    .select(
      "id, brand_id, platform, page_id, page_name, ig_user_id, access_token_encrypted, token_expires_at, status, created_at",
    )
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not save social connection.");
  }
  return toPublic(data as ConnectionRow);
}

export async function disconnectPlatform(
  brandId: string,
  platform: SocialPlatform,
) {
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("social_connections")
    .delete()
    .eq("brand_id", brandId)
    .eq("platform", platform);
  if (error) throw new Error(error.message);
}

export async function getDecryptedConnection(
  brandId: string,
  platform: SocialPlatform,
) {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("social_connections")
    .select(
      "id, brand_id, platform, page_id, page_name, ig_user_id, access_token_encrypted, token_expires_at, status, created_at",
    )
    .eq("brand_id", brandId)
    .eq("platform", platform)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  const row = data as ConnectionRow;
  return {
    ...toPublic(row),
    accessToken: decryptToken(row.access_token_encrypted),
  };
}

export async function listActiveConnectionsForBrand(brandId: string) {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("social_connections")
    .select(
      "id, brand_id, platform, page_id, page_name, ig_user_id, access_token_encrypted, token_expires_at, status, created_at",
    )
    .eq("brand_id", brandId)
    .eq("status", "active");

  if (error) throw new Error(error.message);
  return ((data as ConnectionRow[] | null) ?? []).map((row) => ({
    ...toPublic(row),
    accessToken: decryptToken(row.access_token_encrypted),
  }));
}
