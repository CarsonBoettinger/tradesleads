export type PostStatus = "draft" | "published";
export type PostSource = "agent" | "manual" | "seed";

export type BlogPost = {
  id: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  slug: string;
  title: string;
  excerpt: string;
  body_md: string;
  trade: string | null;
  primary_keyword: string | null;
  secondary_keywords: string[];
  meta_title: string | null;
  meta_description: string | null;
  status: PostStatus;
  source: PostSource;
};

export type BlogPostInput = {
  slug: string;
  title: string;
  excerpt: string;
  body_md: string;
  trade?: string | null;
  primary_keyword?: string | null;
  secondary_keywords?: string[];
  meta_title?: string | null;
  meta_description?: string | null;
  status?: PostStatus;
  source?: PostSource;
  published_at?: string | null;
};

export type BlogTopic = {
  id: string;
  trade: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  title: string;
  angle: string;
  outline: string[];
};
