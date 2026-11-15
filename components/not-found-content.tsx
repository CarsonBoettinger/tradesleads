"use client";

import { useState } from "react";
import { ToolboxChallenge } from "@/components/toolbox-challenge";
import { Container, CtaLink, ghostButtonClass } from "@/components/ui";

export function NotFoundContent() {
  const [restartSignal, setRestartSignal] = useState(0);

  return (
    <Container className="py-12 sm:py-16 lg:py-20">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
        <div>
          <p
            className="font-extrabold tracking-[-0.05em] text-foreman/25 select-none"
            style={{
              fontSize: "clamp(4.5rem, 18vw, 8.5rem)",
              lineHeight: 0.85,
            }}
            aria-hidden="true"
          >
            404
          </p>
          <h1 className="mt-2 max-w-lg text-[2.35rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl">
            Looks like we&apos;ve lost a tool.
          </h1>
          <p className="mt-4 max-w-md text-[18px] leading-relaxed text-muted sm:text-[19px]">
            This page seems to have gone missing from the job site.
          </p>
          <p className="mt-3 max-w-md text-[17px] leading-relaxed text-cocoa/80">
            While you&apos;re here, see how many tools you can catch.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <CtaLink href="/">Back to Home</CtaLink>
            <button
              type="button"
              className={ghostButtonClass}
              onClick={() => {
                setRestartSignal((value) => value + 1);
                document
                  .getElementById("toolbox-challenge")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            >
              Play Again
            </button>
          </div>
        </div>

        <ToolboxChallenge restartSignal={restartSignal} />
      </div>
    </Container>
  );
}
