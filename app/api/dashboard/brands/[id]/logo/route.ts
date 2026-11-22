import { requireDashboardUser } from "@/lib/auth/profile";
import { getBrandAssets, userCanAccessBrand } from "@/lib/sites/brands";
import { themeFromPrimary } from "@/lib/sites/color-theory";
import { optimizeImageBuffer } from "@/lib/sites/image-process";
import { getSupabaseAdmin } from "@/lib/supabase";
import { enforceRateLimit, rejectCrossOrigin } from "@/lib/http-guard";

type Ctx = { params: Promise<{ id: string }> };

export const maxDuration = 60;

export async function POST(request: Request, context: Ctx) {
  const crossOrigin = await rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const session = await requireDashboardUser();
  if (!session) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id: brandId } = await context.params;
  const allowed = await userCanAccessBrand(session.profile, brandId);
  if (!allowed) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  const limited = await enforceRateLimit({
    request,
    key: "dashboard-logo-upload",
    limit: 12,
    windowMs: 60 * 60_000,
    message: "Too many logo uploads.",
  });
  if (limited) return limited;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = form.get("logo");
  if (!(file instanceof File) || file.size < 1) {
    return Response.json({ error: "logo file is required." }, { status: 400 });
  }
  if (file.size > 8_000_000) {
    return Response.json({ error: "Logo must be under 8MB." }, { status: 400 });
  }

  const type = file.type || "";
  if (type && !type.startsWith("image/")) {
    return Response.json(
      { error: "Upload an image file (PNG, JPG, WebP, or SVG)." },
      { status: 400 },
    );
  }

  const applyColors = form.get("applyColors") === "true";
  const buffer = Buffer.from(await file.arrayBuffer());
  const optimized = await optimizeImageBuffer({
    buffer,
    kind: "logo",
  });
  if (!optimized) {
    return Response.json(
      { error: "Could not process that image. Try a PNG or JPG logo." },
      { status: 400 },
    );
  }

  const admin = getSupabaseAdmin();
  const path = `${brandId}/logo-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${optimized.extension}`;

  const { error: uploadError } = await admin.storage
    .from("brand-assets")
    .upload(path, optimized.buffer, {
      contentType: optimized.contentType,
      upsert: false,
    });
  if (uploadError) {
    return Response.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicData } = admin.storage
    .from("brand-assets")
    .getPublicUrl(path);

  // Demote previous primary logos
  await admin
    .from("brand_assets")
    .update({ is_primary: false })
    .eq("brand_id", brandId)
    .eq("kind", "logo");

  const { data: asset, error: insertError } = await admin
    .from("brand_assets")
    .insert({
      brand_id: brandId,
      kind: "logo",
      storage_path: path,
      public_url: publicData.publicUrl,
      source_url: null,
      attribution: "Uploaded in dashboard",
      usage_notes: `Manual logo upload ${optimized.width}x${optimized.height}`,
      width: optimized.width,
      height: optimized.height,
      is_primary: true,
      sort_order: 0,
    })
    .select("*")
    .single();

  if (insertError || !asset) {
    return Response.json(
      { error: insertError?.message ?? "Could not save logo." },
      { status: 500 },
    );
  }

  let theme = null;
  if (applyColors && optimized.dominantColors[0]) {
    const { data: config } = await admin
      .from("site_configs")
      .select("theme")
      .eq("brand_id", brandId)
      .maybeSingle();

    const existing = (config?.theme ?? {}) as Record<string, unknown>;
    const next = {
      ...themeFromPrimary(optimized.dominantColors[0]),
      fontFamily:
        typeof existing.fontFamily === "string"
          ? existing.fontFamily
          : undefined,
    };

    const { error: themeError } = await admin
      .from("site_configs")
      .update({
        theme: next,
        updated_at: new Date().toISOString(),
      })
      .eq("brand_id", brandId);

    if (!themeError) theme = next;
  }

  const assets = await getBrandAssets(brandId);
  return Response.json({
    ok: true,
    asset,
    assets,
    theme,
    suggestedColors: optimized.dominantColors,
  });
}
