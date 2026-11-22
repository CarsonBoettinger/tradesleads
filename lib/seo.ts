import type { Metadata } from "next";
import { COMPANY_EMAIL } from "@/lib/company";
import { absoluteUrl, getSiteUrl } from "@/lib/site";

export const siteName = "Kalvez";
export const siteDescriptor =
  "Kalvez is the AI platform for trades: better Google visibility, more local traffic, booked jobs, and customers who come back.";
export const defaultTitle =
  "Kalvez - AI that gets trade businesses more jobs from Google";
export const siteSlogan = "More jobs from Google.";
export const defaultOgImagePath = "/opengraph-image";

const defaultKeywords = [
  "websites for plumbers",
  "SEO for plumbers",
  "local SEO for HVAC",
  "websites for roofers",
  "Google Business Profile for contractors",
  "trade business websites",
  "contractor website that gets calls",
  "local SEO for trades",
  "AI for contractors",
  "AI local SEO for trades",
  "Google visibility for plumbers",
  "get more jobs from Google",
];

type PageMetadataInput = {
  title: string | { absolute: string };
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  images?: NonNullable<Metadata["openGraph"]>["images"];
  noIndex?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
  images,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const resolvedTitle =
    typeof title === "string" ? `${title} | ${siteName}` : title.absolute;
  const resolvedImages: NonNullable<Metadata["openGraph"]>["images"] =
    images ?? [
      {
        url: defaultOgImagePath,
        width: 1200,
        height: 630,
        alt: defaultTitle,
      },
    ];
  const twitterImages = Array.isArray(resolvedImages)
    ? resolvedImages.map((image) =>
        typeof image === "string" || image instanceof URL
          ? image.toString()
          : image.url,
      )
    : [
        typeof resolvedImages === "string" || resolvedImages instanceof URL
          ? resolvedImages.toString()
          : resolvedImages.url,
      ];

  return {
    title,
    description,
    keywords: keywords?.length ? keywords : defaultKeywords,
    alternates: { canonical },
    openGraph: {
      title: resolvedTitle,
      description,
      type,
      locale: "en_US",
      siteName,
      url: canonical,
      images: resolvedImages,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: twitterImages,
    },
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export function organizationJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name: siteName,
    url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/brand/kalvez-icon.png"),
      width: 512,
      height: 512,
    },
    image: absoluteUrl("/brand/kalvez-logo.png"),
    description: siteDescriptor,
    slogan: siteSlogan,
    foundingDate: "2025",
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    knowsAbout: [
      "AI for contractors",
      "Local SEO",
      "SEO for contractors",
      "Answer engine optimization",
      "Generative engine optimization",
      "Google visibility for trades",
      "Trade business websites",
      "Google Business Profile",
      "Backlinks for trade businesses",
      "Content marketing for trades",
      "Automated review management",
      "CRM for trade businesses",
      "Plumbing marketing",
      "HVAC marketing",
      "Electrical contractor marketing",
      "Roofing marketing",
      "Construction marketing",
      "Pressure washing marketing",
      "Automotive shop marketing",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: COMPANY_EMAIL,
      url: absoluteUrl("/contact"),
      availableLanguage: ["English"],
    },
  };
}

export function websiteJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name: siteName,
    url,
    description: siteDescriptor,
    inLanguage: "en-US",
    publisher: { "@id": `${url}/#organization` },
  };
}

export function blogPostingJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  published_at: string | null;
  updated_at: string;
  primary_keyword?: string | null;
  secondary_keywords?: string[] | null;
  trade?: string | null;
}) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const keywords = [
    post.primary_keyword,
    ...(post.secondary_keywords ?? []),
    post.trade,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at ?? post.updated_at,
    dateModified: post.updated_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    author: {
      "@type": "Organization",
      name: siteName,
      url: getSiteUrl(),
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: getSiteUrl(),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/brand/kalvez-icon.png"),
      },
    },
    image: absoluteUrl(`/blog/${post.slug}/opengraph-image`),
    keywords: keywords.length ? keywords.join(", ") : undefined,
    about: post.trade
      ? {
          "@type": "Thing",
          name: post.trade,
        }
      : undefined,
  };
}

export function tradeServiceJsonLd(trade: {
  name: string;
  singular: string;
  description: string;
  slug: string;
  headline: string;
  pageTitle?: string;
}) {
  const url = absoluteUrl(`/trades/${trade.slug}`);
  const name = trade.pageTitle ?? trade.headline;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    serviceType: `Website and local SEO for ${trade.name.toLowerCase()}`,
    description: trade.description,
    url,
    provider: {
      "@type": "Organization",
      name: siteName,
      url: getSiteUrl(),
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    audience: {
      "@type": "Audience",
      audienceType: trade.name,
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl("/free-demo"),
      price: "0",
      priceCurrency: "USD",
      description: "Free 20-minute demo",
      availability: "https://schema.org/InStock",
    },
  };
}

export function serviceJsonLd(service: {
  name: string;
  pageTitle: string;
  description: string;
  slug: string;
}) {
  const url = absoluteUrl(`/services/${service.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.pageTitle,
    serviceType: service.name,
    description: service.description,
    url,
    provider: {
      "@type": "Organization",
      name: siteName,
      url: getSiteUrl(),
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    audience: {
      "@type": "Audience",
      audienceType: "Trade businesses",
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl("/free-demo"),
      price: "0",
      priceCurrency: "USD",
      description: "Free 20-minute demo",
      availability: "https://schema.org/InStock",
    },
  };
}

export function faqJsonLd(
  items: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function itemListJsonLd(
  name: string,
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
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

export function webPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
  type?: "WebPage" | "CollectionPage" | "ContactPage" | "AboutPage";
}) {
  const url = absoluteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": input.type ?? "WebPage",
    "@id": `${url}#webpage`,
    name: input.name,
    description: input.description,
    url,
    isPartOf: { "@id": `${getSiteUrl()}/#website` },
    about: { "@id": `${getSiteUrl()}/#organization` },
    inLanguage: "en-US",
  };
}
