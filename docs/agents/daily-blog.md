# Daily blog agent

Publishes one Kalvez tip article per day to Supabase `public.posts` (`/blog`).

## Editorial model

Write like [SpotHopper’s restaurant blog](https://www.spothopperapp.com/blog): useful owner tips, not keyword lectures.

- Lead with a real problem (not showing up on Google, visits but no calls, missed phones, slow season).
- Teach one clear fix path an owner can use this week.
- Keep voice plain and trade-smart (`docs/brand/Kalvez-brand.md`).
- Keywords stay in the background; helpfulness comes first.

Topic bank: `lib/blog/topics.ts`.

## What it does

1. Picks the next unused tip topic.
2. Writes on-brand markdown (OpenAI if `OPENAI_API_KEY` is set, else built-in generator).
3. Publishes via `publish_agent_post` with `BLOG_AGENT_TOKEN`.
4. Revalidates `/blog`, the post URL, and the sitemap.

## Trigger

- **Production:** Vercel Cron → `GET /api/cron/daily-blog` daily at 13:00 UTC.
- **Manual:**  
  `curl -H "Authorization: Bearer $CRON_SECRET" https://YOUR_DOMAIN/api/cron/daily-blog`

## Required env

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
BLOG_AGENT_TOKEN=...
CRON_SECRET=...
OPENAI_API_KEY=...            # optional; stronger tip articles
```
