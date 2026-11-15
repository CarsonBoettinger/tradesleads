"use client";

import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { demoCta, demoHref, primaryButtonClass } from "@/components/ui";

const links = [
  { href: "/#found", label: "Get found" },
  { href: "/#remembered", label: "Stay in mind" },
  { href: "/#booked", label: "Booked jobs" },
  { href: "/#how", label: "How it works" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const pathname = usePathname();
  const ctaHref = pathname === demoHref ? "#demo" : demoHref;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-peach bg-cream/90 backdrop-blur-md">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-[10px] focus:bg-foreman focus:px-4 focus:py-3 focus:font-bold focus:text-cream"
      >
        Skip to content
      </a>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <a href="/" aria-label="FOREMAN, home" className="rounded-xl">
          <Logo />
        </a>
        <nav className="hidden items-center gap-5 xl:flex" aria-label="Page">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-base font-bold text-cocoa transition-colors hover:text-foreman focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreman"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={ctaHref} className={`${primaryButtonClass} max-xl:hidden`}>
            {demoCta}
          </a>
          <button
            type="button"
            className="grid size-[52px] shrink-0 cursor-pointer place-items-center rounded-[10px] border-2 border-peach bg-white text-cocoa xl:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? (
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      {open ? (
        <nav
          id={menuId}
          className="border-t-2 border-peach px-5 py-4 xl:hidden"
          aria-label="Page"
        >
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="flex min-h-11 items-center text-lg font-bold text-cocoa"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={ctaHref}
            className={`${primaryButtonClass} mt-3 w-full`}
            onClick={() => setOpen(false)}
          >
            {demoCta}
          </a>
        </nav>
      ) : null}
    </header>
  );
}
