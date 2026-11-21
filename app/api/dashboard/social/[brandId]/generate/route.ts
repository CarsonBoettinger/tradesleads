import { requireDashboardUser } from "@/lib/auth/profile";
import { userCanAccessBrand } from "@/lib/sites/brands";
import { generatePostsForBrand } from "@/lib/social/generate";
import { listPostsForBrand } from "@/lib/social/posts";
import {
  enforceKeyedRateLimit,
  enforceRateLimit,
  rejectCrossOrigin,
} from "@/lib/http-guard";

type Ctx = { params: Promise<{ brandId: string }> };

export const maxDuration = 300;

export async function POST(request: Request, context: Ctx) {
  const crossOrigin = rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const session = await requireDashboardUser();
  if (!session) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { brandId } = await context.params;
  const allowed = await userCanAccessBrand(session.profile, brandId);
  if (!allowed) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  const limited = await enforceRateLimit({
    request,
    key: "social-generate",
    limit: 6,
    windowMs: 60 * 60_000,
    message: "Generation rate limit exceeded.",
  });
  if (limited) return limited;

  const userLimited = await enforceKeyedRateLimit({
    key: `social-generate-user:${session.user.id}`,
    limit: 6,
    windowMs: 60 * 60_000,
    message: "Hourly social generation limit reached.",
  });
  if (userLimited) return userLimited;

  try {
    const result = await generatePostsForBrand(brandId);
    const posts = await listPostsForBrand(brandId);
    return Response.json({ ...result, posts });
  } catch (err) {
    return Response.json(
      {
        error: err instanceof Error ? err.message : "Generation failed.",
      },
      { status: 500 },
    );
  }
}
