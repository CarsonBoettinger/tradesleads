import Link from "next/link";
import { Logo } from "@/components/logo";
import { featuredTrades, tradeHref } from "@/lib/trades";

const explore = [
  { href: "/", label: "Home" },
  { href: "/trades", label: "All trades" },
  { href: "/blog", label: "Blog" },
  { href: "/report", label: "Free report" },
  { href: "/free-demo", label: "Book a free demo" },
];

export function SiteFooter() {
  return (
    <footer className="bg-cocoa text-cream">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo tone="cream" />
          <p className="mt-6 text-[17px] leading-relaxed text-[#c5d0e0]">
            Websites and local search growth for the businesses that build our
            world.
          </p>
          <p className="mt-4 text-base font-bold text-cream">
            Growth for the trades
          </p>
        </div>
        <div>
          <h2 className="text-base font-bold tracking-[0.16em] text-[#c5d0e0] uppercase">
            Explore
          </h2>
          <ul className="mt-4 space-y-2">
            {explore.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-[17px] font-bold text-cream underline decoration-transparent underline-offset-4 hover:decoration-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-base font-bold tracking-[0.16em] text-[#c5d0e0] uppercase">
            Trades
          </h2>
          <ul className="mt-4 space-y-2">
            {featuredTrades.map((trade) => (
              <li key={trade.slug}>
                <Link
                  href={tradeHref(trade.slug)}
                  className="inline-flex min-h-11 items-center text-[17px] font-bold text-cream underline decoration-transparent underline-offset-4 hover:decoration-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
                >
                  {trade.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/trades"
                className="inline-flex min-h-11 items-center text-[17px] font-bold text-cream underline decoration-transparent underline-offset-4 hover:decoration-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
              >
                All trades
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-[15px] text-[#c5d0e0]">© 2026 Kalvez</p>
          <nav aria-label="Legal" className="flex gap-5">
            <Link
              href="/privacy"
              className="inline-flex min-h-11 items-center text-[15px] font-bold text-cream underline decoration-transparent underline-offset-4 hover:decoration-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="inline-flex min-h-11 items-center text-[15px] font-bold text-cream underline decoration-transparent underline-offset-4 hover:decoration-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
            >
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
