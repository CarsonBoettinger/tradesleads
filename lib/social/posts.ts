import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase";
import { zonedTimeToUtc } from "@/lib/social/schedule";
import type {
  SocialPlatform,
  SocialPost,
  SocialPostStatus,
} from "@/lib/social/types";

type PostRow = {
  id: string;
  brand_id: string;
  caption: string;
  image_asset_id: string | null;
  image_url: string | null;
  platforms: string[];
  status: SocialPostStatus;
  scheduled_for: string;
  published_at: string | null;
  facebook_post_id: string | null;
  instagram_post_id: string | null;
  error_message: string | null;
  approved_by: string | null;
  approved_at: string | null;
  generation_meta: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

function toPost(row: PostRow): SocialPost {
  return {
    id: row.id,
    brandId: row.brand_id,
    caption: row.caption,
    imageAssetId: row.image_asset_id,
    imageUrl: row.image_url,
    platforms: (row.platforms ?? []) as SocialPlatform[],
    status: row.status,
    scheduledFor: row.scheduled_for,
    publishedAt: row.published_at,
    facebookPostId: row.facebook_post_id,
    instagramPostId: row.instagram_post_id,
    errorMessage: row.error_message,
    approvedBy: row.approved_by,
    approvedAt: row.approved_at,
    generationMeta: row.generation_meta ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const SELECT =
  "id, brand_id, caption, image_asset_id, image_url, platforms, status, scheduled_for, published_at, facebook_post_id, instagram_post_id, error_message, approved_by, approved_at, generation_meta, created_at, updated_at";

export async function listPostsForBrand(
  brandId: string,
  limit = 120,
): Promise<SocialPost[]> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("social_posts")
    .select(SELECT)
    .eq("brand_id", brandId)
    .neq("status", "rejected")
    .order("scheduled_for", { ascending: true })
    .limit(limit);

  if (error) throw new Error(error.message);
  return ((data as PostRow[] | null) ?? []).map(toPost);
}

export async function listOccupiedSlots(brandId: string): Promise<string[]> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("social_posts")
    .select("scheduled_for")
    .eq("brand_id", brandId)
    .neq("status", "rejected")
    .gte("scheduled_for", new Date().toISOString());

  if (error) throw new Error(error.message);
  return ((data as { scheduled_for: string }[] | null) ?? []).map(
    (r) => r.scheduled_for,
  );
}

export async function createPendingPost(input: {
  brandId: string;
  caption: string;
  imageAssetId: string | null;
  imageUrl: string | null;
  platforms: SocialPlatform[];
  scheduledFor: string;
  generationMeta?: Record<string, unknown>;
}): Promise<SocialPost> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("social_posts")
    .insert({
      brand_id: input.brandId,
      caption: input.caption,
      image_asset_id: input.imageAssetId,
      image_url: input.imageUrl,
      platforms: input.platforms,
      status: "pending_approval",
      scheduled_for: input.scheduledFor,
      generation_meta: input.generationMeta ?? {},
    })
    .select(SELECT)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not create social post.");
  }
  return toPost(data as PostRow);
}

export async function getPostById(postId: string): Promise<SocialPost | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("social_posts")
    .select(SELECT)
    .eq("id", postId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toPost(data as PostRow) : null;
}

export async function updatePost(
  postId: string,
  patch: Partial<{
    caption: string;
    imageAssetId: string | null;
    imageUrl: string | null;
    status: SocialPostStatus;
    approvedBy: string | null;
    approvedAt: string | null;
    facebookPostId: string | null;
    instagramPostId: string | null;
    publishedAt: string | null;
    errorMessage: string | null;
    generationMeta: Record<string, unknown>;
  }>,
): Promise<SocialPost> {
  const admin = getSupabaseAdmin();
  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (patch.caption !== undefined) update.caption = patch.caption;
  if (patch.imageAssetId !== undefined) {
    update.image_asset_id = patch.imageAssetId;
  }
  if (patch.imageUrl !== undefined) update.image_url = patch.imageUrl;
  if (patch.status !== undefined) update.status = patch.status;
  if (patch.approvedBy !== undefined) update.approved_by = patch.approvedBy;
  if (patch.approvedAt !== undefined) update.approved_at = patch.approvedAt;
  if (patch.facebookPostId !== undefined) {
    update.facebook_post_id = patch.facebookPostId;
  }
  if (patch.instagramPostId !== undefined) {
    update.instagram_post_id = patch.instagramPostId;
  }
  if (patch.publishedAt !== undefined) update.published_at = patch.publishedAt;
  if (patch.errorMessage !== undefined) {
    update.error_message = patch.errorMessage;
  }
  if (patch.generationMeta !== undefined) {
    update.generation_meta = patch.generationMeta;
  }

  const { data, error } = await admin
    .from("social_posts")
    .update(update)
    .eq("id", postId)
    .select(SELECT)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not update social post.");
  }
  return toPost(data as PostRow);
}

export async function deletePost(postId: string) {
  const admin = getSupabaseAdmin();
  const { error } = await admin.from("social_posts").delete().eq("id", postId);
  if (error) throw new Error(error.message);
}

export async function listDuePosts(limit = 40): Promise<SocialPost[]> {
  const admin = getSupabaseAdmin();
  const now = new Date().toISOString();
  const { data, error } = await admin
    .from("social_posts")
    .select(SELECT)
    .in("status", ["approved", "scheduled"])
    .lte("scheduled_for", now)
    .order("scheduled_for", { ascending: true })
    .limit(limit);

  if (error) throw new Error(error.message);
  return ((data as PostRow[] | null) ?? []).map(toPost);
}

export async function listRecentCaptions(
  brandId: string,
  limit = 12,
): Promise<string[]> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("social_posts")
    .select("caption")
    .eq("brand_id", brandId)
    .order("scheduled_for", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return ((data as { caption: string }[] | null) ?? [])
    .map((r) => r.caption)
    .filter(Boolean);
}

/** Half-open UTC range [start, end) covering a calendar month in `timeZone`. */
export function monthRangeUtc(
  year: number,
  monthIndex: number,
  timeZone: string,
): { startIso: string; endIso: string } {
  const start = zonedTimeToUtc(
    { year, month: monthIndex + 1, day: 1, hour: 0, minute: 0, second: 0 },
    timeZone,
  );
  const endMonth = monthIndex === 11 ? 0 : monthIndex + 1;
  const endYear = monthIndex === 11 ? year + 1 : year;
  const end = zonedTimeToUtc(
    {
      year: endYear,
      month: endMonth + 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
    },
    timeZone,
  );
  return { startIso: start.toISOString(), endIso: end.toISOString() };
}

export async function bulkUpdateMonthPosts(input: {
  brandId: string;
  year: number;
  monthIndex: number;
  timeZone: string;
  action: "approve" | "reject";
  approvedBy?: string;
}): Promise<{ updated: number }> {
  const admin = getSupabaseAdmin();
  const { startIso, endIso } = monthRangeUtc(
    input.year,
    input.monthIndex,
    input.timeZone,
  );

  const now = new Date().toISOString();
  const update: Record<string, unknown> =
    input.action === "approve"
      ? {
          status: "scheduled",
          approved_by: input.approvedBy ?? null,
          approved_at: now,
          error_message: null,
          updated_at: now,
        }
      : {
          status: "rejected",
          updated_at: now,
        };

  const { data, error } = await admin
    .from("social_posts")
    .update(update)
    .eq("brand_id", input.brandId)
    .eq("status", "pending_approval")
    .gte("scheduled_for", startIso)
    .lt("scheduled_for", endIso)
    .select("id");

  if (error) throw new Error(error.message);
  return { updated: (data ?? []).length };
}
