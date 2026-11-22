import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { getTradeBySlug } from "@/lib/trades";

export const alt = "Kalvez trade growth page";
export const size = ogSize;
export const contentType = ogContentType;

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const trade = getTradeBySlug(slug);

  return renderOgImage({
    eyebrow: trade ? `Kalvez · ${trade.name}` : "Kalvez",
    title: trade?.pageTitle ?? trade?.headline ?? "Growth for the trades",
    description:
      trade?.description ??
      "Websites and local search growth for the businesses that build our world.",
  });
}
