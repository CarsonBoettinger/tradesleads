import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Container, Eyebrow, demoHref, primaryButtonClass } from "@/components/ui";
import { Markdown } from "@/lib/blog/markdown";
import {
  getPublishedPostBySlug,
  listPublishedPostSlugs,
} from "@/lib/blog/posts";
import {
  blogPostingJsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Fully prerender published posts at build so first visits are not cold. */
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  // Do not swallow errors: ensureStatic=navigation needs real params at build,
  // otherwise first visits pay a multi-second cold render.
  const slugs = await listPublishedPostSlugs();
  if (!slugs.length) {
    throw new Error(
      "No published blog posts found. Refusing to build /blog/[slug] without static params.",
    );
  }
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};

  const title = stripBrandTitleSuffix(post.meta_title ?? post.title);
  const description = post.meta_description ?? post.excerpt;

  return buildPageMetadata({
    title,
    description,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.published_at ?? undefined,
    modifiedTime: post.updated_at,
    keywords: [
      post.primary_keyword,
      ...(post.secondary_keywords ?? []),
      post.trade,
    ].filter(Boolean) as string[],
    images: [
      {
        url: `/blog/${post.slug}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  });
}

/** Layout template already appends "| Kalvez"; strip legacy brand suffixes. */
function stripBrandTitleSuffix(title: string) {
  return title.replace(/\s*\|\s*(Kalvez|FOREMAN)\s*$/i, "").trim();
}

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const date = formatDate(post.published_at);
  // Drop the duplicate H1 from markdown body when present.
  const body = post.body_md.replace(/^#\s.+\n+/, "");

  return (
    <div>
      <JsonLd data={blogPostingJsonLd(post)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <SiteHeader />
      <main id="content" className="py-14 sm:py-20">
        <Container>
          <article className="mx-auto max-w-3xl">
            <p className="text-[15px] font-bold text-muted">
              <Link href="/blog" className="hover:text-foreman">
                Blog
              </Link>
              <span aria-hidden="true"> / </span>
              <span className="text-cocoa">{post.title}</span>
            </p>
            {post.trade ? <Eyebrow>{post.trade}</Eyebrow> : null}
            <h1 className="mt-4 text-[2.5rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-base font-bold text-muted">
              {date ? (
                <time dateTime={post.published_at ?? undefined}>{date}</time>
              ) : null}
              {post.primary_keyword ? (
                <span>Focus: {post.primary_keyword}</span>
              ) : null}
            </div>
            <p className="mt-6 text-[18px] leading-[1.6] text-muted">
              {post.excerpt}
            </p>
            <div className="mt-10 border-t-2 border-peach pt-10">
              <Markdown content={body} />
            </div>
          </article>

          <div className="mx-auto mt-16 max-w-3xl rounded-[20px] bg-peach px-6 py-8 sm:px-9">
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-cocoa">
              Built to get you found
            </h2>
            <p className="mt-3 text-[17px] leading-relaxed text-muted">
              Kalvez helps trade businesses show up on Google and on a website
              that turns searches into calls.
            </p>
            <a href={demoHref} className={`${primaryButtonClass} mt-6`}>
              Book a free demo
            </a>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
