import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { TradeLocalV1AreaPage } from "@/components/sites/templates/trade-local-v1/area-page";
import {
  areaPageCopy,
  findServiceArea,
} from "@/lib/sites/areas";
import {
  getBrandAssets,
  getBrandBySlug,
  getSiteConfig,
} from "@/lib/sites/brands";
import { getGeneratedSiteBasePath } from "@/lib/sites/paths";
import { brandSiteRobots } from "@/lib/sites/site-meta";
import type { SiteContent } from "@/lib/sites/types";

export const instant = false;

type Props = {
  params: Promise<{ slug: string; area: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, area } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return { title: "Service area" };
  const config = await getSiteConfig(brand.id);
  const match = findServiceArea(config?.content as SiteContent, area);
  if (!match) return { title: "Service area" };
  const copy = areaPageCopy({
    businessName: brand.name,
    trade: brand.trade,
    areaName: match.name,
    description: match.description,
    body: match.body,
    homeTown: brand.town,
  });
  return {
    title: copy.title,
    description: copy.description,
    robots: await brandSiteRobots(brand),
  };
}

export default async function GeneratedAreaPage({ params }: Props) {
  await connection();
  const { slug, area } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand || brand.status === "draft") notFound();

  const [config, assets, basePath] = await Promise.all([
    getSiteConfig(brand.id),
    getBrandAssets(brand.id),
    getGeneratedSiteBasePath(slug),
  ]);
  if (!config) notFound();

  const match = findServiceArea(config.content as SiteContent, area);
  if (!match) notFound();

  return (
    <TradeLocalV1AreaPage
      brand={brand}
      config={config}
      assets={assets}
      areaName={match.name}
      areaDescription={match.description}
      areaBody={match.body}
      basePath={basePath}
    />
  );
}
