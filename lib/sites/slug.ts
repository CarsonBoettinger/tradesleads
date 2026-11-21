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
