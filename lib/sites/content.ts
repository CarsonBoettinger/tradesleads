import "server-only";

import { aiContentResponseSchema } from "@/lib/sites/content-schema";
import { scrubSiteCopy } from "@/lib/sites/copy";
import { ensureMinimumServices } from "@/lib/sites/services";
import type {
  BrandProfilePayload,
  SiteContent,
  SiteKeywords,
  SiteSeo,
} from "@/lib/sites/types";

export type ContentGenerationResult = {
  content: SiteContent;
  seo: SiteSeo;
  promptTokens: number;
  completionTokens: number;
  usedAi: boolean;
};

function estimateCostUsd(promptTokens: number, completionTokens: number) {
  // gpt-4.1-mini rough public rates; stored for tracking only.
  const inputPerM = 0.4;
  const outputPerM = 1.6;
  return (
    (promptTokens / 1_000_000) * inputPerM +
    (completionTokens / 1_000_000) * outputPerM
  );
}

export { estimateCostUsd };

function fallbackContent(input: {
  businessName: string;
  trade: string;
  town: string | null;
  phone: string | null;
  keywords: SiteKeywords;
  payload: BrandProfilePayload;
}): ContentGenerationResult {
  const place = input.town ?? "the local area";
  const primary = input.keywords.primary;
  const serviceNames = (
    input.payload.services?.length
      ? input.payload.services
      : input.keywords.secondary.slice(0, 5).map((k) =>
          k.replace(new RegExp(`\\s+${place}$`, "i"), "").trim(),
        )
  ).slice(0, 5);

  const content: SiteContent = {
    hero: {
      h1: primary.replace(/\b\w/g, (c) => c.toUpperCase()),
      subhead: `${input.businessName} helps homeowners and businesses in ${place} with reliable ${input.trade.toLowerCase()} service: clear communication, quality work, and fast follow-up.`,
      ctaLabel: "Request a Quote",
      ctaHref: "/#contact",
    },
    about: {
      heading: "About Us",
      body:
        input.payload.description?.slice(0, 700) ||
        `${input.businessName} is a ${input.trade.toLowerCase()} team serving ${place}. We focus on practical solutions, honest timelines, and work that holds up, so you can book with confidence instead of guessing from a vague listing.`,
    },
    services: ensureMinimumServices(
      serviceNames.map((name, index) => ({
        name: name.replace(/\b\w/g, (c) => c.toUpperCase()),
        description: `Professional ${name.toLowerCase()} for homes and businesses around ${place}. We explain options clearly and finish the job the way we quoted.`,
        keyword: input.keywords.secondary[index] ?? name,
      })),
      {
        trade: input.trade,
        town: input.town,
        fillerNames: input.keywords.secondary,
      },
    ),
    whyUs: [
      {
        title: "Local and reachable",
        body: `We serve ${place} and nearby communities, and we make it easy to get a real person when you need help.`,
      },
      {
        title: "Straight answers",
        body: "You get clear scopes, practical recommendations, and no runaround about what happens next.",
      },
      {
        title: "Proof that matters",
        body: "Recent reviews and completed jobs help you see the quality before you book.",
      },
    ],
    serviceAreas: (input.keywords.serviceAreas.length
      ? input.keywords.serviceAreas
      : [place]
    ).map((name) => ({
      name,
      description: `${input.trade} service for homeowners and businesses in ${name}.`,
      body: `${input.businessName} provides ${input.trade.toLowerCase()} service in ${name}. We help homeowners and businesses with clear scopes, honest timelines, and work finished the way it was quoted. Request a quote for your next job in ${name}.`,
    })),
    faqs: [
      {
        question: `Do you offer emergency ${input.trade.toLowerCase()} help in ${place}?`,
        answer: `Contact ${input.businessName}${input.phone ? ` at ${input.phone}` : ""} and tell us what is going on. We prioritize urgent issues whenever scheduling allows.`,
      },
      {
        question: "How do quotes work?",
        answer:
          "Share the problem, photos if you have them, and your address. We confirm scope, timing, and next steps before work begins.",
      },
      {
        question: "What areas do you serve?",
        answer: `We regularly work in ${input.keywords.serviceAreas.slice(0, 4).join(", ") || place}. Ask if you are nearby. Coverage can extend based on the job.`,
      },
      {
        question: "Are you licensed and insured?",
        answer: `Ask ${input.businessName} for current licensing and insurance details for your job type. We are happy to share what applies before work starts.`,
      },
    ],
    testimonials: (input.payload.reviews ?? [])
      .filter((r) => r.text.trim().length > 20)
      .slice(0, 3)
      .map((r) => ({
        author: r.author,
        text: r.text.slice(0, 400),
        rating: r.rating,
      })),
    contact: {
      heading: "Request a Quote",
      body: `Tell us what you need in ${place}. ${input.businessName} will follow up with next steps${input.phone ? `, or call ${input.phone}` : ""}.`,
      formCta: "Send Message",
    },
    nav: {
      links: [
        { label: "Services", href: "/#services" },
        { label: "About Us", href: "/about" },
        { label: "Gallery", href: "/#gallery" },
        { label: "Areas", href: "/#areas" },
        { label: "FAQ", href: "/#faq" },
        { label: "Contact", href: "/#contact" },
      ],
    },
    footer: {
      blurb: `${input.businessName}, ${input.trade.toLowerCase()} serving ${place}.`,
    },
    imageAlts: {
      hero: `${input.businessName} ${input.trade.toLowerCase()} work in ${place}`,
      logo: `${input.businessName} logo`,
    },
  };

  const seo: SiteSeo = {
    title: `${primary} | ${input.businessName}`.slice(0, 70),
    description: content.hero.subhead.slice(0, 160),
  };

  return {
    content: scrubSiteCopy(content),
    seo: scrubSiteCopy(seo),
    promptTokens: 0,
    completionTokens: 0,
    usedAi: false,
  };
}

export async function generateSiteContent(input: {
  businessName: string;
  trade: string;
  town: string | null;
  phone: string | null;
  address: string | null;
  keywords: SiteKeywords;
  payload: BrandProfilePayload;
}): Promise<ContentGenerationResult> {
  const fallback = () => fallbackContent(input);
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return fallback();

  const model =
    process.env.OPENAI_SITE_MODEL?.trim() ||
    process.env.OPENAI_BLOG_MODEL?.trim() ||
    "gpt-4.1-mini";

  const compact = {
    businessName: input.businessName,
    trade: input.trade,
    town: input.town,
    phone: input.phone,
    address: input.address,
    primaryKeyword: input.keywords.primary,
    secondaryKeywords: input.keywords.secondary.slice(0, 8),
    serviceAreas: input.keywords.serviceAreas.slice(0, 8),
    services: (input.payload.services ?? []).slice(0, 8),
    description: input.payload.description?.slice(0, 400) ?? null,
    reviewSnippets: (input.payload.reviews ?? [])
      .slice(0, 4)
      .map((r) => ({
        author: r.author,
        rating: r.rating,
        text: r.text.slice(0, 180),
      })),
  };

  const system = `You write unique local SEO website copy for trade businesses.
Return ONLY valid JSON matching this shape:
{"content":{...},"seo":{"title":"","description":""}}

content must include: hero{h1,subhead,ctaLabel,ctaHref}, about{heading,body}, services[{name,description,keyword}], whyUs[{title,body}], serviceAreas[{name,description,body}], faqs[{question,answer}], testimonials[{author,text,rating}], contact{heading,body,formCta}, nav{links[{label,href}]}, footer{blurb}, imageAlts{hero,logo,about}.

Rules:
- Unique copy for this business; do not use generic interchangeable filler.
- Natural keyword use; no stuffing.
- H1 should reflect primary service + location.
- about.heading must be exactly "About Us".
- Include at least 3 distinct services (prefer 4-6). Never use vague names like "Service" or "Services".
- Include at least 4 FAQs relevant to local search intent.
- Each serviceAreas item needs a short description and a longer body (2-4 sentences) written to rank for "{trade} in {area}".
- ctaHref should be "/#contact". Nav links: Services "/#services", About Us "/about", Gallery "/#gallery", Areas "/#areas", FAQ "/#faq", Contact "/#contact".
- Keep testimonials grounded in provided review snippets (paraphrase lightly if needed).
- No invented certifications, awards, or statistics.
- Never use em dashes or en dashes. Use commas, periods, or hyphens in phone numbers only.
- imageAlts should be descriptive for SEO (business, trade, location).`;

  const user = `Generate website content JSON for:\n${JSON.stringify(compact)}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!response.ok) {
      return fallback();
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    const raw = json.choices?.[0]?.message?.content?.trim();
    if (!raw) return fallback();

    const parsed = aiContentResponseSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return fallback();

    const promptTokens = json.usage?.prompt_tokens ?? 0;
    const completionTokens = json.usage?.completion_tokens ?? 0;

    const content = scrubSiteCopy({
      ...parsed.data.content,
      services: ensureMinimumServices(parsed.data.content.services, {
        trade: input.trade,
        town: input.town,
        fillerNames: [
          ...input.keywords.secondary,
          ...(input.payload.services ?? []),
        ],
      }),
    });

    return {
      content,
      seo: scrubSiteCopy(parsed.data.seo),
      promptTokens,
      completionTokens,
      usedAi: true,
    };
  } catch {
    return fallback();
  }
}
