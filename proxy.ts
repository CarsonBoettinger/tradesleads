import { NextResponse, type NextRequest } from "next/server";
import {
  isDashboardHost,
  parseRequestHost,
  siteSlugFromHost,
} from "@/lib/hosts";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const hostname = parseRequestHost(request.headers.get("host"));
  const { pathname, search } = request.nextUrl;

  // Keep API / Next internals on their real paths for every host.
  const passthrough =
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/brand/");

  // Host → path rewrites for multi-tenant routing.
  const siteSlug = siteSlugFromHost(hostname);
  if (siteSlug && !passthrough) {
    const url = request.nextUrl.clone();
    const rest = pathname === "/" ? "" : pathname;
    url.pathname = `/sites/${siteSlug}${rest}`;
    const rewritten = NextResponse.rewrite(url);
    rewritten.headers.set("x-kalvez-site-slug", siteSlug);
    return rewritten;
  }

  // dashboard.kalvez.com/login → /dashboard/login (logical path for auth + app).
  let dashboardPath = pathname;
  let dashboardRewriteUrl: URL | null = null;
  if (
    isDashboardHost(hostname) &&
    !passthrough &&
    !pathname.startsWith("/dashboard")
  ) {
    dashboardPath = `/dashboard${pathname === "/" ? "" : pathname}`;
    dashboardRewriteUrl = request.nextUrl.clone();
    dashboardRewriteUrl.pathname = dashboardPath;
  }

  const isDashboardPath =
    dashboardPath.startsWith("/dashboard") || isDashboardHost(hostname);

  if (!isDashboardPath) {
    return NextResponse.next();
  }

  // Skip auth refresh for static assets under dashboard.
  if (dashboardPath.includes(".") && !dashboardPath.endsWith(".html")) {
    if (dashboardRewriteUrl) {
      return NextResponse.rewrite(dashboardRewriteUrl);
    }
    return NextResponse.next();
  }

  let sessionResult: Awaited<ReturnType<typeof updateSession>>;
  try {
    sessionResult = await updateSession(request, {
      rewriteTo: dashboardRewriteUrl ?? undefined,
    });
  } catch {
    // Missing anon key in local env — still allow login page to show error.
    if (
      dashboardPath === "/dashboard/login" ||
      dashboardPath.endsWith("/dashboard/login")
    ) {
      if (dashboardRewriteUrl) {
        return NextResponse.rewrite(dashboardRewriteUrl);
      }
      return NextResponse.next();
    }
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/dashboard/login";
    loginUrl.search = `?next=${encodeURIComponent(dashboardPath + search)}`;
    return NextResponse.redirect(loginUrl);
  }

  const { response, user } = sessionResult;
  const isLogin =
    dashboardPath === "/dashboard/login" ||
    dashboardPath.endsWith("/dashboard/login");
  const isChangePassword =
    dashboardPath === "/dashboard/change-password" ||
    dashboardPath.endsWith("/dashboard/change-password");
  const mustChangePassword = Boolean(
    user?.app_metadata?.must_change_password,
  );

  if (!user && !isLogin) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/dashboard/login";
    loginUrl.search = `?next=${encodeURIComponent(dashboardPath + search)}`;
    return NextResponse.redirect(loginUrl);
  }

  if (user && isLogin) {
    const dest = request.nextUrl.clone();
    dest.pathname = mustChangePassword
      ? "/dashboard/change-password"
      : "/dashboard";
    dest.search = "";
    return NextResponse.redirect(dest);
  }

  if (user && mustChangePassword && !isChangePassword) {
    const changeUrl = request.nextUrl.clone();
    changeUrl.pathname = "/dashboard/change-password";
    changeUrl.search = "";
    return NextResponse.redirect(changeUrl);
  }

  if (user && !mustChangePassword && isChangePassword) {
    const home = request.nextUrl.clone();
    home.pathname = "/dashboard";
    home.search = "";
    return NextResponse.redirect(home);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
