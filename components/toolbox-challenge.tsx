"use client";

import {
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ghostButtonClass, primaryButtonClass } from "@/components/ui";

type GamePhase = "idle" | "playing" | "lost";

type ToolKind = "hammer" | "wrench" | "screwdriver" | "tape" | "pliers";

type FallingTool = {
  id: number;
  kind: ToolKind;
  x: number;
  y: number;
  speed: number;
  rotation: number;
  spin: number;
};

const MAX_MISSES = 3;
const TOOLBOX_WIDTH = 96;
const TOOL_SIZE = 44;
const SPAWN_INTERVAL_MS = 1400;
const TOOL_KINDS: ToolKind[] = [
  "hammer",
  "wrench",
  "screwdriver",
  "tape",
  "pliers",
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function ToolIcon({ kind, className = "" }: { kind: ToolKind; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 48 48",
    "aria-hidden": true as const,
  };

  switch (kind) {
    case "hammer":
      return (
        <svg {...common}>
          <rect x="21" y="18" width="6" height="24" rx="2" fill="#5a6b82" />
          <path
            d="M10 14c0-3 2.5-6 8-6h12c5.5 0 8 3 8 6v4H10v-4Z"
            fill="#ef7230"
          />
          <path d="M12 16h24v3H12z" fill="#d15f20" />
        </svg>
      );
    case "wrench":
      return (
        <svg {...common}>
          <path
            d="M18 8a8 8 0 0 1 10.5 7.5L42 29.5 36.5 35 23 21.5A8 8 0 1 1 18 8Zm2.5 5.5a3 3 0 1 0 0-0.1Z"
            fill="#ef7230"
          />
          <circle cx="18" cy="14" r="3.25" fill="#f5f7fb" />
        </svg>
      );
    case "screwdriver":
      return (
        <svg {...common}>
          <path d="M22 6h4l2 8h-8l2-8Z" fill="#ef7230" />
          <rect x="21.5" y="14" width="5" height="22" rx="1.5" fill="#5a6b82" />
          <path d="M21.5 36h5l-1.5 6h-2l-1.5-6Z" fill="#162a4a" />
        </svg>
      );
    case "tape":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="14" fill="#ef7230" />
          <circle cx="24" cy="24" r="7" fill="#f5f7fb" />
          <circle cx="24" cy="24" r="3" fill="#162a4a" />
          <path
            d="M24 10v4M24 34v4M10 24h4M34 24h4"
            stroke="#e8eef6"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "pliers":
      return (
        <svg {...common}>
          <path
            d="M16 8c2 4 4 8 6 12l4-4c-2-4-4-8-6-12-2.2 1-3.5 2.5-4 4Z"
            fill="#5a6b82"
          />
          <path
            d="M32 8c-2 4-4 8-6 12l-4-4c2-4 4-8 6-12 2.2 1 3.5 2.5 4 4Z"
            fill="#5a6b82"
          />
          <path
            d="M20 22c1.5 2 3 4 4 6 1-2 2.5-4 4-6l-2 18h-4l-2-18Z"
            fill="#ef7230"
          />
        </svg>
      );
  }
}

function Toolbox({
  x,
  width,
  bump,
  idle,
}: {
  x: number;
  width: number;
  bump: boolean;
  idle?: boolean;
}) {
  return (
    <div
      className={`absolute bottom-3 transition-transform duration-150 ${
        bump ? "-translate-y-1 scale-[1.04]" : ""
      } ${idle && !bump ? "toolbox-idle" : ""}`}
      style={{ left: x, width }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 96 56" className="h-auto w-full">
        <rect x="8" y="18" width="80" height="32" rx="6" fill="#ef7230" />
        <rect x="12" y="22" width="72" height="10" rx="2" fill="#d15f20" />
        <rect x="36" y="8" width="24" height="14" rx="4" fill="#d15f20" />
        <rect x="40" y="11" width="16" height="6" rx="2" fill="#e8eef6" />
        <rect x="18" y="36" width="18" height="8" rx="2" fill="#e8eef6" />
        <rect x="60" y="36" width="18" height="8" rx="2" fill="#e8eef6" />
      </svg>
    </div>
  );
}

export function ToolboxChallenge({
  resetSignal = 0,
  restartSignal = 0,
  className = "",
}: {
  resetSignal?: number;
  restartSignal?: number;
  className?: string;
}) {
  const labelId = useId();
  const statusId = useId();
  const areaRef = useRef<HTMLDivElement>(null);
  const toolboxXRef = useRef(0);
  const toolsRef = useRef<FallingTool[]>([]);
  const scoreRef = useRef(0);
  const missesRef = useRef(0);
  const phaseRef = useRef<GamePhase>("idle");
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const spawnAtRef = useRef(0);
  const nextIdRef = useRef(1);
  const keysRef = useRef({ left: false, right: false });
  const draggingRef = useRef(false);

  const [phase, setPhase] = useState<GamePhase>("idle");
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [tools, setTools] = useState<FallingTool[]>([]);
  const [toolboxX, setToolboxX] = useState(0);
  const [areaWidth, setAreaWidth] = useState(320);
  const [bump, setBump] = useState(false);
  const [flash, setFlash] = useState(false);

  const syncPhase = (next: GamePhase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  const measure = () => {
    const node = areaRef.current;
    if (!node) return;
    const width = node.clientWidth;
    setAreaWidth(width);
    const centered = (width - TOOLBOX_WIDTH) / 2;
    toolboxXRef.current = centered;
    setToolboxX(centered);
  };

  const clearLoop = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTsRef.current = null;
  };

  const resetGame = useEffectEvent((startPlaying: boolean) => {
    clearLoop();
    toolsRef.current = [];
    scoreRef.current = 0;
    missesRef.current = 0;
    nextIdRef.current = 1;
    keysRef.current = { left: false, right: false };
    setTools([]);
    setScore(0);
    setMisses(0);
    setBump(false);
    setFlash(false);
    measure();
    if (startPlaying) {
      syncPhase("playing");
      spawnAtRef.current = performance.now() + 350;
      lastTsRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
      areaRef.current?.focus({ preventScroll: true });
    } else {
      syncPhase("idle");
    }
  });

  const finishLost = () => {
    clearLoop();
    toolsRef.current = [];
    setTools([]);
    syncPhase("lost");
  };

  const spawnTool = (width: number) => {
    const kind = TOOL_KINDS[Math.floor(Math.random() * TOOL_KINDS.length)];
    const x = clamp(
      Math.random() * (width - TOOL_SIZE),
      8,
      Math.max(8, width - TOOL_SIZE - 8),
    );
    toolsRef.current = [
      ...toolsRef.current,
      {
        id: nextIdRef.current++,
        kind,
        x,
        y: -TOOL_SIZE,
        speed: 95 + Math.random() * 55,
        rotation: Math.random() * 40 - 20,
        spin: (Math.random() * 40 + 20) * (Math.random() > 0.5 ? 1 : -1),
      },
    ];
  };

  const tick = (ts: number) => {
    if (phaseRef.current !== "playing") return;

    const last = lastTsRef.current ?? ts;
    const dt = Math.min(0.033, (ts - last) / 1000);
    lastTsRef.current = ts;

    const width = areaRef.current?.clientWidth ?? areaWidth;
    const height = areaRef.current?.clientHeight ?? 340;
    const moveSpeed = 280;
    let nextX = toolboxXRef.current;
    if (keysRef.current.left) nextX -= moveSpeed * dt;
    if (keysRef.current.right) nextX += moveSpeed * dt;
    nextX = clamp(nextX, 0, Math.max(0, width - TOOLBOX_WIDTH));
    toolboxXRef.current = nextX;
    setToolboxX(nextX);

    if (ts >= spawnAtRef.current) {
      spawnTool(width);
      spawnAtRef.current = ts + SPAWN_INTERVAL_MS + Math.random() * 400;
    }

    const catchY = height - 52;
    const boxLeft = nextX;
    const boxRight = nextX + TOOLBOX_WIDTH;
    let scoreDelta = 0;
    let missDelta = 0;
    const remaining: FallingTool[] = [];

    for (const tool of toolsRef.current) {
      const y = tool.y + tool.speed * dt;
      const rotation = tool.rotation + tool.spin * dt;
      const toolLeft = tool.x;
      const toolRight = tool.x + TOOL_SIZE;
      const toolBottom = y + TOOL_SIZE;

      const overlapsX = toolRight > boxLeft + 8 && toolLeft < boxRight - 8;
      const inCatchZone = toolBottom >= catchY && y <= catchY + 28;

      if (overlapsX && inCatchZone) {
        scoreDelta += 1;
        continue;
      }

      if (y > height) {
        missDelta += 1;
        continue;
      }

      remaining.push({ ...tool, y, rotation });
    }

    toolsRef.current = remaining;
    setTools(remaining);

    if (scoreDelta > 0) {
      scoreRef.current += scoreDelta;
      setScore(scoreRef.current);
      setBump(true);
      setFlash(true);
      window.setTimeout(() => setBump(false), 160);
      window.setTimeout(() => setFlash(false), 220);
    }

    if (missDelta > 0) {
      missesRef.current += missDelta;
      setMisses(missesRef.current);
    }

    if (missesRef.current >= MAX_MISSES) {
      finishLost();
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    measure();
    const node = areaRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    resetGame(false);
  }, [resetSignal]);

  useEffect(() => {
    if (restartSignal === 0) return;
    resetGame(true);
  }, [restartSignal]);

  useEffect(() => {
    return () => clearLoop();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (phaseRef.current !== "playing") return;
      const key = event.key.toLowerCase();
      if (
        key !== "arrowleft" &&
        key !== "arrowright" &&
        key !== "a" &&
        key !== "d"
      ) {
        return;
      }
      event.preventDefault();
      if (key === "arrowleft" || key === "a") keysRef.current.left = true;
      if (key === "arrowright" || key === "d") keysRef.current.right = true;
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "arrowleft" || key === "a") keysRef.current.left = false;
      if (key === "arrowright" || key === "d") keysRef.current.right = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const moveToPointer = (clientX: number) => {
    const node = areaRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const next = clamp(
      clientX - rect.left - TOOLBOX_WIDTH / 2,
      0,
      rect.width - TOOLBOX_WIDTH,
    );
    toolboxXRef.current = next;
    setToolboxX(next);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (phase !== "playing") return;
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    moveToPointer(event.clientX);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || phase !== "playing") return;
    moveToPointer(event.clientX);
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const remainingMisses = Math.max(0, MAX_MISSES - misses);
  const statusText =
    phase === "idle"
      ? "Catch as many tools as you can. Miss 3 and it's game over."
      : phase === "playing"
        ? `Score ${score}. ${remainingMisses} misses remaining.`
        : `Looks like we dropped the ball. Final score ${score}.`;

  return (
    <section
      id="toolbox-challenge"
      className={`overflow-hidden rounded-xl border-2 border-peach bg-white ${className}`}
      aria-labelledby={labelId}
    >
      <div className="flex items-center justify-between gap-3 border-b-2 border-peach bg-white px-4 py-3 sm:px-5">
        <div>
          <p
            id={labelId}
            className="text-[13px] font-bold tracking-[0.16em] text-foreman uppercase"
          >
            Toolbox Challenge
          </p>
          <p className="mt-0.5 text-sm text-muted sm:text-[15px]">
            Catch tools · miss 3 and you&apos;re out
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-peach px-2.5 py-1 text-sm font-bold text-cocoa">
            Score {score}
          </span>
          <span className="rounded-md bg-cocoa px-2.5 py-1 text-sm font-bold text-cream">
            {remainingMisses} left
          </span>
        </div>
      </div>

      <div
        ref={areaRef}
        role="application"
        tabIndex={0}
        aria-describedby={statusId}
        aria-label="Toolbox Challenge game area. Use arrow keys or A and D to move. On touch devices, drag the toolbox."
        className="relative h-[300px] touch-none select-none bg-cream outline-none focus-visible:ring-2 focus-visible:ring-foreman focus-visible:ring-inset sm:h-[340px]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {flash ? (
          <div
            className="pointer-events-none absolute inset-0 bg-foreman/10"
            aria-hidden="true"
          />
        ) : null}

        {tools.map((tool) => (
          <div
            key={tool.id}
            className="absolute will-change-transform"
            style={{
              left: tool.x,
              top: tool.y,
              width: TOOL_SIZE,
              height: TOOL_SIZE,
              transform: `rotate(${tool.rotation}deg)`,
            }}
          >
            <ToolIcon kind={tool.kind} className="size-full" />
          </div>
        ))}

        {phase === "playing" || phase === "idle" ? (
          <Toolbox
            x={toolboxX}
            width={TOOLBOX_WIDTH}
            bump={bump}
            idle={phase === "idle"}
          />
        ) : null}

        {phase !== "playing" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-cream/95 p-5">
            <div className="w-full max-w-sm rounded-xl border-2 border-peach bg-white px-5 py-6 text-center">
              {phase === "idle" ? (
                <>
                  <p className="text-[13px] font-bold tracking-[0.16em] text-foreman uppercase">
                    Toolbox Challenge
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-cocoa">
                    Catch as many tools as you can.
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">
                    Miss 3 and it&apos;s game over. Move with ← → or A/D. On
                    mobile, drag the toolbox.
                  </p>
                  <button
                    type="button"
                    className={`${primaryButtonClass} mt-5 w-full`}
                    onClick={() => resetGame(true)}
                  >
                    Start Game
                  </button>
                </>
              ) : null}

              {phase === "lost" ? (
                <>
                  <p className="text-[13px] font-bold tracking-[0.16em] text-foreman uppercase">
                    Game over
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-cocoa">
                    Looks like we dropped the ball.
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">
                    Final score: {score}. Give it another go.
                  </p>
                  <button
                    type="button"
                    className={`${ghostButtonClass} mt-5 w-full`}
                    onClick={() => resetGame(true)}
                  >
                    Try Again
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <p id={statusId} className="sr-only" aria-live="polite">
        {statusText}
      </p>
    </section>
  );
}
