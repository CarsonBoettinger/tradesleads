import type {
  QaChecklistItem,
  SiteContent,
  SiteSeo,
  SiteTheme,
} from "@/lib/sites/types";

export function runSiteQa(input: {
  content: SiteContent;
  seo: SiteSeo;
  theme: SiteTheme;
  hasLogo: boolean;
  hasContactPhone: boolean;
}): QaChecklistItem[] {
  const { content, seo, theme } = input;

  return [
    {
      id: "h1",
      label: "Primary H1 present",
      pass: Boolean(content.hero?.h1 && content.hero.h1.length >= 8),
      detail: content.hero?.h1 || "Missing H1",
    },
    {
      id: "services",
      label: "Services section populated",
      pass: (content.services?.length ?? 0) >= 3,
      detail: `${content.services?.length ?? 0} services`,
    },
    {
      id: "about",
      label: "About Us section present",
      pass: Boolean(content.about?.heading && content.about?.body),
      detail: content.about?.heading || "Missing About Us",
    },
    {
      id: "faq",
      label: "FAQ section present",
      pass: (content.faqs?.length ?? 0) >= 3,
      detail: `${content.faqs?.length ?? 0} FAQs`,
    },
    {
      id: "image-alts",
      label: "Image alt text present",
      pass: Boolean(content.imageAlts?.hero || content.imageAlts?.logo),
      detail: content.imageAlts?.hero || content.imageAlts?.logo || "Missing alts",
    },
    {
      id: "meta-title",
      label: "Meta title length",
      pass: seo.title.length >= 20 && seo.title.length <= 70,
      detail: `${seo.title.length} chars`,
    },
    {
      id: "meta-description",
      label: "Meta description length",
      pass: seo.description.length >= 70 && seo.description.length <= 170,
      detail: `${seo.description.length} chars`,
    },
    {
      id: "contact",
      label: "Contact / conversion block",
      pass: Boolean(content.contact?.formCta),
      detail: content.contact?.formCta || "Missing contact CTA",
    },
    {
      id: "theme",
      label: "Brand theme colors applied",
      pass: Boolean(theme.primary && theme.accent),
      detail: `${theme.primary} / ${theme.accent}`,
    },
    {
      id: "logo",
      label: "Logo asset available",
      pass: input.hasLogo,
      detail: input.hasLogo ? "Logo cached" : "Using text wordmark fallback",
    },
    {
      id: "phone",
      label: "Phone number available",
      pass: input.hasContactPhone,
      detail: input.hasContactPhone ? "Phone set" : "No phone on brand",
    },
    {
      id: "areas",
      label: "Service areas listed",
      pass: (content.serviceAreas?.length ?? 0) >= 1,
      detail: `${content.serviceAreas?.length ?? 0} areas`,
    },
  ];
}
