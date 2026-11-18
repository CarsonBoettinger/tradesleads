"use client";

import { useEffect, useState, type FormEvent } from "react";
import { BusinessAutocomplete } from "@/components/report/business-autocomplete";
import { ScanStage } from "@/components/report/scan-stage";
import { ScoreCardView } from "@/components/report/score-card";
import type {
  KeywordRank,
  PlaceCandidate,
  PublicReportPayload,
  ReportPhase,
  ScoreCard,
} from "@/lib/report/types";
import { primaryButtonClass } from "@/components/ui";

type Step = "search" | "confirm" | "scan" | "gate" | "score";

export function ReportFlow() {
  const [step, setStep] = useState<Step>("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceCandidate[]>([]);
  const [selected, setSelected] = useState<PlaceCandidate | null>(null);
  const [searching, setSearching] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  const [reportId, setReportId] = useState<string | null>(null);
  const [unlockToken, setUnlockToken] = useState<string | null>(null);
  const [phase, setPhase] = useState<ReportPhase>("queued");
  const [payload, setPayload] = useState<PublicReportPayload | null>(null);
  const [score, setScore] = useState<ScoreCard | null>(null);
  const [keywords, setKeywords] = useState<KeywordRank[]>([]);

  async function searchBusiness(event: FormEvent) {
    event.preventDefault();

    if (selected) {
      void startScan();
      return;
    }

    setSearching(true);
    setError(null);
    try {
      const response = await fetch("/api/report/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Search failed.");
      setResults(data.results ?? []);
      setDemoMode(Boolean(data.demo));
      setSelected(null);
      setStep("confirm");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed.");
    } finally {
      setSearching(false);
    }
  }

  async function startScan() {
    if (!selected) return;
    setStarting(true);
    setError(null);
    try {
      const response = await fetch("/api/report/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId: selected.placeId,
          businessName: selected.name,
          address: selected.address,
          types: selected.types,
          lat: selected.lat,
          lng: selected.lng,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not start scan.");
      setReportId(data.reportId);
      setUnlockToken(data.unlockToken);
      setPhase("queued");
      setPayload(null);
      setScore(null);
      setKeywords([]);
      setStep("scan");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start scan.");
    } finally {
      setStarting(false);
    }
  }

  useEffect(() => {
    if (step !== "scan" && step !== "gate") return;
    if (!reportId || !unlockToken) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function poll() {
      try {
        const response = await fetch(
          `/api/report/status?reportId=${encodeURIComponent(reportId!)}&token=${encodeURIComponent(unlockToken!)}`,
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Status failed.");
        if (cancelled) return;

        setPhase(data.phase as ReportPhase);
        setPayload(data.public as PublicReportPayload);

        if (data.status === "ready") {
          setStep("gate");
          return;
        }
        if (data.status === "unlocked") {
          setScore(data.score);
          setKeywords(data.keywords ?? []);
          setStep("score");
          return;
        }
        if (data.status === "failed") {
          setError(data.error ?? "Scan failed.");
          return;
        }

        timer = setTimeout(poll, 1200);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Status failed.");
          timer = setTimeout(poll, 2500);
        }
      }
    }

    void poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [step, reportId, unlockToken]);

  async function unlock(input: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    consent: boolean;
    website?: string;
  }) {
    if (!reportId || !unlockToken) {
      throw new Error("Missing report session.");
    }
    const response = await fetch("/api/report/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reportId,
        unlockToken,
        ...input,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Unlock failed.");
    setScore(data.score);
    setKeywords(data.keywords ?? []);
    if (data.web || data.competitors) {
      setPayload((current) =>
        current
          ? {
              ...current,
              web: data.web ?? current.web,
              competitors: data.competitors ?? current.competitors,
            }
          : current,
      );
    }
    setStep("score");
  }

  return (
    <div className="space-y-8">
      {step === "search" || step === "confirm" ? (
        <section className="rounded-[12px] border-2 border-peach bg-white p-6 sm:p-8">
          <p className="text-base font-bold tracking-[0.16em] uppercase text-foreman">
            Free digital presence report
          </p>
          <h1 className="mt-3 text-[2.25rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-cocoa sm:text-5xl">
            See how your business shows up online
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Find your listing, watch the scan across search, your website, and
            local reviews, then unlock your report card.
          </p>

          <form
            className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]"
            onSubmit={searchBusiness}
          >
            <BusinessAutocomplete
              value={query}
              selected={selected}
              onQueryChange={setQuery}
              onSelect={(place) => {
                setSelected(place);
                setQuery(place.name);
                setResults([]);
                setStep("search");
                setError(null);
              }}
              onClearSelection={() => setSelected(null)}
            />
            <div className="flex items-end">
              <button
                type="submit"
                className={`${primaryButtonClass} w-full sm:min-w-[180px]`}
                disabled={searching || starting || (!selected && query.trim().length < 3)}
              >
                {selected
                  ? starting
                    ? "Starting scan…"
                    : "Scan this business"
                  : searching
                    ? "Searching…"
                    : "Find business"}
              </button>
            </div>
          </form>

          {selected ? (
            <div className="mt-4 rounded-[10px] border-2 border-foreman bg-peach/50 px-4 py-3">
              <p className="text-base font-bold text-cocoa">{selected.name}</p>
              <p className="mt-1 text-sm text-muted">{selected.address}</p>
            </div>
          ) : null}

          {demoMode && process.env.NODE_ENV !== "production" ? (
            <p className="mt-3 text-sm text-muted">
              Demo data mode - add a Google Places API key for live results.
            </p>
          ) : null}
        </section>
      ) : null}

      {step === "confirm" ? (
        <section className="rounded-[12px] border-2 border-peach bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold text-cocoa">
            Pick the right listing
          </h2>
          <p className="mt-2 text-base text-muted">
            Choose the business with the correct address.
          </p>
          <ul className="mt-5 space-y-3">
            {results.map((item) => {
              const active = selected?.placeId === item.placeId;
              return (
                <li key={item.placeId}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(item);
                      setQuery(item.name);
                    }}
                    className={`w-full rounded-[10px] border-2 px-4 py-4 text-left transition-colors ${
                      active
                        ? "border-foreman bg-peach"
                        : "border-peach bg-cream/60 hover:bg-peach/50"
                    }`}
                  >
                    <p className="text-lg font-bold text-cocoa">{item.name}</p>
                    <p className="mt-1 text-base text-muted">{item.address}</p>
                    {item.rating != null ? (
                      <p className="mt-1 text-sm text-muted">
                        {item.rating.toFixed(1)} ★
                        {item.reviewCount != null
                          ? ` · ${item.reviewCount} reviews`
                          : ""}
                      </p>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
          {!results.length ? (
            <p className="mt-4 text-base text-muted">
              No matches. Try a fuller business name or town.
            </p>
          ) : null}
          <button
            type="button"
            className={`${primaryButtonClass} mt-6`}
            disabled={!selected || starting}
            onClick={() => void startScan()}
          >
            {starting ? "Starting scan…" : "Scan this business"}
          </button>
        </section>
      ) : null}

      {step === "scan" || step === "gate" ? (
        <ScanStage
          phase={phase}
          payload={payload}
          businessName={
            selected?.name ?? payload?.businessName ?? "your business"
          }
          ready={step === "gate" || phase === "ready"}
          onUnlock={unlock}
        />
      ) : null}

      {step === "score" && score ? (
        <ScoreCardView
          score={score}
          keywords={keywords}
          businessName={
            selected?.name ?? payload?.businessName ?? "Your business"
          }
          competitors={payload?.competitors ?? []}
          placeId={selected?.placeId ?? null}
          rating={payload?.rating ?? selected?.rating ?? null}
          reviewCount={
            payload?.reviewCount ?? selected?.reviewCount ?? null
          }
          web={payload?.web ?? null}
        />
      ) : null}

      {error ? (
        <p className="rounded-[10px] border-2 border-foreman/30 bg-peach px-4 py-3 text-base font-semibold text-cocoa">
          {error}
        </p>
      ) : null}
    </div>
  );
}
