import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import {
  getRelatedServices,
  getServiceBySlug,
  serviceHref,
  services,
} from "@/lib/services";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return buildPageMetadata({
    title: service.pageTitle,
    description: service.description,
    path: serviceHref(service.slug),
    keywords: service.keywords,
    images: [
      {
        url: `${serviceHref(service.slug)}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: service.pageTitle,
      },
    ],
  });
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = getRelatedServices(service.slug, 6);

  return (
    <div>
      <JsonLd
        data={webPageJsonLd({
          name: service.pageTitle,
          description: service.description,
          path: serviceHref(service.slug),
        })}
      />
      <JsonLd data={serviceJsonLd(service)} />
      <JsonLd data={faqJsonLd(service.faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.name, path: serviceHref(service.slug) },
        ])}
      />
      <SiteHeader />
      <main id="content">
        <section className="pt-14 pb-16 sm:pt-20 sm:pb-24">
          <Container>
            <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
              <div>
                <Eyebrow>{service.name}</Eyebrow>
                <h1 className="mt-4 max-w-2xl text-[2.5rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl lg:text-6xl">
                  {service.headline}
                </h1>
                <p className="mt-6 max-w-xl text-[18px] leading-[1.6] text-muted sm:text-[19px]">
                  {service.summary}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <CtaLink href={demoHref}>{demoCta}</CtaLink>
                  <CtaLink href={reportHref} variant="ghost">
                    {reportCta}
                  </CtaLink>
                </div>
              </div>

              <article className="rounded-xl border-2 border-peach bg-white p-6 sm:p-8">
                <p className="text-[15px] font-bold tracking-[0.16em] text-muted uppercase">
                  People search for
                </p>
                <p className="mt-3 text-2xl leading-[1.05] font-extrabold tracking-[-0.02em] text-cocoa sm:text-3xl">
                  {service.searchExample}
                </p>
                <ol className="mt-6 space-y-3">
                  {[
                    { place: "1", name: "Your business", note: "The top spot" },
                    {
                      place: "2",
                      name: "National chain",
                      note: "Bigger budget",
                    },
                    {
                      place: "3",
                      name: "Another crew",
                      note: "Also local",
                    },
                  ].map((row) => (
                    <li
                      key={row.place}
                      className={`flex items-center gap-4 rounded-lg border-2 px-4 py-3 ${
                        row.place === "1"
                          ? "border-peach bg-peach"
                          : "border-peach bg-cream"
                      }`}
                    >
                      <span
                        className={`grid size-10 shrink-0 place-items-center rounded-md text-base font-extrabold ${
                          row.place === "1"
                            ? "bg-foreman text-cream"
                            : "bg-white text-cocoa"
                        }`}
                      >
                        {row.place}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-extrabold tracking-[-0.02em] text-cocoa">
                          {row.name}
                        </span>
                        <span className="block text-[15px] text-muted">
                          {row.note}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="mt-5 text-[15px] leading-relaxed text-muted">
                  An example of the list. Not your rank today.
                </p>
              </article>
            </div>
          </Container>
        </section>

        <section className="bg-white py-20 sm:py-28">
          <Container>
            <Eyebrow>The problem</Eyebrow>
            <h2 className="mt-4 max-w-3xl text-[2.25rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl">
              {service.problemHeading}
            </h2>
            <ul className="mt-12 grid gap-4 lg:grid-cols-3">
              {service.pains.map((pain) => (
                <li
                  key={pain.title}
                  className="rounded-xl border-2 border-peach bg-cream p-7 sm:p-8"
                >
                  <h3 className="text-2xl leading-tight font-extrabold tracking-[-0.02em] text-cocoa">
                    {pain.title}
                  </h3>
                  <p className="mt-3 text-[17px] leading-relaxed text-muted">
                    {pain.body}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className="py-20 sm:py-28">
          <Container>
            <Eyebrow>What Kalvez does</Eyebrow>
            <h2 className="mt-4 max-w-3xl text-[2.25rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl">
              {service.outcomesHeading}
            </h2>
            <ul className="mt-12 space-y-6">
              {service.outcomes.map((outcome, index) => (
                <li key={outcome.title} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-peach text-base font-extrabold text-cocoa">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-xl leading-tight font-extrabold tracking-[-0.02em] text-cocoa">
                      {outcome.title}
                    </h3>
                    <p className="mt-1 text-[17px] leading-relaxed text-muted">
                      {outcome.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className="bg-white py-20 sm:py-28">
          <Container>
            <Eyebrow>Questions</Eyebrow>
            <h2 className="mt-4 max-w-3xl text-[2.25rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl">
              About {service.name.toLowerCase()}
            </h2>
            <dl className="mt-12 grid gap-6 sm:grid-cols-2">
              {service.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-xl border-2 border-peach bg-cream p-6 sm:p-7"
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

        <section className="py-6" aria-labelledby="service-cta-heading">
          <Container>
            <div className="rounded-xl bg-cocoa px-6 py-14 text-center sm:px-12 sm:py-16">
              <h2
                id="service-cta-heading"
                className="text-[2.5rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cream sm:text-6xl"
              >
                Get found. Get hired.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[18px] leading-[1.6] text-[#c5d0e0]">
                {service.ctaBody}
              </p>
              <div className="mt-8">
                <CtaLink href={demoHref}>{demoCta}</CtaLink>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-20 sm:py-28">
          <Container>
            <Eyebrow>Related services</Eyebrow>
            <h2 className="mt-4 max-w-3xl text-[2.25rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl">
              More ways Kalvez helps trades grow
            </h2>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={serviceHref(item.slug)}
                    className="flex min-h-14 items-center rounded-xl border-2 border-peach bg-white px-5 text-[17px] font-bold text-cocoa transition-colors hover:bg-peach focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreman"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="flex min-h-14 items-center rounded-xl border-2 border-cocoa bg-cocoa px-5 text-[17px] font-bold text-cream transition-colors hover:bg-foreman focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreman"
                >
                  Browse all services
                </Link>
              </li>
            </ul>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
