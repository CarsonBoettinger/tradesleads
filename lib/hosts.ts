import { getSiteUrl } from "@/lib/site";

export function getDashboardHost() {
  return (
    process.env.NEXT_PUBLIC_DASHBOARD_HOST?.trim() ||
    defaultSubdomainHost("dashboard")
  );
}

export function getSitesRootHost() {
  return (
    process.env.NEXT_PUBLIC_SITES_ROOT_HOST?.trim() ||
    defaultSubdomainHost("sites")
  );
}

function defaultSubdomainHost(label: string) {
  try {
    const site = new URL(getSiteUrl());
    const hostname = site.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return `${label}.localhost`;
    }
    // kalvez.com → dashboard.kalvez.com / sites.kalvez.com
    return `${label}.${hostname.replace(/^www\./, "")}`;
  } catch {
    return `${label}.kalvez.com`;
  }
}

export function parseRequestHost(hostHeader: string | null) {
  const raw = (hostHeader ?? "").split(",")[0]?.trim() ?? "";
  const withoutPort = raw.replace(/:\d+$/, "");
  return withoutPort.toLowerCase();
}

export function isDashboardHost(hostname: string) {
  const expected = getDashboardHost().toLowerCase().replace(/:\d+$/, "");
  return hostname === expected || hostname.startsWith("dashboard.");
}

/** Returns site slug when host is {slug}.sites.* */
export function siteSlugFromHost(hostname: string): string | null {
  const sitesRoot = getSitesRootHost().toLowerCase().replace(/:\d+$/, "");
  if (hostname === sitesRoot) return null;

  const suffix = `.${sitesRoot}`;
  if (hostname.endsWith(suffix)) {
    const slug = hostname.slice(0, -suffix.length);
    if (slug && !slug.includes(".")) return slug;
  }

  const match = hostname.match(/^([a-z0-9-]+)\.sites\./i);
  return match?.[1]?.toLowerCase() ?? null;
}

export function brandPreviewUrl(slug: string) {
  const sitesRoot = getSitesRootHost();
  const siteUrl = getSiteUrl();
  try {
    const parsed = new URL(siteUrl);
    // Local/dev: path-based preview works without wildcard DNS/hosts.
    if (
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      process.env.NODE_ENV !== "production"
    ) {
      return `${parsed.origin}/sites/${slug}`;
    }
    const protocol = parsed.protocol;
    const port = parsed.port ? `:${parsed.port}` : "";
    return `${protocol}//${slug}.${sitesRoot}${port}`;
  } catch {
    return `https://${slug}.${sitesRoot}`;
  }
}

export function dashboardUrl(path = "/") {
  const host = getDashboardHost();
  const siteUrl = getSiteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  try {
    const parsed = new URL(siteUrl);
    const protocol = parsed.protocol;
    const port = parsed.port ? `:${parsed.port}` : "";
    return `${protocol}//${host}${port}${normalized === "/" ? "" : normalized}`;
  } catch {
    return `https://${host}${normalized === "/" ? "" : normalized}`;
  }
}
