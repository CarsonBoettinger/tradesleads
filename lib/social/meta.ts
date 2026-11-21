import "server-only";

import { dashboardUrl } from "@/lib/hosts";
import type { SocialPlatform } from "@/lib/social/types";

const GRAPH = "https://graph.facebook.com/v21.0";

export function metaAppConfig() {
  const appId = process.env.META_APP_ID?.trim();
  const appSecret = process.env.META_APP_SECRET?.trim();
  const redirectUri =
    process.env.META_REDIRECT_URI?.trim() ||
    dashboardUrl("/api/dashboard/social/meta/callback");

  if (!appId || !appSecret) {
    throw new Error("META_APP_ID and META_APP_SECRET are required.");
  }
  if (!redirectUri) {
    throw new Error("META_REDIRECT_URI is required.");
  }
  return { appId, appSecret, redirectUri };
}

const SCOPES = [
  "pages_show_list",
  "pages_manage_posts",
  "pages_read_engagement",
  "instagram_basic",
  "instagram_content_publish",
  "business_management",
].join(",");

export function buildMetaOAuthUrl(state: string) {
  const { appId, redirectUri } = metaAppConfig();
  const url = new URL("https://www.facebook.com/v21.0/dialog/oauth");
  url.searchParams.set("client_id", appId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", SCOPES);
  url.searchParams.set("response_type", "code");
  return url.toString();
}

async function graphGet<T>(
  path: string,
  params: Record<string, string>,
): Promise<T> {
  const url = new URL(`${GRAPH}${path}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString());
  const json = (await res.json()) as T & {
    error?: { message?: string };
  };
  if (!res.ok || json.error) {
    throw new Error(json.error?.message ?? `Meta Graph error (${res.status})`);
  }
  return json;
}

async function graphPost<T>(
  path: string,
  body: Record<string, string>,
): Promise<T> {
  const url = new URL(`${GRAPH}${path}`);
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body),
  });
  const json = (await res.json()) as T & {
    error?: { message?: string };
  };
  if (!res.ok || json.error) {
    throw new Error(json.error?.message ?? `Meta Graph error (${res.status})`);
  }
  return json;
}

export async function exchangeCodeForUserToken(code: string) {
  const { appId, appSecret, redirectUri } = metaAppConfig();
  return graphGet<{ access_token: string; expires_in?: number }>(
    "/oauth/access_token",
    {
      client_id: appId,
      client_secret: appSecret,
      redirect_uri: redirectUri,
      code,
    },
  );
}

export async function exchangeForLongLivedUserToken(shortToken: string) {
  const { appId, appSecret } = metaAppConfig();
  return graphGet<{ access_token: string; expires_in?: number }>(
    "/oauth/access_token",
    {
      grant_type: "fb_exchange_token",
      client_id: appId,
      client_secret: appSecret,
      fb_exchange_token: shortToken,
    },
  );
}

export type MetaPage = {
  id: string;
  name: string;
  access_token: string;
  instagram_business_account?: { id: string };
};

export async function listManagedPages(userToken: string): Promise<MetaPage[]> {
  const json = await graphGet<{ data?: MetaPage[] }>("/me/accounts", {
    access_token: userToken,
    fields:
      "id,name,access_token,instagram_business_account{id,username,name}",
    limit: "100",
  });
  return json.data ?? [];
}

export function pickPageForPlatform(
  pages: MetaPage[],
  platform: SocialPlatform,
  preferredPageId?: string | null,
): MetaPage | null {
  const withPreference = preferredPageId
    ? pages.find((p) => p.id === preferredPageId)
    : null;
  if (platform === "instagram") {
    const candidates = pages.filter((p) => p.instagram_business_account?.id);
    if (withPreference?.instagram_business_account?.id) return withPreference;
    return candidates[0] ?? null;
  }
  if (withPreference) return withPreference;
  return pages[0] ?? null;
}

export async function publishFacebookPhoto(input: {
  pageId: string;
  pageAccessToken: string;
  caption: string;
  imageUrl: string;
}): Promise<string> {
  const json = await graphPost<{ id?: string; post_id?: string }>(
    `/${input.pageId}/photos`,
    {
      url: input.imageUrl,
      caption: input.caption,
      access_token: input.pageAccessToken,
      published: "true",
    },
  );
  return json.post_id ?? json.id ?? "";
}

export async function publishInstagramPhoto(input: {
  igUserId: string;
  pageAccessToken: string;
  caption: string;
  imageUrl: string;
}): Promise<string> {
  const container = await graphPost<{ id: string }>(
    `/${input.igUserId}/media`,
    {
      image_url: input.imageUrl,
      caption: input.caption,
      access_token: input.pageAccessToken,
    },
  );

  // Instagram containers need a short moment before publish is allowed.
  await waitForIgContainer(container.id, input.pageAccessToken);

  const published = await graphPost<{ id: string }>(
    `/${input.igUserId}/media_publish`,
    {
      creation_id: container.id,
      access_token: input.pageAccessToken,
    },
  );
  return published.id;
}

async function waitForIgContainer(
  creationId: string,
  accessToken: string,
  attempts = 8,
) {
  for (let i = 0; i < attempts; i += 1) {
    const status = await graphGet<{
      status_code?: string;
      status?: string;
    }>(`/${creationId}`, {
      fields: "status_code,status",
      access_token: accessToken,
    });
    if (status.status_code === "FINISHED") return;
    if (status.status_code === "ERROR") {
      throw new Error(status.status ?? "Instagram media container failed.");
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
}
