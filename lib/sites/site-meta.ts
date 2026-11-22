import { headers } from "next/headers";
import {
  brandCanonicalUrl,
  brandSiteIsIndexable,
} from "@/lib/hosts";
import type { Brand } from "@/lib/sites/types";

export async function getSiteRequestMode(): Promise<"preview" | "custom" | "path"> {
  const headerStore = await headers();
  const mode = headerStore.get("x-kalvez-site-mode");
  if (mode === "custom") return "custom";
  if (mode === "preview") return "preview";
  return "path";
}

export async function brandSiteRobots(brand: Brand) {
  const mode = await getSiteRequestMode();
  const indexable = brandSiteIsIndexable(brand, {
    onCustomDomain: mode === "custom",
  });
  return indexable
    ? { index: true, follow: true }
    : { index: false, follow: false };
}

export function brandSiteCanonical(brand: Brand) {
  return brandCanonicalUrl(brand);
}
