import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { TradeLocalV1AboutPage } from "@/components/sites/templates/trade-local-v1/about-page";
import {
  getBrandAssets,
  getBrandBySlug,
  getSiteConfig,
} from "@/lib/sites/brands";
import { getGeneratedSiteBasePath } from "@/lib/sites/paths";
import { brandSiteRobots } from "@/lib/sites/site-meta";

export const instant = false;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return { title: "About Us" };
  return {
    title: `About Us | ${brand.name}`,
    description: `Learn more about ${brand.name}${brand.town ? ` in ${brand.town}` : ""}.`,
    robots: await brandSiteRobots(brand),
  };
}

export default async function GeneratedAboutPage({ params }: Props) {
  await connection();
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand || brand.status === "draft") notFound();

  const [config, assets, basePath] = await Promise.all([
    getSiteConfig(brand.id),
    getBrandAssets(brand.id),
    getGeneratedSiteBasePath(slug),
  ]);
  if (!config) notFound();

  return (
    <TradeLocalV1AboutPage
      brand={brand}
      config={config}
      assets={assets}
      basePath={basePath}
    />
  );
}
