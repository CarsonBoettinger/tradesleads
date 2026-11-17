import type { MetadataRoute } from "next";
import { siteDescriptor, siteName } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    description: siteDescriptor,
    start_url: "/",
    display: "standalone",
    background_color: "#F5F7FB",
    theme_color: "#162A4A",
    lang: "en-US",
    categories: ["business", "marketing"],
    icons: [
      {
        src: "/brand/kalvez-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/kalvez-icon-small.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
