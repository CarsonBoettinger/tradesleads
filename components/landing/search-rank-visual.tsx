"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const QUERY = "best plumber near me";
const ROW_HEIGHT = 58;
const TYPE_MS = 55;

const competitors = [
  { id: "chain", name: "National chain", rating: "3.8" },
  { id: "crew", name: "Another crew", rating: "3.6" },
] as const;

const you = {
  id: "you",
  name: "Your business",
  rating: "4.9",
} as const;

type Phase = "typing" | "ranked" | "hold";

export function SearchRankVisual() {
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");
  const [yourPlace, setYourPlace] = useState(3);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (finishedRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishedRef.current = true;
      setTyped(QUERY);
      setYourPlace(1);
      setPhase("hold");
      return;
    }

    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    async function run() {
      await wait(500);

      for (let i = 1; i <= QUERY.length; i += 1) {
        if (cancelled) return;
        setTyped(QUERY.slice(0, i));
        await wait(TYPE_MS);
      }

      if (cancelled) return;
      setPhase("ranked");
      await wait(750);
      if (cancelled) return;
      setYourPlace(2);
      await wait(700);
      if (cancelled) return;
      setYourPlace(1);
      setPhase("hold");
      finishedRef.current = true;
    }

    void run();
    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const showResults = phase !== "typing";
  const ordered = orderRows(yourPlace);

  return (
    <div className="relative mx-auto flex h-full max-w-md items-center justify-center">
      <div
        className="absolute inset-3 rounded-2xl opacity-70 sm:inset-5"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(239,114,48,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239,114,48,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      />
      <MapPins />

      <div className="relative z-10 w-full max-w-[19.5rem] overflow-hidden rounded-2xl border border-cocoa/10 bg-white shadow-[0_18px_50px_rgba(22,42,74,0.14)] sm:max-w-[21rem]">
        <div className="flex items-center gap-2 border-b border-cocoa/8 px-3.5 py-3">
          <SearchIcon className="size-4 shrink-0 text-muted" />
          <p className="min-h-[1.25rem] truncate text-[13px] font-semibold text-cocoa">
            {typed}
            {phase === "typing" ? (
              <span
                className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-[2px] bg-foreman align-baseline"
                aria-hidden="true"
              />
            ) : null}
          </p>
        </div>

        <div
          className="relative p-3"
          style={{ height: ROW_HEIGHT * 3 + 24 }}
          aria-live="polite"
        >
          {showResults
            ? ordered.map((row, index) => {
                const featured = row.id === "you";
                const place = index + 1;
                return (
                  <div
                    key={row.id}
                    className="absolute right-3 left-3 transition-[top] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ top: 12 + index * ROW_HEIGHT }}
                  >
                    <div
                      className={`flex h-[50px] items-center gap-3 rounded-xl px-3 ${
                        featured
                          ? "border-2 border-foreman bg-peach/40"
                          : "border border-cocoa/8 bg-cream/60"
                      }`}
                    >
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-extrabold ${
                          featured
                            ? "bg-foreman text-cream"
                            : "bg-cocoa/10 text-muted"
                        }`}
                      >
                        {place}
                      </span>
                      {featured ? (
                        <span className="relative size-9 shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src="/images/house.jpg"
                            alt=""
                            fill
                            sizes="36px"
                            className="object-cover"
                          />
                        </span>
                      ) : (
                        <span
                          className="grid size-9 shrink-0 place-items-center rounded-lg bg-cocoa/8"
                          aria-hidden="true"
                        >
                          <BuildingIcon className="size-4 text-muted" />
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-extrabold text-cocoa">
                          {row.name}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-muted">
                          {row.rating}
                          <Stars filled={featured} />
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
}

function orderRows(yourPlace: number) {
  if (yourPlace <= 1) return [you, competitors[0], competitors[1]];
  if (yourPlace === 2) return [competitors[0], you, competitors[1]];
  return [competitors[0], competitors[1], you];
}

function MapPins() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <Pin className="absolute top-[18%] left-[14%] text-foreman" />
      <Pin className="absolute top-[28%] right-[12%] text-sunrise" />
      <Pin className="absolute bottom-[22%] left-[22%] text-foreman/70" />
      <Pin className="absolute right-[20%] bottom-[30%] text-sunrise/80" />
    </div>
  );
}

function Stars({ filled }: { filled: boolean }) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 12 12" className="size-2.5" fill="none">
          <path
            d="M6 1.2l1.35 2.74 3.02.44-2.18 2.13.52 3.01L6 8.1l-2.71 1.42.52-3.01L1.63 4.38l3.02-.44L6 1.2z"
            fill={filled ? "#ef7230" : "#9aa8bc"}
          />
        </svg>
      ))}
    </span>
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

function BuildingIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M3.5 13.5V5.5L8 2.5l4.5 3v8H3.5zM6.5 13.5v-3h3v3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Pin({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 24"
      fill="none"
      className={`size-7 drop-shadow-sm ${className}`}
      aria-hidden="true"
    >
      <path
        d="M10 0C5.58 0 2 3.58 2 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8z"
        fill="currentColor"
      />
      <circle cx="10" cy="8" r="2.75" fill="#f5f7fb" />
    </svg>
  );
}
