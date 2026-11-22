import type { Brand, SiteTheme } from "@/lib/sites/types";
import type { OpeningHoursLine } from "@/lib/sites/hours";
import { googleMapsEmbedUrl } from "@/lib/sites/maps";

export function SiteLocationHours({
  brand,
  theme,
  hours,
}: {
  brand: Brand;
  theme: SiteTheme;
  hours: OpeningHoursLine[];
}) {
  const mapSrc = googleMapsEmbedUrl({
    lat: brand.lat,
    lng: brand.lng,
    address: brand.address,
    mapsUri: brand.maps_uri,
    name: brand.name,
  });

  if (!mapSrc && hours.length === 0 && !brand.address) return null;

  return (
    <section
      id="location"
      className="border-t border-black/5 bg-[color:var(--site-surface)]"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight">
          Location & hours
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-[color:var(--site-muted)]">
          Find {brand.name}
          {brand.town ? ` in ${brand.town}` : ""} and check when we are open.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="overflow-hidden rounded-[16px] border border-black/5 bg-white">
            {mapSrc ? (
              <iframe
                title={`${brand.name} on Google Maps`}
                src={mapSrc}
                className="h-[320px] w-full border-0 lg:h-full lg:min-h-[320px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="flex h-[320px] items-center justify-center px-6 text-sm text-[color:var(--site-muted)]">
                Map unavailable
              </div>
            )}
          </div>

          <div className="rounded-[16px] border border-black/5 bg-white p-6">
            {brand.address ? (
              <div>
                <p
                  className="text-sm font-bold uppercase tracking-[0.14em]"
                  style={{ color: theme.accent }}
                >
                  Address
                </p>
                <p className="mt-2 text-base font-semibold leading-relaxed">
                  {brand.address}
                </p>
                {brand.maps_uri ? (
                  <a
                    href={brand.maps_uri}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-sm font-bold underline underline-offset-4"
                    style={{ color: theme.primary }}
                  >
                    Open in Google Maps
                  </a>
                ) : null}
              </div>
            ) : null}

            {hours.length > 0 ? (
              <div className={brand.address ? "mt-8" : undefined}>
                <p
                  className="text-sm font-bold uppercase tracking-[0.14em]"
                  style={{ color: theme.accent }}
                >
                  Operating hours
                </p>
                <dl className="mt-4 space-y-2.5">
                  {hours.map((row) => (
                    <div
                      key={`${row.label}-${row.value}`}
                      className="flex items-baseline justify-between gap-4 border-b border-black/5 pb-2 text-sm last:border-0"
                    >
                      <dt className="font-semibold">{row.label}</dt>
                      <dd className="text-right text-[color:var(--site-muted)]">
                        {row.value || "-"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <p className="mt-6 text-sm text-[color:var(--site-muted)]">
                Hours are not listed yet. Call
                {brand.phone ? ` ${brand.phone}` : " us"} to confirm availability.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
