import { getSiteUrl } from "@/lib/site";
import type { Brand } from "@/lib/sites/types";

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

export function isMarketingHost(hostname: string) {
  try {
    const site = new URL(getSiteUrl()).hostname.toLowerCase().replace(/^www\./, "");
    const host = hostname.toLowerCase().replace(/^www\./, "");
    if (host === site) return true;
  } catch {
    // ignore
  }
  const sitesRoot = getSitesRootHost().toLowerCase().replace(/:\d+$/, "");
  if (hostname === sitesRoot) return true;
  if (hostname === "localhost" || hostname === "127.0.0.1") return true;
  if (hostname.endsWith(".netlify.app")) return true;
  return false;
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

/** Canonical public URL: custom domain when live+published, else opaque preview. */
export function brandCanonicalUrl(
  brand: Pick<
    Brand,
    "slug" | "status" | "custom_domain" | "custom_domain_www" | "domain_status"
  >,
) {
  if (
    brand.status === "published" &&
    brand.domain_status === "live" &&
    brand.custom_domain
  ) {
    const apex = brand.custom_domain.replace(/^www\./, "");
    const host =
      brand.custom_domain_www === false ? apex : `www.${apex}`;
    return `https://${host}`;
  }
  return brandPreviewUrl(brand.slug);
}

export function brandSiteIsIndexable(
  brand: Pick<Brand, "status" | "domain_status" | "custom_domain">,
  opts: { onCustomDomain: boolean },
) {
  return (
    opts.onCustomDomain &&
    brand.status === "published" &&
    brand.domain_status === "live" &&
    Boolean(brand.custom_domain)
  );
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
