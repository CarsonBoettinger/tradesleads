import "server-only";

import { listActiveConnectionsForBrand } from "@/lib/social/connections";
import {
  publishFacebookPhoto,
  publishInstagramPhoto,
} from "@/lib/social/meta";
import { listDuePosts, updatePost } from "@/lib/social/posts";

export async function publishDuePosts(limit = 20): Promise<{
  attempted: number;
  published: number;
  failed: number;
  results: Array<{ postId: string; ok: boolean; error?: string }>;
}> {
  const due = await listDuePosts(limit);
  const results: Array<{ postId: string; ok: boolean; error?: string }> = [];
  let published = 0;
  let failed = 0;

  for (const post of due) {
    await updatePost(post.id, { status: "publishing", errorMessage: null });

    if (!post.imageUrl) {
      await updatePost(post.id, {
        status: "failed",
        errorMessage: "Missing image URL.",
      });
      failed += 1;
      results.push({ postId: post.id, ok: false, error: "Missing image URL." });
      continue;
    }

    try {
      const connections = await listActiveConnectionsForBrand(post.brandId);
      const byPlatform = Object.fromEntries(
        connections.map((c) => [c.platform, c]),
      ) as Record<
        string,
        (typeof connections)[number]
      >;

      let facebookPostId = post.facebookPostId;
      let instagramPostId = post.instagramPostId;
      const errors: string[] = [];

      if (post.platforms.includes("facebook") && byPlatform.facebook) {
        const fb = byPlatform.facebook;
        try {
          facebookPostId = await publishFacebookPhoto({
            pageId: fb.pageId,
            pageAccessToken: fb.accessToken,
            caption: post.caption,
            imageUrl: post.imageUrl,
          });
        } catch (err) {
          errors.push(
            `facebook: ${err instanceof Error ? err.message : "failed"}`,
          );
        }
      }

      if (post.platforms.includes("instagram") && byPlatform.instagram) {
        const ig = byPlatform.instagram;
        if (!ig.igUserId) {
          errors.push("instagram: missing IG user id");
        } else {
          try {
            instagramPostId = await publishInstagramPhoto({
              igUserId: ig.igUserId,
              pageAccessToken: ig.accessToken,
              caption: post.caption,
              imageUrl: post.imageUrl,
            });
          } catch (err) {
            errors.push(
              `instagram: ${err instanceof Error ? err.message : "failed"}`,
            );
          }
        }
      }

      const anySuccess = Boolean(facebookPostId || instagramPostId);
      if (!anySuccess) {
        throw new Error(errors.join("; ") || "No platforms published.");
      }

      await updatePost(post.id, {
        status: "published",
        publishedAt: new Date().toISOString(),
        facebookPostId,
        instagramPostId,
        errorMessage: errors.length ? errors.join("; ") : null,
      });
      published += 1;
      results.push({
        postId: post.id,
        ok: true,
        error: errors.length ? errors.join("; ") : undefined,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Publish failed.";
      await updatePost(post.id, {
        status: "failed",
        errorMessage: message,
      });
      failed += 1;
      results.push({ postId: post.id, ok: false, error: message });
    }
  }

  return {
    attempted: due.length,
    published,
    failed,
    results,
  };
}
