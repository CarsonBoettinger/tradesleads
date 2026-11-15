export function Mark({ className = "size-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="#C2410C" />
      <path
        d="M11 24 24 12l13 12v6L24 18 11 30zM11 34l13-12 13 12v4L24 26 11 38z"
        fill="#FFF8F1"
      />
    </svg>
  );
}

export function Logo({ tone = "cocoa" }: { tone?: "cocoa" | "cream" }) {
  return (
    <span className="inline-flex items-center gap-3.5">
      <Mark />
      <span
        className={`text-[1.35rem] leading-none font-extrabold tracking-[0.06em] uppercase ${
          tone === "cream" ? "text-cream" : "text-cocoa"
        }`}
      >
        FOREMAN
      </span>
    </span>
  );
}
