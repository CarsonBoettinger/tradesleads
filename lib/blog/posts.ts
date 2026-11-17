import "server-only";

import { cacheTag } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { BlogPost, BlogPostInput } from "./types";

export async function listPublishedPosts(limit = 50): Promise<BlogPost[]> {
  "use cache";
  cacheTag("blog-posts");

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to list posts: ${error.message}`);
  return (data ?? []) as BlogPost[];
}

export async function getPublishedPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  "use cache";
  cacheTag("blog-posts", `blog-post-${slug}`);

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(`Failed to load post: ${error.message}`);
  return (data as BlogPost | null) ?? null;
}

export async function listUsedTopicHints(): Promise<
  Array<{ title: string; primary_keyword: string | null }>
> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .select("title, primary_keyword")
    .order("published_at", { ascending: false })
    .limit(40);

  if (error) throw new Error(`Failed to list topic hints: ${error.message}`);
  return (data ?? []) as Array<{
    title: string;
    primary_keyword: string | null;
  }>;
}

export async function publishPost(input: BlogPostInput): Promise<BlogPost> {
  const supabase = getSupabaseAdmin();
  const row = {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    body_md: input.body_md,
    trade: input.trade ?? null,
    primary_keyword: input.primary_keyword ?? null,
    secondary_keywords: input.secondary_keywords ?? [],
    meta_title: input.meta_title ?? null,
    meta_description: input.meta_description ?? null,
    status: input.status ?? "published",
    source: input.source ?? "agent",
    published_at:
      input.published_at ??
      (input.status === "draft" ? null : new Date().toISOString()),
  };

  const { data, error } = await supabase
    .from("posts")
    .upsert(row, { onConflict: "slug" })
    .select("*")
    .single();

  if (error) throw new Error(`Failed to publish post: ${error.message}`);
  return data as BlogPost;
}
