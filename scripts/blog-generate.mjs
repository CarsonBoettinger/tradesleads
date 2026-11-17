#!/usr/bin/env node
/**
 * Local trigger for /api/cron/daily-blog.
 * Loads CRON_SECRET from .env.local via `node --env-file=.env.local`.
 *
 * Usage:
 *   npm run blog:generate
 *   npm run blog:generate -- --topic=not-on-google
 */

const secret = process.env.CRON_SECRET?.trim();
if (!secret) {
  console.error(
    "Missing CRON_SECRET. Add it to .env.local (same value the Next server uses).",
  );
  process.exit(1);
}

// Prefer SITE_URL for local runs; do not use NEXT_PUBLIC_SITE_URL (often production).
const base = (process.env.SITE_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);

const topicArg = process.argv.slice(2).find((arg) => arg.startsWith("--topic="));
const topic = topicArg?.slice("--topic=".length)?.trim();

const url = new URL(`${base}/api/cron/daily-blog`);
if (topic) url.searchParams.set("topic", topic);

let response;
try {
  response = await fetch(url, {
    headers: { Authorization: `Bearer ${secret}` },
  });
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(
    `Could not reach ${url.origin}. Is the Next.js server running? (npm run dev)\n${detail}`,
  );
  process.exit(1);
}

const body = await response.text();
let parsed;
try {
  parsed = JSON.parse(body);
} catch {
  parsed = null;
}

if (!response.ok) {
  const message =
    parsed?.error || body || `${response.status} ${response.statusText}`;
  console.error(`Blog generate failed (${response.status}): ${message}`);
  process.exit(1);
}

if (parsed?.ok && parsed.slug) {
  console.log(`Published: ${parsed.title}`);
  console.log(`URL: ${parsed.url ?? `/blog/${parsed.slug}`}`);
} else {
  console.log(body);
}
