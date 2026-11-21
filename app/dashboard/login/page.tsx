"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/logo";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export default function DashboardLoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createBrowserSupabase();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signError) throw signError;
      router.replace(next.startsWith("/dashboard") ? next : "/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <section className="order-2 flex flex-col bg-white px-6 py-8 sm:px-12 lg:order-1 lg:min-h-dvh lg:px-16 lg:py-10 xl:px-20">
        <Link href="/" className="inline-flex w-fit rounded-md">
          <Logo />
        </Link>

        <div className="mx-auto flex w-full max-w-[420px] flex-col py-8 lg:flex-1 lg:justify-center lg:py-12">
          <p className="text-sm font-bold tracking-wide text-foreman uppercase">
            Dashboard
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-cocoa">
            Sign in
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Accounts are created by Kalvez. Use the email and password you were
            given, or the invite link from your assignment email.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <label className="block text-sm font-semibold text-cocoa" htmlFor="email">
              Email
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 h-12 w-full rounded-[10px] border-2 border-peach bg-cream px-3.5 text-base outline-none transition-colors placeholder:text-muted/70 focus:border-foreman focus:bg-white"
                placeholder="you@company.com"
              />
            </label>
            <label
              className="block text-sm font-semibold text-cocoa"
              htmlFor="password"
            >
              Password
              <input
                id="password"
                type="password"
                required
                minLength={8}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 h-12 w-full rounded-[10px] border-2 border-peach bg-cream px-3.5 text-base outline-none transition-colors placeholder:text-muted/70 focus:border-foreman focus:bg-white"
                placeholder="Your password"
              />
            </label>
            {error ? (
              <p className="text-sm font-medium text-red-600" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-[10px] bg-foreman text-sm font-bold text-white transition-colors hover:bg-[#d86324] disabled:opacity-60"
            >
              {loading ? "Please wait…" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-xs text-muted">
            Need access? Ask the Kalvez team for an invite.
          </p>
        </div>
      </section>

      <aside className="relative order-1 h-48 sm:h-64 lg:order-2 lg:h-auto lg:min-h-dvh">
        <Image
          src="/images/login/electrician.jpg"
          alt="Electrician in a hard hat wiring a panel"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-[center_30%] lg:object-[center_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cocoa/80 via-cocoa/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10 lg:p-12">
          <p className="text-sm font-bold tracking-wide text-sunrise uppercase">
            For the trades
          </p>
          <p className="mt-2 max-w-md text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            Built to get you found.
          </p>
          <p className="mt-3 hidden max-w-md text-sm leading-relaxed text-white/80 sm:block sm:text-base">
            Websites and local search for electricians, plumbers, roofers, and
            the rest of the trades.
          </p>
          <p className="mt-4 text-xs text-white/60">
            Photo from{" "}
            <a
              href="https://unsplash.com/license"
              className="underline decoration-white/30 underline-offset-2 hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              Unsplash
            </a>
          </p>
        </div>
      </aside>
    </div>
  );
}
