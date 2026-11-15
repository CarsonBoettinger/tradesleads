import { absoluteUrl, getSiteUrl } from "@/lib/site";

export const siteName = "FOREMAN";
export const siteDescriptor =
  "Websites and local search growth for the businesses that build our world.";
export const defaultTitle = "FOREMAN - Built to get you found";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: getSiteUrl(),
    description: siteDescriptor,
    slogan: "Built to get you found.",
    knowsAbout: [
      "Local SEO",
      "Trade business websites",
      "Google Business Profile",
      "Plumbing marketing",
      "HVAC marketing",
      "Electrical contractor marketing",
      "Roofing marketing",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: getSiteUrl(),
    description: siteDescriptor,
  };
}

export function blogPostingJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  published_at: string | null;
  updated_at: string;
  primary_keyword?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at ?? post.updated_at,
    dateModified: post.updated_at,
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    author: {
      "@type": "Organization",
      name: siteName,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: getSiteUrl(),
    },
    keywords: post.primary_keyword ?? undefined,
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
