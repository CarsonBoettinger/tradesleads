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
import { resolveWhyUsIcon } from "@/components/sites/templates/trade-local-v1/icons";
import {
  IconBadge,
  OverlappingPhotos,
  SectionEyebrow,
} from "@/components/sites/templates/trade-local-v1/ui";
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
  const photos = assets.filter(
    (a) =>
      a.public_url &&
      (a.kind === "gallery" || a.kind === "hero" || a.kind === "og"),
  );
  const primaryPhoto = photos[0] ?? null;
  const secondaryPhoto = photos[1] ?? null;

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
        <section className="border-b border-black/5 bg-white">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 md:py-20">
            {primaryPhoto?.public_url ? (
              <div className="pb-8 lg:pb-6">
                <OverlappingPhotos
                  primary={primaryPhoto.public_url}
                  secondary={secondaryPhoto?.public_url}
                  primaryAlt={
                    content.imageAlts?.about ??
                    content.imageAlts?.hero ??
                    `${brand.name} about us`
                  }
                  secondaryAlt={
                    content.imageAlts?.["gallery-1"] ??
                    `${brand.name} project photo`
                  }
                  primaryWidth={primaryPhoto.width}
                  primaryHeight={primaryPhoto.height}
                  secondaryWidth={secondaryPhoto?.width}
                  secondaryHeight={secondaryPhoto?.height}
                />
              </div>
            ) : null}
            <div>
              <SectionEyebrow color={theme.accent}>
                {content.about.heading}
              </SectionEyebrow>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
                {brand.name}
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
          </div>
        </section>

        {content.whyUs?.length ? (
          <section className="border-t border-black/5 bg-[color:var(--site-surface)]">
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
              <div className="mx-auto max-w-2xl text-center">
                <SectionEyebrow color={theme.accent}>Why us</SectionEyebrow>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
                  Why homeowners choose us
                </h2>
              </div>
              <div className="mt-12 grid gap-10 md:grid-cols-3 lg:gap-8">
                {content.whyUs.map((item) => (
                  <article
                    key={item.title}
                    className="flex flex-col items-center rounded-[18px] border border-black/5 bg-white px-6 py-8 text-center shadow-[0_12px_28px_-24px_rgba(0,0,0,0.45)]"
                  >
                    <IconBadge
                      icon={resolveWhyUsIcon(item.title)}
                      color={theme.primary}
                    />
                    <h3 className="mt-5 text-lg font-bold tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[color:var(--site-muted)]">
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter brand={brand} content={content} theme={theme} />
    </div>
  );
}
