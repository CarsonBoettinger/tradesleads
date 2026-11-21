import { renderOgImage, ogContentType, ogSize } from "@/lib/og";
import { defaultTitle, siteDescriptor, siteSlogan } from "@/lib/seo";

export const alt = defaultTitle;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    title: siteSlogan,
    description: siteDescriptor,
  });
}
