import Link from "next/link";
import { Logo } from "@/components/logo";
import { siteDescriptor } from "@/lib/seo";
import { featuredServices, serviceHref } from "@/lib/services";
import { featuredTrades, tradeHref } from "@/lib/trades";

const explore = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/services", label: "What we do" },
  { href: "/pricing", label: "Pricing" },
  { href: "/trades", label: "All trades" },
  { href: "/blog", label: "Blog" },
  { href: "/report", label: "Free report" },
  { href: "/contact", label: "Contact" },
  { href: "/free-demo", label: "Book a free demo" },
];

const footerServices = featuredServices.slice(0, 6);

export function SiteFooter() {
  return (
    <footer className="bg-cocoa text-cream">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm md:col-span-2 lg:col-span-1">
          <Logo tone="cream" />
          <p className="mt-6 text-[17px] leading-relaxed text-[#c5d0e0]">
            {siteDescriptor}
          </p>
          <p className="mt-4 text-base font-bold text-cream">
            AI platform for the trades
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
            What we do
          </h2>
          <ul className="mt-4 space-y-2">
            {footerServices.map((service) => (
              <li key={service.slug}>
                <Link
                  href={serviceHref(service.slug)}
                  className="inline-flex min-h-11 items-center text-[17px] font-bold text-cream underline decoration-transparent underline-offset-4 hover:decoration-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
                >
                  {service.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/services"
                className="inline-flex min-h-11 items-center text-[17px] font-bold text-cream underline decoration-transparent underline-offset-4 hover:decoration-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
              >
                All services
              </Link>
            </li>
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
          <nav
            aria-label="Legal and social"
            className="flex flex-wrap items-center gap-x-5 gap-y-1"
          >
            <a
              href="https://www.instagram.com/Kalvezai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-[15px] font-bold text-cream underline decoration-transparent underline-offset-4 hover:decoration-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
            >
              <IconInstagram />
              Instagram
            </a>
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

function IconInstagram() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      aria-hidden
      fill="currentColor"
    >
      <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zm9.75 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  );
}
