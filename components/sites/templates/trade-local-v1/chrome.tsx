import type { Brand, BrandAsset, SiteContent, SiteTheme } from "@/lib/sites/types";
import { siteHref } from "@/lib/sites/paths";

export function SiteHeader({
  brand,
  content,
  theme,
  logo,
  basePath,
}: {
  brand: Brand;
  content: SiteContent;
  theme: SiteTheme;
  logo: BrandAsset | null;
  basePath: string;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-[color:var(--site-surface)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a
          href={siteHref(basePath, "/")}
          className="flex items-center gap-3 font-bold tracking-tight"
        >
          {logo?.public_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo.public_url}
              alt={content.imageAlts?.logo ?? `${brand.name} logo`}
              width={logo.width ?? 160}
              height={logo.height ?? 40}
              className="h-10 w-auto max-w-[180px] object-contain"
              loading="eager"
              decoding="async"
            />
          ) : (
            <span className="text-lg" style={{ color: "var(--site-secondary)" }}>
              {brand.name}
            </span>
          )}
        </a>
        <nav className="hidden items-center gap-5 text-sm font-semibold md:flex">
          {content.nav.links.map((link) => (
            <a
              key={`${link.label}-${link.href}`}
              href={siteHref(basePath, link.href)}
              className="text-[color:var(--site-muted)] transition hover:text-[color:var(--site-text)]"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={siteHref(basePath, "/#contact")}
            className="hidden rounded-[10px] border-2 px-3 py-2 text-sm font-bold sm:inline-flex"
            style={{
              borderColor: "var(--site-primary)",
              color: "var(--site-primary)",
            }}
          >
            {content.hero.ctaLabel}
          </a>
          {brand.phone ? (
            <a
              href={`tel:${brand.phone.replace(/[^\d+]/g, "")}`}
              className="rounded-[10px] px-4 py-2 text-sm font-bold text-white"
              style={{ background: "var(--site-accent)" }}
            >
              Call
            </a>
          ) : (
            <a
              href={siteHref(basePath, "/#contact")}
              className="rounded-[10px] px-4 py-2 text-sm font-bold text-white sm:hidden"
              style={{ background: "var(--site-accent)" }}
            >
              {content.hero.ctaLabel}
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({
  brand,
  content,
  theme,
}: {
  brand: Brand;
  content: SiteContent;
  theme: SiteTheme;
}) {
  return (
    <footer
      className="border-t border-black/5 text-white"
      style={{ background: theme.secondary }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-bold">{brand.name}</p>
          <p className="mt-1 text-sm text-white/75">{content.footer.blurb}</p>
        </div>
        <p className="text-xs text-white/55">Site powered by Kalvez</p>
      </div>
    </footer>
  );
}
