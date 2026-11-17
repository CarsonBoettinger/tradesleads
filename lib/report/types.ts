export type ReportTrade =
  | "Plumber"
  | "Roofer"
  | "Electrician"
  | "HVAC"
  | "Builder"
  | "Painter"
  | "Flooring"
  | "Concrete"
  | "Fencing"
  | "Carpenter"
  | "Landscaper"
  | "Tree service"
  | "Snow removal"
  | "Pressure washing"
  | "Window cleaning"
  | "Commercial cleaning"
  | "Gutter cleaning"
  | "Pest control"
  | "Pool service"
  | "Junk removal"
  | "Auto repair"
  | "Auto detailing"
  | "Towing"
  | "Welding"
  | "Solar"
  | "Appliance repair"
  | "Moving"
  | "Locksmith"
  | "Another trade";

export type ReportStatus =
  | "queued"
  | "scanning"
  | "ready"
  | "unlocked"
  | "failed";

export type ReportPhase =
  | "queued"
  | "search"
  | "web"
  | "listings"
  | "ready"
  | "failed";

export type PlaceCandidate = {
  placeId: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  rating: number | null;
  reviewCount: number | null;
  types: string[];
};

export type PlaceDetails = {
  placeId: string;
  name: string;
  address: string;
  town: string | null;
  lat: number | null;
  lng: number | null;
  website: string | null;
  phone: string | null;
  rating: number | null;
  reviewCount: number | null;
  reviews: ReviewItem[];
  mapsUri: string | null;
  types: string[];
};

export type ReviewItem = {
  author: string;
  rating: number;
  text: string;
  relativeTime: string | null;
};

export type CompetitorItem = {
  placeId: string;
  name: string;
  address: string;
  rating: number | null;
  reviewCount: number | null;
  lat: number | null;
  lng: number | null;
};

export type KeywordRank = {
  keyword: string;
  mapPackPosition: number | null;
  organicPosition: number | null;
  inMapPack: boolean;
};

export type WebsiteCheck = {
  id: string;
  label: string;
  pass: boolean | null;
  detail: string;
};

export type WebSignals = {
  url: string | null;
  /** Average of Lighthouse categories (0–100). */
  overall: number | null;
  performance: number | null;
  accessibility: number | null;
  bestPractices: number | null;
  seo: number | null;
  mobileFriendly: boolean | null;
  hasHttps: boolean;
  loadMs: number | null;
  /** PageSpeed final-screenshot data URL when available. */
  screenshot: string | null;
  checks: WebsiteCheck[];
};

export type ScoreCard = {
  overall: number;
  searchScore: number;
  webScore: number;
  listingsScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  competitorRank: number;
  competitorTotal: number;
  estimatedMonthlyLossLow: number;
  estimatedMonthlyLossHigh: number;
  estimatedJobsMissedLow: number;
  estimatedJobsMissedHigh: number;
  avgJobValue: number;
  summary: string;
  topIssues: string[];
};

export type PublicReportPayload = {
  businessName: string;
  address: string | null;
  town: string | null;
  trade: string;
  lat: number | null;
  lng: number | null;
  website: string | null;
  rating: number | null;
  reviewCount: number | null;
  mapsUri: string | null;
  competitors: CompetitorItem[];
  reviews: ReviewItem[];
  web: WebSignals | null;
  keywordsPreview: Array<{ keyword: string; scanned: boolean }>;
  teaser: {
    competitorHint: string;
    reviewHint: string;
    webHint: string;
  };
};

export type ScorePayload = {
  score: ScoreCard;
  keywords: KeywordRank[];
  web: WebSignals;
  competitors: CompetitorItem[];
  reviews: ReviewItem[];
};

export type PresenceReportRow = {
  id: string;
  created_at: string;
  updated_at: string;
  unlock_token: string;
  status: ReportStatus;
  phase: ReportPhase;
  place_id: string;
  business_name: string;
  formatted_address: string | null;
  town: string | null;
  trade: string;
  lat: number | null;
  lng: number | null;
  website: string | null;
  phone: string | null;
  rating: number | null;
  review_count: number | null;
  public_payload: PublicReportPayload;
  score_payload: ScorePayload | null;
  overall_score: number | null;
  grade: ScoreCard["grade"] | null;
  completed_at: string | null;
  error_message: string | null;
  lead_id: string | null;
  contact_first_name: string | null;
  contact_last_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  unlocked_at: string | null;
};
