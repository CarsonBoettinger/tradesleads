import type { MetadataRoute } from "next";
import { cacheTag } from "next/cache";
import { listPublishedPosts } from "@/lib/blog/posts";
import { absoluteUrl } from "@/lib/site";
import { tradeHref, trades } from "@/lib/trades";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheTag("blog-posts");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/report"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: absoluteUrl("/free-demo"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...trades.map((trade) => ({
      url: absoluteUrl(tradeHref(trade.slug)),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];

  try {
    const posts = await listPublishedPosts(200);
    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.updated_at ?? post.published_at ?? Date.now()),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
    return [...staticRoutes, ...postRoutes];
  } catch {
    return staticRoutes;
  }
}
