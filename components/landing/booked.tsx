import type { ReactNode } from "react";
import { Accent, FeaturePanel } from "@/components/landing/feature-panel";

const features = [
  {
    icon: <CallsIcon />,
    title: "Calls from people who need the work",
    body: (
      <>
        Google traffic from homeowners with a job in mind, not window shoppers
        passing through.
      </>
    ),
  },
  {
    icon: <QuoteIcon />,
    title: "Quote requests while you are on the tools",
    body: (
      <>
        The website takes the details so you can call them back between jobs.
      </>
    ),
  },
  {
    icon: <WeekIcon />,
    title: "Slow weeks with work you want",
    body: (
      <>
        Show up for the searches that fill the gaps,{" "}
        <Accent>not only the rush</Accent>.
      </>
    ),
  },
];

export function Booked() {
  return (
    <div className="pb-14 sm:pb-20">
      <FeaturePanel
        id="booked"
        eyebrow="More booked jobs"
        eyebrowIcon={<BoltIcon />}
        title="Turn Google traffic into work on the calendar"
        features={features}
        visual={<GrowthVisual />}
      />
    </div>
  );
}

function GrowthVisual() {
  return (
    <div className="relative mx-auto flex h-full max-w-md items-center justify-center py-2">
      <div className="relative h-[19rem] w-full max-w-[22rem] sm:h-[22rem]">
        <div className="feature-float absolute top-0 left-0 w-[68%]">
          <ChartCard
            className="rotate-[-2deg]"
            title="Website visits"
            accent="green"
          >
            <BarChart
              values={[28, 36, 32, 48, 55, 62, 78]}
              from="#b7e4c7"
              to="#2d6a4f"
            />
          </ChartCard>
        </div>

        <div className="feature-float-delayed absolute top-[28%] right-0 z-10 w-[70%]">
          <ChartCard
            className="rotate-[2deg]"
            title="Average job size"
            accent="blue"
          >
            <LineChart />
          </ChartCard>
        </div>

        <div className="feature-float-late absolute bottom-0 left-[8%] z-20 w-[74%]">
          <ChartCard
            className="rotate-[-1deg]"
            title="Booked jobs"
            accent="orange"
          >
            <BarChart
              values={[22, 30, 38, 42, 51, 60, 74]}
              from="#fdba8c"
              to="#ef7230"
            />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
  className = "",
  accent,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  accent: "green" | "blue" | "orange";
}) {
  const dot =
    accent === "green"
      ? "bg-[#2d6a4f]"
      : accent === "blue"
        ? "bg-[#2563eb]"
        : "bg-foreman";

  return (
    <article
      className={`rounded-2xl border border-cocoa/10 bg-white p-3.5 shadow-[0_16px_40px_rgba(22,42,74,0.12)] sm:p-4 ${className}`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className={`size-2 rounded-full ${dot}`} />
        <p className="text-[12px] font-extrabold tracking-[-0.01em] text-cocoa">
          {title}
        </p>
      </div>
      {children}
      <div className="mt-2 flex justify-between px-0.5 text-[9px] font-semibold tracking-[0.06em] text-muted/70 uppercase">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </article>
  );
}

function BarChart({
  values,
  from,
  to,
}: {
  values: number[];
  from: string;
  to: string;
}) {
  return (
    <div className="flex h-20 items-end gap-1.5 px-0.5 sm:h-24 sm:gap-2">
      {values.map((value, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-md"
          style={{
            height: `${value}%`,
            background: `linear-gradient(180deg, ${to} 0%, ${from} 100%)`,
          }}
        />
      ))}
    </div>
  );
}

function LineChart() {
  const points = [
    [8, 72],
    [24, 64],
    [40, 58],
    [56, 48],
    [72, 40],
    [88, 28],
    [104, 18],
  ];
  const path = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`)
    .join(" ");

  return (
    <svg viewBox="0 0 112 90" className="h-20 w-full sm:h-24" aria-hidden="true">
      {[20, 40, 60, 80].map((y) => (
        <line
          key={y}
          x1="0"
          x2="112"
          y1={y}
          y2={y}
          stroke="rgba(22,42,74,0.08)"
          strokeWidth="1"
        />
      ))}
      <path
        d={path}
        fill="none"
        stroke="#2563eb"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#2563eb" />
      ))}
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
      <path
        d="M9 1.5L3.5 9h4L7 14.5 12.5 7h-4L9 1.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CallsIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
      <path
        d="M4.2 3.5h2.1l.8 2.1-1.1 1.1a8.5 8.5 0 003.4 3.4l1.1-1.1 2.1.8v2.1A1.2 1.2 0 0111.3 13 8.8 8.8 0 013 4.7a1.2 1.2 0 011.2-1.2z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
      <path
        d="M3.5 4.5h9v6.5H8L5.5 13V11H3.5V4.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M6 7h4M6 9h2.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WeekIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 5v3.2l2 1.3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
