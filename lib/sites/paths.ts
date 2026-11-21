import { headers } from "next/headers";

/** Base path for generated site links (empty on *.sites.* host, /sites/{slug} on path preview). */
export async function getGeneratedSiteBasePath(slug: string) {
  const headerStore = await headers();
  const hostSlug = headerStore.get("x-kalvez-site-slug");
  if (hostSlug) return "";
  return `/sites/${slug}`;
}

export function siteHref(basePath: string, href: string) {
  if (!href) return basePath || "/";
  if (href.startsWith("http")) return href;
  if (href.startsWith("#")) {
    return basePath ? `${basePath}${href}` : href;
  }
  if (href.startsWith("/#")) {
    return basePath ? `${basePath}${href.slice(1)}` : href;
  }
  if (href.startsWith("/")) {
    return `${basePath}${href}` || href;
  }
  return `${basePath}/${href}`;
}
