"use client";

import { useEffect, useRef, useState } from "react";
import { BlurredReport } from "@/components/report/blurred-report";
import { CompetitorMap } from "@/components/report/competitor-map";
import type { PublicReportPayload, ReportPhase } from "@/lib/report/types";

type Act = "map" | "web" | "listings" | "gate";

const acts: Array<{ id: Act; label: string }> = [
  { id: "map", label: "Search results" },
  { id: "web", label: "Web experience" },
  { id: "listings", label: "Local listings" },
  { id: "gate", label: "Report ready" },
];

function phaseRank(phase: ReportPhase) {
  if (phase === "queued" || phase === "search") return 0;
  if (phase === "web") return 1;
  if (phase === "listings") return 2;
  if (phase === "ready") return 3;
  return 0;
}

export function ScanStage({
  phase,
  payload,
  businessName,
  ready,
  onUnlock,
}: {
  phase: ReportPhase;
  payload: PublicReportPayload | null;
  businessName: string;
  ready: boolean;
  onUnlock: (input: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    consent: boolean;
  }) => Promise<void>;
}) {
  const [act, setAct] = useState<Act>("map");
  const [mapBeat, setMapBeat] = useState<"finding" | "you" | "competitors" | "done">(
    "finding",
  );
  const [webBeat, setWebBeat] = useState<"loading" | "scanning" | "done">(
    "loading",
  );
  const [listBeat, setListBeat] = useState<"pulling" | "scanning" | "done">(
    "pulling",
  );
  const [shownCompetitors, setShownCompetitors] = useState(0);
  const [shownReviews, setShownReviews] = useState(0);
  const mapDoneRef = useRef(false);
  const webDoneRef = useRef(false);
  const listDoneRef = useRef(false);

  const competitors = payload?.competitors ?? [];
  const reviews = payload?.reviews ?? [];
  const web = payload?.web;
  const siteUrl = web?.url ?? payload?.website ?? null;
  const serverRank = phaseRank(phase);
  const actIndex = acts.findIndex((item) => item.id === act);

  // 1) Map: find you → competitors → complete → web
  useEffect(() => {
    if (act !== "map") return;

    const timers: Array<ReturnType<typeof setTimeout>> = [];
    const intervals: Array<ReturnType<typeof setInterval>> = [];
    // Drop "You" first, then wait before competitor pins.
    timers.push(setTimeout(() => setMapBeat("you"), 900));

    let competitorsStarted = false;
    const startCompetitors = () => {
      if (competitorsStarted) return;
      competitorsStarted = true;
      setMapBeat("competitors");
    };

    // Hold on "You" for a beat, then reveal rivals once data is ready.
    timers.push(
      setTimeout(() => {
        const poll = setInterval(() => {
          if (competitors.length > 0 || serverRank >= 1) {
            clearInterval(poll);
            startCompetitors();
          }
        }, 200);
        intervals.push(poll);
        timers.push(
          setTimeout(() => {
            clearInterval(poll);
            startCompetitors();
          }, 6000),
        );
      }, 1800),
    );

    return () => {
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [act, competitors.length, serverRank]);

  useEffect(() => {
    if (act !== "map" || mapBeat !== "competitors" || mapDoneRef.current) return;

    setShownCompetitors(0);
    const total = Math.max(competitors.length, 1);
    const timers: Array<ReturnType<typeof setTimeout>> = [];

    for (let i = 1; i <= total; i += 1) {
      timers.push(setTimeout(() => setShownCompetitors(i), i * 520));
    }

    timers.push(
      setTimeout(() => {
        if (mapDoneRef.current) return;
        mapDoneRef.current = true;
        setMapBeat("done");
        setAct("web");
        setWebBeat("loading");
      }, total * 520 + 1100),
    );

    return () => timers.forEach(clearTimeout);
  }, [act, mapBeat, competitors.length]);

  // 2) Web: load site → scan → listings (no score reveal during the scan)
  useEffect(() => {
    if (act !== "web" || webDoneRef.current) return;

    if (webBeat === "loading") {
      const timer = setTimeout(() => setWebBeat("scanning"), 1400);
      return () => clearTimeout(timer);
    }

    if (webBeat === "scanning") {
      const scoresReady =
        web != null &&
        (web.performance != null || web.seo != null || !web.url);

      const finish = () => {
        if (webDoneRef.current) return;
        webDoneRef.current = true;
        setWebBeat("done");
        setAct("listings");
        setListBeat("pulling");
      };

      if (scoresReady || serverRank >= 2) {
        const timer = setTimeout(finish, 1600);
        return () => clearTimeout(timer);
      }

      const poll = setInterval(() => {
        if (
          (web != null &&
            (web.performance != null || web.seo != null || !web.url)) ||
          serverRank >= 2
        ) {
          clearInterval(poll);
          finish();
        }
      }, 300);
      const fallback = setTimeout(() => {
        clearInterval(poll);
        finish();
      }, 12000);
      return () => {
        clearInterval(poll);
        clearTimeout(fallback);
      };
    }
  }, [act, webBeat, web, serverRank]);

  // 3) Listings: pull reviews → scan → gate
  useEffect(() => {
    if (act !== "listings" || listDoneRef.current) return;
    const timers: Array<ReturnType<typeof setTimeout>> = [];

    if (listBeat === "pulling") {
      timers.push(setTimeout(() => setListBeat("scanning"), 700));
    }

    if (listBeat === "scanning") {
      setShownReviews(0);
      const count = Math.min(Math.max(reviews.length, 3), 3);
      for (let i = 1; i <= count; i += 1) {
        timers.push(setTimeout(() => setShownReviews(i), i * 400));
      }
      timers.push(
        setTimeout(() => {
          setListBeat("done");
          const goGate = () => {
            if (listDoneRef.current) return;
            listDoneRef.current = true;
            setAct("gate");
          };
          if (ready || serverRank >= 3) {
            goGate();
          } else {
            const poll = setInterval(() => {
              if (ready || serverRank >= 3) {
                clearInterval(poll);
                goGate();
              }
            }, 300);
            timers.push(
              setTimeout(() => {
                clearInterval(poll);
                goGate();
              }, 10000),
            );
          }
        }, count * 400 + 1200),
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [act, listBeat, reviews.length, ready, serverRank]);

  useEffect(() => {
    if (act === "listings" && listBeat === "done" && ready && !listDoneRef.current) {
      listDoneRef.current = true;
      setAct("gate");
    }
  }, [act, listBeat, ready]);

  const statusCopy =
    act === "map"
      ? mapBeat === "finding"
        ? "Finding you on the map…"
        : mapBeat === "you"
          ? "Located your listing. Scanning nearby competitors…"
          : mapBeat === "competitors"
            ? "Comparing you with nearby competitors…"
            : "Search scan complete."
      : act === "web"
        ? webBeat === "loading"
          ? "Pulling up your website…"
          : webBeat === "scanning"
            ? "Scanning pages, speed, and mobile experience…"
            : "Website scan complete."
        : act === "listings"
          ? listBeat === "pulling"
            ? "Pulling local listing reviews…"
            : "Reading review strength and gaps…"
          : "Report ready - unlock to see your scores.";

  return (
    <section className="space-y-6">
      <div>
        <p className="text-base font-bold tracking-[0.16em] uppercase text-foreman">
          Scanning
        </p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.02em] text-cocoa">
          Checking {businessName}
        </h2>
        <p className="mt-2 text-lg text-muted">{statusCopy}</p>
      </div>

      <ol className="grid gap-2 sm:grid-cols-4">
        {acts.map((item, index) => {
          const done = index < actIndex || act === "gate";
          const active = item.id === act && act !== "gate";
          return (
            <li
              key={item.id}
              className={`rounded-[10px] border-2 px-3 py-3 text-sm font-bold transition-colors ${
                done || active
                  ? "border-foreman bg-peach text-cocoa"
                  : "border-peach bg-white text-muted"
              }`}
            >
              <span className="mr-2 tabular-nums">{index + 1}.</span>
              {item.label}
              {done && !(active || item.id === act) ? (
                <span className="ml-2 text-foreman">✓</span>
              ) : null}
            </li>
          );
        })}
      </ol>

      {act === "map" ? (
        <div className="overflow-hidden rounded-[12px] border-2 border-peach bg-white p-5">
          <p className="text-sm font-bold tracking-[0.14em] uppercase text-cocoa">
            Map of your area
          </p>
          <div className="mt-4">
            <CompetitorMap
              lat={payload?.lat ?? null}
              lng={payload?.lng ?? null}
              locating={mapBeat === "finding"}
              showYou={mapBeat !== "finding"}
              competitors={
                mapBeat === "competitors" || mapBeat === "done"
                  ? competitors.slice(0, shownCompetitors)
                  : []
              }
            />
          </div>
          <p className="mt-3 text-sm text-muted">
            {mapBeat === "finding"
              ? "Searching the map pack around your listing…"
              : mapBeat === "you"
                ? "Found you. Looking for competitors within ~25 miles…"
                : (payload?.teaser.competitorHint ??
                  `Found ${competitors.length} competitors nearby.`)}
          </p>
        </div>
      ) : null}

      {act === "web" ? (
        <div className="relative overflow-hidden rounded-[12px] border-2 border-peach bg-white">
          <div className="flex items-center gap-2 border-b-2 border-peach bg-cream px-4 py-3">
            <span className="size-2.5 rounded-full bg-[#E5C7B0]" />
            <span className="size-2.5 rounded-full bg-[#E5C7B0]" />
            <span className="size-2.5 rounded-full bg-[#E5C7B0]" />
            <div className="ml-2 flex-1 truncate rounded-md bg-white px-3 py-1 text-sm text-muted">
              {siteUrl ??
                (webBeat === "loading"
                  ? "Opening site…"
                  : "No website on listing")}
            </div>
          </div>
          <div className="relative">
            <div className="relative h-[280px] overflow-hidden bg-cream">
              {web?.screenshot ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={web.screenshot}
                  alt={`Preview of ${businessName} website`}
                  className="h-full w-full object-cover object-top"
                />
              ) : siteUrl ? (
                <iframe
                  title={`${businessName} website preview`}
                  src={siteUrl}
                  className="h-[280%] w-full origin-top scale-[0.55] border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full flex-col justify-center gap-3 p-6">
                  <div className="h-4 w-2/3 rounded bg-peach" />
                  <div className="h-3 w-full rounded bg-peach/70" />
                  <div className="h-3 w-5/6 rounded bg-peach/70" />
                  <p className="mt-2 text-sm font-bold text-muted">
                    No website linked on this Google listing.
                  </p>
                </div>
              )}
              {webBeat === "scanning" ? (
                <div className="website-scan pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(194,65,12,0.14),transparent)]" />
              ) : null}
              {webBeat === "loading" && siteUrl ? (
                <div className="absolute inset-0 grid place-items-center bg-cream/70">
                  <p className="text-sm font-bold text-cocoa">
                    Opening your website…
                  </p>
                </div>
              ) : null}
            </div>
            <p className="border-t-2 border-peach px-4 py-3 text-sm text-muted">
              {webBeat === "loading"
                ? "Loading your website…"
                : "Scanning the page - then we check local listings."}
            </p>
          </div>
        </div>
      ) : null}

      {act === "listings" ? (
        <div className="rounded-[12px] border-2 border-peach bg-white p-5">
          <p className="text-sm font-bold tracking-[0.14em] uppercase text-cocoa">
            Reviews
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {(reviews.length ? reviews : placeholderReviews)
              .slice(0, shownReviews)
              .map((review, index) => (
                <article
                  key={`${review.author}-${index}`}
                  className="review-card relative overflow-hidden rounded-[10px] border border-peach bg-cream/80 p-4"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <p className="text-sm font-bold text-cocoa">
                    {"★".repeat(Math.max(1, Math.round(review.rating)))}
                    <span className="ml-2 font-semibold text-muted">
                      {review.author}
                    </span>
                  </p>
                  <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted">
                    {review.text || "Scanning review text…"}
                  </p>
                  {listBeat === "scanning" ? (
                    <div className="review-scan absolute inset-0" />
                  ) : null}
                </article>
              ))}
          </div>
          {shownReviews === 0 ? (
            <p className="mt-4 text-sm text-muted">Pulling reviews from Google…</p>
          ) : (
            <p className="mt-3 text-sm text-muted">
              {payload?.teaser.reviewHint ??
                `Pulled ${reviews.length || shownReviews} recent reviews.`}
            </p>
          )}
        </div>
      ) : null}

      {act === "gate" ? (
        <BlurredReport businessName={businessName} onUnlock={onUnlock} />
      ) : null}
    </section>
  );
}

const placeholderReviews = [
  {
    author: "Customer",
    rating: 5,
    text: "Scanning review text…",
    relativeTime: null,
  },
  {
    author: "Customer",
    rating: 4,
    text: "Scanning review text…",
    relativeTime: null,
  },
  {
    author: "Customer",
    rating: 5,
    text: "Scanning review text…",
    relativeTime: null,
  },
];
