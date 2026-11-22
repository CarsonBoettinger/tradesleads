import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase";
import { dashboardUrl } from "@/lib/hosts";
import { sendClientInviteEmail } from "@/lib/sites/client-invite-email";
import { uniqueOpaqueSiteSlug } from "@/lib/sites/slug";
import type {
  Brand,
  BrandAsset,
  DomainStatus,
  GenerationJob,
  Profile,
  SiteConfig,
} from "@/lib/sites/types";

function normalizeBrand(row: Brand | null): Brand | null {
  if (!row) return null;
  return {
    ...row,
    custom_domain: row.custom_domain ?? null,
    custom_domain_www: row.custom_domain_www ?? true,
    domain_status: row.domain_status ?? "none",
    domain_error: row.domain_error ?? null,
    domain_verified_at: row.domain_verified_at ?? null,
    ssl_provisioned_at: row.ssl_provisioned_at ?? null,
  };
}

export async function listBrandsForProfile(profile: Profile): Promise<Brand[]> {
  const admin = getSupabaseAdmin();

  if (profile.role === "staff") {
    const { data, error } = await admin
      .from("brands")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return ((data ?? []) as Brand[])
      .map((row) => normalizeBrand(row))
      .filter((row): row is Brand => Boolean(row));
  }

  const { data: memberships, error: memberError } = await admin
    .from("brand_members")
    .select("brand_id")
    .eq("user_id", profile.id);
  if (memberError) throw memberError;

  const ids = (memberships ?? []).map((row) => row.brand_id as string);
  if (ids.length === 0) return [];

  const { data, error } = await admin
    .from("brands")
    .select("*")
    .in("id", ids)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as Brand[])
    .map((row) => normalizeBrand(row))
    .filter((row): row is Brand => Boolean(row));
}

export async function getBrandById(id: string): Promise<Brand | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("brands")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return normalizeBrand(data as Brand | null);
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return normalizeBrand(data as Brand | null);
}

export async function getBrandByCustomDomain(
  hostname: string,
): Promise<Brand | null> {
  const host = hostname.toLowerCase().replace(/:\d+$/, "").replace(/\.$/, "");
  if (!host) return null;

  const admin = getSupabaseAdmin();
  const withoutWww = host.startsWith("www.") ? host.slice(4) : host;
  const withWww = host.startsWith("www.") ? host : `www.${host}`;

  const { data, error } = await admin
    .from("brands")
    .select("*")
    .or(
      `custom_domain.eq."${withoutWww}",custom_domain.eq."${withWww}",custom_domain.eq."${host}"`,
    )
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return normalizeBrand(data as Brand | null);
}

export function brandDomainHosts(brand: Pick<Brand, "custom_domain" | "custom_domain_www">): string[] {
  const domain = brand.custom_domain?.trim().toLowerCase();
  if (!domain) return [];
  const apex = domain.replace(/^www\./, "");
  if (brand.custom_domain_www === false) return [apex];
  return [apex, `www.${apex}`];
}

export async function userCanAccessBrand(
  profile: Profile,
  brandId: string,
): Promise<boolean> {
  if (profile.role === "staff") return true;
  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("brand_members")
    .select("id")
    .eq("brand_id", brandId)
    .eq("user_id", profile.id)
    .maybeSingle();
  return Boolean(data);
}

export async function createBrandFromPlace(input: {
  name: string;
  placeId: string;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  trade?: string | null;
  createdBy: string;
}): Promise<Brand> {
  const admin = getSupabaseAdmin();
  const slug = await uniqueOpaqueSiteSlug(async (candidate) => {
    const { data } = await admin
      .from("brands")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    return Boolean(data);
  });

  const { data, error } = await admin
    .from("brands")
    .insert({
      name: input.name,
      slug,
      place_id: input.placeId,
      address: input.address ?? null,
      lat: input.lat ?? null,
      lng: input.lng ?? null,
      trade: input.trade ?? null,
      status: "draft",
      domain_status: "none",
      custom_domain_www: true,
      created_by: input.createdBy,
    })
    .select("*")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Could not create brand.");

  await admin.from("site_configs").insert({
    brand_id: data.id,
    template_id: "trade-local-v1",
    theme: {},
    content: {},
    seo: {},
    keywords: {},
    qa: {},
  });

  return normalizeBrand(data as Brand)!;
}

export async function getSiteConfig(brandId: string): Promise<SiteConfig | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("site_configs")
    .select("*")
    .eq("brand_id", brandId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    ...(data as SiteConfig),
    theme: (data.theme ?? {}) as SiteConfig["theme"],
    content: (data.content ?? {}) as SiteConfig["content"],
    seo: (data.seo ?? {}) as SiteConfig["seo"],
    keywords: (data.keywords ?? {}) as SiteConfig["keywords"],
    qa: (data.qa ?? {}) as SiteConfig["qa"],
  };
}

export async function getBrandProfile(brandId: string): Promise<{
  brand_id: string;
  place_id: string | null;
  payload: import("@/lib/sites/types").BrandProfilePayload;
  source_urls: string[];
  fetched_at: string | null;
} | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("brand_profiles")
    .select("brand_id, place_id, payload, source_urls, fetched_at")
    .eq("brand_id", brandId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    brand_id: data.brand_id as string,
    place_id: (data.place_id as string | null) ?? null,
    payload: (data.payload ?? {}) as import("@/lib/sites/types").BrandProfilePayload,
    source_urls: (data.source_urls as string[]) ?? [],
    fetched_at: (data.fetched_at as string | null) ?? null,
  };
}

export async function getBrandAssets(brandId: string): Promise<BrandAsset[]> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("brand_assets")
    .select("*")
    .eq("brand_id", brandId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as BrandAsset[];
}

export async function getLatestJob(brandId: string): Promise<GenerationJob | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("generation_jobs")
    .select("*")
    .eq("brand_id", brandId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as GenerationJob | null) ?? null;
}

export async function publishBrand(brandId: string) {
  const brand = await getBrandById(brandId);
  if (!brand) throw new Error("Brand not found.");
  if (!brand.custom_domain) {
    throw new Error("Set a custom domain before publishing.");
  }
  if (brand.domain_status !== "live") {
    throw new Error(
      "Custom domain must be live (DNS verified and SSL provisioned) before publishing.",
    );
  }
  if (brand.status !== "ready" && brand.status !== "published") {
    throw new Error("Website must be ready before publishing.");
  }

  const admin = getSupabaseAdmin();
  const now = new Date().toISOString();
  const { error: brandError } = await admin
    .from("brands")
    .update({ status: "published", updated_at: now })
    .eq("id", brandId);
  if (brandError) throw brandError;

  const { error: configError } = await admin
    .from("site_configs")
    .update({ published_at: now, updated_at: now })
    .eq("brand_id", brandId);
  if (configError) throw configError;
}

export async function updateBrandDomain(input: {
  brandId: string;
  customDomain: string | null;
  customDomainWww?: boolean;
  domainStatus?: DomainStatus;
  domainError?: string | null;
  domainVerifiedAt?: string | null;
  sslProvisionedAt?: string | null;
}) {
  const admin = getSupabaseAdmin();
  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.customDomain !== undefined) {
    patch.custom_domain = input.customDomain;
  }
  if (input.customDomainWww !== undefined) {
    patch.custom_domain_www = input.customDomainWww;
  }
  if (input.domainStatus !== undefined) {
    patch.domain_status = input.domainStatus;
  }
  if (input.domainError !== undefined) {
    patch.domain_error = input.domainError;
  }
  if (input.domainVerifiedAt !== undefined) {
    patch.domain_verified_at = input.domainVerifiedAt;
  }
  if (input.sslProvisionedAt !== undefined) {
    patch.ssl_provisioned_at = input.sslProvisionedAt;
  }

  const { data, error } = await admin
    .from("brands")
    .update(patch)
    .eq("id", input.brandId)
    .select("*")
    .single();
  if (error || !data) {
    throw new Error(error?.message ?? "Could not update domain.");
  }
  return normalizeBrand(data as Brand)!;
}

/** Staff-only hard delete: storage objects first, then brand (DB cascades). */
export async function deleteBrand(brandId: string) {
  const admin = getSupabaseAdmin();
  const assets = await getBrandAssets(brandId);
  const paths = assets
    .map((asset) => asset.storage_path)
    .filter((path): path is string => Boolean(path));

  if (paths.length > 0) {
    const { error: storageError } = await admin.storage
      .from("brand-assets")
      .remove(paths);
    if (storageError) {
      // Continue deleting the brand even if some files are already gone.
      console.warn("brand storage cleanup:", storageError.message);
    }
  }

  // Also clear any leftover folder objects under brandId/
  const { data: listed } = await admin.storage
    .from("brand-assets")
    .list(brandId, { limit: 100 });
  if (listed?.length) {
    await admin.storage
      .from("brand-assets")
      .remove(listed.map((file) => `${brandId}/${file.name}`));
  }

  const { error } = await admin.from("brands").delete().eq("id", brandId);
  if (error) throw error;
}

function generateTemporaryPassword() {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(14));
  let body = "";
  for (const byte of bytes) {
    body += alphabet[byte % alphabet.length];
  }
  // Guarantee complexity rules for common password policies.
  return `${body}Aa1!`;
}

export async function assignClientToBrand(input: {
  brandId: string;
  email: string;
  fullName?: string | null;
  memberRole?: "owner" | "viewer";
}) {
  const admin = getSupabaseAdmin();
  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName ?? email.split("@")[0];

  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  let userId = existingProfile?.id as string | undefined;
  let temporaryPassword: string | null = null;
  let created = false;
  let emailSent = false;
  let emailError: string | null = null;

  if (!userId) {
    temporaryPassword = generateTemporaryPassword();
    const loginRedirect = dashboardUrl("/dashboard/login");
    const userMetadata = {
      full_name: fullName,
      role: "client",
      temporary_password: temporaryPassword,
    };
    const hasResend = Boolean(process.env.RESEND_API_KEY?.trim());

    if (hasResend) {
      // Resend owns the password email; create the Auth user directly.
      const { data: createdUser, error: createError } =
        await admin.auth.admin.createUser({
          email,
          password: temporaryPassword,
          email_confirm: true,
          user_metadata: userMetadata,
          app_metadata: {
            must_change_password: true,
          },
        });

      if (createError || !createdUser.user) {
        throw new Error(
          createError?.message ?? "Could not create client user.",
        );
      }

      userId = createdUser.user.id;

      const brand = await getBrandById(input.brandId);
      const resend = await sendClientInviteEmail({
        email,
        fullName,
        temporaryPassword,
        brandName: brand?.name ?? null,
      });
      emailSent = resend.sent;
      emailError = resend.sent
        ? null
        : (resend.error ?? "Invite email failed.");
    } else {
      // Supabase Auth invite email (project SMTP / Auth templates).
      // Paste supabase/templates/invite.html into Auth → Email Templates →
      // Invite user so {{ .Data.temporary_password }} is included.
      const { data: invited, error: inviteError } =
        await admin.auth.admin.inviteUserByEmail(email, {
          data: userMetadata,
          redirectTo: loginRedirect,
        });

      if (inviteError || !invited.user) {
        const { data: createdUser, error: createError } =
          await admin.auth.admin.createUser({
            email,
            password: temporaryPassword,
            email_confirm: true,
            user_metadata: userMetadata,
            app_metadata: {
              must_change_password: true,
            },
          });

        if (createError || !createdUser.user) {
          throw new Error(
            inviteError?.message ??
              createError?.message ??
              "Could not create client user.",
          );
        }

        userId = createdUser.user.id;
        emailError =
          inviteError?.message ??
          "Supabase invite email was not sent; share the password manually.";
      } else {
        userId = invited.user.id;
        emailSent = true;

        const { error: updateError } = await admin.auth.admin.updateUserById(
          userId,
          {
            password: temporaryPassword,
            email_confirm: true,
            app_metadata: {
              must_change_password: true,
            },
            user_metadata: userMetadata,
          },
        );
        if (updateError) {
          throw new Error(updateError.message);
        }
      }
    }

    created = true;

    await admin.from("profiles").upsert({
      id: userId,
      email,
      full_name: fullName,
      role: "client",
      must_change_password: true,
      updated_at: new Date().toISOString(),
    });
  }

  const { error } = await admin.from("brand_members").upsert(
    {
      brand_id: input.brandId,
      user_id: userId,
      role: input.memberRole ?? "owner",
    },
    { onConflict: "brand_id,user_id" },
  );
  if (error) throw error;

  return {
    userId,
    email,
    created,
    temporaryPassword,
    emailSent,
    emailError,
  };
}

export async function listBrandMembers(brandId: string) {
  const admin = getSupabaseAdmin();
  const { data: members, error } = await admin
    .from("brand_members")
    .select("id, role, user_id, created_at")
    .eq("brand_id", brandId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const userIds = (members ?? []).map((m) => m.user_id as string);
  if (userIds.length === 0) return [];

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, email, full_name, role")
    .in("id", userIds);

  const byId = new Map((profiles ?? []).map((p) => [p.id as string, p]));
  return (members ?? []).map((m) => ({
    id: m.id as string,
    role: m.role as string,
    userId: m.user_id as string,
    createdAt: m.created_at as string,
    profile: byId.get(m.user_id as string) ?? null,
  }));
}
