/** Remove em/en dashes and normalize copy for client sites. */
export function stripEmDashes(value: string): string {
  return value
    .replace(/(\d)\u2014(\d)/g, "$1-$2") // phone-style em dash
    .replace(/(\d)\u2013(\d)/g, "$1-$2") // phone-style en dash
    .replace(/\u2014/g, ",") // em dash —
    .replace(/\u2013/g, "-") // en dash –
    .replace(/(\d)--(\d)/g, "$1-$2")
    .replace(/--+/g, ",")
    .replace(/\s*,\s*,+/g, ",")
    .replace(/\s+([,.!?])/g, "$1")
    .replace(/,\s*\./g, ".")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function scrubSiteCopy<T>(value: T): T {
  if (typeof value === "string") {
    return stripEmDashes(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => scrubSiteCopy(item)) as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      out[key] = scrubSiteCopy(nested);
    }
    return out as T;
  }
  return value;
}
