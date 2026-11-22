import Link from "next/link";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { BrandList } from "@/components/dashboard/brand-list";
import { requireDashboardUser } from "@/lib/auth/profile";
import { listBrandsForProfile } from "@/lib/sites/brands";

export const instant = false;

export default async function DashboardHomePage() {
  await connection();
  const session = await requireDashboardUser().catch(() => null);
  if (!session) redirect("/dashboard/login");

  const brands = await listBrandsForProfile(session.profile);
  const isStaff = session.profile.role === "staff";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Brands</h1>
          <p className="mt-2 text-muted">
            {isStaff
              ? "Search Google Business Profiles, generate sites, and assign clients."
              : "Websites assigned to your account."}
          </p>
        </div>
        {isStaff ? (
          <Link
            href="/dashboard/brands/new"
            className="rounded-[10px] bg-foreman px-4 py-2.5 text-sm font-bold text-white"
          >
            Add Business
          </Link>
        ) : null}
      </div>

      <BrandList brands={brands} isStaff={isStaff} />
    </div>
  );
}
