import type { Metadata } from "next";
import Link from "next/link";
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
  itemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { serviceHref, services } from "@/lib/services";

const title = "What we do for trade businesses";
const description =
  "Kalvez services for trades: local SEO, SEO, AEO, GEO, backlinks, content, CRM, review management, appointment scheduling, and online payments.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/services",
  keywords: [
    "services for trade businesses",
    "local SEO for trades",
    "SEO for contractors",
    "content marketing for trades",
    "CRM for trade businesses",
  ],
});

export default function ServicesIndexPage() {
  return (
    <div>
      <JsonLd
        data={webPageJsonLd({
          name: title,
          description,
          path: "/services",
          type: "CollectionPage",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <JsonLd
        data={itemListJsonLd(
          "Kalvez services for trade businesses",
          services.map((service) => ({
            name: service.name,
            path: serviceHref(service.slug),
          })),
        )}
      />
      <SiteHeader />
      <main id="content">
        <section className="pt-14 pb-16 sm:pt-20 sm:pb-24">
          <Container>
            <Eyebrow>What we do</Eyebrow>
            <h1 className="mt-4 max-w-3xl text-[2.5rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl lg:text-6xl">
              Services that get trades found and hired
            </h1>
            <p className="mt-6 max-w-2xl text-[18px] leading-[1.6] text-muted sm:text-[19px]">
              {services.length} growth services for crews who want more jobs
              from Google - search, content, reviews, bookings, and payments.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaLink href={demoHref}>{demoCta}</CtaLink>
              <CtaLink href={reportHref} variant="ghost">
                {reportCta}
              </CtaLink>
            </div>
          </Container>
        </section>

        <section className="border-t-2 border-peach py-16 sm:py-20">
          <Container>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={serviceHref(service.slug)}
                    className="flex min-h-14 flex-col justify-center rounded-xl border-2 border-peach bg-white px-5 py-4 text-cocoa transition-colors hover:bg-peach focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreman"
                  >
                    <span className="text-[17px] font-bold">{service.name}</span>
                    <span className="mt-1 text-[15px] leading-snug text-muted">
                      {service.pageTitle}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className="py-6" aria-labelledby="services-cta-heading">
          <Container>
            <div className="rounded-xl bg-cocoa px-6 py-14 text-center sm:px-12 sm:py-16">
              <h2
                id="services-cta-heading"
                className="text-[2.5rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cream sm:text-6xl"
              >
                Get found. Get hired.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[18px] leading-[1.6] text-[#c5d0e0]">
                Tell us your trade and the town you serve. The demo takes 20
                minutes.
              </p>
              <div className="mt-8">
                <CtaLink href={demoHref}>{demoCta}</CtaLink>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
