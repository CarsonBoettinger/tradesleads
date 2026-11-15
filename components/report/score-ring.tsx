export function scoreTone(score: number | null): "good" | "ok" | "bad" | "empty" {
  if (score == null) return "empty";
  if (score >= 85) return "good";
  if (score >= 50) return "ok";
  return "bad";
}

const TONE_COLOR = {
  good: "#0d9488",
  ok: "#d97706",
  bad: "#dc2626",
  empty: "#d6c4b5",
} as const;

export function ScoreRing({
  label,
  score,
  size = "md",
}: {
  label: string;
  score: number | null;
  size?: "lg" | "md";
}) {
  const tone = scoreTone(score);
  const color = TONE_COLOR[tone];
  const radius = size === "lg" ? 52 : 38;
  const stroke = size === "lg" ? 8 : 6;
  const box = (radius + stroke) * 2;
  const circumference = 2 * Math.PI * radius;
  const progress = score == null ? 0 : Math.max(0, Math.min(100, score)) / 100;
  const dash = circumference * progress;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative"
        style={{ width: box, height: box }}
        aria-label={`${label} score ${score ?? "unavailable"}`}
      >
        <svg width={box} height={box} className="-rotate-90" aria-hidden>
          <circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            fill="none"
            stroke="#f3e7db"
            strokeWidth={stroke}
          />
          <circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span
            className={`font-extrabold tabular-nums ${
              size === "lg" ? "text-3xl" : "text-xl"
            }`}
            style={{ color }}
          >
            {score ?? "-"}
          </span>
        </div>
      </div>
      <p className="text-center text-sm font-bold text-cocoa">{label}</p>
    </div>
  );
}
