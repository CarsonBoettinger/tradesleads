import type { ReactNode } from "react";

export const demoCta = "Book a free demo";
export const demoHref = "/free-demo";

export const reportCta = "Get my free report";
export const reportHref = "/report";

export const primaryButtonClass =
  "inline-flex h-[52px] cursor-pointer items-center justify-center rounded-[10px] bg-foreman px-6 text-center text-[17px] font-bold whitespace-nowrap text-cream transition-colors hover:bg-[#9a3412] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreman";

export const ghostButtonClass =
  "inline-flex h-[52px] cursor-pointer items-center justify-center rounded-[10px] border-2 border-peach bg-white px-6 text-center text-[17px] font-bold text-cocoa transition-colors hover:bg-peach focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreman";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  on = "cream",
}: {
  children: ReactNode;
  on?: "cream" | "peach";
}) {
  return (
    <p
      className={`text-base font-bold tracking-[0.16em] uppercase ${
        on === "peach" ? "text-cocoa" : "text-foreman"
      }`}
    >
      {children}
    </p>
  );
}

export function CtaLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`${variant === "primary" ? primaryButtonClass : ghostButtonClass} ${className}`}
    >
      {children}
    </a>
  );
}
