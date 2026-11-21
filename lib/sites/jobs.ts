import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase";
import type { GenerationPhase } from "@/lib/sites/types";

export async function createGenerationJob(brandId: string) {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("generation_jobs")
    .insert({
      brand_id: brandId,
      status: "queued",
      phase: "queued",
      attempts: 0,
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new Error(error?.message ?? "Could not create generation job.");
  }

  await admin
    .from("brands")
    .update({
      status: "generating",
      updated_at: new Date().toISOString(),
    })
    .eq("id", brandId);

  return data;
}

export async function updateJob(
  jobId: string,
  patch: Record<string, unknown>,
) {
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("generation_jobs")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", jobId);
  if (error) throw error;
}

export async function setJobPhase(
  jobId: string,
  brandId: string,
  phase: GenerationPhase,
  message?: string,
) {
  await updateJob(jobId, {
    phase,
    status: phase === "failed" ? "failed" : "running",
  });
  if (message) {
    await appendJobLog({
      jobId,
      brandId,
      phase,
      message,
      level: phase === "failed" ? "error" : "info",
    });
  }
}

export async function appendJobLog(input: {
  jobId: string;
  brandId: string;
  phase: string;
  message: string;
  level?: "info" | "warn" | "error";
  meta?: Record<string, unknown>;
}) {
  const admin = getSupabaseAdmin();
  await admin.from("generation_logs").insert({
    job_id: input.jobId,
    brand_id: input.brandId,
    phase: input.phase,
    message: input.message,
    level: input.level ?? "info",
    meta: input.meta ?? {},
  });
}

export async function listJobLogs(jobId: string) {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("generation_logs")
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
