import Image from "next/image";
import { Accent, FeaturePanel } from "@/components/landing/feature-panel";

const features = [
  {
    icon: <UsersIcon />,
    title: "We keep your site looking like the work",
    body: (
      <>
        Services, crew photos, and a clear way to call, updated for you so
        people <Accent>think of you first</Accent>.
      </>
    ),
  },
  {
    icon: <CalendarIcon />,
    title: "We keep your listing true",
    body: (
      <>
        Hours, service area, and photos stay matched to what you actually do{" "}
        <Accent>this month</Accent>, without you chasing it.
      </>
    ),
  },
  {
    icon: <SparkIcon />,
    title: "We turn finished jobs into the next ones",
    body: (
      <>
        Review asks, follow-ups, and replies go out for you so past customers
        can find you again.
      </>
    ),
  },
];

export function Remembered() {
  return (
    <FeaturePanel
      id="remembered"
      reverse
      eyebrow="Stay in mind"
      eyebrowIcon={<HeartIcon />}
      title="Be the name they call next time"
      features={features}
      visual={<KeepCurrentVisual />}
    />
  );
}

function KeepCurrentVisual() {
  const days = ["23", "24", "25", "26"];
  const hours = ["9 AM", "12 PM", "3 PM", "6 PM", "9 PM"];
  const cards = [
    {
      left: "16%",
      top: "12%",
      label: "Review sent",
      tag: "DONE",
      image: "/images/calendar/review.jpg",
      alt: "Email on a laptop",
    },
    {
      left: "38%",
      top: "30%",
      label: "Photos posted",
      tag: "DONE",
      image: "/images/calendar/photos.jpg",
      alt: "Crew working on a job site",
    },
    {
      left: "60%",
      top: "14%",
      label: "Listing updated",
      tag: "DONE",
      image: "/images/calendar/listing.jpg",
      alt: "House keys for a local listing",
    },
    {
      left: "78%",
      top: "34%",
      label: "Reply sent",
      tag: "DONE",
      image: "/images/calendar/reply.jpg",
      alt: "Handshake after a finished job",
    },
    {
      left: "38%",
      top: "62%",
      label: "Page updated",
      tag: "DONE",
      image: "/images/calendar/site.jpg",
      alt: "Website open on a laptop",
    },
    {
      left: "60%",
      top: "52%",
      label: "Follow-up sent",
      tag: "DONE",
      image: "/images/calendar/followup.jpg",
      alt: "Phone ready for a text follow-up",
    },
  ];

  return (
    <div className="relative mx-auto flex h-full max-w-lg items-center">
      <div className="relative aspect-[5/4] w-full overflow-hidden rounded-2xl border border-cocoa/8 bg-white/55 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] sm:aspect-[4/3] sm:p-4">
        <div className="grid h-full grid-cols-[2.2rem_repeat(4,minmax(0,1fr))] grid-rows-[1.25rem_repeat(5,minmax(0,1fr))]">
          <div />
          {days.map((day) => (
            <div
              key={day}
              className="text-center text-[11px] font-bold tracking-[0.08em] text-muted uppercase"
            >
              {day}
            </div>
          ))}
          {hours.map((hour) => (
            <div key={hour} className="contents">
              <div className="pr-1 pt-1 text-right text-[10px] font-semibold text-muted/80">
                {hour}
              </div>
              {days.map((day) => (
                <div
                  key={`${day}-${hour}`}
                  className="border-t border-l border-cocoa/6"
                />
              ))}
            </div>
          ))}
        </div>

        {cards.map((card) => (
          <div
            key={card.label}
            className="absolute w-[21%] min-w-[4.4rem] max-w-[5.6rem] -translate-x-1/2"
            style={{ left: card.left, top: card.top }}
          >
            <article className="overflow-hidden rounded-xl border border-cocoa/10 bg-white shadow-[0_10px_28px_rgba(22,42,74,0.12)]">
              <div className="relative h-10 overflow-hidden bg-[#d7e2f0] sm:h-11">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="90px"
                  className="object-cover"
                />
              </div>
              <div className="px-1.5 py-1.5">
                <p className="truncate text-[10px] font-extrabold tracking-[-0.02em] text-cocoa sm:text-[11px]">
                  {card.label}
                </p>
                <div className="mt-1 flex items-center justify-between gap-1">
                  <span className="size-3 rounded-full bg-foreman/15" />
                  <span className="rounded bg-cocoa/[0.06] px-1 py-0.5 text-[7px] font-bold tracking-[0.08em] text-muted uppercase sm:text-[8px]">
                    {card.tag}
                  </span>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
      <path
        d="M8 13.2S2.8 9.8 2.8 6.4A2.7 2.7 0 018 4.6a2.7 2.7 0 015.2 1.8C13.2 9.8 8 13.2 8 13.2z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
      <circle cx="6" cy="5.5" r="2.2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M2.5 12.5c.4-2 1.8-3 3.5-3s3.1 1 3.5 3M11 6.2a2 2 0 11.1 0M10.2 9.7c1.3.2 2.3 1.1 2.7 2.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
      <rect
        x="2.5"
        y="3.5"
        width="11"
        height="10"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M2.5 6.5h11M5.5 2.5v2M10.5 2.5v2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
      <path
        d="M8 2.5l1.1 3.2L12.5 7 9.1 8.3 8 11.5 6.9 8.3 3.5 7l3.4-1.3L8 2.5zM12.5 10.5l.55 1.6 1.6.55-1.6.55-.55 1.6-.55-1.6-1.6-.55 1.6-.55.55-1.6z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
