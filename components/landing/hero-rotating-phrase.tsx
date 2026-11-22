"use client";

import { useEffect, useState } from "react";

const phrases = [
  "more jobs",
  "more Google traffic",
  "more Google reviews",
  "more referrals",
  "more repeat customers",
] as const;

const INTERVAL_MS = 2800;

export function HeroRotatingPhrase() {
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    setReady(true);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!ready || reduceMotion) return;
    const count = phrases.length;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [ready, reduceMotion, phrases.length]);

  // Keep SSR and the first client paint identical.
  const active = ready && reduceMotion ? null : phrases[ready ? index : 0];

  return (
    <span className="relative mt-1 inline-grid w-full text-foreman" aria-hidden="true">
      {phrases.map((phrase) => (
        <span
          key={`sizer-${phrase}`}
          className="invisible col-start-1 row-start-1"
          aria-hidden="true"
        >
          {phrase}
        </span>
      ))}
      {ready && reduceMotion ? (
        <span className="col-start-1 row-start-1">{phrases.join(", ")}</span>
      ) : (
        <span
          key={active}
          className={
            ready
              ? "hero-phrase-pop col-start-1 row-start-1"
              : "col-start-1 row-start-1"
          }
        >
          {active}
        </span>
      )}
    </span>
  );
}
