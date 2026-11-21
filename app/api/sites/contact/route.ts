import {
  enforceKeyedRateLimit,
  enforceRateLimit,
  readJsonBody,
  rejectCrossOrigin,
} from "@/lib/http-guard";
import { getBrandById, getBrandBySlug } from "@/lib/sites/brands";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { getSupabaseAdmin } from "@/lib/supabase";
import { parseEmail, parsePhone } from "@/lib/contact";

export async function POST(request: Request) {
  const crossOrigin = rejectCrossOrigin(request, { requireOrigin: true });
  if (crossOrigin) return crossOrigin;

  const limited = await enforceRateLimit({
    request,
    key: "site-contact",
    limit: 5,
    windowMs: 60_000,
    message: "Too many messages. Try again shortly.",
  });
  if (limited) return limited;

  const parsedBody = await readJsonBody(request, 8_192);
  if (!parsedBody.ok) return parsedBody.response;

  const raw = (parsedBody.body ?? {}) as Record<string, unknown>;
  // Honeypot
  if (typeof raw.website === "string" && raw.website.trim()) {
    return Response.json({ ok: true });
  }

  const turnstile = await verifyTurnstile({
    token: raw.turnstileToken,
    request,
  });
  if (!turnstile.ok) return turnstile.response;

  const brandId = typeof raw.brandId === "string" ? raw.brandId : "";
  const brandSlug = typeof raw.brandSlug === "string" ? raw.brandSlug : "";
  const name = typeof raw.name === "string" ? raw.name.trim().slice(0, 120) : "";
  const emailRaw = typeof raw.email === "string" ? raw.email : "";
  const phoneRaw = typeof raw.phone === "string" ? raw.phone : "";
  const details =
    typeof raw.details === "string" ? raw.details.trim().slice(0, 2000) : "";

  const emailParsed = parseEmail(emailRaw);
  const phoneParsed = phoneRaw ? parsePhone(phoneRaw) : null;

  if (!name || !emailParsed.ok || !details) {
    return Response.json(
      { error: "Name, email, and details are required." },
      { status: 400 },
    );
  }
  const email = emailParsed.email;
  const phone =
    phoneParsed && phoneParsed.ok ? phoneParsed.phone : null;

  const emailLimited = await enforceKeyedRateLimit({
    key: `site-contact-email:${email}`,
    limit: 10,
    windowMs: 60 * 60_000,
    message: "Too many messages from this email. Try again later.",
  });
  if (emailLimited) return emailLimited;

  const brand =
    (brandId ? await getBrandById(brandId) : null) ??
    (brandSlug ? await getBrandBySlug(brandSlug) : null);

  if (!brand || (brand.status !== "published" && brand.status !== "ready")) {
    return Response.json({ error: "Site not available." }, { status: 404 });
  }

  const [firstName, ...rest] = name.split(/\s+/);
  const lastName = rest.join(" ") || "-";

  try {
    const admin = getSupabaseAdmin();
    await admin.from("leads").insert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phone || "",
      business: brand.name,
      town: brand.town ?? "",
      trade: brand.trade ?? "",
      comments: details,
      consent: true,
      source: `site:${brand.slug}`,
      tags: ["generated_site"],
      direction: "inbound",
      channel: "manual",
      place_id: brand.place_id,
      status: "new",
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Site contact failed:", error);
    return Response.json(
      { error: "Could not save your message." },
      { status: 500 },
    );
  }
}
