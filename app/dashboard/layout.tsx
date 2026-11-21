import { connection } from "next/server";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireDashboardUser } from "@/lib/auth/profile";

// Auth + DB access — allow request-time rendering under Cache Components.
export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Stop prerender before cookies()/Date usage in auth + Supabase clients.
  await connection();

  const session = await requireDashboardUser().catch(() => null);

  if (!session) {
    return <div className="min-h-dvh bg-white text-cocoa">{children}</div>;
  }

  return (
    <DashboardShell
      email={session.profile.email}
      role={session.profile.role}
    >
      {children}
    </DashboardShell>
  );
}
