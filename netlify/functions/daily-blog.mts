/**
 * Netlify Scheduled Function → Next.js `/api/cron/daily-blog`.
 * Schedule is set in netlify.toml (`0 13 * * *` UTC).
 * Requires CRON_SECRET (and BLOG_AGENT_TOKEN on the Next app) in site env.
 */
export default async () => {
  const base = (
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    ""
  ).replace(/\/$/, "");

  const secret = process.env.CRON_SECRET?.trim();

  if (!base) {
    throw new Error(
      "Missing site URL (URL / DEPLOY_PRIME_URL / NEXT_PUBLIC_SITE_URL).",
    );
  }
  if (!secret) {
    throw new Error("Missing CRON_SECRET.");
  }

  const response = await fetch(`${base}/api/cron/daily-blog`, {
    headers: {
      Authorization: `Bearer ${secret}`,
    },
  });

  const body = await response.text();
  if (!response.ok) {
    console.error("daily-blog failed", response.status, body);
    throw new Error(`daily-blog failed: ${response.status}`);
  }

  console.log("daily-blog ok", body);
  return new Response(body, {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};
