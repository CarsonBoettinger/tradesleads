import "server-only";

import {
  reportKeywordLimit,
  shouldUseReportDemoData,
} from "@/lib/report/config";
import {
  demoCompetitors,
  demoKeywords,
  demoPlaceDetails,
  demoWeb,
} from "@/lib/report/demo-data";
import {
  inferTrade,
  keywordsForServiceArea,
  keywordsForTrade,
  isReportTrade,
} from "@/lib/report/keywords";
import {
  findNearbyCompetitors,
  getPlaceDetails,
} from "@/lib/report/places";
import { scanWebsite } from "@/lib/report/pagespeed";
import { buildScoreCard, buildTeaser } from "@/lib/report/scoring";
import {
  localSearchConfigured,
  rankKeywords,
} from "@/lib/report/keyword-rank";
import {
  SERVICE_AREA_MILES,
  resolveServiceAreaTowns,
} from "@/lib/report/service-area";
import { getSupabaseAdmin } from "@/lib/supabase";
import type {
  KeywordRank,
  PlaceDetails,
  PublicReportPayload,
  ReportPhase,
  ReportTrade,
  ScorePayload,
} from "@/lib/report/types";

async function updateReport(
  id: string,
  patch: Record<string, unknown>,
) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("presence_reports")
    .update(patch)
    .eq("id", id);
  if (error) throw error;
}

function useDemoProviders() {
  return shouldUseReportDemoData();
}

async function loadPlace(
  placeId: string,
  trade: ReportTrade,
  businessName: string,
): Promise<PlaceDetails> {
  if (useDemoProviders() || placeId.startsWith("demo-")) {
    return demoPlaceDetails(placeId, trade, businessName);
  }
  return getPlaceDetails(placeId);
}

export async function runPresenceReport(reportId: string) {
  const supabase = getSupabaseAdmin();
  const { data: report, error } = await supabase
    .from("presence_reports")
    .select("*")
    .eq("id", reportId)
    .single();

  if (error || !report) {
    throw new Error(error?.message ?? "Report not found.");
  }

  if (!isReportTrade(report.trade)) {
    throw new Error("Invalid trade on report.");
  }

  if (
    report.status === "scanning" ||
    report.status === "ready" ||
    report.status === "unlocked"
  ) {
    return;
  }

  const trade = report.trade as ReportTrade;

  try {
    await updateReport(reportId, {
      status: "scanning",
      phase: "search" satisfies ReportPhase,
    });

    const place = await loadPlace(
      report.place_id,
      trade,
      report.business_name,
    );

    const resolvedTrade = inferTrade({
      types: place.types,
      name: place.name,
    });
    const activeTrade =
      resolvedTrade !== "Another trade" || trade === "Another trade"
        ? resolvedTrade
        : trade;

    let serviceTowns = await resolveServiceAreaTowns({
      lat: place.lat,
      lng: place.lng,
      homeTown: place.town,
    });

    let competitors = demoCompetitors();
    if (!useDemoProviders() && place.lat != null && place.lng != null) {
      try {
        competitors = await findNearbyCompetitors({
          lat: place.lat,
          lng: place.lng,
          trade: activeTrade,
          excludePlaceId: place.placeId,
          towns: serviceTowns,
        });
      } catch (err) {
        console.error("Competitor scan failed:", err);
      }
    }

    // Enrich towns from competitors found inside the 25-mile area.
    serviceTowns = await resolveServiceAreaTowns({
      lat: place.lat,
      lng: place.lng,
      homeTown: place.town,
      competitorAddresses: competitors.map((c) => c.address),
    });

    const keywordLimit = reportKeywordLimit();
    const tradeKeywords = keywordsForServiceArea(
      activeTrade,
      serviceTowns,
      keywordLimit,
    );

    const publicBase: PublicReportPayload = {
      businessName: place.name,
      address: place.address,
      town: place.town,
      trade: activeTrade,
      lat: place.lat,
      lng: place.lng,
      website: place.website,
      rating: place.rating,
      reviewCount: place.reviewCount,
      mapsUri: place.mapsUri,
      competitors,
      reviews: [],
      web: null,
      keywordsPreview: tradeKeywords.map((keyword) => ({
        keyword,
        scanned: false,
      })),
      teaser: {
        competitorHint: `We found ${competitors.length} competitors within about ${SERVICE_AREA_MILES} miles${
          serviceTowns.length > 1
            ? ` across ${serviceTowns.slice(0, 3).join(", ")}`
            : ""
        }.`,
        reviewHint: "Pulling recent reviews next.",
        webHint: "Website scan queued.",
      },
    };

    await updateReport(reportId, {
      phase: "search",
      trade: activeTrade,
      business_name: place.name,
      formatted_address: place.address,
      town: place.town,
      lat: place.lat,
      lng: place.lng,
      website: place.website,
      phone: place.phone,
      rating: place.rating,
      review_count: place.reviewCount,
      public_payload: publicBase,
    });

    // Brief pause so the client can show the map act.
    await sleep(700);

    await updateReport(reportId, { phase: "web" satisfies ReportPhase });

    let web = demoWeb(place.website);
    if (!place.website) {
      web = {
        url: null,
        overall: null,
        performance: null,
        accessibility: null,
        bestPractices: null,
        seo: null,
        mobileFriendly: null,
        hasHttps: false,
        loadMs: null,
        screenshot: null,
        checks: [],
      };
    } else if (!useDemoProviders()) {
      try {
        web = await scanWebsite(place.website, {
          businessName: place.name,
          tradeKeywords,
        });
      } catch (err) {
        console.error("Website scan failed:", err);
        web = {
          url: place.website,
          overall: null,
          performance: null,
          accessibility: null,
          bestPractices: null,
          seo: null,
          mobileFriendly: null,
          hasHttps: place.website.startsWith("https://"),
          loadMs: null,
          screenshot: null,
          checks: [],
        };
      }
    }

    await updateReport(reportId, {
      phase: "web",
      public_payload: {
        ...publicBase,
        web,
        teaser: {
          ...publicBase.teaser,
          webHint: web.url
            ? "Your website loaded - checking speed and mobile next steps."
            : "No website was linked on your Google listing.",
        },
      },
    });

    await sleep(700);

    await updateReport(reportId, { phase: "listings" satisfies ReportPhase });

    const reviews = place.reviews;
    const keywordList = tradeKeywords;
    let keywords: KeywordRank[] = keywordList.map((keyword) => ({
      keyword,
      mapPackPosition: null,
      organicPosition: null,
      inMapPack: false,
    }));

    if (useDemoProviders()) {
      keywords = demoKeywords(activeTrade, place.town).slice(0, keywordLimit);
      if (serviceTowns.length) {
        keywords = keywordsForServiceArea(
          activeTrade,
          serviceTowns,
          keywordLimit,
        ).map((keyword, index) => ({
          keyword,
          mapPackPosition: index === 0 ? 3 : null,
          organicPosition: index === 0 ? 8 : null,
          inMapPack: index === 0,
        }));
      }
    } else if (localSearchConfigured()) {
      try {
        keywords = await rankKeywords({
          keywords: keywordList,
          businessName: place.name,
          placeId: place.placeId,
          lat: place.lat,
          lng: place.lng,
          limit: keywordLimit,
        });
      } catch (err) {
        console.error("Local keyword ranking failed:", err);
      }
    }

    const score = buildScoreCard({
      trade: activeTrade,
      place,
      competitors,
      keywords,
      web,
      reviews,
    });

    const teaser = buildTeaser({ competitors, reviews, web, place });

    const publicPayload: PublicReportPayload = {
      businessName: place.name,
      address: place.address,
      town: place.town,
      trade: activeTrade,
      lat: place.lat,
      lng: place.lng,
      website: place.website,
      rating: place.rating,
      reviewCount: place.reviewCount,
      mapsUri: place.mapsUri,
      competitors,
      reviews,
      web,
      keywordsPreview: keywords.map((k) => ({
        keyword: k.keyword,
        scanned: true,
      })),
      teaser,
    };

    const scorePayload: ScorePayload = {
      score,
      keywords,
      web,
      competitors,
      reviews,
    };

    await updateReport(reportId, {
      status: "ready",
      phase: "ready",
      public_payload: publicPayload,
      score_payload: scorePayload,
      overall_score: score.overall,
      grade: score.grade,
      completed_at: new Date().toISOString(),
      error_message: null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Scan failed.";
    console.error("Presence report failed:", err);
    await updateReport(reportId, {
      status: "failed",
      phase: "failed",
      error_message: message,
    });
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
