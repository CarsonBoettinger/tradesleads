import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { generateBlogPost, topicIdFromKeywords } from "@/lib/blog/generate";
import { listUsedTopicHints } from "@/lib/blog/posts";
import { publishGeneratedPost } from "@/lib/blog/publish";

function authorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const agentToken = process.env.BLOG_AGENT_TOKEN;
  const header = request.headers.get("authorization");
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const queryToken = new URL(request.url).searchParams.get("token");

  const candidates = [bearer, queryToken].filter(Boolean) as string[];
  if (cronSecret && candidates.includes(cronSecret)) return true;
  if (agentToken && candidates.includes(agentToken)) return true;

  // Vercel Cron sends Authorization: Bearer <CRON_SECRET> when configured.
  if (process.env.VERCEL === "1" && !cronSecret && !agentToken) {
    return false;
  }

  return false;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

export async function POST(request: Request) {
  return GET(request);
}
