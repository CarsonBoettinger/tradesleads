import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { TradeLocalV1Site } from "@/components/sites/templates/trade-local-v1/site";
import { JsonLd } from "@/components/json-ld";
import {
  getBrandAssets,
  getBrandBySlug,
  getBrandProfile,
  getSiteConfig,
} from "@/lib/sites/brands";
import { brandPreviewUrl } from "@/lib/hosts";
import { normalizeOpeningHours } from "@/lib/sites/hours";
import { getGeneratedSiteBasePath } from "@/lib/sites/paths";

export const instant = false;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return { title: "Site not found" };
  const config = await getSiteConfig(brand.id);
  const title = config?.seo?.title || brand.name;
  const description =
    config?.seo?.description || `${brand.name} local service website`;

  return {
    title,
    description,
    robots:
      brand.status === "published"
        ? { index: true, follow: true }
        : { index: false, follow: false },
    openGraph: {
      title: config?.seo?.ogTitle || title,
      description: config?.seo?.ogDescription || description,
      url: brandPreviewUrl(slug),
    },
  };
}

export default async function GeneratedSitePage({ params }: Props) {
  await connection();
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  // Preview allowed for ready/published/generating; draft without config 404s soft
  if (brand.status === "draft") {
    notFound();
  }

  const [config, assets, profile, basePath] = await Promise.all([
    getSiteConfig(brand.id),
    getBrandAssets(brand.id),
    getBrandProfile(brand.id),
    getGeneratedSiteBasePath(slug),
  ]);

  if (!config) notFound();

  const hours = normalizeOpeningHours(profile?.payload?.hours);
  const openingHoursSpecification = hours
    .filter((row) => row.value && !/closed/i.test(row.value))
    .map((row) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: row.label,
      description: row.value,
    }));

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: brand.name,
    telephone: brand.phone ?? undefined,
    url: brandPreviewUrl(brand.slug),
    address: brand.address
      ? {
          "@type": "PostalAddress",
          streetAddress: brand.address,
        }
      : undefined,
    geo:
      brand.lat != null && brand.lng != null
        ? {
            "@type": "GeoCoordinates",
            latitude: brand.lat,
            longitude: brand.lng,
          }
        : undefined,
    openingHoursSpecification: openingHoursSpecification.length
      ? openingHoursSpecification
      : undefined,
  };

  return (
    <>
      <JsonLd data={localBusiness} />
      <TradeLocalV1Site
        brand={brand}
        config={config}
        assets={assets}
        hours={hours}
        basePath={basePath}
      />
    </>
  );
}
