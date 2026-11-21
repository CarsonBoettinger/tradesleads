import type {
  Brand,
  BrandAsset,
  SiteConfig,
  SiteContent,
  SiteTheme,
} from "@/lib/sites/types";
import {
  SiteFooter,
  SiteHeader,
} from "@/components/sites/templates/trade-local-v1/chrome";
import { siteHref } from "@/lib/sites/paths";

function themeStyle(theme: SiteTheme): React.CSSProperties {
  return {
    ["--site-primary" as string]: theme.primary,
    ["--site-secondary" as string]: theme.secondary,
    ["--site-accent" as string]: theme.accent,
    ["--site-bg" as string]: theme.background,
    ["--site-surface" as string]: theme.surface,
    ["--site-text" as string]: theme.text,
    ["--site-muted" as string]: theme.muted,
    fontFamily: theme.fontFamily ?? "system-ui, sans-serif",
    background: theme.background,
    color: theme.text,
  };
}

export function TradeLocalV1AboutPage({
  brand,
  config,
  assets,
  basePath = "",
}: {
  brand: Brand;
  config: SiteConfig;
  assets: BrandAsset[];
  basePath?: string;
}) {
  const content = config.content as SiteContent;
  const theme = config.theme as SiteTheme;
  const logo =
    assets.find((a) => a.kind === "logo" && a.public_url) ??
    assets.find((a) => a.kind === "logo") ??
    null;
  const photo =
    assets.find((a) => a.kind === "gallery" && a.public_url) ??
    assets.find((a) => a.kind === "hero" && a.public_url) ??
    null;

  if (!content?.about) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold">About Us</h1>
        <p className="mt-3 text-slate-600">Content is still being generated.</p>
      </div>
    );
  }

  return (
    <div style={themeStyle(theme)} className="min-h-dvh">
      <SiteHeader
        brand={brand}
        content={content}
        theme={theme}
        logo={logo}
        basePath={basePath}
      />

      <main>
        <section className="border-b border-black/5 bg-[color:var(--site-surface)]">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <p
                className="text-sm font-bold uppercase tracking-[0.16em]"
                style={{ color: theme.accent }}
              >
                About Us
              </p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
                {content.about.heading}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-[color:var(--site-muted)]">
                {content.about.body}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={siteHref(basePath, "/#contact")}
                  className="rounded-[10px] px-5 py-3 text-sm font-bold text-white"
                  style={{ background: theme.accent }}
                >
                  Request a Quote
                </a>
                <a
                  href={siteHref(basePath, "/")}
                  className="rounded-[10px] border-2 px-5 py-3 text-sm font-bold"
                  style={{ borderColor: theme.primary, color: theme.primary }}
                >
                  Back to home
                </a>
              </div>
            </div>
            {photo?.public_url ? (
              <div className="overflow-hidden rounded-[18px] border border-black/5 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.public_url}
                  alt={
                    content.imageAlts?.about ??
                    content.imageAlts?.hero ??
                    `${brand.name} about us`
                  }
                  width={photo.width ?? 1200}
                  height={photo.height ?? 900}
                  className="h-full max-h-[480px] w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
            ) : null}
          </div>
        </section>

        {content.whyUs?.length ? (
          <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Why homeowners choose us
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {content.whyUs.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[14px] border border-black/5 bg-white p-5"
                >
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--site-muted)]">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter brand={brand} content={content} theme={theme} />
    </div>
  );
}
