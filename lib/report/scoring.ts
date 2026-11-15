import { avgJobValue } from "@/lib/report/keywords";
import type {
  CompetitorItem,
  KeywordRank,
  PlaceDetails,
  ReportTrade,
  ReviewItem,
  ScoreCard,
  WebSignals,
} from "@/lib/report/types";

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function gradeFromScore(score: number): ScoreCard["grade"] {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 65) return "C";
  if (score >= 50) return "D";
  return "F";
}

function mapPackScore(keywords: KeywordRank[]) {
  if (!keywords.length) return 35;
  const scores = keywords.map((k) => {
    if (k.mapPackPosition == null) return 15;
    if (k.mapPackPosition === 1) return 100;
    if (k.mapPackPosition === 2) return 82;
    if (k.mapPackPosition === 3) return 68;
    if (k.mapPackPosition <= 6) return 45;
    return 28;
  });
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function organicScore(keywords: KeywordRank[]) {
  if (!keywords.length) return 30;
  const scores = keywords.map((k) => {
    if (k.organicPosition == null) return 12;
    if (k.organicPosition <= 3) return 95;
    if (k.organicPosition <= 10) return 72;
    if (k.organicPosition <= 20) return 48;
    return 25;
  });
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function listingsScore(
  place: PlaceDetails,
  competitors: CompetitorItem[],
  reviews: ReviewItem[],
) {
  const rating = place.rating ?? 0;
  const count = place.reviewCount ?? reviews.length;
  const ratingPart = (rating / 5) * 55;
  const volumePart = Math.min(35, Math.log10(Math.max(count, 1) + 1) * 18);
  const recentPart = reviews.length >= 3 ? 10 : reviews.length > 0 ? 5 : 0;

  const peerAvg =
    competitors.reduce((sum, c) => sum + (c.reviewCount ?? 0), 0) /
    Math.max(competitors.length, 1);
  const gapPenalty = peerAvg > count * 1.5 ? 12 : peerAvg > count ? 6 : 0;

  return clamp(ratingPart + volumePart + recentPart - gapPenalty);
}

function webExperienceScore(web: WebSignals) {
  if (!web.url) return 28;
  const parts = [
    web.performance ?? 45,
    web.seo ?? 50,
    web.accessibility ?? 55,
    web.bestPractices ?? 55,
  ];
  let score = parts.reduce((a, b) => a + b, 0) / parts.length;
  if (!web.hasHttps) score -= 18;
  if (web.mobileFriendly === false) score -= 12;

  const checks = web.checks ?? [];
  if (checks.length) {
    const known = checks.filter((c) => c.pass !== null);
    const failed = known.filter((c) => c.pass === false).length;
    score -= failed * 4;
    const passed = known.filter((c) => c.pass === true).length;
    if (passed >= 5) score += 3;
  }

  return clamp(score);
}

function competitorRank(
  place: PlaceDetails,
  competitors: CompetitorItem[],
): { rank: number; total: number } {
  const pool = [
    {
      placeId: place.placeId,
      rating: place.rating ?? 0,
      reviewCount: place.reviewCount ?? 0,
    },
    ...competitors.map((c) => ({
      placeId: c.placeId,
      rating: c.rating ?? 0,
      reviewCount: c.reviewCount ?? 0,
    })),
  ];

  pool.sort((a, b) => {
    const scoreA = a.rating * 20 + Math.log10(a.reviewCount + 1) * 10;
    const scoreB = b.rating * 20 + Math.log10(b.reviewCount + 1) * 10;
    return scoreB - scoreA;
  });

  const index = pool.findIndex((p) => p.placeId === place.placeId);
  return { rank: index >= 0 ? index + 1 : pool.length, total: pool.length };
}

/** Realistic monthly job ceiling by trade - Google alone does not feed dozens of builder jobs. */
const MONTHLY_MISS_CAP: Record<ReportTrade, { low: number; high: number }> = {
  Plumber: { low: 2, high: 10 },
  Roofer: { low: 1, high: 5 },
  Electrician: { low: 2, high: 8 },
  HVAC: { low: 1, high: 6 },
  Builder: { low: 1, high: 3 },
  Landscaper: { low: 2, high: 8 },
  "Another trade": { low: 1, high: 5 },
};

function missedJobsFromKeywords(keywords: KeywordRank[]) {
  // Conservative local demand model (jobs/month across the keyword set).
  let missed = 0;
  for (const k of keywords) {
    if (k.mapPackPosition == null) missed += 0.45;
    else if (k.mapPackPosition === 2) missed += 0.15;
    else if (k.mapPackPosition === 3) missed += 0.25;
    else if (k.mapPackPosition > 3) missed += 0.35;

    if (k.organicPosition == null) missed += 0.2;
    else if (k.organicPosition > 10) missed += 0.15;
    else if (k.organicPosition > 3) missed += 0.08;
  }
  return missed;
}

function estimateMissedJobs(
  trade: ReportTrade,
  keywords: KeywordRank[],
  searchScore: number,
) {
  const caps = MONTHLY_MISS_CAP[trade];
  const raw = missedJobsFromKeywords(keywords);
  const severity = clamp(100 - searchScore, 15, 100) / 100;
  const scaled = raw * (0.55 + severity * 0.7);
  const mid = Math.min(caps.high, Math.max(caps.low * 0.6, scaled));
  const low = Math.max(1, Math.round(Math.min(mid * 0.75, caps.high)));
  const high = Math.max(
    low + 1,
    Math.round(Math.min(Math.max(mid * 1.15, low + 1), caps.high)),
  );
  return { low, high };
}

export type CompetitorStanding = {
  placeId: string;
  name: string;
  rating: number | null;
  reviewCount: number | null;
  isYou: boolean;
  rank: number;
};

export function buildCompetitorStandings(input: {
  place: Pick<PlaceDetails, "placeId" | "name" | "rating" | "reviewCount">;
  competitors: CompetitorItem[];
}): CompetitorStanding[] {
  const pool = [
    {
      placeId: input.place.placeId,
      name: input.place.name,
      rating: input.place.rating,
      reviewCount: input.place.reviewCount,
      isYou: true,
    },
    ...input.competitors.map((c) => ({
      placeId: c.placeId,
      name: c.name,
      rating: c.rating,
      reviewCount: c.reviewCount,
      isYou: false,
    })),
  ];

  pool.sort((a, b) => {
    const scoreA =
      (a.rating ?? 0) * 20 + Math.log10((a.reviewCount ?? 0) + 1) * 10;
    const scoreB =
      (b.rating ?? 0) * 20 + Math.log10((b.reviewCount ?? 0) + 1) * 10;
    return scoreB - scoreA;
  });

  return pool.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}

export function buildScoreCard(input: {
  trade: ReportTrade;
  place: PlaceDetails;
  competitors: CompetitorItem[];
  keywords: KeywordRank[];
  web: WebSignals;
  reviews: ReviewItem[];
}): ScoreCard {
  const search = clamp(
    mapPackScore(input.keywords) * 0.65 + organicScore(input.keywords) * 0.35,
  );
  const web = webExperienceScore(input.web);
  const listings = listingsScore(
    input.place,
    input.competitors,
    input.reviews,
  );
  const overall = clamp(search * 0.4 + listings * 0.35 + web * 0.25);
  const { rank, total } = competitorRank(input.place, input.competitors);
  const jobValue = avgJobValue(input.trade);
  const { low: missedLow, high: missedHigh } = estimateMissedJobs(
    input.trade,
    input.keywords,
    search,
  );
  const lossLow = missedLow * jobValue;
  const lossHigh = missedHigh * jobValue;

  const topIssues: string[] = [];
  const packHits = input.keywords.filter((k) => k.inMapPack).length;
  if (packHits < 3) {
    topIssues.push("You are missing the map pack on most trade searches.");
  }
  if ((input.place.reviewCount ?? 0) < 40) {
    topIssues.push("Review volume is behind stronger local competitors.");
  }
  if (!input.web.url) {
    topIssues.push("No website was found on your Google listing.");
  } else if ((input.web.performance ?? 0) < 55) {
    topIssues.push("Your site is slow on mobile - people leave before calling.");
  }
  if ((input.web.seo ?? 100) < 60) {
    topIssues.push("Your website is hard for Google to understand for local jobs.");
  }
  if (topIssues.length === 0) {
    topIssues.push("A few local ranking gaps are still leaving calls on the table.");
  }

  const summary =
    overall >= 80
      ? "You show up in a few good spots, but competitors are still taking jobs you could win."
      : overall >= 60
        ? "Homeowners in your area are searching - you are only catching part of that demand."
        : "Most local searches for your trade are going to other businesses right now.";

  return {
    overall,
    searchScore: search,
    webScore: web,
    listingsScore: listings,
    grade: gradeFromScore(overall),
    competitorRank: rank,
    competitorTotal: total,
    estimatedMonthlyLossLow: lossLow,
    estimatedMonthlyLossHigh: lossHigh,
    estimatedJobsMissedLow: missedLow,
    estimatedJobsMissedHigh: missedHigh,
    avgJobValue: jobValue,
    summary,
    topIssues: topIssues.slice(0, 3),
  };
}

export function buildTeaser(input: {
  competitors: CompetitorItem[];
  reviews: ReviewItem[];
  web: WebSignals;
  place: PlaceDetails;
}) {
  const peerReviews = Math.max(
    ...input.competitors.map((c) => c.reviewCount ?? 0),
    0,
  );
  const yours = input.place.reviewCount ?? input.reviews.length;
  return {
    competitorHint:
      input.competitors.length > 0
        ? `We found ${input.competitors.length} nearby competitors on the map.`
        : "We scanned local results around your business.",
    reviewHint:
      peerReviews > yours
        ? `A nearby competitor has about ${peerReviews} reviews vs your ${yours}.`
        : `We pulled ${input.reviews.length || yours} recent reviews to score your listing.`,
    webHint: input.web.url
      ? "Your website loaded - we checked speed, mobile, and how clear the next step is."
      : "No website was linked on your Google listing.",
  };
}
