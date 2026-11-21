import "server-only";

import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getSupabaseAdmin } from "@/lib/supabase";

async function resolveFfmpegPath() {
  // Prefer packaged binary; fall back to PATH / known install locations.
  // Avoid relying solely on ffmpeg-static's exported path under Turbopack.
  const candidates = [
    join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg"),
    join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg.exe"),
  ];
  try {
    const mod = await import("ffmpeg-static");
    if (typeof mod.default === "string" && mod.default) {
      candidates.unshift(mod.default);
    }
  } catch {
    // ignore
  }
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // try next
    }
  }
  return "ffmpeg";
}

async function runFfmpeg(args: string[]) {
  const ffmpegPath = await resolveFfmpegPath();

  await new Promise<void>((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr.slice(-800) || `ffmpeg exited ${code}`));
    });
  });
}

/** Ken Burns style MP4 from a still — reliable fallback when Veo is unavailable. */
async function renderKenBurnsMp4(imageBuffer: Buffer): Promise<Buffer | null> {
  const dir = await mkdtemp(join(tmpdir(), "kalvez-hero-"));
  const inputPath = join(dir, "hero-still.jpg");
  const outputPath = join(dir, "hero.mp4");
  try {
    // Keep extra resolution so zoompan has headroom (1:1 crop shakes from integer rounding).
    const sharp = (await import("sharp")).default;
    const still = await sharp(imageBuffer, { failOn: "none" })
      .rotate()
      .resize(3840, 2160, { fit: "cover" })
      .jpeg({ quality: 92 })
      .toBuffer();
    await writeFile(inputPath, still);

    // Sine zoom (always slightly cropped) returns to the start so <video loop> is seamless.
    await runFfmpeg([
      "-y",
      "-loop",
      "1",
      "-framerate",
      "30",
      "-i",
      inputPath,
      "-vf",
      "zoompan=z='1.08+0.04*sin(2*PI*on/180)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=30",
      "-t",
      "6",
      "-r",
      "30",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "20",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-an",
      outputPath,
    ]);

    return await readFile(outputPath);
  } catch (error) {
    console.warn(
      "[hero-video] kenburns failed",
      error instanceof Error ? error.message : error,
    );
    return null;
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => undefined);
  }
}

async function tryGeminiVeo(input: {
  imageBuf: Buffer;
  mimeType: string;
  prompt: string;
}): Promise<Buffer | null> {
  const apiKey =
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_AI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim();
  if (!apiKey) return null;

  const model =
    process.env.GEMINI_VIDEO_MODEL?.trim() || "veo-3.1-fast-generate-preview";

  try {
    const createUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predictLongRunning?key=${encodeURIComponent(apiKey)}`;
    const createRes = await fetch(createUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [
          {
            prompt: input.prompt,
            image: {
              bytesBase64Encoded: input.imageBuf.toString("base64"),
              mimeType: input.mimeType,
            },
          },
        ],
        parameters: {
          aspectRatio: "16:9",
          durationSeconds: 6,
        },
      }),
      signal: AbortSignal.timeout(60_000),
    });
    if (!createRes.ok) return null;

    const created = (await createRes.json()) as { name?: string };
    const operationName = created.name;
    if (!operationName) return null;

    for (let attempt = 0; attempt < 24; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 5_000));
      const pollUrl = `https://generativelanguage.googleapis.com/v1beta/${operationName}?key=${encodeURIComponent(apiKey)}`;
      const pollRes = await fetch(pollUrl, {
        cache: "no-store",
        signal: AbortSignal.timeout(30_000),
      });
      if (!pollRes.ok) continue;
      const pollJson = (await pollRes.json()) as {
        done?: boolean;
        error?: unknown;
        response?: {
          generateVideoResponse?: {
            generatedSamples?: Array<{
              video?: { uri?: string; bytesBase64Encoded?: string };
            }>;
          };
        };
      };
      if (pollJson.error) return null;
      if (!pollJson.done) continue;

      const sample =
        pollJson.response?.generateVideoResponse?.generatedSamples?.[0]?.video;
      if (sample?.bytesBase64Encoded) {
        return Buffer.from(sample.bytesBase64Encoded, "base64");
      }
      if (sample?.uri) {
        const downloadUrl = sample.uri.includes("?")
          ? `${sample.uri}&key=${encodeURIComponent(apiKey)}`
          : `${sample.uri}?key=${encodeURIComponent(apiKey)}`;
        const videoRes = await fetch(downloadUrl, {
          cache: "no-store",
          signal: AbortSignal.timeout(60_000),
        });
        if (!videoRes.ok) return null;
        return Buffer.from(await videoRes.arrayBuffer());
      }
      return null;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Create a hero MP4 from a still image.
 * Tries Gemini Veo when available, otherwise Ken Burns via ffmpeg-static.
 */
export async function generateAndStoreHeroVideo(input: {
  brandId: string;
  imageUrl: string;
  businessName: string;
  trade: string | null;
  town: string | null;
}): Promise<{
  public_url: string;
  storage_path: string;
  kind: "hero_video";
} | null> {
  try {
    const imageRes = await fetch(input.imageUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    if (!imageRes.ok) return null;
    const imageBuf = Buffer.from(await imageRes.arrayBuffer());
    if (imageBuf.byteLength < 1_000 || imageBuf.byteLength > 12_000_000) {
      return null;
    }

    const contentType = imageRes.headers.get("content-type") || "image/jpeg";
    const mimeType = contentType.startsWith("image/")
      ? contentType.split(";")[0]!
      : "image/jpeg";

    const trade = (input.trade ?? "home services").toLowerCase();
    const place = input.town ?? "Ontario";
    const prompt = `Subtle cinematic camera push-in on this finished ${trade} project photo in ${place}. Slow natural motion, realistic lighting, no text, no logos, no people faces changing, keep the same room or exterior composition.`;

    let videoBytes =
      (await tryGeminiVeo({ imageBuf, mimeType, prompt })) ??
      (await renderKenBurnsMp4(imageBuf));

    if (!videoBytes || videoBytes.byteLength < 5_000) {
      console.warn("[hero-video] no video bytes produced");
      return null;
    }

    const admin = getSupabaseAdmin();
    const path = `${input.brandId}/hero-video-${Date.now()}.mp4`;
    const { error: uploadError } = await admin.storage
      .from("brand-assets")
      .upload(path, videoBytes, {
        contentType: "video/mp4",
        upsert: false,
      });
    if (uploadError) {
      console.warn("[hero-video] upload failed", uploadError.message);
      return null;
    }

    const { data: publicData } = admin.storage
      .from("brand-assets")
      .getPublicUrl(path);

    const { data, error } = await admin
      .from("brand_assets")
      .insert({
        brand_id: input.brandId,
        kind: "hero_video",
        storage_path: path,
        public_url: publicData.publicUrl,
        source_url: input.imageUrl,
        attribution: "Hero video generated from brand photo",
        usage_notes: "hero-video/mp4 generated from still image",
        width: 1920,
        height: 1080,
        is_primary: false,
        sort_order: 0,
      })
      .select("public_url, storage_path")
      .single();

    if (error || !data?.public_url) {
      console.warn("[hero-video] insert failed", error?.message);
      return null;
    }
    return {
      public_url: data.public_url as string,
      storage_path: data.storage_path as string,
      kind: "hero_video",
    };
  } catch (error) {
    console.warn(
      "[hero-video] generation failed",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
