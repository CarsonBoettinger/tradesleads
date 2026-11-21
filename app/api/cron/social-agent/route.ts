import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { runSocialGeneratePass } from "@/lib/social/generate";
import { publishDuePosts } from "@/lib/social/publish";
import { enforceRateLimit } from "@/lib/http-guard";

export const maxDuration = 300;

function secretsMatch(provided: string, expected: string) {
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function authorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization");
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
  // Query-string tokens leak via logs/Referer — production requires Bearer only.
  const queryToken =
    process.env.NODE_ENV === "production"
      ? null
      : new URL(request.url).searchParams.get("token");

  const candidates = [bearer, queryToken].filter(Boolean) as string[];
  for (const candidate of candidates) {
    if (cronSecret && secretsMatch(candidate, cronSecret)) return true;
  }

  if (
    (process.env.VERCEL === "1" || process.env.NETLIFY === "true") &&
    !cronSecret
  ) {
    return false;
  }

  return false;
}

async function handle(request: Request) {
  if (!authorized(request)) {
    const probeLimited = await enforceRateLimit({
      request,
      key: "social-cron-auth-fail",
      limit: 30,
      windowMs: 15 * 60_000,
      message: "Too many unauthorized attempts.",
    });
    if (probeLimited) return probeLimited;
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = await enforceRateLimit({
    request,
    key: "cron-social-agent",
    limit: 30,
    windowMs: 60 * 60_000,
    message: "Cron rate limit exceeded.",
  });
  if (limited) return limited;

  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") || "all";

  const result: {
    generate?: Awaited<ReturnType<typeof runSocialGeneratePass>>;
    publish?: Awaited<ReturnType<typeof publishDuePosts>>;
  } = {};

  if (mode === "generate" || mode === "all") {
    result.generate = await runSocialGeneratePass();
  }
  if (mode === "publish" || mode === "all") {
    result.publish = await publishDuePosts();
  }

  return NextResponse.json({ ok: true, mode, ...result });
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
