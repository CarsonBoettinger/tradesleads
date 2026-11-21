export type ProfileRole = "staff" | "client";

export type BrandStatus =
  | "draft"
  | "generating"
  | "ready"
  | "published"
  | "failed";

export type GenerationJobStatus = "queued" | "running" | "ready" | "failed";

export type GenerationPhase =
  | "queued"
  | "fetch"
  | "brand"
  | "keywords"
  | "content"
  | "build"
  | "assets"
  | "qa"
  | "ready"
  | "failed";

export const GENERATION_PHASE_LABELS: Record<GenerationPhase, string> = {
  queued: "Queued",
  fetch: "Fetching business information",
  brand: "Extracting brand identity",
  keywords: "Analyzing services and keywords",
  content: "Generating SEO content",
  build: "Building website",
  assets: "Optimizing assets",
  qa: "Running quality checks",
  ready: "Website ready",
  failed: "Generation failed",
};

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: ProfileRole;
  must_change_password: boolean;
};

export type Brand = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  slug: string;
  place_id: string | null;
  trade: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  town: string | null;
  lat: number | null;
  lng: number | null;
  maps_uri: string | null;
  status: BrandStatus;
  created_by: string | null;
};

export type BrandAsset = {
  id: string;
  brand_id: string;
  kind: "logo" | "hero" | "gallery" | "og" | "hero_video" | "other";
  storage_path: string;
  public_url: string | null;
  source_url: string | null;
  attribution: string | null;
  usage_notes: string | null;
  width: number | null;
  height: number | null;
  sort_order: number;
  is_primary: boolean;
};

export type SiteTheme = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  fontFamily?: string;
};

export type SiteSeo = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
};

export type SiteKeywords = {
  primary: string;
  secondary: string[];
  serviceAreas: string[];
};

export type SiteContent = {
  hero: {
    h1: string;
    subhead: string;
    ctaLabel: string;
    ctaHref: string;
  };
  about: {
    heading: string;
    body: string;
  };
  services: Array<{
    name: string;
    description: string;
    keyword?: string;
  }>;
  whyUs: Array<{
    title: string;
    body: string;
  }>;
  serviceAreas: Array<{
    name: string;
    description: string;
    /** Longer SEO body for /areas/[area] pages. */
    body?: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  testimonials: Array<{
    author: string;
    text: string;
    rating?: number;
  }>;
  contact: {
    heading: string;
    body: string;
    formCta: string;
  };
  nav: {
    links: Array<{ label: string; href: string }>;
  };
  footer: {
    blurb: string;
  };
  imageAlts?: Record<string, string>;
};

export type QaChecklistItem = {
  id: string;
  label: string;
  pass: boolean;
  detail: string;
};

export type SiteConfig = {
  id: string;
  brand_id: string;
  template_id: string;
  theme: SiteTheme;
  content: SiteContent;
  seo: SiteSeo;
  keywords: SiteKeywords;
  qa: { items?: QaChecklistItem[] };
  published_at: string | null;
};

export type GenerationJob = {
  id: string;
  brand_id: string;
  status: GenerationJobStatus;
  phase: GenerationPhase;
  attempts: number;
  error_message: string | null;
  prompt_tokens: number | null;
  completion_tokens: number | null;
  estimated_cost_usd: number | null;
  started_at: string | null;
  completed_at: string | null;
  qa: { items?: QaChecklistItem[] };
};

export type BrandProfilePayload = {
  hours?: Array<{ day: string; open: string; close: string }> | string[];
  services?: string[];
  serviceAreas?: string[];
  description?: string | null;
  reviews?: Array<{
    author: string;
    rating: number;
    text: string;
  }>;
  socialLinks?: string[];
  colors?: {
    primary?: string | null;
    secondary?: string | null;
    accent?: string | null;
  };
  /** Full scored palette candidates from CSS + assets. */
  palette?: string[];
  logoCandidates?: string[];
  imageCandidates?: string[];
  fonts?: string[];
  rawHtmlSignals?: {
    title?: string | null;
    h1?: string | null;
    metaDescription?: string | null;
  };
};
