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
import {
  resolveServiceIcon,
  resolveWhyUsIcon,
} from "@/components/sites/templates/trade-local-v1/icons";
import { SiteLocationHours } from "@/components/sites/templates/trade-local-v1/location-hours";
import {
  IconBadge,
  InitialsAvatar,
  OverlappingPhotos,
  SectionEyebrow,
  StarRating,
} from "@/components/sites/templates/trade-local-v1/ui";
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
  const photos = galleryAssets(assets);
  const aboutPrimary = photos[0] ?? heroImage;
  const aboutSecondary =
    photos.find((photo) => photo.id !== aboutPrimary?.id) ?? null;
  const servicesHeading = brand.town
    ? `Services in ${brand.town}`
    : "Core services";

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
          {heroImage?.public_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage.public_url}
              alt={content.imageAlts?.hero ?? `${brand.name} hero`}
              width={heroImage.width ?? 1920}
              height={heroImage.height ?? 1080}
              className="absolute inset-0 h-full w-full object-cover"
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

        <section
          id="services"
          className="relative border-t-4 bg-white"
          style={{ borderColor: theme.accent }}
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <SectionEyebrow color={theme.accent}>Our services</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
                {servicesHeading}
              </h2>
            </div>
            <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {content.services.map((service) => (
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

        <section
          id="about"
          className="border-y border-black/5 bg-[color:var(--site-surface)]"
        >
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 md:py-20">
            {aboutPrimary?.public_url ? (
              <div className="order-2 pb-8 lg:order-1 lg:pb-6">
                <OverlappingPhotos
                  primary={aboutPrimary.public_url}
                  secondary={aboutSecondary?.public_url}
                  primaryAlt={
                    content.imageAlts?.about ??
                    content.imageAlts?.hero ??
                    `${brand.name} project work`
                  }
                  secondaryAlt={
                    content.imageAlts?.["gallery-1"] ??
                    `${brand.name} completed project`
                  }
                  primaryWidth={aboutPrimary.width}
                  primaryHeight={aboutPrimary.height}
                  secondaryWidth={aboutSecondary?.width}
                  secondaryHeight={aboutSecondary?.height}
                />
              </div>
            ) : null}
            <div
              className={
                aboutPrimary?.public_url ? "order-1 lg:order-2" : undefined
              }
            >
              <SectionEyebrow color={theme.accent}>
                {content.about.heading}
              </SectionEyebrow>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
                {brand.name}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[color:var(--site-muted)]">
                {content.about.body.slice(0, 420)}
                {content.about.body.length > 420 ? "…" : ""}
              </p>
              <a
                href={siteHref(basePath, "/about")}
                className="mt-7 inline-flex rounded-[10px] px-5 py-3 text-sm font-bold text-white"
                style={{ background: theme.primary }}
              >
                Read our story
              </a>
            </div>
          </div>
        </section>

        {photos.length > 0 ? (
          <section id="gallery" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
            <div className="max-w-2xl">
              <SectionEyebrow color={theme.accent}>Gallery</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
                Project gallery
              </h2>
              <p className="mt-3 text-sm text-[color:var(--site-muted)]">
                Photos from {brand.name}
                {brand.town ? ` in and around ${brand.town}` : ""}.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.slice(0, 9).map((photo, index) => (
                <figure
                  key={photo.id}
                  className="overflow-hidden rounded-[16px] border border-black/5 bg-[color:var(--site-surface)]"
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
                    className="aspect-[4/3] w-full object-cover transition duration-500 hover:scale-[1.03]"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        <section
          id="why"
          className="border-y border-black/5 bg-[color:var(--site-surface)]"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <SectionEyebrow color={theme.accent}>Why us</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
                Why choose {brand.name}
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

        <section id="areas" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="max-w-2xl">
            <SectionEyebrow color={theme.accent}>Coverage</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
              Service areas
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.serviceAreas.map((area) => (
              <a
                key={area.name}
                href={siteHref(basePath, `/areas/${areaSlug(area.name)}`)}
                className="rounded-[14px] border border-black/5 bg-white p-5 transition hover:border-black/15 hover:shadow-sm"
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
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
              <div className="mx-auto max-w-2xl text-center">
                <SectionEyebrow color={theme.accent}>
                  Our reviews
                </SectionEyebrow>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
                  Words from our customers
                </h2>
              </div>
              <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {content.testimonials.map((item) => (
                  <blockquote
                    key={`${item.author}-${item.text.slice(0, 24)}`}
                    className="flex h-full flex-col rounded-[16px] border border-black/5 bg-white p-6 shadow-[0_12px_28px_-24px_rgba(0,0,0,0.4)]"
                  >
                    <div className="flex items-center gap-3">
                      <InitialsAvatar
                        name={item.author}
                        color={theme.secondary}
                      />
                      <StarRating rating={item.rating ?? 5} />
                    </div>
                    <p className="mt-5 flex-1 text-sm leading-relaxed text-[color:var(--site-muted)]">
                      “{item.text}”
                    </p>
                    <footer className="mt-5 border-t border-black/5 pt-4">
                      <cite className="not-italic text-sm font-bold">
                        {item.author}
                      </cite>
                      <p className="mt-0.5 text-xs text-[color:var(--site-muted)]">
                        Customer
                      </p>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section id="faq" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="max-w-3xl">
            <SectionEyebrow color={theme.accent}>FAQ</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
              Frequently asked questions
            </h2>
          </div>
          <dl className="mt-8 space-y-4">
            {content.faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-[14px] border border-black/5 bg-[color:var(--site-surface)] p-5"
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
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 md:py-20">
            <div>
              <SectionEyebrow color={theme.accent}>Contact</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
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
