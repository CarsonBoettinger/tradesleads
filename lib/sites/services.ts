import {
  isReportTrade,
  servicePhrasesForTrade,
} from "@/lib/report/keywords";
import type { SiteContent } from "@/lib/sites/types";

export const MIN_SITE_SERVICES = 3;

const WEAK_SERVICE_NAMES = new Set([
  "service",
  "services",
  "home services",
  "point of interest",
  "establishment",
  "store",
  "premise",
  "local business",
]);

function titleCase(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase()).trim();
}

export function isWeakServiceName(name: string) {
  const normalized = name.toLowerCase().replace(/\s+/g, " ").trim();
  if (!normalized || normalized.length < 3) return true;
  if (WEAK_SERVICE_NAMES.has(normalized)) return true;
  return /^(general\s+)?service$/i.test(normalized);
}

function defaultServiceNames(trade: string | null | undefined): string[] {
  const cleaned = trade?.trim() || "Home services";
  if (isReportTrade(cleaned)) {
    return servicePhrasesForTrade(cleaned).filter(
      (phrase) => !isWeakServiceName(phrase),
    );
  }
  return [
    `${cleaned} repair`,
    `${cleaned} installation`,
    `Emergency ${cleaned}`,
    `${cleaned} maintenance`,
    `${cleaned} inspection`,
  ];
}

function serviceDescription(name: string, place: string) {
  return `Professional ${name.toLowerCase()} for homes and businesses around ${place}. We explain options clearly and finish the job the way we quoted.`;
}

/**
 * Keep existing services, drop vague names, and pad to at least 3 so the
 * services grid always looks full.
 */
export function ensureMinimumServices(
  services: SiteContent["services"] | null | undefined,
  input: {
    trade?: string | null;
    town?: string | null;
    fillerNames?: string[];
  },
): SiteContent["services"] {
  const place = input.town?.trim() || "the local area";
  const seen = new Set<string>();
  const result: SiteContent["services"] = [];

  for (const service of services ?? []) {
    if (isWeakServiceName(service.name)) continue;
    const key = service.name.toLowerCase().replace(/\s+/g, " ").trim();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({
      ...service,
      name: titleCase(service.name),
      description:
        service.description?.trim() || serviceDescription(service.name, place),
    });
  }

  const fillers = [
    ...(input.fillerNames ?? []),
    ...defaultServiceNames(input.trade),
  ];

  for (const raw of fillers) {
    if (result.length >= MIN_SITE_SERVICES) break;
    const name = raw
      .replace(new RegExp(`\\s+${place.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"), "")
      .replace(/\s+/g, " ")
      .trim();
    if (isWeakServiceName(name)) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({
      name: titleCase(name),
      description: serviceDescription(name, place),
      keyword: name,
    });
  }

  let fallbackIndex = 1;
  while (result.length < MIN_SITE_SERVICES) {
    const trade = input.trade?.trim() || "Trade";
    const name = `${trade} Service ${fallbackIndex}`;
    fallbackIndex += 1;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({
      name: titleCase(name),
      description: serviceDescription(name, place),
      keyword: name,
    });
  }

  return result.slice(0, 8);
}
