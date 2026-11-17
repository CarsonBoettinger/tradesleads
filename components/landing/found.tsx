import { Container } from "@/components/ui";
import { Accent, FeaturePanel } from "@/components/landing/feature-panel";
import { SearchRankVisual } from "@/components/landing/search-rank-visual";

const features = [
  {
    icon: <SearchIcon />,
    title: "Rank higher on Google",
    body: (
      <>
        Show up in <Accent>more local searches</Accent> for your trade in your
        town.
      </>
    ),
  },
  {
    icon: <StarIcon />,
    title: "Earn more 5-star reviews",
    body: (
      <>
        Happy customers get an easy way to review you while the job is still
        fresh.
      </>
    ),
  },
  {
    icon: <TrophyIcon />,
    title: "Beat the big guys",
    body: (
      <>
        Look as established as the national brands.{" "}
        <Accent>Keep the work local.</Accent>
      </>
    ),
  },
];

export function Found() {
  return (
    <div className="pt-14 sm:pt-20">
      <Container>
        <h2 className="mx-auto max-w-3xl text-center text-[1.75rem] leading-[1.15] font-extrabold tracking-[-0.03em] text-balance text-cocoa sm:text-[2.35rem]">
          One platform to get found, stay known &amp; fill the week
        </h2>
      </Container>
      <div className="mt-8 sm:mt-10">
        <FeaturePanel
          id="found"
          eyebrow="Get the call"
          eyebrowIcon={<BarsIcon />}
          title="Show up when someone is ready to hire"
          features={features}
          visual={<SearchRankVisual />}
        />
      </div>
    </div>
  );
}

function BarsIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
      <path
        d="M3 12V8.5M8 12V4M13 12V6.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M10.2 10.2L13 13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
      <path
        d="M8 2.2l1.7 3.45 3.8.55-2.75 2.68.65 3.8L8 11.1l-3.4 1.78.65-3.8L2.5 6.2l3.8-.55L8 2.2z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
      <path
        d="M5 3.5h6v3.2a3 3 0 01-6 0V3.5zM5 3.5H3.4a1.6 1.6 0 001.5 2.6M11 3.5h1.6a1.6 1.6 0 01-1.5 2.6M6.5 12.5h3M8 9.7v2.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
