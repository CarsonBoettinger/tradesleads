import type { Metadata } from "next";
import { DemoForm } from "@/components/demo-form";
import { Container, Eyebrow } from "@/components/ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const description =
  "A free 20-minute demo of how your trade business shows up on Google and on your website.";

export const metadata: Metadata = {
  title: "Book a free demo - FOREMAN",
  description,
  openGraph: {
    title: "Book a free demo - FOREMAN",
    description,
    type: "website",
    locale: "en_US",
    siteName: "FOREMAN",
  },
};

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

export default function FreeDemoPage() {
  return (
    <div>
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
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
