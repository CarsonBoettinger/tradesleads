import { requireDashboardUser } from "@/lib/auth/profile";
import {
  deleteBrand,
  getBrandAssets,
  getBrandById,
  getBrandProfile,
  getLatestJob,
  getSiteConfig,
  listBrandMembers,
  publishBrand,
  userCanAccessBrand,
} from "@/lib/sites/brands";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  enforceRateLimit,
  readJsonBody,
  rejectCrossOrigin,
} from "@/lib/http-guard";
import { normalizeHex, themeFromPrimary } from "@/lib/sites/color-theory";
import { siteContentSchema, siteSeoSchema } from "@/lib/sites/content-schema";
import { parseHoursTextarea } from "@/lib/sites/hours";
import type { SiteTheme } from "@/lib/sites/types";

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

  const [brand, config, assets, job, members, profile] = await Promise.all([
    getBrandById(id),
    getSiteConfig(id),
    getBrandAssets(id),
    getLatestJob(id),
    session.profile.role === "staff" ? listBrandMembers(id) : Promise.resolve([]),
    getBrandProfile(id),
  ]);

  if (!brand) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  return Response.json({
    brand,
    config,
    assets,
    job,
    members,
    profile,
    hours: profile?.payload?.hours ?? [],
    socialLinks: profile?.payload?.socialLinks ?? [],
    role: session.profile.role,
  });
}

export async function PATCH(request: Request, context: Ctx) {
  const crossOrigin = await rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const session = await requireDashboardUser();
  if (!session) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const allowed = await userCanAccessBrand(session.profile, id);
  if (!allowed) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  const limited = await enforceRateLimit({
    request,
    key: "dashboard-brand-patch",
    limit: 40,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const parsedBody = await readJsonBody(request, 64_000);
  if (!parsedBody.ok) return parsedBody.response;
  const raw = (parsedBody.body ?? {}) as Record<string, unknown>;
  const admin = getSupabaseAdmin();

  if (raw.action === "publish") {
    if (session.profile.role !== "staff") {
      return Response.json({ error: "Staff only." }, { status: 403 });
    }
    try {
      await publishBrand(id);
      return Response.json({ ok: true });
    } catch (error) {
      return Response.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Could not publish brand.",
        },
        { status: 400 },
      );
    }
  }

  if (raw.content || raw.seo) {
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (raw.content) {
      const parsed = siteContentSchema.safeParse(raw.content);
      if (!parsed.success) {
        return Response.json(
          { error: "Invalid content payload." },
          { status: 400 },
        );
      }
      updates.content = parsed.data;
    }
    if (raw.seo) {
      const parsed = siteSeoSchema.safeParse(raw.seo);
      if (!parsed.success) {
        return Response.json({ error: "Invalid SEO payload." }, { status: 400 });
      }
      updates.seo = parsed.data;
    }
    const { error } = await admin
      .from("site_configs")
      .update(updates)
      .eq("brand_id", id);
    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  if (raw.brand && session.profile.role === "staff") {
    const brandPatch = raw.brand as Record<string, unknown>;
    const allowedFields = ["phone", "email", "website", "address", "town"] as const;
    const patch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    for (const key of allowedFields) {
      if (typeof brandPatch[key] === "string") {
        patch[key] = (brandPatch[key] as string).trim().slice(0, 240);
      }
    }
    await admin.from("brands").update(patch).eq("id", id);
  } else if (raw.brand) {
    // Clients can update contact and location fields
    const brandPatch = raw.brand as Record<string, unknown>;
    const patch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    for (const key of ["phone", "email", "address", "town"] as const) {
      if (typeof brandPatch[key] === "string") {
        patch[key] = (brandPatch[key] as string).trim().slice(0, 240);
      }
    }
    await admin.from("brands").update(patch).eq("id", id);
  }

  if (typeof raw.hoursText === "string") {
    const hours = parseHoursTextarea(raw.hoursText);
    const existing = await getBrandProfile(id);
    const payload = {
      ...(existing?.payload ?? {}),
      hours,
    };
    const { error } = await admin.from("brand_profiles").upsert(
      {
        brand_id: id,
        place_id: existing?.place_id ?? null,
        payload,
        source_urls: existing?.source_urls ?? [],
        fetched_at: existing?.fetched_at ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "brand_id" },
    );
    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  if (raw.theme && typeof raw.theme === "object") {
    const themePatch = raw.theme as Record<string, unknown>;
    const { data: existingConfig, error: configError } = await admin
      .from("site_configs")
      .select("theme")
      .eq("brand_id", id)
      .maybeSingle();
    if (configError) {
      return Response.json({ error: configError.message }, { status: 500 });
    }

    const current = (existingConfig?.theme ?? {}) as Partial<SiteTheme>;
    const primary =
      normalizeHex(
        typeof themePatch.primary === "string" ? themePatch.primary : "",
      ) ??
      normalizeHex(current.primary ?? "") ??
      "#162a4a";

    // Rebuild neutrals from primary, then allow explicit secondary/accent overrides.
    const rebuilt = themeFromPrimary(primary, current.fontFamily ?? null);
    const secondary =
      normalizeHex(
        typeof themePatch.secondary === "string" ? themePatch.secondary : "",
      ) ?? rebuilt.secondary;
    const accent =
      normalizeHex(
        typeof themePatch.accent === "string" ? themePatch.accent : "",
      ) ?? rebuilt.accent;

    const nextTheme: SiteTheme = {
      ...rebuilt,
      ...current,
      primary,
      secondary,
      accent,
      background:
        normalizeHex(
          typeof themePatch.background === "string"
            ? themePatch.background
            : "",
        ) ??
        rebuilt.background,
      surface:
        normalizeHex(
          typeof themePatch.surface === "string" ? themePatch.surface : "",
        ) ??
        current.surface ??
        rebuilt.surface,
      text:
        normalizeHex(
          typeof themePatch.text === "string" ? themePatch.text : "",
        ) ?? rebuilt.text,
      muted:
        normalizeHex(
          typeof themePatch.muted === "string" ? themePatch.muted : "",
        ) ?? rebuilt.muted,
      fontFamily: current.fontFamily ?? rebuilt.fontFamily,
    };

    const { error: themeError } = await admin
      .from("site_configs")
      .update({
        theme: nextTheme,
        updated_at: new Date().toISOString(),
      })
      .eq("brand_id", id);
    if (themeError) {
      return Response.json({ error: themeError.message }, { status: 500 });
    }

    return Response.json({ ok: true, theme: nextTheme });
  }

  return Response.json({ ok: true });
}

export async function DELETE(request: Request, context: Ctx) {
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
    key: "dashboard-brand-delete",
    limit: 20,
    windowMs: 60_000,
  });
  if (limited) return limited;

  try {
    await deleteBrand(id);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Could not delete brand.",
      },
      { status: 500 },
    );
  }
}
