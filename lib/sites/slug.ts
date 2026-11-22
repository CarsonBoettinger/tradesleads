import { randomBytes } from "node:crypto";

/** Crockford base32 (no I/L/O/U) — URL-safe opaque tokens. */
const OPAQUE_ALPHABET = "0123456789abcdefghjkmnpqrstvwxyz";

export function slugifyBrandName(value: string) {
  const base = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return base || "business";
}

/** Random unguessable site slug for previews (e.g. `p7k2m9n4qx3w`). */
export function createOpaqueSiteSlug(length = 12): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += OPAQUE_ALPHABET[bytes[i]! % OPAQUE_ALPHABET.length];
  }
  return out;
}

export async function uniqueOpaqueSiteSlug(
  exists: (slug: string) => Promise<boolean>,
  length = 12,
) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const candidate = createOpaqueSiteSlug(length);
    if (!(await exists(candidate))) return candidate;
  }
  // Extremely unlikely collision path.
  return createOpaqueSiteSlug(length + 4);
}

/** @deprecated Prefer uniqueOpaqueSiteSlug for public preview URLs. */
export async function uniqueBrandSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>,
) {
  const root = slugifyBrandName(base);
  if (!(await exists(root))) return root;

  for (let i = 2; i < 50; i += 1) {
    const candidate = `${root}-${i}`;
    if (!(await exists(candidate))) return candidate;
  }

  return `${root}-${Date.now().toString(36)}`;
}
