import type { ReactNode } from "react";
import { Container } from "@/components/ui";

export type FeatureItem = {
  icon: ReactNode;
  title: string;
  body: ReactNode;
};

export function FeaturePanel({
  id,
  eyebrow,
  eyebrowIcon,
  title,
  features,
  ctaHref = "#how",
  ctaLabel = "See how it works",
  visual,
  reverse = false,
}: {
  id: string;
  eyebrow: string;
  eyebrowIcon: ReactNode;
  title: string;
  features: FeatureItem[];
  ctaHref?: string;
  ctaLabel?: string;
  visual: ReactNode;
  reverse?: boolean;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-4 sm:py-5">
      <Container>
        <div className="overflow-hidden rounded-[1.75rem] border border-cocoa/10 bg-white shadow-[0_1px_0_rgba(22,42,74,0.04)]">
          <div
            className={`grid lg:grid-cols-2 ${
              reverse ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="flex flex-col justify-center px-7 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
              <p className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em] text-muted">
                <span className="text-foreman" aria-hidden="true">
                  {eyebrowIcon}
                </span>
                {eyebrow}
              </p>
              <h2 className="mt-4 max-w-md text-[1.85rem] leading-[1.12] font-extrabold tracking-[-0.03em] text-balance text-cocoa sm:text-[2.15rem]">
                {title}
              </h2>
              <ul className="mt-8 space-y-5">
                {features.map((feature) => (
                  <li key={feature.title} className="flex gap-3.5">
                    <span
                      className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-peach text-foreman"
                      aria-hidden="true"
                    >
                      {feature.icon}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[17px] leading-snug font-extrabold tracking-[-0.02em] text-cocoa">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-muted sm:text-[16px]">
                        {feature.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <a
                href={ctaHref}
                className="mt-9 inline-flex h-11 w-fit items-center gap-2 rounded-[10px] bg-cocoa/[0.06] px-5 text-[15px] font-bold text-cocoa transition-colors hover:bg-cocoa/[0.1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreman"
              >
                {ctaLabel}
                <ArrowUpRight />
              </a>
            </div>

            <div className="relative min-h-[22rem] overflow-hidden bg-[#e8eef6] px-5 py-8 sm:min-h-[26rem] sm:px-8 sm:py-10 lg:px-10">
              {visual}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function Accent({ children }: { children: ReactNode }) {
  return <span className="font-extrabold text-foreman">{children}</span>;
}

function ArrowUpRight() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="size-3.5"
    >
      <path
        d="M4.5 11.5L11.5 4.5M11.5 4.5H6.25M11.5 4.5V9.75"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
