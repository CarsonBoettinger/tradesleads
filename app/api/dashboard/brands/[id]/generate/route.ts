import { after } from "next/server";
import { requireStaff } from "@/lib/auth/profile";
import { getBrandById } from "@/lib/sites/brands";
import { createGenerationJob } from "@/lib/sites/jobs";
import { runGeneration } from "@/lib/sites/run";
import { enforceRateLimit, rejectCrossOrigin } from "@/lib/http-guard";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Ctx) {
  const crossOrigin = rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const staff = await requireStaff();
  if (!staff) {
    return Response.json({ error: "Staff only." }, { status: 403 });
  }

  const limited = enforceRateLimit({
    request,
    key: "dashboard-generate",
    limit: 10,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const { id } = await context.params;
  const brand = await getBrandById(id);
  if (!brand) {
    return Response.json({ error: "Brand not found." }, { status: 404 });
  }

  const job = await createGenerationJob(brand.id);
  after(() => runGeneration(job.id as string));

  return Response.json({ jobId: job.id, brandId: brand.id });
}
