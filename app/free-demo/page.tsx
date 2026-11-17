import type { Metadata } from "next";
import { DemoForm } from "@/components/demo-form";
import { JsonLd } from "@/components/json-ld";
import { Container, Eyebrow } from "@/components/ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  faqJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

const title = "Book a free demo";
const description =
  "A free 20-minute demo of how your trade business shows up on Google and on your website.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/free-demo",
  keywords: [
    "free SEO demo for contractors",
    "Google Business Profile audit",
    "trade business website demo",
    "local SEO consultation",
  ],
});

const points = [
  {
    title: "Where you show up",
    body: "A plain look at your Google listing and your website.",
  },
  {
    title: "Google in your town",
    body: "How you appear when someone searches for your trade.",
  },
  {
    title: "Calls, not just visits",
    body: "What turns a search into a phone call.",
  },
  {
    title: "Reviews",
    body: "Whether happy customers can find a way to leave one.",
  },
  {
    title: "What to fix first",
    body: "The one or two changes that matter before anything else.",
  },
];

const faqs = [
  {
    question: "What happens on the free Kalvez demo?",
    answer:
      "In 20 minutes we review how your trade business shows up on Google and on your website, then spell out the first fixes that turn searches into calls.",
  },
  {
    question: "Who is the demo for?",
    answer:
      "Owners of plumbing, HVAC, electrical, roofing, construction, automotive, and other local trade businesses that want more booked jobs.",
  },
  {
    question: "Do I need a website already?",
    answer:
      "No. We can look at your Google listing alone, or both your listing and website if you have one.",
  },
];

export default function FreeDemoPage() {
  return (
    <div>
      <JsonLd
        data={webPageJsonLd({
          name: title,
          description,
          path: "/free-demo",
          type: "ContactPage",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Free demo", path: "/free-demo" },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <SiteHeader />
      <main id="content" className="py-14 sm:py-20">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
            <div>
              <Eyebrow>Free 20-minute demo</Eyebrow>
              <h1 className="mt-4 text-[2.5rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl">
                See where you could be missing customers
              </h1>
              <p className="mt-6 text-[18px] leading-[1.6] text-muted">
                On this 20-minute demo, you get:
              </p>
              <ul className="mt-8 space-y-6">
                {points.map((point) => (
                  <li key={point.title} className="flex gap-4">
                    <span
                      className="mt-1 size-2.5 shrink-0 rounded-full bg-foreman"
                      aria-hidden="true"
                    />
                    <div>
                      <h2 className="text-xl leading-tight font-extrabold tracking-[-0.02em] text-cocoa">
                        {point.title}
                      </h2>
                      <p className="mt-1 text-[17px] leading-relaxed text-muted">
                        {point.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div
              id="demo"
              className="scroll-mt-28 rounded-xl border-2 border-peach bg-white p-6 sm:p-9"
            >
              <DemoForm />
            </div>
          </div>

          <section className="mt-20 border-t-2 border-peach pt-16 sm:mt-24 sm:pt-20">
            <Eyebrow>Questions</Eyebrow>
            <h2 className="mt-4 max-w-2xl text-[2rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-4xl">
              Before you book
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
          </section>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
