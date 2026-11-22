import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { getServiceBySlug } from "@/lib/services";

export const alt = "Kalvez service page";
export const size = ogSize;
export const contentType = ogContentType;

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  return renderOgImage({
    eyebrow: service ? `Kalvez · ${service.name}` : "Kalvez",
    title: service?.headline ?? "What we do for the trades",
    description:
      service?.description ??
      "Local SEO, content, reviews, and growth tools for trade businesses.",
  });
}
