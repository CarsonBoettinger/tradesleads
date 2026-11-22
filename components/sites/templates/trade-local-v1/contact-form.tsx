"use client";

import { useRef, useState } from "react";
import {
  TurnstileWidget,
  type TurnstileHandle,
} from "@/components/security/turnstile-widget";

export function SiteContactForm({
  brandId,
  brandSlug,
  ctaLabel,
  accent,
}: {
  brandId: string;
  brandSlug: string;
  ctaLabel: string;
  accent: string;
}) {
  const turnstileRef = useRef<TurnstileHandle>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const turnstileToken = (await turnstileRef.current?.getToken()) ?? "";
      if (
        process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() &&
        !turnstileToken
      ) {
        setStatus("error");
        setMessage("Complete the security check and try again.");
        return;
      }

      const response = await fetch("/api/sites/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId,
          brandSlug,
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? ""),
          details: String(data.get("details") ?? ""),
          website: String(data.get("website") ?? ""),
          turnstileToken,
        }),
      });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) {
        turnstileRef.current?.reset();
        setStatus("error");
        setMessage(json.error ?? "Could not send message.");
        return;
      }
      setStatus("ok");
      setMessage("Thanks - we received your request.");
      form.reset();
      turnstileRef.current?.reset();
    } catch {
      turnstileRef.current?.reset();
      setStatus("error");
      setMessage("Could not send message right now.");
    }
  }

  const fieldClass =
    "mt-1.5 h-12 w-full rounded-[10px] border-2 border-black/10 bg-white px-3 text-[15px] outline-none focus:border-[color:var(--site-accent)]";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[16px] border border-black/5 bg-[color:var(--site-surface)] p-5 shadow-sm"
      style={{ ["--site-accent" as string]: accent }}
    >
      <label className="block text-sm font-semibold">
        Name
        <input name="name" required className={fieldClass} />
      </label>
      <label className="mt-4 block text-sm font-semibold">
        Email
        <input name="email" type="email" required className={fieldClass} />
      </label>
      <label className="mt-4 block text-sm font-semibold">
        Phone
        <input name="phone" type="tel" className={fieldClass} />
      </label>
      <label className="mt-4 block text-sm font-semibold">
        How can we help?
        <textarea
          name="details"
          required
          rows={4}
          className="mt-1.5 w-full rounded-[10px] border-2 border-black/10 bg-white px-3 py-2 text-[15px] outline-none focus:border-[color:var(--site-accent)]"
        />
      </label>
      {/* Honeypot */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden
      />
      <div className="mt-4">
        <TurnstileWidget ref={turnstileRef} />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-5 w-full rounded-[10px] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
        style={{ background: accent }}
      >
        {status === "loading" ? "Sending…" : ctaLabel}
      </button>
      {message ? (
        <p
          className={`mt-3 text-sm ${status === "error" ? "text-red-600" : "text-emerald-700"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
