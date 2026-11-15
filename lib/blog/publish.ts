import { getSupabaseAdmin } from "@/lib/supabase";
import type { BlogPost, BlogPostInput } from "./types";

export async function publishGeneratedPost(
  input: BlogPostInput,
  token: string,
): Promise<BlogPost> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc("publish_agent_post", {
    p_token: token,
    p_slug: input.slug,
    p_title: input.title,
    p_excerpt: input.excerpt,
    p_body_md: input.body_md,
    p_trade: input.trade ?? null,
    p_primary_keyword: input.primary_keyword ?? null,
    p_secondary_keywords: input.secondary_keywords ?? [],
    p_meta_title: input.meta_title ?? null,
    p_meta_description: input.meta_description ?? null,
  });

  if (error) {
    throw new Error(`Failed to publish via agent RPC: ${error.message}`);
  }

  return data as BlogPost;
}
