import "server-only";
import { resolve4, resolveCname } from "node:dns/promises";

type NetlifySite = {
  id: string;
  name?: string;
  custom_domain?: string | null;
  domain_aliases?: string[];
  ssl_url?: string | null;
  url?: string | null;
};

function netlifyConfig() {
  const token = process.env.NETLIFY_AUTH_TOKEN?.trim();
  const siteId = process.env.NETLIFY_SITE_ID?.trim();
  if (!token || !siteId) {
    throw new Error(
      "NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID are required for domain automation.",
    );
  }
  return { token, siteId };
}

async function netlifyFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const { token } = netlifyConfig();
  const response = await fetch(`https://api.netlify.com/api/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Netlify API ${response.status}: ${text || response.statusText}`,
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function normalizeCustomDomain(raw: string): string {
  let value = raw.trim().toLowerCase();
  value = value.replace(/^https?:\/\//, "");
  value = value.split("/")[0] ?? value;
  value = value.replace(/:\d+$/, "");
  value = value.replace(/\.$/, "");
  value = value.replace(/^www\./, "");
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(value)) {
    throw new Error("Enter a valid domain like example.com");
  }
  return value;
}

export function domainAliasesForBrand(input: {
  customDomain: string;
  includeWww?: boolean;
}): string[] {
  const apex = normalizeCustomDomain(input.customDomain);
  if (input.includeWww === false) return [apex];
  return [apex, `www.${apex}`];
}

/** Netlify load balancer host clients should CNAME to (or ALIAS/ANAME at apex). */
export function netlifyDnsTarget(): string {
  const explicit = process.env.NETLIFY_DNS_TARGET?.trim();
  if (explicit) return explicit;
  const siteName = process.env.NETLIFY_SITE_NAME?.trim();
  if (siteName) return `${siteName}.netlify.app`;
  return "kalvez.netlify.app";
}

export async function getNetlifySite(): Promise<NetlifySite> {
  const { siteId } = netlifyConfig();
  return netlifyFetch<NetlifySite>(`/sites/${siteId}`);
}

export async function addDomainAliases(aliases: string[]): Promise<NetlifySite> {
  const { siteId } = netlifyConfig();
  const site = await getNetlifySite();
  const existing = new Set(
    (site.domain_aliases ?? []).map((d) => d.toLowerCase()),
  );
  if (site.custom_domain) {
    existing.add(site.custom_domain.toLowerCase());
  }

  const next = [...(site.domain_aliases ?? [])];
  for (const alias of aliases) {
    const normalized = alias.toLowerCase();
    if (existing.has(normalized)) continue;
    // Never overwrite the primary marketing domain.
    if (site.custom_domain?.toLowerCase() === normalized) continue;
    next.push(normalized);
    existing.add(normalized);
  }

  return netlifyFetch<NetlifySite>(`/sites/${siteId}`, {
    method: "PATCH",
    body: JSON.stringify({ domain_aliases: next }),
  });
}

export async function removeDomainAliases(aliases: string[]): Promise<NetlifySite> {
  const { siteId } = netlifyConfig();
  const site = await getNetlifySite();
  const remove = new Set(aliases.map((d) => d.toLowerCase()));
  const next = (site.domain_aliases ?? []).filter(
    (alias) => !remove.has(alias.toLowerCase()),
  );
  return netlifyFetch<NetlifySite>(`/sites/${siteId}`, {
    method: "PATCH",
    body: JSON.stringify({ domain_aliases: next }),
  });
}

export async function provisionSiteSsl(): Promise<unknown> {
  const { siteId } = netlifyConfig();
  return netlifyFetch(`/sites/${siteId}/ssl`, { method: "POST" });
}

export type DnsCheckResult = {
  hostname: string;
  ok: boolean;
  records: string[];
  expected: string;
  detail: string;
};

async function resolveHostRecords(hostname: string): Promise<string[]> {
  const records: string[] = [];
  try {
    const cnames = await resolveCname(hostname);
    records.push(...cnames.map((c) => c.toLowerCase().replace(/\.$/, "")));
  } catch {
    // no CNAME
  }
  try {
    const a = await resolve4(hostname);
    records.push(...a);
  } catch {
    // no A
  }
  return records;
}

/**
 * Verify DNS points at Netlify. Accepts CNAME to *.netlify.app or A records
 * that match Netlify's load balancer IPs when CNAME is flattened.
 */
export async function checkDomainDns(hostnames: string[]): Promise<{
  ok: boolean;
  results: DnsCheckResult[];
}> {
  const expected = netlifyDnsTarget().toLowerCase().replace(/\.$/, "");
  const results: DnsCheckResult[] = [];

  for (const hostname of hostnames) {
    const records = await resolveHostRecords(hostname);
    const pointsToNetlifyApp = records.some(
      (r) =>
        r === expected ||
        r.endsWith(".netlify.app") ||
        r.endsWith(".netlify.com"),
    );
    // Netlify anycast / load balancer — accept common documented IPs as soft pass
    // when apex uses A records (ALIAS providers vary).
    const netlifyA = new Set(["75.2.60.5", "99.83.190.102"]);
    const pointsToNetlifyA = records.some((r) => netlifyA.has(r));
    const ok = pointsToNetlifyApp || pointsToNetlifyA;

    results.push({
      hostname,
      ok,
      records,
      expected,
      detail: ok
        ? `DNS points to Netlify (${records.join(", ") || "ok"}).`
        : records.length
          ? `Found ${records.join(", ")}; expected CNAME/ALIAS to ${expected}.`
          : `No DNS records found. Create a CNAME (or ALIAS/ANAME at apex) to ${expected}.`,
    });
  }

  return {
    ok: results.length > 0 && results.every((r) => r.ok),
    results,
  };
}

export function dnsInstructions(hostnames: string[]) {
  const target = netlifyDnsTarget();
  return hostnames.map((hostname) => {
    const isApex = hostname.split(".").length === 2;
    return {
      hostname,
      type: isApex ? "ALIAS / ANAME / A" : "CNAME",
      value: isApex
        ? `${target} (or Netlify A records if your DNS host has no ALIAS)`
        : target,
      note: isApex
        ? "Many registrars need ALIAS/ANAME at the apex. Otherwise use www as primary and redirect apex."
        : `Point ${hostname} to ${target}.`,
    };
  });
}
