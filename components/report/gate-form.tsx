"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { formatPhone, parseEmail, parsePhone } from "@/lib/contact";
import { primaryButtonClass } from "@/components/ui";

const fieldClass =
  "mt-2 h-[48px] w-full rounded-[10px] border-2 border-peach bg-white px-4 text-[16px] text-cocoa outline-none transition-colors focus:border-foreman";

export function GateForm({
  onUnlock,
  compact = false,
}: {
  compact?: boolean;
  onUnlock: (input: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    consent: boolean;
    website?: string;
  }) => Promise<void>;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const emailParsed = parseEmail(email);
    if (!emailParsed.ok) {
      setError(emailParsed.error);
      setBusy(false);
      return;
    }
    const phoneParsed = parsePhone(phone);
    if (!phoneParsed.ok) {
      setError(phoneParsed.error);
      setBusy(false);
      return;
    }
    setPhone(phoneParsed.phone);

    try {
      await onUnlock({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: emailParsed.email,
        phone: phoneParsed.phone,
        consent,
        website: honeypot,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not unlock.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="text-sm font-bold tracking-[0.16em] uppercase text-foreman">
        Unlock your score
      </p>
      <h2
        className={`mt-2 font-extrabold tracking-[-0.02em] text-cocoa ${
          compact ? "text-2xl" : "text-3xl"
        }`}
      >
        Your report is ready
      </h2>
      <p className={`mt-2 text-muted ${compact ? "text-base" : "text-lg"}`}>
        Enter your details to unblur the full report card - scores, rough monthly
        miss, competitor rank, and keyword rankings.
      </p>

      <form className="relative mt-5 grid gap-3 sm:grid-cols-2" onSubmit={submit}>
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
        >
          <label htmlFor="report-website">Website</label>
          <input
            id="report-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>
        <label className="block text-sm font-bold text-cocoa">
          First name
          <input
            className={fieldClass}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
            required
          />
        </label>
        <label className="block text-sm font-bold text-cocoa">
          Last name
          <input
            className={fieldClass}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
            required
          />
        </label>
        <label className="block text-sm font-bold text-cocoa">
          Email
          <input
            className={fieldClass}
            type="email"
            inputMode="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className="block text-sm font-bold text-cocoa">
          Phone
          <input
            className={fieldClass}
            type="tel"
            inputMode="tel"
            placeholder="(519) 555-0123"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            autoComplete="tel"
            required
          />
        </label>
        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-sm text-muted">
            <input
              type="checkbox"
              className="mt-1 size-5 rounded border-2 border-peach"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>
              I agree Kalvez can contact me about this report and local growth
              help.
            </span>
          </label>
          <p className="mt-2 pl-8 text-sm leading-relaxed text-muted">
            <Link
              href="/privacy"
              className="font-bold text-cocoa underline decoration-peach underline-offset-4 hover:decoration-foreman focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreman"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              href="/terms"
              className="font-bold text-cocoa underline decoration-peach underline-offset-4 hover:decoration-foreman focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreman"
            >
              Terms of Service
            </Link>
            .
          </p>
        </div>
        {error ? (
          <p className="sm:col-span-2 text-sm font-semibold text-foreman">
            {error}
          </p>
        ) : null}
        <div className="sm:col-span-2">
          <button
            type="submit"
            className={`${primaryButtonClass} w-full`}
            disabled={busy}
          >
            {busy ? "Unlocking…" : "Show my report card"}
          </button>
        </div>
      </form>
    </div>
  );
}
