import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Container, Eyebrow } from "@/components/ui";

export const LEGAL_EMAIL = "privacy@kalvez.com";
export const LEGAL_UPDATED = "November 17, 2026";

export type LegalSection = {
  id: string;
  title: string;
  body: ReactNode;
};

const proseClass =
  "mt-4 space-y-4 text-[17px] leading-[1.7] text-muted [&_a]:font-bold [&_a]:text-cocoa [&_a]:underline [&_a]:decoration-peach [&_a]:underline-offset-4 hover:[&_a]:decoration-foreman focus-visible:[&_a]:outline-2 focus-visible:[&_a]:outline-offset-4 focus-visible:[&_a]:outline-foreman [&_h3]:pt-4 [&_h3]:text-xl [&_h3]:leading-tight [&_h3]:font-extrabold [&_h3]:tracking-[-0.02em] [&_h3]:text-cocoa [&_li]:mt-2 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_strong]:font-bold [&_strong]:text-cocoa [&_td]:border-b [&_td]:border-peach [&_td]:py-3 [&_td]:pr-4 [&_td]:align-top [&_th]:border-b-2 [&_th]:border-peach [&_th]:pb-2 [&_th]:pr-4 [&_th]:text-left [&_th]:text-base [&_th]:font-extrabold [&_th]:text-cocoa [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6";

export function LegalDocument({
  kicker,
  title,
  lede,
  sections,
}: {
  kicker: string;
  title: string;
  lede: string;
  sections: LegalSection[];
}) {
  return (
    <div>
      <SiteHeader />
      <main id="content" className="py-14 sm:py-20">
        <Container>
          <Eyebrow>{kicker}</Eyebrow>
          <h1 className="mt-4 max-w-3xl text-[2.5rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-[18px] leading-[1.6] text-muted">
            {lede}
          </p>
          <p className="mt-4 text-base font-bold text-cocoa">
            Effective {LEGAL_UPDATED}. Last updated {LEGAL_UPDATED}.
          </p>

          <div className="mt-12 grid items-start gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
            <nav
              aria-label="On this page"
              className="rounded-xl border-2 border-peach bg-white p-5 lg:sticky lg:top-28"
            >
              <p className="text-base font-bold tracking-[0.16em] text-foreman uppercase">
                On this page
              </p>
              <ol className="mt-3 space-y-1">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="inline-flex min-h-11 items-center py-1 text-[15px] leading-snug font-bold text-cocoa underline decoration-transparent underline-offset-4 hover:decoration-cocoa focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreman"
                    >
                      {index + 1}. {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <article className="min-w-0 max-w-3xl">
              {sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`${section.id}-heading`}
                  className="scroll-mt-28 border-t-2 border-peach py-10 first:border-t-0 first:pt-0"
                >
                  <h2
                    id={`${section.id}-heading`}
                    className="text-[1.75rem] leading-tight font-extrabold tracking-[-0.02em] text-cocoa"
                  >
                    {index + 1}. {section.title}
                  </h2>
                  <div className={proseClass}>{section.body}</div>
                </section>
              ))}
            </article>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
