import { requireDashboardUser } from "@/lib/auth/profile";
import {
  CHECKLIST_KEYS,
  getBrandLead,
  isLeadStatus,
  updateBrandLead,
  type ChecklistKey,
  type LeadChecklist,
} from "@/lib/leads/crm";
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
    const lead = await getBrandLead(brandId, leadId);
    if (!lead) {
      return Response.json({ error: "Lead not found." }, { status: 404 });
    }
    return Response.json({ lead });
  } catch (error) {
    console.error("Get brand lead failed:", error);
    return Response.json({ error: "Could not load lead." }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: Ctx) {
  const crossOrigin = await rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const limited = await enforceRateLimit({
    request,
    key: "dashboard-leads-patch",
    limit: 60,
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
  const status =
    raw.status !== undefined
      ? isLeadStatus(raw.status)
        ? raw.status
        : null
      : undefined;
  if (raw.status !== undefined && status === null) {
    return Response.json({ error: "Invalid status." }, { status: 400 });
  }

  let checklist: Partial<LeadChecklist> | undefined;
  if (raw.checklist !== undefined) {
    if (!raw.checklist || typeof raw.checklist !== "object") {
      return Response.json({ error: "Invalid checklist." }, { status: 400 });
    }
    const next: Partial<LeadChecklist> = {};
    const obj = raw.checklist as Record<string, unknown>;
    for (const key of CHECKLIST_KEYS) {
      if (typeof obj[key] === "boolean") {
        next[key as ChecklistKey] = obj[key];
      }
    }
    checklist = next;
  }

  if (status === undefined && checklist === undefined) {
    return Response.json(
      { error: "Provide status and/or checklist." },
      { status: 400 },
    );
  }

  try {
    const lead = await updateBrandLead({
      brandId,
      leadId,
      status: status ?? undefined,
      checklist,
      userId: session.user.id,
      actorName: session.profile.full_name ?? session.profile.email,
    });
    return Response.json({ lead });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not update lead.";
    const statusCode = message === "Lead not found." ? 404 : 500;
    if (statusCode === 500) console.error("Update brand lead failed:", error);
    return Response.json({ error: message }, { status: statusCode });
  }
}
