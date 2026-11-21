import { createGenerationJob } from "@/lib/sites/jobs";
import { getBrandById } from "@/lib/sites/brands";
import { runGeneration } from "@/lib/sites/run";
import { readJsonBody } from "@/lib/http-guard";

export const maxDuration = 300;

/** Internal regenerate endpoint for ops / local scripts (CRON_SECRET). */
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!secret || token !== secret) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = await readJsonBody(request, 4_096);
  if (!parsed.ok) return parsed.response;
  const body = (parsed.body ?? {}) as Record<string, unknown>;
  const brandId = typeof body.brandId === "string" ? body.brandId : "";
  const sync = body.sync === true;

  if (!brandId) {
    return Response.json({ error: "brandId required." }, { status: 400 });
  }

  const brand = await getBrandById(brandId);
  if (!brand) {
    return Response.json({ error: "Brand not found." }, { status: 404 });
  }

  const job = await createGenerationJob(brand.id);
  if (sync) {
    await runGeneration(job.id as string);
    return Response.json({ ok: true, jobId: job.id, brandId: brand.id, sync: true });
  }

  const { after } = await import("next/server");
  after(() => runGeneration(job.id as string));
  return Response.json({ ok: true, jobId: job.id, brandId: brand.id });
}
