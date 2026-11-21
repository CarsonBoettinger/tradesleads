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
        <section className="border-b border-black/5 bg-[color:var(--site-surface)]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p
              className="text-sm font-bold uppercase tracking-[0.16em]"
              style={{ color: theme.accent }}
            >
              Service area
            </p>
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
          <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Services in {areaName}
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {content.services.slice(0, 6).map((service) => (
                <article
                  key={service.name}
                  className="rounded-[14px] border border-black/5 bg-white p-5"
                >
                  <h3 className="text-lg font-bold">{service.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--site-muted)]">
                    {service.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {otherAreas.length ? (
          <section className="border-t border-black/5 bg-[color:var(--site-surface)]">
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
              <h2 className="text-3xl font-extrabold tracking-tight">
                Other areas we serve
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {otherAreas.map((area) => (
                  <a
                    key={area.name}
                    href={siteHref(basePath, `/areas/${areaSlug(area.name)}`)}
                    className="rounded-[12px] border border-black/5 bg-white p-4 transition hover:border-black/15"
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
