"use client";

import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { demoCta, demoHref, primaryButtonClass } from "@/components/ui";

export type NavLink = {
  href: string;
  label: string;
};

export function SiteHeaderActions({ links }: { links: NavLink[] }) {
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
    <>
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
      {open ? (
        <nav
          id={menuId}
          className="absolute inset-x-0 top-full border-b-2 border-t-2 border-peach bg-cream px-5 py-4 xl:hidden"
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
    </>
  );
}
