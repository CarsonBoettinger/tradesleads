import { slugifyBrandName } from "@/lib/sites/slug";
import type { SiteContent } from "@/lib/sites/types";

export function areaSlug(name: string) {
  return slugifyBrandName(name);
}

export function findServiceArea(
  content: SiteContent | null | undefined,
  areaParam: string,
) {
  const areas = content?.serviceAreas ?? [];
  const needle = areaParam.toLowerCase();
  return (
    areas.find((area) => areaSlug(area.name) === needle) ??
    areas.find((area) => area.name.toLowerCase() === needle) ??
    null
  );
}

export function areaPageCopy(input: {
  businessName: string;
  trade: string | null;
  areaName: string;
  description?: string;
  body?: string;
  homeTown?: string | null;
}) {
  const trade = (input.trade ?? "local service").toLowerCase();
  const body =
    input.body?.trim() ||
    `${input.businessName} provides ${trade} service in ${input.areaName}${
      input.homeTown && input.homeTown !== input.areaName
        ? `, working from ${input.homeTown} and nearby communities`
        : ""
    }. ${
      input.description?.trim() ||
      `Homeowners and businesses in ${input.areaName} get clear scopes, practical recommendations, and work that is finished the way it was quoted.`
    } Call or request a quote to talk through timing, access, and next steps for your job in ${input.areaName}.`;

  return {
    h1: `${input.trade ?? "Service"} in ${input.areaName}`,
    subhead: `${input.businessName} serves ${input.areaName} with reliable ${trade} work.`,
    body,
    title: `${input.trade ?? "Service"} in ${input.areaName} | ${input.businessName}`.slice(
      0,
      70,
    ),
    description: body.slice(0, 160),
  };
}
