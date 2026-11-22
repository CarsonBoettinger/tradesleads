import type { Metadata } from "next";
import Image from "next/image";
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
import { COMPANY_EMAIL, companyMailto } from "@/lib/company";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  webPageJsonLd,
} from "@/lib/seo";

const title = "About Kalvez";
const description =
  "Why Kalvez exists: independent trade businesses lose jobs to whoever shows up first on Google. We build the AI platform that helps them get found and booked.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/about",
  keywords: [
    "about Kalvez",
    "AI for trade businesses",
    "local SEO for contractors",
    "get more jobs from Google",
  ],
});

const pillars = [
  {
    title: "The work is there",
    body: "Homeowners and property managers still search for plumbers, HVAC techs, electricians, roofers, and dozens of other trades every day. The demand did not disappear.",
  },
  {
    title: "Visibility decides who gets the call",
    body: "When someone needs a crew, they open Google. The businesses that look clear, local, and ready get the phone call. Everyone else never hears about the job.",
  },
  {
    title: "Independent crews deserve a fair shot",
    body: "National brands and marketing budgets should not own the Map Pack by default. A solid local presence should help a real crew win work in their own town.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <JsonLd
        data={webPageJsonLd({
          name: title,
          description,
          path: "/about",
          type: "AboutPage",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <SiteHeader />
      <main id="content">
        <section className="relative overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-24">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(239,114,48,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(22,42,74,0.08),_transparent_50%)]"
            aria-hidden="true"
          />
          <Container className="relative">
            <Eyebrow>About</Eyebrow>
            <h1 className="mt-4 max-w-3xl text-[2.5rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl lg:text-6xl">
              Jobs are going to whoever shows up on Google
            </h1>
            <p className="mt-6 max-w-2xl text-[18px] leading-[1.6] text-muted sm:text-[19px]">
              Kalvez is the AI platform for the trades. We exist because great
              crews still miss booked work when they are hard to find online, and
              because that gap is fixable.
            </p>
          </Container>
        </section>

        <section className="bg-white py-16 sm:py-24" aria-labelledby="opportunity-heading">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
              <div>
                <Eyebrow>The opportunity</Eyebrow>
                <h2
                  id="opportunity-heading"
                  className="mt-4 max-w-xl text-[2rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-4xl"
                >
                  Local search is still the front door for trade work
                </h2>
                <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-muted sm:text-[18px]">
                  <p>
                    Every week, people in every town type the same searches:
                    plumber near me, AC repair, electrician, roof leak, garage
                    door stuck. They are ready to hire. They just need a crew
                    that looks available and trustworthy on the screen in front
                    of them.
                  </p>
                  <p>
                    Too many independent shops still rely on word of mouth alone
                    while competitors own the listing, the reviews, and the
                    first click. That is not a talent problem. It is a visibility
                    problem, and visibility is something you can build.
                  </p>
                  <p>
                    Kalvez was built for that opening: help trade businesses get
                    found, get trusted, and get booked, without turning owners
                    into full-time marketers.
                  </p>
                </div>
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border-2 border-peach sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image
                  src="/images/hero/lifestyle.jpg"
                  alt="Trade professional at work on a job site"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
              </div>
            </div>
          </Container>
        </section>

        <section className="bg-cocoa py-16 text-cream sm:py-24" aria-labelledby="pillars-heading">
          <Container>
            <Eyebrow on="peach">Why this matters</Eyebrow>
            <h2
              id="pillars-heading"
              className="mt-4 max-w-3xl text-[2rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance sm:text-4xl"
            >
              Three truths behind Kalvez
            </h2>
            <ul className="mt-12 grid gap-8 md:grid-cols-3">
              {pillars.map((pillar) => (
                <li key={pillar.title}>
                  <h3 className="text-2xl leading-tight font-extrabold tracking-[-0.02em]">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-[17px] leading-relaxed text-[#c5d0e0]">
                    {pillar.body}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className="py-16 sm:py-24" aria-labelledby="contact-heading">
          <Container>
            <div className="rounded-xl border-2 border-peach bg-white p-7 sm:p-10">
              <Eyebrow>Talk to us</Eyebrow>
              <h2
                id="contact-heading"
                className="mt-4 max-w-2xl text-[2rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-4xl"
              >
                Real people. Real reply.
              </h2>
              <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted sm:text-[18px]">
                Email{" "}
                <a
                  href={companyMailto}
                  className="font-bold text-cocoa underline decoration-peach underline-offset-4 hover:decoration-foreman focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreman"
                >
                  {COMPANY_EMAIL}
                </a>{" "}
                or book a free 20-minute demo. Tell us the trade and the town.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CtaLink href={demoHref}>{demoCta}</CtaLink>
                <CtaLink href={reportHref} variant="ghost">
                  {reportCta}
                </CtaLink>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
