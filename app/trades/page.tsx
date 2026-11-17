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
import {
  getTradesByCategory,
  tradeCategories,
  tradeHref,
  trades,
} from "@/lib/trades";

const title = "Growth pages for every trade";
const description =
  "Local SEO and website growth pages for construction, mechanical trades, automotive, cleaning, property services, crafts, industrial, and more.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/trades",
  keywords: [
    "trade business marketing",
    "contractor SEO pages",
    "local SEO for trades",
    "websites for tradespeople",
  ],
});

export default function TradesIndexPage() {
  return (
    <div>
      <JsonLd
        data={webPageJsonLd({
          name: title,
          description,
          path: "/trades",
          type: "CollectionPage",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Trades", path: "/trades" },
        ])}
      />
      <JsonLd
        data={itemListJsonLd(
          "Kalvez trade growth pages",
          trades.map((trade) => ({
            name: trade.name,
            path: tradeHref(trade.slug),
          })),
        )}
      />
      <SiteHeader />
      <main id="content">
        <section className="pt-14 pb-16 sm:pt-20 sm:pb-24">
          <Container>
            <Eyebrow>Trades</Eyebrow>
            <h1 className="mt-4 max-w-3xl text-[2.5rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl lg:text-6xl">
              Built for the businesses that build our world
            </h1>
            <p className="mt-6 max-w-2xl text-[18px] leading-[1.6] text-muted sm:text-[19px]">
              {trades.length} trade pages for local search. Pick your trade,
              see how Kalvez helps you get found and get hired.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaLink href={demoHref}>{demoCta}</CtaLink>
              <CtaLink href={reportHref} variant="ghost">
                {reportCta}
              </CtaLink>
            </div>
          </Container>
        </section>

        {tradeCategories.map((category) => {
          const categoryTrades = getTradesByCategory(category.id);
          if (!categoryTrades.length) return null;

          return (
            <section
              key={category.id}
              id={category.id}
              className="border-t-2 border-peach py-16 sm:py-20"
            >
              <Container>
                <h2 className="max-w-3xl text-[2rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-4xl">
                  {category.name}
                </h2>
                <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted">
                  {category.description}
                </p>
                <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryTrades.map((trade) => (
                    <li key={trade.slug}>
                      <Link
                        href={tradeHref(trade.slug)}
                        className="flex min-h-14 items-center rounded-xl border-2 border-peach bg-white px-5 text-[17px] font-bold text-cocoa transition-colors hover:bg-peach focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreman"
                      >
                        {trade.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Container>
            </section>
          );
        })}

        <section className="py-6" aria-labelledby="trades-cta-heading">
          <Container>
            <div className="rounded-xl bg-cocoa px-6 py-14 text-center sm:px-12 sm:py-16">
              <h2
                id="trades-cta-heading"
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
