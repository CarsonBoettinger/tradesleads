import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import type { SocialPlatform } from "@/lib/social/types";

type OAuthState = {
  brandId: string;
  platform: SocialPlatform;
  userId: string;
  pageId?: string;
  exp: number;
};

function secret() {
  const configured =
    process.env.SOCIAL_TOKEN_ENCRYPTION_KEY?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    process.env.META_APP_SECRET?.trim();

  if (configured) return configured;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "OAuth state secret missing. Set SOCIAL_TOKEN_ENCRYPTION_KEY (or CRON_SECRET / META_APP_SECRET).",
    );
  }

  return "dev-social-oauth";
}

export function signOAuthState(payload: Omit<OAuthState, "exp">): string {
  const body: OAuthState = {
    ...payload,
    exp: Date.now() + 15 * 60_000,
  };
  const json = Buffer.from(JSON.stringify(body)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(json).digest("base64url");
  return `${json}.${sig}`;
}

export function verifyOAuthState(raw: string): OAuthState {
  const [json, sig] = raw.split(".");
  if (!json || !sig) throw new Error("Invalid OAuth state.");
  const expected = createHmac("sha256", secret())
    .update(json)
    .digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new Error("Invalid OAuth state signature.");
  }
  const parsed = JSON.parse(
    Buffer.from(json, "base64url").toString("utf8"),
  ) as OAuthState;
  if (!parsed.exp || parsed.exp < Date.now()) {
    throw new Error("OAuth state expired.");
  }
  if (!parsed.brandId || !parsed.platform || !parsed.userId) {
    throw new Error("OAuth state incomplete.");
  }
  return parsed;
}
