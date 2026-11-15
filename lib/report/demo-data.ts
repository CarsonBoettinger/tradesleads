import { keywordsForTrade } from "@/lib/report/keywords";
import type {
  CompetitorItem,
  KeywordRank,
  PlaceCandidate,
  PlaceDetails,
  ReportTrade,
  ReviewItem,
  WebSignals,
} from "@/lib/report/types";

/** Deterministic demo data when provider API keys are missing. */
export function demoSearch(query: string, trade: string): PlaceCandidate[] {
  const name = query.trim() || `${trade} Pros`;
  return [
    {
      placeId: "demo-place-1",
      name,
      address: `128 Market Street, Springfield, IL 62701`,
      lat: 39.7817,
      lng: -89.6501,
      rating: 4.4,
      reviewCount: 37,
      types: ["local_business"],
    },
    {
      placeId: "demo-place-2",
      name: `${name} Services`,
      address: `44 Oak Avenue, Springfield, IL 62704`,
      lat: 39.79,
      lng: -89.66,
      rating: 4.1,
      reviewCount: 18,
      types: ["local_business"],
    },
  ];
}

export function demoPlaceDetails(
  placeId: string,
  trade: ReportTrade,
  fallbackName?: string,
): PlaceDetails {
  const name = fallbackName?.trim() || `${trade} Co.`;
  const reviews: ReviewItem[] = [
    {
      author: "Jamie R.",
      rating: 5,
      text: "Showed up on time and fixed the issue the same day. Would hire again.",
      relativeTime: "2 weeks ago",
    },
    {
      author: "Chris M.",
      rating: 4,
      text: "Solid work. Communication could be a little faster, but the job was clean.",
      relativeTime: "a month ago",
    },
    {
      author: "Sam T.",
      rating: 5,
      text: "Quoted fairly and explained everything before starting. Great local crew.",
      relativeTime: "2 months ago",
    },
  ];

  return {
    placeId,
    name,
    address: "128 Market Street, Springfield, IL 62701",
    town: "Springfield",
    lat: 39.7817,
    lng: -89.6501,
    website: "https://example.com",
    phone: "(217) 555-0142",
    rating: 4.4,
    reviewCount: 37,
    reviews,
    mapsUri: "https://maps.google.com/?q=Springfield+IL",
    types: ["general_contractor", "establishment"],
  };
}

export function demoCompetitors(): CompetitorItem[] {
  return [
    {
      placeId: "demo-comp-1",
      name: "Northside Trade Pros",
      address: "9 River Rd, Springfield, IL",
      rating: 4.8,
      reviewCount: 162,
      lat: 39.79,
      lng: -89.64,
    },
    {
      placeId: "demo-comp-2",
      name: "City Line Services",
      address: "220 Elm St, Springfield, IL",
      rating: 4.6,
      reviewCount: 98,
      lat: 39.77,
      lng: -89.66,
    },
    {
      placeId: "demo-comp-3",
      name: "Harbor Home Crew",
      address: "15 Lake Ave, Springfield, IL",
      rating: 4.5,
      reviewCount: 71,
      lat: 39.785,
      lng: -89.67,
    },
    {
      placeId: "demo-comp-4",
      name: "Summit Local Co.",
      address: "88 Hill St, Springfield, IL",
      rating: 4.2,
      reviewCount: 44,
      lat: 39.775,
      lng: -89.645,
    },
  ];
}

export function demoWeb(url: string | null): WebSignals {
  return {
    url: url ?? "https://example.com",
    overall: 62,
    performance: 48,
    accessibility: 74,
    bestPractices: 67,
    seo: 61,
    mobileFriendly: true,
    hasHttps: true,
    loadMs: 4200,
    screenshot: null,
    checks: [
      {
        id: "https",
        label: "Secure HTTPS",
        pass: true,
        detail: "Site loads over HTTPS.",
      },
      {
        id: "h1",
        label: "H1 headline present",
        pass: true,
        detail: "Found H1: “Trusted local service”",
      },
      {
        id: "h1-keyword",
        label: "H1 includes a service keyword",
        pass: false,
        detail:
          "H1 does not clearly include a service keyword homeowners search for.",
      },
      {
        id: "contrast",
        label: "Text contrast looks readable",
        pass: true,
        detail: "PageSpeed contrast check passed.",
      },
      {
        id: "speed",
        label: "Mobile site speed",
        pass: false,
        detail: "Interactive in about 4.2s.",
      },
      {
        id: "mobile",
        label: "Mobile-friendly layout",
        pass: true,
        detail: "Viewport and mobile layout look usable.",
      },
    ],
  };
}

export function demoKeywords(
  trade: ReportTrade,
  town: string | null,
): KeywordRank[] {
  return keywordsForTrade(trade, town).map((keyword, index) => {
    if (index === 0) {
      return {
        keyword,
        mapPackPosition: 3,
        organicPosition: 8,
        inMapPack: true,
      };
    }
    if (index === 1) {
      return {
        keyword,
        mapPackPosition: null,
        organicPosition: 14,
        inMapPack: false,
      };
    }
    if (index < 4) {
      return {
        keyword,
        mapPackPosition: index + 3,
        organicPosition: 11 + index,
        inMapPack: false,
      };
    }
    return {
      keyword,
      mapPackPosition: null,
      organicPosition: null,
      inMapPack: false,
    };
  });
}
