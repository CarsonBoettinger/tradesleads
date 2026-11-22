/**
 * Edge/proxy-safe brand slug lookup by custom domain.
 * Uses Supabase REST so proxy does not import the Node admin client.
 */

type CacheEntry = { slug: string | null; expires: number };

const cache = new Map<string, CacheEntry>();
const TTL_MS = 60_000;

function cacheKey(hostname: string) {
  return hostname.toLowerCase().replace(/^www\./, "");
}

export async function lookupSlugByCustomDomain(
  hostname: string,
): Promise<string | null> {
  const key = cacheKey(hostname);
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.slug;

  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const anon =
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const apiKey = serviceRole || anon;
  if (!url || !apiKey) {
    cache.set(key, { slug: null, expires: Date.now() + 5_000 });
    return null;
  }

  const apex = key;
  const endpoint = new URL(`${url.replace(/\/$/, "")}/rest/v1/brands`);
  endpoint.searchParams.set("select", "slug,custom_domain,custom_domain_www");
  // Quote values so dots in hostnames are not treated as PostgREST operators.
  endpoint.searchParams.set(
    "or",
    `(custom_domain.eq."${apex}",custom_domain.eq."www.${apex}")`,
  );
  endpoint.searchParams.set("limit", "1");

  try {
    const response = await fetch(endpoint.toString(), {
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      // Avoid Next data cache sticking stale domain maps forever.
      cache: "no-store",
    });
    if (!response.ok) {
      cache.set(key, { slug: null, expires: Date.now() + 5_000 });
      return null;
    }
    const rows = (await response.json()) as Array<{
      slug: string;
      custom_domain: string | null;
      custom_domain_www: boolean | null;
    }>;
    const row = rows[0];
    const slug = row?.slug ?? null;
    cache.set(key, { slug, expires: Date.now() + TTL_MS });
    return slug;
  } catch {
    cache.set(key, { slug: null, expires: Date.now() + 5_000 });
    return null;
  }
}

export function invalidateDomainLookupCache(hostname?: string) {
  if (!hostname) {
    cache.clear();
    return;
  }
  cache.delete(cacheKey(hostname));
}
