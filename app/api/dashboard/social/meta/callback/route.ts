import { requireDashboardUser } from "@/lib/auth/profile";
import { dashboardUrl } from "@/lib/hosts";
import { enforceRateLimit } from "@/lib/http-guard";
import { userCanAccessBrand } from "@/lib/sites/brands";
import { upsertConnection } from "@/lib/social/connections";
import {
  exchangeCodeForUserToken,
  exchangeForLongLivedUserToken,
  listManagedPages,
  pickPageForPlatform,
} from "@/lib/social/meta";
import { verifyOAuthState } from "@/lib/social/oauth-state";
import { getOrCreateSettings } from "@/lib/social/settings";

function brandSocialRedirect(brandId: string, query: Record<string, string>) {
  const params = new URLSearchParams({ section: "socials", ...query });
  return Response.redirect(
    dashboardUrl(`/dashboard/brands/${brandId}?${params.toString()}`),
    302,
  );
}

export async function GET(request: Request) {
  const limited = await enforceRateLimit({
    request,
    key: "meta-oauth-callback",
    limit: 30,
    windowMs: 15 * 60_000,
    message: "Too many OAuth attempts.",
  });
  if (limited) return limited;

  const session = await requireDashboardUser();
  if (!session) {
    return Response.redirect(dashboardUrl("/dashboard/login"), 302);
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const stateRaw = url.searchParams.get("state");
  const oauthError =
    url.searchParams.get("error_description") ||
    url.searchParams.get("error");

  if (oauthError) {
    return Response.redirect(
      dashboardUrl(`/dashboard?social_error=${encodeURIComponent(oauthError)}`),
      302,
    );
  }

  if (!code || !stateRaw) {
    return new Response("Missing code or state.", { status: 400 });
  }

  let state;
  try {
    state = verifyOAuthState(stateRaw);
  } catch (err) {
    return new Response(
      err instanceof Error ? err.message : "Invalid state.",
      { status: 400 },
    );
  }

  if (state.userId !== session.user.id) {
    return new Response("OAuth user mismatch.", { status: 403 });
  }

  const allowed = await userCanAccessBrand(session.profile, state.brandId);
  if (!allowed) {
    return new Response("Forbidden.", { status: 403 });
  }

  try {
    const short = await exchangeCodeForUserToken(code);
    const longLived = await exchangeForLongLivedUserToken(short.access_token);
    const pages = await listManagedPages(longLived.access_token);
    const page = pickPageForPlatform(
      pages,
      state.platform,
      state.pageId ?? null,
    );

    if (!page) {
      return brandSocialRedirect(state.brandId, {
        social_error:
          state.platform === "instagram"
            ? "No Facebook Page with a linked Instagram Business account was found."
            : "No Facebook Page was found for this account.",
      });
    }

    if (
      state.platform === "instagram" &&
      !page.instagram_business_account?.id
    ) {
      return brandSocialRedirect(state.brandId, {
        social_error:
          "Selected Page is not linked to an Instagram Business account.",
      });
    }

    const expiresAt =
      typeof longLived.expires_in === "number"
        ? new Date(Date.now() + longLived.expires_in * 1000).toISOString()
        : null;

    await upsertConnection({
      brandId: state.brandId,
      platform: state.platform,
      pageId: page.id,
      pageName: page.name,
      igUserId: page.instagram_business_account?.id ?? null,
      accessToken: page.access_token,
      tokenExpiresAt: expiresAt,
      connectedBy: session.user.id,
    });

    await getOrCreateSettings(state.brandId);

    return brandSocialRedirect(state.brandId, {
      social_connected: state.platform,
    });
  } catch (err) {
    return brandSocialRedirect(state.brandId, {
      social_error:
        err instanceof Error ? err.message : "Could not complete Meta connect.",
    });
  }
}
