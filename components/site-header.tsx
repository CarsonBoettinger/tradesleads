import { Logo } from "@/components/logo";
import { SiteHeaderActions } from "@/components/site-header-actions";

const links = [
  { href: "/#found", label: "Get found" },
  { href: "/#how", label: "How it works" },
  { href: "/services", label: "Services" },
  { href: "/trades", label: "Trades" },
  { href: "/blog", label: "Blog" },
  { href: "/report", label: "Free report" },
] as const;

export function SiteHeader() {
  const navLinks = [...links];

  return (
    <header className="sticky top-0 z-40 border-b-2 border-peach bg-cream/90 backdrop-blur-md">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-[10px] focus:bg-foreman focus:px-4 focus:py-3 focus:font-bold focus:text-cream"
      >
        Skip to content
      </a>
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <a href="/" aria-label="Kalvez, home" className="rounded-xl">
          <Logo />
        </a>
        <nav className="hidden items-center gap-5 xl:flex" aria-label="Page">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-base font-bold text-cocoa transition-colors hover:text-foreman focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreman"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <SiteHeaderActions links={navLinks} />
      </div>
    </header>
  );
}
