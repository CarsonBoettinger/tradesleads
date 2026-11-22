import type { Metadata } from "next";
import { DemoForm } from "@/components/demo-form";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  Container,
  CtaLink,
  Eyebrow,
  reportCta,
  reportHref,
} from "@/components/ui";
import { COMPANY_EMAIL, companyMailto } from "@/lib/company";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  webPageJsonLd,
} from "@/lib/seo";

const title = "Contact Kalvez";
const description =
  "Email Kalvez or book a free 20-minute demo. Tell us your trade and town. We will reply with a clear next step.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/contact",
  keywords: [
    "contact Kalvez",
    "book a demo for contractors",
    "trade business SEO help",
  ],
});

const channels = [
  {
    title: "Email",
    body: (
      <>
        Reach the team at{" "}
        <a
          href={companyMailto}
          className="font-bold text-cocoa underline decoration-peach underline-offset-4 hover:decoration-foreman focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreman"
        >
          {COMPANY_EMAIL}
        </a>
        . We read every message.
      </>
    ),
  },
  {
    title: "Free demo",
    body: "Twenty minutes on your Google listing and website, plus the first fixes that matter for booked jobs.",
  },
  {
    title: "Free report",
    body: "Prefer to start alone? Run a free digital presence report, then email us with questions.",
  },
];

export default function ContactPage() {
  return (
    <div>
      <JsonLd
        data={webPageJsonLd({
          name: title,
          description,
          path: "/contact",
          type: "ContactPage",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <SiteHeader />
      <main id="content" className="py-14 sm:py-20">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
            <div>
              <Eyebrow>Contact</Eyebrow>
              <h1 className="mt-4 text-[2.5rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl">
                Get in touch
              </h1>
              <p className="mt-6 text-[18px] leading-[1.6] text-muted">
                Questions about Kalvez, your Google visibility, or a project for
                your trade business. Start here.
              </p>
              <ul className="mt-10 space-y-6">
                {channels.map((channel) => (
                  <li key={channel.title} className="flex gap-4">
                    <span
                      className="mt-1 size-2.5 shrink-0 rounded-full bg-foreman"
                      aria-hidden="true"
                    />
                    <div>
                      <h2 className="text-xl leading-tight font-extrabold tracking-[-0.02em] text-cocoa">
                        {channel.title}
                      </h2>
                      <p className="mt-1 text-[17px] leading-relaxed text-muted">
                        {channel.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <CtaLink href={reportHref} variant="ghost">
                  {reportCta}
                </CtaLink>
              </div>
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
