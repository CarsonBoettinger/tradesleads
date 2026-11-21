import { createGenerationJob } from "@/lib/sites/jobs";
import { getBrandById } from "@/lib/sites/brands";
import { runGeneration } from "@/lib/sites/run";
import { enforceRateLimit, readJsonBody } from "@/lib/http-guard";
import { safeEqual } from "@/lib/report/security";

export const maxDuration = 300;

/** Internal regenerate endpoint for ops / local scripts (CRON_SECRET). */
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }
    return Response.json(
      { error: "CRON_SECRET is not configured." },
      { status: 503 },
    );
  }

  if (!token || !safeEqual(token, secret)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const limited = await enforceRateLimit({
    request,
    key: "internal-regenerate",
    limit: 10,
    windowMs: 60 * 60_000,
    message: "Internal regenerate rate limit exceeded.",
  });
  if (limited) return limited;

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
