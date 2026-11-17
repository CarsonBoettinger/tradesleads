import { getPublishedPostBySlug } from "@/lib/blog/posts";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Kalvez blog article";
export const size = ogSize;
export const contentType = ogContentType;

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  return renderOgImage({
    eyebrow: post?.trade ? `Kalvez · ${post.trade}` : "Kalvez Blog",
    title: post?.title ?? "Tips for trade owners",
    description: post?.excerpt ?? "Local search and website advice for the trades.",
  });
}
