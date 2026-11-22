import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
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
import { Markdown } from "@/lib/blog/markdown";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  tradeServiceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { getTradeGuideMarkdown } from "@/lib/trades/guides";
import {
  getRelatedTrades,
  getTradeBySlug,
  tradeHref,
  trades,
} from "@/lib/trades";

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

  const title = trade.pageTitle;
  const description = trade.description;

  return buildPageMetadata({
    title,
    description,
    path: tradeHref(trade.slug),
    noIndex: !trade.indexable,
    keywords: [
      `${trade.name} marketing`,
      `${trade.singular} website`,
      `local SEO for ${trade.name}`,
      trade.searchExample,
      `Google Business Profile for ${trade.name}`,
      trade.pageTitle,
    ],
    images: [
      {
        url: `${tradeHref(trade.slug)}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: trade.pageTitle,
      },
    ],
  });
}

function TradePageFallback() {
  return (
    <main id="content">
      <section className="pt-14 pb-16 sm:pt-20 sm:pb-24">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
            <div>
              <div className="h-4 w-24 rounded bg-peach" />
              <div className="mt-4 h-14 max-w-2xl rounded bg-peach/70 sm:h-16" />
              <div className="mt-6 h-20 max-w-xl rounded bg-peach/50" />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <div className="h-12 w-40 rounded-lg bg-peach" />
                <div className="h-12 w-40 rounded-lg bg-peach/60" />
              </div>
            </div>
            <div className="h-72 rounded-xl border-2 border-peach bg-white sm:h-80" />
          </div>
        </Container>
      </section>
    </main>
  );
}

async function TradePageContent({ params }: PageProps) {
  const { slug } = await params;
  const trade = getTradeBySlug(slug);
  if (!trade) notFound();

  const otherTrades = getRelatedTrades(trade.slug, 8);
  const guide = getTradeGuideMarkdown(trade.slug);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: trade.pageTitle,
          description: trade.description,
          path: tradeHref(trade.slug),
        })}
      />
      <JsonLd data={tradeServiceJsonLd(trade)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Trades", path: "/trades" },
          { name: trade.name, path: tradeHref(trade.slug) },
        ])}
      />
      <main id="content">
        <section className="pt-14 pb-16 sm:pt-20 sm:pb-24">
          <Container>
            <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
              <div>
                <Eyebrow>{trade.name}</Eyebrow>
                <h1 className="mt-4 max-w-2xl text-[2.5rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl lg:text-6xl">
                  {trade.pageTitle}
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

        {guide ? (
          <section className="bg-white py-20 sm:py-28">
            <Container>
              <Eyebrow>Field guide</Eyebrow>
              <h2 className="mt-4 max-w-3xl text-[2.25rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl">
                How {trade.name.toLowerCase()} win more work from Google
              </h2>
              <div className="mx-auto mt-12 max-w-3xl">
                <Markdown content={guide} />
              </div>
            </Container>
          </section>
        ) : null}

        <section className="py-6" aria-labelledby="trade-cta-heading">
          <Container>
            <div className="rounded-xl bg-cocoa px-6 py-14 text-center sm:px-12 sm:py-16">
              <h2
                id="trade-cta-heading"
                className="text-[2.5rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cream sm:text-6xl"
              >
                Get found. Get hired.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[18px] leading-[1.6] text-[#c5d0e0]">
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
              Related trades we help grow
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
              <li>
                <Link
                  href="/trades"
                  className="flex min-h-14 items-center rounded-xl border-2 border-cocoa bg-cocoa px-5 text-[17px] font-bold text-cream transition-colors hover:bg-foreman focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreman"
                >
                  Browse all trades
                </Link>
              </li>
            </ul>
          </Container>
        </section>
      </main>
    </>
  );
}

export default function TradePage({ params }: PageProps) {
  return (
    <div>
      <SiteHeader />
      <Suspense fallback={<TradePageFallback />}>
        <TradePageContent params={params} />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
