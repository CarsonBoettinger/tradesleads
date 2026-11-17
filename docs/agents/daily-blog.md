# Daily blog agent

Publishes one Kalvez tip article per day to Supabase `public.posts` (served at `/blog`).

## Commands

### Local generate

With the Next.js app running (`npm run dev`) and env vars loaded:

```bash
# Uses SITE_URL if set, otherwise http://localhost:3000
CRON_SECRET=your-secret npm run blog:generate
```

That script is a thin wrapper around:

```bash
curl -sS -H "Authorization: Bearer $CRON_SECRET" \
  "${SITE_URL:-http://localhost:3000}/api/cron/daily-blog"
```

### Production / manual trigger

```bash
curl -sS -H "Authorization: Bearer $CRON_SECRET" \
  "https://YOUR_DOMAIN/api/cron/daily-blog"
```

`GET` and `POST` both work on the same route.

### Force a specific topic

Pass a topic id from `lib/blog/topics.ts` (`BLOG_TOPICS[].id`):

```bash
curl -sS -H "Authorization: Bearer $CRON_SECRET" \
  "http://localhost:3000/api/cron/daily-blog?topic=not-on-google"
```

Without `topic`, the agent picks the next unused tip for the day (skips topics already published recently).

### Auth

Send one of these secrets as a Bearer token **or** as `?token=`:

| Secret | Role |
| --- | --- |
| `CRON_SECRET` | Cron / npm script auth |
| `BLOG_AGENT_TOKEN` | Also accepted for the HTTP route; **required** to call the `publish_agent_post` RPC |

Example with query token:

```bash
curl -sS "http://localhost:3000/api/cron/daily-blog?token=$CRON_SECRET"
```

Unauthorized requests return `401`. Missing `BLOG_AGENT_TOKEN` returns `500`.

### Success response

```json
{
  "ok": true,
  "slug": "why-your-trade-business-isnt-showing-up-on-google-and-how-to-fix-it-2026-11-16",
  "title": "Why your trade business isn’t showing up on Google (and how to fix it)",
  "url": "/blog/why-your-trade-business-isnt-showing-up-on-google-and-how-to-fix-it-2026-11-16"
}
```

Failures return `{ "error": "..." }` with status `500`.

## Scheduled run

Production (Netlify): scheduled function `netlify/functions/daily-blog` runs daily at **13:00 UTC** (`netlify.toml`: `0 13 * * *`) and calls `GET /api/cron/daily-blog` with `Authorization: Bearer $CRON_SECRET`.

Vercel: `vercel.json` cron hits the same route on the same schedule if you deploy there instead.

## What the command does

1. Auth-checks the request.
2. Loads recent posts and maps them back to topic ids.
3. Picks a topic (`?topic=` or next unused day pick).
4. Writes markdown (OpenAI if `OPENAI_API_KEY` is set, else built-in template).
5. Publishes via Supabase RPC `publish_agent_post` with `BLOG_AGENT_TOKEN`.
6. Revalidates `/blog`, the post URL, cache tags, and `/sitemap.xml`.

Code path: `app/api/cron/daily-blog/route.ts` → `lib/blog/generate.ts` → `lib/blog/publish.ts`.

## Editorial model

Write like [SpotHopper’s restaurant blog](https://www.spothopperapp.com/blog): useful owner tips, not keyword lectures.

- Lead with a real problem (not showing up on Google, visits but no calls, missed phones, slow season).
- Teach one clear fix path an owner can use this week.
- Keep voice plain and trade-smart (`docs/brand/Kalvez-brand.md`).
- Keywords stay in the background; helpfulness comes first.

Topic bank: `lib/blog/topics.ts`.

## Required env

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
BLOG_AGENT_TOKEN=...          # required for publish RPC
CRON_SECRET=...               # required for cron / npm run blog:generate
OPENAI_API_KEY=...            # optional; stronger tip articles
OPENAI_BLOG_MODEL=gpt-4.1-mini  # optional override
SITE_URL=http://localhost:3000  # optional; used by blog:generate
```
