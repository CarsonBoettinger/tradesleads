import type {
  Brand,
  BrandAsset,
  SiteConfig,
  SiteContent,
  SiteTheme,
} from "@/lib/sites/types";
import { SiteContactForm } from "@/components/sites/templates/trade-local-v1/contact-form";
import {
  SiteFooter,
  SiteHeader,
} from "@/components/sites/templates/trade-local-v1/chrome";
import { SiteLocationHours } from "@/components/sites/templates/trade-local-v1/location-hours";
import { areaSlug } from "@/lib/sites/areas";
import type { OpeningHoursLine } from "@/lib/sites/hours";
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

function primaryAsset(assets: BrandAsset[], kind: BrandAsset["kind"]) {
  return (
    assets.find((a) => a.kind === kind && a.public_url) ??
    assets.find((a) => a.kind === kind) ??
    null
  );
}

function galleryAssets(assets: BrandAsset[]) {
  return assets.filter(
    (a) =>
      a.public_url &&
      (a.kind === "gallery" || a.kind === "hero" || a.kind === "og"),
  );
}

export function TradeLocalV1Site({
  brand,
  config,
  assets,
  hours = [],
  basePath = "",
}: {
  brand: Brand;
  config: SiteConfig;
  assets: BrandAsset[];
  hours?: OpeningHoursLine[];
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
  const logo = primaryAsset(assets, "logo");
  const heroImage =
    primaryAsset(assets, "hero") ?? primaryAsset(assets, "gallery");
  const heroVideo =
    assets.find(
      (a) =>
        a.public_url &&
        (a.kind === "hero_video" ||
          (a.kind === "other" &&
            /hero.?video|video\/mp4/i.test(
              `${a.usage_notes ?? ""} ${a.attribution ?? ""}`,
            ))),
    ) ?? null;
  const photos = galleryAssets(assets);

  if (!content?.hero) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold">{brand.name}</h1>
        <p className="mt-3 text-slate-600">
          This website is still being generated.
        </p>
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

      <main id="top">
        <section className="relative min-h-[70vh] overflow-hidden md:min-h-[78vh]">
          {heroVideo?.public_url ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={heroImage?.public_url ?? undefined}
              aria-label={content.imageAlts?.hero ?? `${brand.name} hero video`}
            >
              <source src={heroVideo.public_url} type="video/mp4" />
            </video>
          ) : heroImage?.public_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage.public_url}
              alt={content.imageAlts?.hero ?? `${brand.name} hero`}
              width={heroImage.width ?? 1920}
              height={heroImage.height ?? 1080}
              className="absolute inset-0 h-full w-full origin-center object-cover motion-safe:animate-[site-kenburns_28s_ease-in-out_infinite_alternate]"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          ) : (
            <div className="absolute inset-0 bg-slate-800" />
          )}
          {/* Neutral dark overlay only - never brand-red over photos */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/35" />
          <div className="relative mx-auto flex max-w-6xl flex-col justify-end px-4 py-16 sm:px-6 md:min-h-[78vh] md:py-24">
            <div className="max-w-2xl text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                {brand.trade}
                {brand.town ? ` · ${brand.town}` : ""}
              </p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                {content.hero.h1}
              </h1>
              <p className="mt-5 text-lg text-white/92">
                {content.hero.subhead}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={siteHref(basePath, content.hero.ctaHref || "/#contact")}
                  className="rounded-[10px] px-5 py-3 text-sm font-bold text-white"
                  style={{ background: theme.accent }}
                >
                  {content.hero.ctaLabel}
                </a>
                {brand.phone ? (
                  <a
                    href={`tel:${brand.phone.replace(/[^\d+]/g, "")}`}
                    className="rounded-[10px] border border-white/55 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm"
                  >
                    Call {brand.phone}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Core services
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {content.services.map((service) => (
              <article
                key={service.name}
                className="rounded-[14px] border border-black/5 bg-[color:var(--site-surface)] p-5 shadow-sm"
              >
                <h3 className="text-lg font-bold">{service.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--site-muted)]">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="about"
          className="border-y border-black/5 bg-[color:var(--site-surface)]"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p
              className="text-sm font-bold uppercase tracking-[0.16em]"
              style={{ color: theme.accent }}
            >
              About Us
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
              {content.about.heading}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[color:var(--site-muted)]">
              {content.about.body.slice(0, 280)}
              {content.about.body.length > 280 ? "…" : ""}
            </p>
            <a
              href={siteHref(basePath, "/about")}
              className="mt-6 inline-flex rounded-[10px] px-5 py-3 text-sm font-bold text-white"
              style={{ background: theme.primary }}
            >
              Read our story
            </a>
          </div>
        </section>

        {photos.length > 0 ? (
          <section id="gallery" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Project gallery
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-[color:var(--site-muted)]">
              Photos from {brand.name}
              {brand.town ? ` in and around ${brand.town}` : ""}.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.slice(0, 9).map((photo, index) => (
                <figure
                  key={photo.id}
                  className="overflow-hidden rounded-[14px] border border-black/5 bg-[color:var(--site-surface)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.public_url!}
                    alt={
                      content.imageAlts?.[`gallery-${index}`] ??
                      content.imageAlts?.hero ??
                      `${brand.name} project photo ${index + 1}`
                    }
                    width={photo.width ?? 1200}
                    height={photo.height ?? 900}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        <section id="why" className="border-y border-black/5 bg-[color:var(--site-surface)]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Why choose {brand.name}
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
          </div>
        </section>

        <section id="areas" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Service areas
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.serviceAreas.map((area) => (
              <a
                key={area.name}
                href={siteHref(basePath, `/areas/${areaSlug(area.name)}`)}
                className="rounded-[12px] border border-black/5 p-4 transition hover:border-black/15"
              >
                <h3 className="font-bold">{area.name}</h3>
                <p className="mt-2 text-sm text-[color:var(--site-muted)]">
                  {area.description}
                </p>
                <span
                  className="mt-3 inline-flex text-sm font-bold"
                  style={{ color: theme.primary }}
                >
                  View {area.name} page
                </span>
              </a>
            ))}
          </div>
        </section>

        {content.testimonials?.length ? (
          <section
            id="reviews"
            className="border-y border-black/5 bg-[color:var(--site-surface)]"
          >
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
              <h2 className="text-3xl font-extrabold tracking-tight">
                What customers say
              </h2>
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {content.testimonials.map((item) => (
                  <blockquote
                    key={`${item.author}-${item.text.slice(0, 24)}`}
                    className="rounded-[14px] border border-black/5 bg-white p-5"
                  >
                    <p className="text-sm leading-relaxed text-[color:var(--site-muted)]">
                      “{item.text}”
                    </p>
                    <footer className="mt-4 text-sm font-bold">
                      {item.author}
                      {item.rating ? ` · ${item.rating}/5` : ""}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section id="faq" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-3xl">
            <p
              className="text-sm font-bold uppercase tracking-[0.16em]"
              style={{ color: theme.accent }}
            >
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
              Frequently asked questions
            </h2>
          </div>
          <dl className="mt-8 space-y-4">
            {content.faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-[12px] border border-black/5 bg-[color:var(--site-surface)] p-5"
              >
                <dt className="font-bold">{faq.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[color:var(--site-muted)]">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          id="contact"
          className="border-t border-black/5 bg-[color:var(--site-surface)]"
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                {content.contact.heading}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[color:var(--site-muted)]">
                {content.contact.body}
              </p>
              {brand.phone ? (
                <a
                  href={`tel:${brand.phone.replace(/[^\d+]/g, "")}`}
                  className="mt-6 inline-flex rounded-[10px] px-5 py-3 text-sm font-bold text-white"
                  style={{ background: "var(--site-secondary)" }}
                >
                  Call {brand.phone}
                </a>
              ) : null}
            </div>
            <SiteContactForm
              brandId={brand.id}
              brandSlug={brand.slug}
              ctaLabel={content.contact.formCta}
              accent={theme.accent}
            />
          </div>
        </section>

        <SiteLocationHours brand={brand} theme={theme} hours={hours} />
      </main>

      <SiteFooter brand={brand} content={content} theme={theme} />
    </div>
  );
}
