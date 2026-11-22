# Kalvez / tradesleads

Next.js app for Kalvez lead capture, free reports, and the daily blog agent.

## Getting Started

```bash
npm install
cp .env.example .env.local
# fill in values from .env.example
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Netlify

Next.js 16 runs on Netlify with the OpenNext adapter (applied automatically - do not pin `@netlify/plugin-nextjs`).

1. Push this repo and [add a new site from Git](https://app.netlify.com/start) in Netlify.
2. Build settings are in `netlify.toml` (`npm run build`, publish `.next`, Node 20).
3. In **Project configuration → Environment variables**, set at least:

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL only (safe in the browser) |
| `SUPABASE_URL` | Supabase project URL (**server-only**, not `NEXT_PUBLIC_`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server writes (**secret**, never `NEXT_PUBLIC_`) |
| `BLOG_AGENT_TOKEN` | Must match `public.app_settings.blog_agent_token` |
| `CRON_SECRET` | Auth for scheduled daily blog job (Bearer only in production) |
| `GOOGLE_PLACES_API_KEY` | Required for `/report` in production |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Durable API rate limits (required in production) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile on public forms |

Do **not** prefix secrets with `NEXT_PUBLIC_` (except the Turnstile site key). Forms and reports call `/api/*` routes; keys stay on the server.

Optional: `OPENAI_API_KEY`, `OPENAI_BLOG_MODEL`, `PAGESPEED_API_KEY`, `REPORT_KEYWORD_LIMIT`. Keep Telegram tokens in Supabase Vault, not Netlify.

In Supabase Auth, enable **leaked password protection** (HaveIBeenPwned) under Authentication → Providers → Email.

4. Deploy. The daily blog job is `netlify/functions/daily-blog` on schedule `0 13 * * *` UTC (calls `/api/cron/daily-blog`).

Manual blog trigger:

```bash
curl -sS -H "Authorization: Bearer $CRON_SECRET" \
  "https://YOUR_DOMAIN/api/cron/daily-blog"
```

See `.env.example` and `docs/agents/daily-blog.md` for more.
