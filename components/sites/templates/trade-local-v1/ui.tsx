import type { ReactNode } from "react";
import {
  SiteIcon,
  type SiteIconKey,
} from "@/components/sites/templates/trade-local-v1/icons";

export function SectionEyebrow({
  children,
  color,
}: {
  children: ReactNode;
  color: string;
}) {
  return (
    <p
      className="text-sm font-bold uppercase tracking-[0.16em]"
      style={{ color }}
    >
      {children}
    </p>
  );
}

export function IconBadge({
  icon,
  color,
  size = "md",
}: {
  icon: SiteIconKey;
  color: string;
  size?: "sm" | "md" | "lg";
}) {
  const dim =
    size === "lg" ? "size-16" : size === "sm" ? "size-11" : "size-14";
  const iconClass =
    size === "lg" ? "size-8" : size === "sm" ? "size-5" : "size-7";

  return (
    <span
      className={`inline-flex ${dim} shrink-0 items-center justify-center rounded-full text-white shadow-sm`}
      style={{ background: color }}
      aria-hidden="true"
    >
      <SiteIcon name={icon} className={iconClass} />
    </span>
  );
}

export function StarRating({
  rating = 5,
  className = "",
}: {
  rating?: number;
  className?: string;
}) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div
      className={`flex items-center gap-0.5 ${className}`}
      aria-label={`${filled} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          viewBox="0 0 12 12"
          className="size-3.5"
          aria-hidden="true"
        >
          <path
            d="M6 1.1 7.4 4l3.1.5-2.25 2.2.55 3.15L6 8.35 3.2 9.85l.55-3.15L1.5 4.5 4.6 4 6 1.1z"
            fill={index < filled ? "#E8A317" : "#D4D4D8"}
          />
        </svg>
      ))}
    </div>
  );
}

export function InitialsAvatar({
  name,
  color,
}: {
  name: string;
  color: string;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <span
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
      style={{ background: color }}
      aria-hidden="true"
    >
      {initials || "?"}
    </span>
  );
}

export function OverlappingPhotos({
  primary,
  secondary,
  primaryAlt,
  secondaryAlt,
  primaryWidth,
  primaryHeight,
  secondaryWidth,
  secondaryHeight,
}: {
  primary: string;
  secondary?: string | null;
  primaryAlt: string;
  secondaryAlt?: string;
  primaryWidth?: number | null;
  primaryHeight?: number | null;
  secondaryWidth?: number | null;
  secondaryHeight?: number | null;
}) {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="overflow-hidden rounded-[22px] border border-black/5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.45)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={primary}
          alt={primaryAlt}
          width={primaryWidth ?? 1200}
          height={primaryHeight ?? 900}
          className="aspect-[4/3] w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
      {secondary ? (
        <div className="absolute -bottom-6 -right-2 w-[48%] overflow-hidden rounded-[16px] border-4 border-white shadow-[0_16px_32px_-20px_rgba(0,0,0,0.5)] sm:-right-4 sm:w-[44%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={secondary}
            alt={secondaryAlt ?? primaryAlt}
            width={secondaryWidth ?? 800}
            height={secondaryHeight ?? 600}
            className="aspect-[4/3] w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}
    </div>
  );
}
