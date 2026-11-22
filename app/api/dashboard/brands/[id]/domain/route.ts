import { requireDashboardUser } from "@/lib/auth/profile";
import {
  brandDomainHosts,
  getBrandById,
  updateBrandDomain,
  userCanAccessBrand,
} from "@/lib/sites/brands";
import { invalidateDomainLookupCache } from "@/lib/sites/domain-lookup";
import {
  addDomainAliases,
  checkDomainDns,
  dnsInstructions,
  domainAliasesForBrand,
  normalizeCustomDomain,
  provisionSiteSsl,
  removeDomainAliases,
} from "@/lib/sites/netlify-domains";
import {
  enforceRateLimit,
  readJsonBody,
  rejectCrossOrigin,
} from "@/lib/http-guard";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const session = await requireDashboardUser();
  if (!session) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const allowed = await userCanAccessBrand(session.profile, id);
  if (!allowed) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  const brand = await getBrandById(id);
  if (!brand) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  const hosts = brandDomainHosts(brand);
  return Response.json({
    brand: {
      custom_domain: brand.custom_domain,
      custom_domain_www: brand.custom_domain_www,
      domain_status: brand.domain_status,
      domain_error: brand.domain_error,
      domain_verified_at: brand.domain_verified_at,
      ssl_provisioned_at: brand.ssl_provisioned_at,
      status: brand.status,
    },
    hosts,
    dns: hosts.length ? dnsInstructions(hosts) : [],
  });
}

export async function POST(request: Request, context: Ctx) {
  const crossOrigin = await rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const session = await requireDashboardUser();
  if (!session) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (session.profile.role !== "staff") {
    return Response.json({ error: "Staff only." }, { status: 403 });
  }

  const { id } = await context.params;
  const brand = await getBrandById(id);
  if (!brand) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  const limited = await enforceRateLimit({
    request,
    key: "dashboard-brand-domain",
    limit: 30,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const parsedBody = await readJsonBody(request, 8_000);
  if (!parsedBody.ok) return parsedBody.response;
  const raw = (parsedBody.body ?? {}) as Record<string, unknown>;
  const action = typeof raw.action === "string" ? raw.action : "save";

  try {
    if (action === "save") {
      const domainRaw =
        typeof raw.customDomain === "string" ? raw.customDomain : "";
      const includeWww =
        typeof raw.customDomainWww === "boolean"
          ? raw.customDomainWww
          : brand.custom_domain_www !== false;

      if (!domainRaw.trim()) {
        // Clear domain
        if (brand.custom_domain) {
          try {
            await removeDomainAliases(brandDomainHosts(brand));
          } catch {
            // Netlify cleanup is best-effort when clearing.
          }
          invalidateDomainLookupCache(brand.custom_domain);
        }
        const updated = await updateBrandDomain({
          brandId: id,
          customDomain: null,
          customDomainWww: true,
          domainStatus: "none",
          domainError: null,
          domainVerifiedAt: null,
          sslProvisionedAt: null,
        });
        return Response.json({ ok: true, brand: updated, dns: [] });
      }

      const apex = normalizeCustomDomain(domainRaw);
      const aliases = domainAliasesForBrand({
        customDomain: apex,
        includeWww,
      });

      // Remove previous aliases if domain changed.
      if (
        brand.custom_domain &&
        brand.custom_domain.replace(/^www\./, "") !== apex
      ) {
        try {
          await removeDomainAliases(brandDomainHosts(brand));
        } catch {
          // ignore
        }
        invalidateDomainLookupCache(brand.custom_domain);
      }

      await addDomainAliases(aliases);
      const updated = await updateBrandDomain({
        brandId: id,
        customDomain: apex,
        customDomainWww: includeWww,
        domainStatus: "pending_dns",
        domainError: null,
        domainVerifiedAt: null,
        sslProvisionedAt: null,
      });
      invalidateDomainLookupCache(apex);

      return Response.json({
        ok: true,
        brand: updated,
        hosts: aliases,
        dns: dnsInstructions(aliases),
      });
    }

    if (action === "verify") {
      if (!brand.custom_domain) {
        return Response.json(
          { error: "Set a custom domain first." },
          { status: 400 },
        );
      }
      const hosts = brandDomainHosts(brand);
      const check = await checkDomainDns(hosts);
      if (!check.ok) {
        const updated = await updateBrandDomain({
          brandId: id,
          customDomain: brand.custom_domain,
          domainStatus: "pending_dns",
          domainError: check.results.map((r) => r.detail).join(" "),
        });
        return Response.json({
          ok: false,
          brand: updated,
          check,
          dns: dnsInstructions(hosts),
        });
      }

      const updated = await updateBrandDomain({
        brandId: id,
        customDomain: brand.custom_domain,
        domainStatus: "pending_ssl",
        domainError: null,
        domainVerifiedAt: new Date().toISOString(),
      });
      return Response.json({
        ok: true,
        brand: updated,
        check,
        dns: dnsInstructions(hosts),
      });
    }

    if (action === "ssl") {
      if (!brand.custom_domain) {
        return Response.json(
          { error: "Set a custom domain first." },
          { status: 400 },
        );
      }
      if (
        brand.domain_status !== "pending_ssl" &&
        brand.domain_status !== "live" &&
        brand.domain_status !== "pending_dns"
      ) {
        return Response.json(
          { error: "Verify DNS before provisioning SSL." },
          { status: 400 },
        );
      }

      // Re-check DNS before SSL.
      const hosts = brandDomainHosts(brand);
      const check = await checkDomainDns(hosts);
      if (!check.ok) {
        const updated = await updateBrandDomain({
          brandId: id,
          customDomain: brand.custom_domain,
          domainStatus: "pending_dns",
          domainError: check.results.map((r) => r.detail).join(" "),
        });
        return Response.json(
          {
            ok: false,
            error: "DNS is not ready for SSL yet.",
            brand: updated,
            check,
          },
          { status: 400 },
        );
      }

      try {
        await provisionSiteSsl();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "SSL provisioning failed.";
        // Netlify often auto-provisions; treat "already" style errors as soft success.
        const softOk = /already|exist|certificate/i.test(message);
        if (!softOk) {
          const updated = await updateBrandDomain({
            brandId: id,
            customDomain: brand.custom_domain,
            domainStatus: "error",
            domainError: message,
          });
          return Response.json(
            { ok: false, error: message, brand: updated },
            { status: 502 },
          );
        }
      }

      const updated = await updateBrandDomain({
        brandId: id,
        customDomain: brand.custom_domain,
        domainStatus: "live",
        domainError: null,
        domainVerifiedAt: brand.domain_verified_at ?? new Date().toISOString(),
        sslProvisionedAt: new Date().toISOString(),
      });
      invalidateDomainLookupCache(brand.custom_domain);

      return Response.json({ ok: true, brand: updated });
    }

    return Response.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Domain update failed.";
    try {
      await updateBrandDomain({
        brandId: id,
        customDomain: brand.custom_domain,
        domainStatus: "error",
        domainError: message,
      });
    } catch {
      // ignore secondary failure
    }
    return Response.json({ error: message }, { status: 500 });
  }
}
