import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { BrandDetail } from "@/components/dashboard/brand-detail";
import { requireDashboardUser } from "@/lib/auth/profile";
import {
  getBrandAssets,
  getBrandById,
  getBrandProfile,
  getLatestJob,
  getSiteConfig,
  listBrandMembers,
  userCanAccessBrand,
} from "@/lib/sites/brands";
import type { SiteConfig } from "@/lib/sites/types";

export const instant = false;

type Props = { params: Promise<{ id: string }> };

export default async function BrandDetailPage({ params }: Props) {
  await connection();
  const session = await requireDashboardUser();
  if (!session) redirect("/dashboard/login");

  const { id } = await params;
  const allowed = await userCanAccessBrand(session.profile, id);
  if (!allowed) notFound();

  const [brand, config, assets, job, members, profile] = await Promise.all([
    getBrandById(id),
    getSiteConfig(id),
    getBrandAssets(id),
    getLatestJob(id),
    session.profile.role === "staff"
      ? listBrandMembers(id)
      : Promise.resolve([]),
    getBrandProfile(id),
  ]);

  if (!brand) notFound();

  return (
    <BrandDetail
      brandId={brand.id}
      initialBrand={brand}
      initialConfig={config as SiteConfig | null}
      initialAssets={assets}
      initialJob={job}
      initialMembers={members}
      initialHours={profile?.payload?.hours}
      role={session.profile.role}
      userEmail={session.profile.email}
    />
  );
}
