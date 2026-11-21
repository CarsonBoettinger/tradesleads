"use client";

import { useEffect, useState } from "react";

const phrases = [
  "more jobs",
  "more Google traffic",
  "more repeat customers",
] as const;

const INTERVAL_MS = 2800;

export function HeroRotatingPhrase() {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % phrases.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const active = phrases[index];

  return (
    <span className="relative mt-1 inline-grid w-full text-foreman">
      {phrases.map((phrase) => (
        <span
          key={`sizer-${phrase}`}
          className="invisible col-start-1 row-start-1"
          aria-hidden="true"
        >
          {phrase}
        </span>
      ))}
      {reduceMotion ? (
        <span className="col-start-1 row-start-1">{phrases.join(", ")}</span>
      ) : (
        <span
          key={active}
          className="hero-phrase-pop col-start-1 row-start-1"
          aria-live="polite"
        >
          {active}
        </span>
      )}
    </span>
  );
}
