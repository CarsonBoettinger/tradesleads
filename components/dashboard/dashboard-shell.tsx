"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardShell({
  email,
  role,
  children,
}: {
  email: string | null;
  role: "staff" | "client";
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isBrandWorkspace =
    /^\/dashboard\/brands\/[^/]+$/.test(pathname) &&
    !pathname.endsWith("/new");

  if (isBrandWorkspace) {
    return <div className="min-h-dvh bg-[#f3f6fb] text-cocoa">{children}</div>;
  }

  return (
    <div className="min-h-dvh bg-[#f3f6fb] text-cocoa">
      <header className="border-b border-peach bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-lg font-extrabold tracking-tight"
            >
              Kalvez <span className="text-foreman">Dashboard</span>
            </Link>
            <nav className="hidden gap-4 text-sm font-semibold text-muted sm:flex">
              <Link href="/dashboard" className="hover:text-cocoa">
                Brands
              </Link>
              {role === "staff" ? (
                <Link href="/dashboard/brands/new" className="hover:text-cocoa">
                  Add Business
                </Link>
              ) : null}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted sm:inline">
              {email} · {role}
            </span>
            <form action="/api/dashboard/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-[10px] border-2 border-peach px-3 py-1.5 font-semibold hover:border-foreman"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
