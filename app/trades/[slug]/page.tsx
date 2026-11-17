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
import { breadcrumbJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { getTradeBySlug, tradeHref, trades } from "@/lib/trades";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return trades.map((trade) => ({ slug: trade.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const trade = getTradeBySlug(slug);
  if (!trade) return {};

  const title = `Local growth for ${trade.name}`;
  const description = trade.description;

  return {
    title,
    description,
    keywords: [
      `${trade.name} marketing`,
      `${trade.singular} website`,
      `local SEO for ${trade.name}`,
      trade.searchExample,
    ],
    alternates: { canonical: absoluteUrl(tradeHref(trade.slug)) },
    openGraph: {
      title: `${title} | Kalvez`,
      description,
      type: "website",
      locale: "en_US",
      siteName: "Kalvez",
      url: absoluteUrl(tradeHref(trade.slug)),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Kalvez`,
      description,
    },
  };
}

export default async function TradePage({ params }: PageProps) {
  const { slug } = await params;
  const trade = getTradeBySlug(slug);
  if (!trade) notFound();

  const otherTrades = trades.filter((item) => item.slug !== trade.slug);

  return (
    <div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: trade.name, path: tradeHref(trade.slug) },
        ])}
      />
      <SiteHeader />
      <main id="content">
        <section className="pt-14 pb-16 sm:pt-20 sm:pb-24">
          <Container>
            <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
              <div>
                <Eyebrow>{trade.name}</Eyebrow>
                <h1 className="mt-4 max-w-2xl text-[2.5rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl lg:text-6xl">
                  {trade.headline}
                </h1>
                <p className="mt-6 max-w-xl text-[18px] leading-[1.6] text-muted sm:text-[19px]">
                  {trade.summary}
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
                  Local search
                </p>
                <p className="mt-3 text-2xl leading-[1.05] font-extrabold tracking-[-0.02em] text-cocoa sm:text-3xl">
                  {trade.searchExample}
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
              Why good {trade.name.toLowerCase()} miss jobs online
            </h2>
            <ul className="mt-12 grid gap-4 lg:grid-cols-3">
              {trade.pains.map((pain) => (
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
              Built for {trade.name.toLowerCase()} who want more booked work
            </h2>
            <ul className="mt-12 space-y-6">
              {trade.outcomes.map((outcome, index) => (
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

        <section className="py-6" aria-labelledby="trade-cta-heading">
          <Container>
            <div className="rounded-xl bg-cocoa px-6 py-14 text-center sm:px-12 sm:py-16">
              <h2
                id="trade-cta-heading"
                className="text-[2.5rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cream sm:text-6xl"
              >
                Get found. Get hired.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[18px] leading-[1.6] text-[#eadfd6]">
                Tell us you are {trade.article} {trade.singular} and the town
                you serve. The demo takes 20 minutes.
              </p>
              <div className="mt-8">
                <CtaLink href={demoHref}>{demoCta}</CtaLink>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-20 sm:py-28">
          <Container>
            <Eyebrow>Other trades</Eyebrow>
            <h2 className="mt-4 max-w-3xl text-[2.25rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl">
              Growth for the crews that build our world
            </h2>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {otherTrades.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={tradeHref(item.slug)}
                    className="flex min-h-14 items-center rounded-xl border-2 border-peach bg-white px-5 text-[17px] font-bold text-cocoa transition-colors hover:bg-peach focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreman"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
