import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Container, Eyebrow, demoHref, primaryButtonClass } from "@/components/ui";
import { listPublishedPosts } from "@/lib/blog/posts";
import { breadcrumbJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Quick marketing and local-search tips for trade owners who can’t afford to lose another customer - Google, websites, reviews, and getting calls.",
  alternates: { canonical: absoluteUrl("/blog") },
  openGraph: {
    title: "Blog | Kalvez",
    description:
      "Useful tips for plumbers, roofers, electricians, HVAC, builders, and landscapers.",
    url: absoluteUrl("/blog"),
    type: "website",
  },
};

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function BlogIndexPage() {
  const posts = await listPublishedPosts(50);

  return (
    <div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <SiteHeader />
      <main id="content" className="py-14 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Blog</Eyebrow>
            <h1 className="mt-4 text-[2.5rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl">
              Tips for owners who can’t lose another call
            </h1>
            <p className="mt-6 text-[18px] leading-[1.6] text-muted">
              Quick, useful advice on Google, websites, reviews, and booking
              jobs - written for busy trade shops. A new tip lands here every
              day.
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="mt-14 text-[17px] text-muted">
              Articles are on the way.{" "}
              <Link href={demoHref} className="font-bold text-foreman underline">
                Book a free demo
              </Link>{" "}
              while you wait.
            </p>
          ) : (
            <ul className="mt-14 divide-y-2 divide-peach border-y-2 border-peach">
              {posts.map((post) => {
                const date = formatDate(post.published_at);
                return (
                  <li key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col gap-3 py-8 transition-colors sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
                    >
                      <div className="max-w-2xl">
                        {post.trade ? (
                          <p className="text-sm font-bold tracking-[0.14em] text-foreman uppercase">
                            {post.trade}
                          </p>
                        ) : null}
                        <h2 className="mt-2 text-2xl leading-tight font-extrabold tracking-[-0.02em] text-cocoa group-hover:text-foreman">
                          {post.title}
                        </h2>
                        <p className="mt-3 text-[17px] leading-relaxed text-muted">
                          {post.excerpt}
                        </p>
                      </div>
                      {date ? (
                        <time
                          dateTime={post.published_at ?? undefined}
                          className="shrink-0 text-base font-bold text-muted"
                        >
                          {date}
                        </time>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-14 rounded-[20px] bg-peach px-6 py-8 sm:px-9">
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-cocoa">
              Want this done for your business?
            </h2>
            <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-muted">
              Book a free 20-minute demo. We look at your Google listing and
              website in plain language.
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
