import Image from "next/image";
import { HeroRotatingPhrase } from "@/components/landing/hero-rotating-phrase";
import {
  Container,
  CtaLink,
  demoCta,
  demoHref,
  reportCta,
  reportHref,
} from "@/components/ui";

const feed = [
  {
    name: "Mike Torres",
    avatar: "/images/avatars/mike.jpg",
    badge: "Booked · $2,400",
    tone: "success" as const,
    icon: "check" as const,
  },
  {
    name: "Sarah Chen",
    avatar: "/images/avatars/sarah.jpg",
    badge: "Quote request",
    tone: "lead" as const,
    icon: "quote" as const,
  },
  {
    name: "James Whitaker",
    avatar: "/images/avatars/james.jpg",
    badge: "5-star review",
    tone: "review" as const,
    icon: "star" as const,
  },
  {
    name: "Amanda Reyes",
    avatar: "/images/avatars/amanda.jpg",
    badge: "Paid · $850",
    tone: "money" as const,
    icon: "check" as const,
  },
];

const badgeTone = {
  success: "bg-[#E7F6EC] text-[#1F7A45]",
  lead: "bg-[#FDE8D8] text-[#C25712]",
  review: "bg-[#FFF3D6] text-[#9A6B00]",
  money: "bg-[#E8EEF8] text-[#2F4F8A]",
} as const;

export function Hero() {
  return (
    <section className="pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          <div>
            <p className="inline-flex rounded-lg bg-peach px-4 py-2 text-base font-bold text-cocoa">
              All-in-one AI marketing
            </p>
            <h1 className="mt-6 max-w-2xl text-[2.35rem] leading-[1.08] font-extrabold tracking-[-0.02em] text-cocoa sm:text-5xl lg:text-6xl">
              <span className="block">The AI platform for</span>
              <HeroRotatingPhrase />
            </h1>
            <p className="mt-6 max-w-xl text-[19px] leading-[1.6] text-muted sm:text-[21px]">
              Kalvez is the AI platform that grows your Google visibility,
              brings in local traffic that turns into booked work, and brings
              past customers back, so you stay on the tools while the right
              people find you.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaLink href={reportHref}>{reportCta}</CtaLink>
              <CtaLink href={demoHref} variant="ghost">
                {demoCta}
              </CtaLink>
            </div>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
              Free AI report on your Google visibility, traffic, and what it
              would take to fill more of the week.
            </p>
          </div>

          <div className="hero-outcome relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] sm:rounded-[2rem]">
              <Image
                src="/images/hero/lifestyle.jpg"
                alt="A tradesperson finishing a job with a happy homeowner"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover object-[center_30%]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-cocoa/35 via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>

            <div className="hero-feed-card relative z-10 -mt-16 mx-3 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-[0_18px_50px_rgba(22,42,74,0.18)] backdrop-blur-sm sm:-mt-20 sm:mx-5 sm:p-5">
              <div className="mb-3 flex items-center gap-2.5 px-0.5">
                <span className="grid size-8 place-items-center rounded-full bg-[#FDE8D8] text-foreman">
                  <BellIcon />
                </span>
                <p className="text-[15px] font-extrabold tracking-[-0.01em] text-cocoa">
                  Jobs coming in
                </p>
              </div>

              <ul className="flex flex-col gap-1" aria-label="Live job activity">
                {feed.map((item, index) => (
                  <li
                    key={item.name}
                    className={`hero-feed-row hero-feed-row-${index + 1} flex items-center gap-3 rounded-xl px-1.5 py-2`}
                  >
                    <span className="relative size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white">
                      <Image
                        src={item.avatar}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[14px] font-bold text-cocoa sm:text-[15px]">
                      {item.name}
                    </span>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold sm:text-[12px] ${badgeTone[item.tone]}`}
                    >
                      <BadgeIcon type={item.icon} />
                      {item.badge}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
      <path
        d="M8 1.75a3.5 3.5 0 0 0-3.5 3.5v1.2c0 .55-.18 1.08-.5 1.52L3.1 9.2A1.1 1.1 0 0 0 4 11h8a1.1 1.1 0 0 0 .9-1.8l-.9-1.23a2.6 2.6 0 0 1-.5-1.52V5.25A3.5 3.5 0 0 0 8 1.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M6.4 12.5a1.75 1.75 0 0 0 3.2 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BadgeIcon({ type }: { type: "check" | "quote" | "star" }) {
  if (type === "star") {
    return (
      <svg viewBox="0 0 12 12" className="size-3" fill="currentColor" aria-hidden="true">
        <path d="M6 1.2l1.35 2.74 3.02.44-2.18 2.13.51 3.01L6 8.1l-2.7 1.42.51-3.01L1.63 4.38l3.02-.44L6 1.2Z" />
      </svg>
    );
  }

  if (type === "quote") {
    return (
      <svg viewBox="0 0 12 12" fill="none" className="size-3" aria-hidden="true">
        <path
          d="M2.5 3.25h7v4.1a1 1 0 0 1-1 1H5.2L3.4 9.9V8.35h-.9a1 1 0 0 1-1-1v-3.1a1 1 0 0 1 1-1Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 12 12" fill="none" className="size-3" aria-hidden="true">
      <path
        d="M1.75 6.4l1.9 1.9 3.1-4.2M6.4 4.1l1.05 1.4L10.25 3"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
