import { Logo } from "@/components/logo";
import { tradeHref, trades } from "@/lib/trades";

const visit = [
  { href: "/#found", label: "Get found" },
  { href: "/#remembered", label: "Stay in mind" },
  { href: "/#booked", label: "Booked jobs" },
  { href: "/#how", label: "How it works" },
  { href: "/blog", label: "Blog" },
  { href: "/free-demo", label: "Book a free demo" },
];

export function SiteFooter() {
  return (
    <footer className="bg-cocoa text-cream">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo tone="cream" />
          <p className="mt-6 text-[17px] leading-relaxed text-[#eadfd6]">
            Websites and local search growth for the businesses that build our
            world.
          </p>
          <p className="mt-4 text-base font-bold text-cream">
            Growth for the trades
          </p>
        </div>
        <div>
          <h2 className="text-base font-bold tracking-[0.16em] text-[#eadfd6] uppercase">
            On this page
          </h2>
          <ul className="mt-4 space-y-2">
            {visit.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-[17px] font-bold text-cream underline decoration-transparent underline-offset-4 hover:decoration-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-base font-bold tracking-[0.16em] text-[#eadfd6] uppercase">
            Trades
          </h2>
          <ul className="mt-4 space-y-2">
            {trades.map((trade) => (
              <li key={trade.slug}>
                <a
                  href={tradeHref(trade.slug)}
                  className="inline-flex min-h-11 items-center text-[17px] font-bold text-cream underline decoration-transparent underline-offset-4 hover:decoration-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
                >
                  {trade.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto w-full max-w-6xl px-5 py-6 text-[15px] text-[#eadfd6] sm:px-8">
          © 2026 FOREMAN
        </p>
      </div>
    </footer>
  );
}
