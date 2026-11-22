import { requireDashboardUser } from "@/lib/auth/profile";
import { userCanAccessBrand } from "@/lib/sites/brands";
import { bulkUpdateMonthPosts, listPostsForBrand } from "@/lib/social/posts";
import { getOrCreateSettings } from "@/lib/social/settings";
import {
  enforceRateLimit,
  readJsonBody,
  rejectCrossOrigin,
} from "@/lib/http-guard";

type Ctx = { params: Promise<{ brandId: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const crossOrigin = await rejectCrossOrigin(request);
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
    key: "social-posts-bulk",
    limit: 30,
    windowMs: 15 * 60_000,
    message: "Too many bulk post updates.",
  });
  if (limited) return limited;

  const parsedBody = await readJsonBody(request, 4_096);
  if (!parsedBody.ok) return parsedBody.response;
  const body = (parsedBody.body ?? {}) as {
    action?: "approve" | "reject";
    year?: number;
    monthIndex?: number;
  };

  if (body.action !== "approve" && body.action !== "reject") {
    return Response.json(
      { error: "action must be approve or reject." },
      { status: 400 },
    );
  }

  const year = body.year;
  const monthIndex = body.monthIndex;
  if (
    typeof year !== "number" ||
    !Number.isInteger(year) ||
    year < 2020 ||
    year > 2100 ||
    typeof monthIndex !== "number" ||
    !Number.isInteger(monthIndex) ||
    monthIndex < 0 ||
    monthIndex > 11
  ) {
    return Response.json(
      { error: "year and monthIndex (0-11) are required." },
      { status: 400 },
    );
  }

  const settings = await getOrCreateSettings(brandId);
  const result = await bulkUpdateMonthPosts({
    brandId,
    year,
    monthIndex,
    timeZone: settings.timezone,
    action: body.action,
    approvedBy: body.action === "approve" ? session.user.id : undefined,
  });

  const posts = await listPostsForBrand(brandId);
  return Response.json({
    updated: result.updated,
    posts,
  });
}
