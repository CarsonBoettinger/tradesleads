import { requireDashboardUser } from "@/lib/auth/profile";
import { userCanAccessBrand } from "@/lib/sites/brands";
import {
  disconnectPlatform,
  listConnectionsPublic,
} from "@/lib/social/connections";
import { listPostsForBrand } from "@/lib/social/posts";
import {
  getOrCreateSettings,
  updateSettings,
} from "@/lib/social/settings";
import type {
  SocialPlatform,
  SocialPostFrequency,
} from "@/lib/social/types";
import {
  enforceRateLimit,
  readJsonBody,
  rejectCrossOrigin,
} from "@/lib/http-guard";

type Ctx = { params: Promise<{ brandId: string }> };

const FREQUENCIES = new Set<SocialPostFrequency>([
  "daily",
  "weekdays",
  "3x_week",
  "weekly",
]);

export async function GET(_request: Request, context: Ctx) {
  const session = await requireDashboardUser();
  if (!session) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { brandId } = await context.params;
  const allowed = await userCanAccessBrand(session.profile, brandId);
  if (!allowed) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  const [connections, settings, posts] = await Promise.all([
    listConnectionsPublic(brandId),
    getOrCreateSettings(brandId),
    listPostsForBrand(brandId),
  ]);

  return Response.json({ connections, settings, posts });
}

export async function PATCH(request: Request, context: Ctx) {
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
    key: "social-settings-patch",
    limit: 40,
    windowMs: 15 * 60_000,
    message: "Too many updates.",
  });
  if (limited) return limited;

  const parsedBody = await readJsonBody(request, 4_096);
  if (!parsedBody.ok) return parsedBody.response;
  const body = (parsedBody.body ?? {}) as {
    frequency?: string;
    timezone?: string;
    preferredHour?: number;
    enabled?: boolean;
    lookAheadDays?: number;
    cadenceConfirmed?: boolean;
  };

  if (body.frequency && !FREQUENCIES.has(body.frequency as SocialPostFrequency)) {
    return Response.json({ error: "Invalid frequency." }, { status: 400 });
  }

  const settings = await updateSettings(brandId, {
    frequency: body.frequency as SocialPostFrequency | undefined,
    timezone: typeof body.timezone === "string" ? body.timezone : undefined,
    preferredHour:
      typeof body.preferredHour === "number" ? body.preferredHour : undefined,
    enabled: typeof body.enabled === "boolean" ? body.enabled : undefined,
    lookAheadDays:
      typeof body.lookAheadDays === "number" ? body.lookAheadDays : undefined,
    cadenceConfirmed:
      typeof body.cadenceConfirmed === "boolean"
        ? body.cadenceConfirmed
        : body.frequency
          ? true
          : undefined,
  });

  return Response.json({ settings });
}

export async function DELETE(request: Request, context: Ctx) {
  const crossOrigin = rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const session = await requireDashboardUser();
  if (!session) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const limited = await enforceRateLimit({
    request,
    key: "social-disconnect",
    limit: 20,
    windowMs: 15 * 60_000,
    message: "Too many disconnect attempts.",
  });
  if (limited) return limited;

  const { brandId } = await context.params;
  const allowed = await userCanAccessBrand(session.profile, brandId);
  if (!allowed) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  const url = new URL(request.url);
  const platform = url.searchParams.get("platform") as SocialPlatform | null;
  if (platform !== "facebook" && platform !== "instagram") {
    return Response.json(
      { error: "platform=facebook|instagram is required." },
      { status: 400 },
    );
  }

  await disconnectPlatform(brandId, platform);
  const connections = await listConnectionsPublic(brandId);
  return Response.json({ ok: true, connections });
}
