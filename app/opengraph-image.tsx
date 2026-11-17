import { renderOgImage, ogContentType, ogSize } from "@/lib/og";
import { siteDescriptor } from "@/lib/seo";

export const alt = "Kalvez - Built to get you found";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    title: "Built to get you found.",
    description: siteDescriptor,
  });
}
