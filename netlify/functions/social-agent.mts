/**
 * Netlify Scheduled Function → Next.js `/api/cron/social-agent`.
 * Hourly schedule in netlify.toml. Hits publish + generate passes.
 * Requires CRON_SECRET in site env.
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

  const response = await fetch(`${base}/api/cron/social-agent?mode=all`, {
    headers: {
      Authorization: `Bearer ${secret}`,
    },
  });

  const body = await response.text();
  if (!response.ok) {
    console.error("social-agent failed", response.status, body);
    throw new Error(`social-agent failed: ${response.status}`);
  }

  console.log("social-agent ok", body);
  return new Response(body, {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};
