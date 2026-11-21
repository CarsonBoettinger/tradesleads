import { z } from "zod";

export const siteThemeSchema = z.object({
  primary: z.string().min(4),
  secondary: z.string().min(4),
  accent: z.string().min(4),
  background: z.string().min(4),
  surface: z.string().min(4),
  text: z.string().min(4),
  muted: z.string().min(4),
  fontFamily: z.string().optional(),
});

export const siteSeoSchema = z.object({
  title: z.string().min(10).max(70),
  description: z.string().min(40).max(170),
  ogTitle: z.string().max(70).optional(),
  ogDescription: z.string().max(170).optional(),
});

export const siteKeywordsSchema = z.object({
  primary: z.string().min(2),
  secondary: z.array(z.string()).max(12),
  serviceAreas: z.array(z.string()).max(20),
});

export const siteContentSchema = z.object({
  hero: z.object({
    h1: z.string().min(8).max(120),
    subhead: z.string().min(20).max(280),
    ctaLabel: z.string().min(2).max(40),
    ctaHref: z.string().min(1).max(80),
  }),
  about: z.object({
    heading: z.string().min(4).max(100),
    body: z.string().min(40).max(1200),
  }),
  services: z
    .array(
      z.object({
        name: z.string().min(2).max(80),
        description: z.string().min(20).max(400),
        keyword: z.string().max(80).optional(),
      }),
    )
    .min(3)
    .max(8),
  whyUs: z
    .array(
      z.object({
        title: z.string().min(2).max(80),
        body: z.string().min(20).max(320),
      }),
    )
    .min(3)
    .max(6),
  serviceAreas: z
    .array(
      z.object({
        name: z.string().min(2).max(80),
        description: z.string().min(20).max(280),
        body: z.string().min(40).max(900).optional(),
      }),
    )
    .min(1)
    .max(12),
  faqs: z
    .array(
      z.object({
        question: z.string().min(8).max(160),
        answer: z.string().min(20).max(500),
      }),
    )
    .min(3)
    .max(8),
  testimonials: z
    .array(
      z.object({
        author: z.string().min(2).max(80),
        text: z.string().min(10).max(500),
        rating: z.number().min(1).max(5).optional(),
      }),
    )
    .max(8),
  contact: z.object({
    heading: z.string().min(4).max(100),
    body: z.string().min(20).max(400),
    formCta: z.string().min(2).max(40),
  }),
  nav: z.object({
    links: z
      .array(
        z.object({
          label: z.string().min(2).max(40),
          href: z.string().min(1).max(80),
        }),
      )
      .min(3)
      .max(8),
  }),
  footer: z.object({
    blurb: z.string().min(10).max(240),
  }),
  imageAlts: z.record(z.string(), z.string()).optional(),
});

export const aiContentResponseSchema = z.object({
  content: siteContentSchema,
  seo: siteSeoSchema,
});

export type AiContentResponse = z.infer<typeof aiContentResponseSchema>;
