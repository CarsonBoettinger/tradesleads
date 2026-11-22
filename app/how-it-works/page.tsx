import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  Container,
  CtaLink,
  Eyebrow,
  demoCta,
  demoHref,
  reportCta,
  reportHref,
} from "@/components/ui";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  faqJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

const title = "How Kalvez works";
const description =
  "From your trade and town to clearer Google visibility and more booked jobs. See how Kalvez works in plain steps.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/how-it-works",
  keywords: [
    "how Kalvez works",
    "local SEO process for contractors",
    "Google visibility for trades",
  ],
});

const steps = [
  {
    step: "01",
    title: "Your trade and your town",
    body: "Start with the work you do and where you do it. That brief drives every recommendation. No generic agency deck.",
  },
  {
    step: "02",
    title: "A clear look at Google today",
    body: "Where you show up, how your listing and site read to a customer, and where traffic is leaking before the phone rings.",
  },
  {
    step: "03",
    title: "Fix what moves calls first",
    body: "We prioritize the changes that help the right people find you, trust you, and book: visibility, reviews, and a site that converts.",
  },
  {
    step: "04",
    title: "Keep compounding",
    body: "The AI platform keeps working on presence, content, and follow-through so you stay on the tools while Google keeps sending work.",
  },
];

const faqs = [
  {
    question: "Do I need a website already?",
    answer:
      "No. We can start from your Google Business Profile alone, or from both your listing and website if you have one.",
  },
  {
    question: "How long is the free demo?",
    answer:
      "About 20 minutes. You leave with a plain read on visibility and the first fixes that matter for booked jobs.",
  },
  {
    question: "What trades do you support?",
    answer:
      "Plumbing, HVAC, electrical, roofing, construction, landscaping, automotive, and dozens of other local trades.",
  },
];

export default function HowItWorksPage() {
  return (
    <div>
      <JsonLd
        data={webPageJsonLd({
          name: title,
          description,
          path: "/how-it-works",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "How it works", path: "/how-it-works" },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <SiteHeader />
      <main id="content">
        <section className="pt-14 pb-16 sm:pt-20 sm:pb-20">
          <Container>
            <Eyebrow>How it works</Eyebrow>
            <h1 className="mt-4 max-w-3xl text-[2.5rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl lg:text-6xl">
              From Google visibility to a booked job
            </h1>
            <p className="mt-6 max-w-2xl text-[18px] leading-[1.6] text-muted sm:text-[19px]">
              A simple path: understand where you stand, fix what turns searches
              into calls, then keep compounding.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaLink href={demoHref}>{demoCta}</CtaLink>
              <CtaLink href={reportHref} variant="ghost">
                {reportCta}
              </CtaLink>
            </div>
          </Container>
        </section>

        <section className="bg-white py-16 sm:py-24" aria-labelledby="steps-heading">
          <Container>
            <h2 id="steps-heading" className="sr-only">
              Steps
            </h2>
            <ol className="grid gap-4 lg:grid-cols-2">
              {steps.map((step) => (
                <li
                  key={step.step}
                  className="rounded-xl border-2 border-peach bg-cream p-7 sm:p-9"
                >
                  <span className="grid size-12 place-items-center rounded-lg bg-peach text-base font-extrabold text-cocoa">
                    {step.step}
                  </span>
                  <h3 className="mt-6 text-2xl leading-tight font-extrabold tracking-[-0.02em] text-cocoa">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[17px] leading-relaxed text-muted">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section className="py-16 sm:py-24" aria-labelledby="faq-heading">
          <Container>
            <Eyebrow>Questions</Eyebrow>
            <h2
              id="faq-heading"
              className="mt-4 max-w-2xl text-[2rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-4xl"
            >
              Before you start
            </h2>
            <dl className="mt-10 grid gap-6 lg:grid-cols-3">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-xl border-2 border-peach bg-white p-6 sm:p-7"
                >
                  <dt className="text-xl leading-tight font-extrabold tracking-[-0.02em] text-cocoa">
                    {faq.question}
                  </dt>
                  <dd className="mt-3 text-[17px] leading-relaxed text-muted">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
