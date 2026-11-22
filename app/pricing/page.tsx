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
} from "@/components/ui";
import { COMPANY_EMAIL, companyMailto } from "@/lib/company";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  webPageJsonLd,
} from "@/lib/seo";

const title = "Pricing";
const description =
  "Kalvez pricing is simple: talk to us. Tell us your trade and town, and we will scope what fits.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/pricing",
  keywords: [
    "Kalvez pricing",
    "contractor SEO pricing",
    "local SEO cost for trades",
  ],
});

export default function PricingPage() {
  return (
    <div>
      <JsonLd
        data={webPageJsonLd({
          name: title,
          description,
          path: "/pricing",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
      <SiteHeader />
      <main id="content" className="py-14 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Pricing</Eyebrow>
            <h1 className="mt-4 text-[2.5rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl">
              Talk to us
            </h1>
            <p className="mt-6 text-[18px] leading-[1.6] text-muted sm:text-[19px]">
              Every shop starts from a different place. We do not publish a fixed
              menu. Tell us the trade and the town, and we will tell you what it
              would take and what it would cost.
            </p>
            <p className="mt-4 text-[18px] leading-[1.6] text-muted sm:text-[19px]">
              Email{" "}
              <a
                href={companyMailto}
                className="font-bold text-cocoa underline decoration-peach underline-offset-4 hover:decoration-foreman focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreman"
              >
                {COMPANY_EMAIL}
              </a>{" "}
              or book a free 20-minute demo.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaLink href={demoHref}>{demoCta}</CtaLink>
              <CtaLink href={companyMailto} variant="ghost">
                Email us
              </CtaLink>
            </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
