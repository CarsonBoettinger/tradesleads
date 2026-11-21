import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { generateBlogPost, topicIdFromKeywords } from "@/lib/blog/generate";
import { listUsedTopicHints } from "@/lib/blog/posts";
import { publishGeneratedPost } from "@/lib/blog/publish";
import { enforceRateLimit } from "@/lib/http-guard";

function secretsMatch(provided: string, expected: string) {
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function authorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const agentToken = process.env.BLOG_AGENT_TOKEN;
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
    if (agentToken && secretsMatch(candidate, agentToken)) return true;
  }

  // Hosted cron (Vercel Cron / Netlify scheduled function) must send a secret.
  if (
    (process.env.VERCEL === "1" || process.env.NETLIFY === "true") &&
    !cronSecret &&
    !agentToken
  ) {
    return false;
  }

  return false;
}

async function handle(request: Request) {
  if (!authorized(request)) {
    const probeLimited = await enforceRateLimit({
      request,
      key: "cron-auth-fail",
      limit: 30,
      windowMs: 15 * 60_000,
      message: "Too many unauthorized attempts.",
    });
    if (probeLimited) return probeLimited;
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = await enforceRateLimit({
    request,
    key: "cron-daily-blog",
    limit: 3,
    windowMs: 60 * 60_000,
    message: "Cron rate limit exceeded.",
  });
  if (limited) return limited;

  const agentToken = process.env.BLOG_AGENT_TOKEN;
  if (!agentToken) {
    return NextResponse.json(
      { error: "Missing BLOG_AGENT_TOKEN" },
      { status: 500 },
    );
  }

  try {
    const topicId = new URL(request.url).searchParams.get("topic") ?? undefined;
    const used = await listUsedTopicHints();
    const usedTopicIds = used
      .map((row) => topicIdFromKeywords(row))
      .filter((id): id is string => Boolean(id));

    const draft = await generateBlogPost({ usedTopicIds, topicId });
    const post = await publishGeneratedPost(draft, agentToken);

    revalidateTag("blog-posts", "max");
    revalidateTag(`blog-post-${post.slug}`, "max");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({
      ok: true,
      slug: post.slug,
      title: post.title,
      url: `/blog/${post.slug}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
