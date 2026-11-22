import { requireDashboardUser } from "@/lib/auth/profile";
import { userCanAccessBrand } from "@/lib/sites/brands";
import { generatePostsForBrand } from "@/lib/social/generate";
import {
  deletePost,
  getPostById,
  updatePost,
} from "@/lib/social/posts";
import {
  enforceKeyedRateLimit,
  enforceRateLimit,
  readJsonBody,
  rejectCrossOrigin,
} from "@/lib/http-guard";

type Ctx = { params: Promise<{ brandId: string; postId: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const crossOrigin = await rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const session = await requireDashboardUser();
  if (!session) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { brandId, postId } = await context.params;
  const allowed = await userCanAccessBrand(session.profile, brandId);
  if (!allowed) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  const limited = await enforceRateLimit({
    request,
    key: "social-post-patch",
    limit: 60,
    windowMs: 15 * 60_000,
    message: "Too many post updates.",
  });
  if (limited) return limited;

  const post = await getPostById(postId);
  if (!post || post.brandId !== brandId) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  const parsedBody = await readJsonBody(request, 8_192);
  if (!parsedBody.ok) return parsedBody.response;
  const body = (parsedBody.body ?? {}) as {
    action?: "approve" | "reject" | "edit" | "regenerate";
    caption?: string;
  };

  if (!body.action) {
    return Response.json({ error: "action is required." }, { status: 400 });
  }

  if (body.action === "approve") {
    if (
      post.status !== "pending_approval" &&
      post.status !== "rejected" &&
      post.status !== "failed"
    ) {
      return Response.json(
        { error: "Post cannot be approved in its current state." },
        { status: 400 },
      );
    }
    const updated = await updatePost(postId, {
      status: "scheduled",
      approvedBy: session.user.id,
      approvedAt: new Date().toISOString(),
      errorMessage: null,
    });
    return Response.json({ post: updated });
  }

  if (body.action === "reject") {
    const updated = await updatePost(postId, {
      status: "rejected",
    });
    return Response.json({ post: updated });
  }

  if (body.action === "edit") {
    const caption = body.caption?.trim();
    if (!caption) {
      return Response.json({ error: "caption is required." }, { status: 400 });
    }
    const updated = await updatePost(postId, {
      caption: caption.slice(0, 2200),
    });
    return Response.json({ post: updated });
  }

  if (body.action === "regenerate") {
    const regenLimited = await enforceKeyedRateLimit({
      key: `social-post-regen-user:${session.user.id}`,
      limit: 10,
      windowMs: 60 * 60_000,
      message: "Hourly regenerate limit reached.",
    });
    if (regenLimited) return regenLimited;

    // Drop this draft and refill pipeline for one slot via generate pass.
    await deletePost(postId);
    const result = await generatePostsForBrand(brandId);
    return Response.json({ ok: true, regenerated: result });
  }

  return Response.json({ error: "Unknown action." }, { status: 400 });
}
