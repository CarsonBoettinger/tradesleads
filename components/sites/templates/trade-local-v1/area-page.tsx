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
import { resolveServiceIcon } from "@/components/sites/templates/trade-local-v1/icons";
import {
  IconBadge,
  SectionEyebrow,
} from "@/components/sites/templates/trade-local-v1/ui";
import { areaPageCopy, areaSlug } from "@/lib/sites/areas";
import { siteHref } from "@/lib/sites/paths";
import { ensureMinimumServices } from "@/lib/sites/services";

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

export function TradeLocalV1AreaPage({
  brand,
  config,
  assets,
  areaName,
  areaDescription,
  areaBody,
  basePath = "",
}: {
  brand: Brand;
  config: SiteConfig;
  assets: BrandAsset[];
  areaName: string;
  areaDescription?: string;
  areaBody?: string;
  basePath?: string;
}) {
  const rawContent = config.content as SiteContent;
  const content: SiteContent = {
    ...rawContent,
    services: ensureMinimumServices(rawContent?.services, {
      trade: brand.trade,
      town: brand.town,
    }),
  };
  const theme = config.theme as SiteTheme;
  const logo =
    assets.find((a) => a.kind === "logo" && a.public_url) ??
    assets.find((a) => a.kind === "logo") ??
    null;
  const copy = areaPageCopy({
    businessName: brand.name,
    trade: brand.trade,
    areaName,
    description: areaDescription,
    body: areaBody,
    homeTown: brand.town,
  });

  const otherAreas = (content.serviceAreas ?? []).filter(
    (area) => area.name !== areaName,
  );

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
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
            <SectionEyebrow color={theme.accent}>Service area</SectionEyebrow>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight">
              {copy.h1}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[color:var(--site-muted)]">
              {copy.subhead}
            </p>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-[color:var(--site-muted)]">
              {copy.body}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={siteHref(basePath, "/#contact")}
                className="rounded-[10px] px-5 py-3 text-sm font-bold text-white"
                style={{ background: theme.accent }}
              >
                Request a Quote
              </a>
              {brand.phone ? (
                <a
                  href={`tel:${brand.phone.replace(/[^\d+]/g, "")}`}
                  className="rounded-[10px] border-2 px-5 py-3 text-sm font-bold"
                  style={{ borderColor: theme.primary, color: theme.primary }}
                >
                  Call {brand.phone}
                </a>
              ) : null}
            </div>
          </div>
        </section>

        {content.services?.length ? (
          <section
            className="relative border-t-4 bg-[color:var(--site-surface)]"
            style={{ borderColor: theme.accent }}
          >
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
              <div className="mx-auto max-w-2xl text-center">
                <SectionEyebrow color={theme.accent}>
                  Our services
                </SectionEyebrow>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
                  Services in {areaName}
                </h2>
              </div>
              <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {content.services.slice(0, 6).map((service) => (
                  <article
                    key={service.name}
                    className="flex flex-col items-center text-center"
                  >
                    <IconBadge
                      icon={resolveServiceIcon(service.name)}
                      color={theme.accent}
                      size="lg"
                    />
                    <h3 className="mt-5 text-lg font-bold tracking-tight">
                      {service.name}
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-[color:var(--site-muted)]">
                      {service.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {otherAreas.length ? (
          <section className="border-t border-black/5 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
              <div className="max-w-2xl">
                <SectionEyebrow color={theme.accent}>Coverage</SectionEyebrow>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
                  Other areas we serve
                </h2>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {otherAreas.map((area) => (
                  <a
                    key={area.name}
                    href={siteHref(basePath, `/areas/${areaSlug(area.name)}`)}
                    className="rounded-[14px] border border-black/5 bg-[color:var(--site-surface)] p-5 transition hover:border-black/15 hover:shadow-sm"
                  >
                    <h3 className="font-bold">{area.name}</h3>
                    <p className="mt-2 text-sm text-[color:var(--site-muted)]">
                      {area.description}
                    </p>
                  </a>
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
