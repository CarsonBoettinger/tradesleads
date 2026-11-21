import { requireDashboardUser } from "@/lib/auth/profile";
import { getLatestJob, userCanAccessBrand } from "@/lib/sites/brands";
import { listJobLogs } from "@/lib/sites/jobs";
import { GENERATION_PHASE_LABELS } from "@/lib/sites/types";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const session = await requireDashboardUser();
  if (!session) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const allowed = await userCanAccessBrand(session.profile, id);
  if (!allowed) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  const job = await getLatestJob(id);
  if (!job) {
    return Response.json({ job: null, logs: [], phases: GENERATION_PHASE_LABELS });
  }

  const logs = await listJobLogs(job.id);
  return Response.json({
    job,
    logs,
    phases: GENERATION_PHASE_LABELS,
    label:
      GENERATION_PHASE_LABELS[
        job.phase as keyof typeof GENERATION_PHASE_LABELS
      ] ?? job.phase,
  });
}
