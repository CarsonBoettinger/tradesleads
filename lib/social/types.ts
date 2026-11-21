export type SocialPlatform = "facebook" | "instagram";

export type SocialPostFrequency = "daily" | "weekdays" | "3x_week" | "weekly";

export type SocialPostStatus =
  | "pending_approval"
  | "approved"
  | "rejected"
  | "scheduled"
  | "publishing"
  | "published"
  | "failed";

export type SocialConnectionPublic = {
  id: string;
  brandId: string;
  platform: SocialPlatform;
  pageId: string;
  pageName: string | null;
  igUserId: string | null;
  status: "active" | "revoked" | "expired";
  tokenExpiresAt: string | null;
  createdAt: string;
};

export type SocialPostSettings = {
  id: string;
  brandId: string;
  frequency: SocialPostFrequency;
  timezone: string;
  preferredHour: number;
  enabled: boolean;
  lookAheadDays: number;
  /** False until the client answers “how often” during Socials onboarding. */
  cadenceConfirmed: boolean;
};

export type SocialPost = {
  id: string;
  brandId: string;
  caption: string;
  imageAssetId: string | null;
  imageUrl: string | null;
  platforms: SocialPlatform[];
  status: SocialPostStatus;
  scheduledFor: string;
  publishedAt: string | null;
  facebookPostId: string | null;
  instagramPostId: string | null;
  errorMessage: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  generationMeta: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export const SOCIAL_FREQUENCY_OPTIONS: Array<{
  value: SocialPostFrequency;
  label: string;
  hint: string;
}> = [
  { value: "daily", label: "Every day", hint: "One post per day" },
  {
    value: "weekdays",
    label: "Weekdays only",
    hint: "Monday through Friday",
  },
  {
    value: "3x_week",
    label: "3 times a week",
    hint: "Monday, Wednesday, Friday",
  },
  { value: "weekly", label: "Once a week", hint: "Every Monday" },
];
