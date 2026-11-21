import { requireDashboardUser } from "@/lib/auth/profile";
import { userCanAccessBrand } from "@/lib/sites/brands";
import { buildMetaOAuthUrl } from "@/lib/social/meta";
import { signOAuthState } from "@/lib/social/oauth-state";
import type { SocialPlatform } from "@/lib/social/types";
import { enforceRateLimit, rejectCrossOrigin } from "@/lib/http-guard";

export async function GET(request: Request) {
  const crossOrigin = rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const session = await requireDashboardUser();
  if (!session) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const limited = await enforceRateLimit({
    request,
    key: "social-meta-start",
    limit: 20,
    windowMs: 15 * 60_000,
    message: "Too many connect attempts.",
  });
  if (limited) return limited;

  const url = new URL(request.url);
  const brandId = url.searchParams.get("brandId")?.trim();
  const platform = url.searchParams.get("platform")?.trim() as
    | SocialPlatform
    | undefined;
  const pageId = url.searchParams.get("pageId")?.trim() || undefined;

  if (!brandId || (platform !== "facebook" && platform !== "instagram")) {
    return Response.json(
      { error: "brandId and platform (facebook|instagram) are required." },
      { status: 400 },
    );
  }

  const allowed = await userCanAccessBrand(session.profile, brandId);
  if (!allowed) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const state = signOAuthState({
      brandId,
      platform,
      userId: session.user.id,
      pageId,
    });
    const oauthUrl = buildMetaOAuthUrl(state);
    return Response.json({ url: oauthUrl });
  } catch (err) {
    return Response.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Meta app is not configured.",
      },
      { status: 500 },
    );
  }
}
