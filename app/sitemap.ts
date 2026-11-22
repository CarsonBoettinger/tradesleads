import type { MetadataRoute } from "next";
import { cacheTag } from "next/cache";
import { listPublishedPosts } from "@/lib/blog/posts";
import { serviceHref, services } from "@/lib/services";
import { absoluteUrl } from "@/lib/site";
import { tradeHref, trades } from "@/lib/trades";

/** Stable stamp so crawlers are not told every URL changed on every request. */
const SITE_UPDATED_AT = new Date("2026-03-24");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheTag("blog-posts");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: SITE_UPDATED_AT,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/report"),
      lastModified: SITE_UPDATED_AT,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: absoluteUrl("/free-demo"),
      lastModified: SITE_UPDATED_AT,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: SITE_UPDATED_AT,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/trades"),
      lastModified: SITE_UPDATED_AT,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/services"),
      lastModified: SITE_UPDATED_AT,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified: new Date("2026-11-17"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/terms"),
      lastModified: new Date("2026-11-17"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...trades.map((trade) => ({
      url: absoluteUrl(tradeHref(trade.slug)),
      lastModified: SITE_UPDATED_AT,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...services.map((service) => ({
      url: absoluteUrl(serviceHref(service.slug)),
      lastModified: SITE_UPDATED_AT,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];

  try {
    const posts = await listPublishedPosts(500);
    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(
        post.updated_at ?? post.published_at ?? SITE_UPDATED_AT,
      ),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const latestPost = posts[0];
    if (latestPost) {
      const blogIndex = staticRoutes.find(
        (route) => route.url === absoluteUrl("/blog"),
      );
      if (blogIndex) {
        blogIndex.lastModified = new Date(
          latestPost.updated_at ??
            latestPost.published_at ??
            SITE_UPDATED_AT,
        );
      }
    }

    return [...staticRoutes, ...postRoutes];
  } catch {
    return staticRoutes;
  }
}
