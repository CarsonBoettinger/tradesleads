import { requireDashboardUser } from "@/lib/auth/profile";
import { addLeadNote, listLeadActivities } from "@/lib/leads/crm";
import { userCanAccessBrand } from "@/lib/sites/brands";
import {
  enforceRateLimit,
  readJsonBody,
  rejectCrossOrigin,
} from "@/lib/http-guard";

type Ctx = { params: Promise<{ brandId: string; leadId: string }> };

export async function GET(_request: Request, context: Ctx) {
  const session = await requireDashboardUser();
  if (!session) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { brandId, leadId } = await context.params;
  const allowed = await userCanAccessBrand(session.profile, brandId);
  if (!allowed) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const activities = await listLeadActivities(brandId, leadId);
    return Response.json({ activities });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not load activities.";
    const statusCode = message === "Lead not found." ? 404 : 500;
    if (statusCode === 500) {
      console.error("List lead activities failed:", error);
    }
    return Response.json({ error: message }, { status: statusCode });
  }
}

export async function POST(request: Request, context: Ctx) {
  const crossOrigin = await rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const limited = await enforceRateLimit({
    request,
    key: "dashboard-leads-note",
    limit: 40,
    windowMs: 60_000,
    message: "Too many requests. Try again shortly.",
  });
  if (limited) return limited;

  const session = await requireDashboardUser();
  if (!session) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { brandId, leadId } = await context.params;
  const allowed = await userCanAccessBrand(session.profile, brandId);
  if (!allowed) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  const parsedBody = await readJsonBody(request, 4_096);
  if (!parsedBody.ok) return parsedBody.response;

  const raw = (parsedBody.body ?? {}) as Record<string, unknown>;
  const notes = typeof raw.notes === "string" ? raw.notes : "";
  if (!notes.trim()) {
    return Response.json({ error: "Note is required." }, { status: 400 });
  }

  try {
    const activity = await addLeadNote({
      brandId,
      leadId,
      userId: session.user.id,
      actorName: session.profile.full_name ?? session.profile.email,
      notes,
    });
    return Response.json({ activity }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not add note.";
    const statusCode =
      message === "Lead not found."
        ? 404
        : message === "Note is required."
          ? 400
          : 500;
    if (statusCode === 500) console.error("Add lead note failed:", error);
    return Response.json({ error: message }, { status: statusCode });
  }
}
