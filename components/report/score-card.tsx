import type {
  CompetitorItem,
  KeywordRank,
  ScoreCard as ScoreCardType,
  WebSignals,
} from "@/lib/report/types";
import { buildCompetitorStandings } from "@/lib/report/scoring";
import { ScoreRing } from "@/components/report/score-ring";
import { demoHref } from "@/components/ui";

function money(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function rankLabel(position: number | null) {
  if (position == null) return "Not on page 1";
  return `#${position}`;
}

function stars(rating: number | null) {
  if (rating == null) return "No rating";
  return `${rating.toFixed(1)} ★`;
}

export function ScoreCardView({
  score,
  keywords,
  businessName,
  competitors,
  placeId,
  rating,
  reviewCount,
  web,
}: {
  score: ScoreCardType;
  keywords: KeywordRank[];
  businessName: string;
  competitors: CompetitorItem[];
  placeId: string | null;
  rating: number | null;
  reviewCount: number | null;
  web: WebSignals | null;
}) {
  const standings = buildCompetitorStandings({
    place: {
      placeId: placeId || "you",
      name: businessName,
      rating,
      reviewCount,
    },
    competitors,
  });

  return (
    <section className="space-y-8">
      <div className="rounded-[12px] border-2 border-peach bg-white p-6 sm:p-8">
        <p className="text-base font-bold tracking-[0.16em] uppercase text-foreman">
          Report card
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.02em] text-cocoa sm:text-4xl">
          {businessName}
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-muted">{score.summary}</p>

        <div className="mt-8">
          <div className="flex flex-wrap items-end justify-center gap-6 sm:gap-8">
            <ScoreRing label="Overall" score={score.overall} size="lg" />
            <ScoreRing label="Search" score={score.searchScore} />
            <ScoreRing label="Website" score={score.webScore} />
            <ScoreRing label="Listings" score={score.listingsScore} />
          </div>

          {web?.checks?.length ? (
            <div className="mt-8">
              <p className="text-sm font-bold tracking-[0.14em] uppercase text-cocoa">
                Common website checks
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {web.checks.map((check) => (
                  <li
                    key={check.id}
                    className="rounded-[10px] border border-peach bg-cream/70 px-4 py-3"
                  >
                    <p className="flex items-center gap-2 text-base font-bold text-cocoa">
                      <span
                        className={
                          check.pass === true
                            ? "text-teal-700"
                            : check.pass === false
                              ? "text-red-600"
                              : "text-muted"
                        }
                      >
                        {check.pass === true
                          ? "✓"
                          : check.pass === false
                            ? "✗"
                            : "·"}
                      </span>
                      {check.label}
                    </p>
                    <p className="mt-1 text-sm text-muted">{check.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[12px] bg-peach/60 p-5">
            <p className="text-sm font-bold tracking-[0.14em] uppercase text-cocoa">
              Rough monthly miss
            </p>
            <p className="mt-2 text-3xl font-extrabold text-cocoa">
              {money(score.estimatedMonthlyLossLow)}–
              {money(score.estimatedMonthlyLossHigh)}
            </p>
            <p className="mt-2 text-base text-muted">
              About {score.estimatedJobsMissedLow}–
              {score.estimatedJobsMissedHigh} jobs/month at ~
              {money(score.avgJobValue)} average. Rough range from local ranking
              gaps - not a promise.
            </p>
          </div>
          <div className="rounded-[12px] bg-peach/60 p-5">
            <p className="text-sm font-bold tracking-[0.14em] uppercase text-cocoa">
              Among nearby competitors
            </p>
            <p className="mt-2 text-3xl font-extrabold text-cocoa">
              #{score.competitorRank} of {score.competitorTotal}
            </p>
            <ol className="mt-4 space-y-2">
              {standings.map((row) => (
                <li
                  key={row.placeId}
                  className={`flex items-center justify-between gap-3 rounded-[10px] px-3 py-2 text-sm ${
                    row.isYou
                      ? "bg-foreman text-cream"
                      : "bg-white/80 text-cocoa"
                  }`}
                >
                  <span className="min-w-0 font-bold">
                    <span className="mr-2 tabular-nums opacity-80">
                      #{row.rank}
                    </span>
                    <span className="truncate">
                      {row.isYou ? "You" : row.name}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 tabular-nums ${
                      row.isYou ? "text-cream/90" : "text-muted"
                    }`}
                  >
                    {stars(row.rating)}
                    {row.reviewCount != null ? (
                      <span className="ml-1 opacity-80">
                        ({row.reviewCount})
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ol>
            {score.topIssues.length ? (
              <ul className="mt-4 space-y-2 text-base text-muted">
                {score.topIssues.map((issue) => (
                  <li key={issue}>• {issue}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-[12px] border-2 border-peach bg-white p-6 sm:p-8">
        <h3 className="text-2xl font-extrabold tracking-[-0.02em] text-cocoa">
          Key trade searches
        </h3>
        <p className="mt-2 text-base text-muted">
          Sampled across your ~25-mile service area and nearby towns - limited
          checks to save search credits.
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-base">
            <thead>
              <tr className="border-b border-peach text-sm tracking-[0.08em] uppercase text-muted">
                <th className="py-3 pr-4 font-bold">Keyword</th>
                <th className="py-3 pr-4 font-bold">Map pack</th>
                <th className="py-3 font-bold">Search</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((row) => (
                <tr key={row.keyword} className="border-b border-peach/70">
                  <td className="py-3 pr-4 font-semibold text-cocoa">
                    {row.keyword}
                  </td>
                  <td className="py-3 pr-4 text-muted">
                    {rankLabel(row.mapPackPosition)}
                  </td>
                  <td className="py-3 text-muted">
                    {rankLabel(row.organicPosition)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-[12px] bg-foreman px-6 py-8 text-center sm:px-10">
        <h3 className="text-2xl font-extrabold text-cream sm:text-3xl">
          Want help fixing the gaps?
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-base text-cream/90">
          Book a free 20-minute demo and we will walk through what to fix first.
        </p>
        <a
          href={demoHref}
          className="mt-6 inline-flex h-[52px] items-center justify-center rounded-[10px] bg-cream px-7 text-[17px] font-bold text-foreman transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
        >
          Book a free demo
        </a>
      </div>
    </section>
  );
}
