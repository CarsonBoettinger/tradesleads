import "server-only";

import { clientIp, rateLimit } from "@/lib/report/rate-limit";
import { getSiteUrl } from "@/lib/site";

const DEFAULT_JSON_BYTES = 32_768;

function allowedOrigins(): Set<string> {
  const origins = new Set<string>();

  const add = (raw: string | undefined | null) => {
    if (!raw) return;
    try {
      const url = new URL(raw.includes("://") ? raw : `https://${raw}`);
      origins.add(url.origin);
    } catch {
      // ignore invalid env values
    }
  };

  add(getSiteUrl());
  add(process.env.URL);
  add(process.env.DEPLOY_PRIME_URL);
  add(process.env.VERCEL_URL);
  add(process.env.VERCEL_BRANCH_URL);
  add(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  add(process.env.NEXT_PUBLIC_DASHBOARD_HOST);
  add(process.env.NEXT_PUBLIC_SITES_ROOT_HOST);

  // dashboard.kalvez.com / *.sites.kalvez.com derived from site URL
  try {
    const site = new URL(getSiteUrl());
    const root = site.hostname.replace(/^www\./, "");
    add(`${site.protocol}//dashboard.${root}`);
    add(`${site.protocol}//sites.${root}`);
  } catch {
    // ignore
  }

  if (process.env.NODE_ENV !== "production") {
    origins.add("http://localhost:3000");
    origins.add("http://127.0.0.1:3000");
    origins.add("http://dashboard.localhost:3000");
    origins.add("http://sites.localhost:3000");
  }

  return origins;
}

/** Reject cross-site POSTs; browsers send Origin on fetch from pages. */
export function rejectCrossOrigin(request: Request): Response | null {
  const origin = request.headers.get("origin");
  if (!origin) {
    // Non-browser clients (curl, scripts) omit Origin — still rate-limited below.
    return null;
  }

  if (allowedOrigins().has(origin)) return null;

  return Response.json({ error: "Forbidden." }, { status: 403 });
}

export function tooManyRequests(
  message: string,
  retryAfterSec: number,
): Response {
  return Response.json(
    { error: message },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    },
  );
}

export function enforceRateLimit(input: {
  request: Request;
  key: string;
  limit: number;
  windowMs: number;
  message?: string;
}): Response | null {
  const limited = rateLimit({
    key: `${input.key}:${clientIp(input.request)}`,
    limit: input.limit,
    windowMs: input.windowMs,
  });
  if (limited.ok) return null;
  return tooManyRequests(
    input.message ?? "Too many requests. Try again shortly.",
    limited.retryAfterSec,
  );
}

export function enforceKeyedRateLimit(input: {
  key: string;
  limit: number;
  windowMs: number;
  message?: string;
}): Response | null {
  const limited = rateLimit({
    key: input.key,
    limit: input.limit,
    windowMs: input.windowMs,
  });
  if (limited.ok) return null;
  return tooManyRequests(
    input.message ?? "Too many requests. Try again shortly.",
    limited.retryAfterSec,
  );
}

export async function readJsonBody(
  request: Request,
  maxBytes = DEFAULT_JSON_BYTES,
): Promise<
  | { ok: true; body: unknown }
  | { ok: false; response: Response }
> {
  const contentLength = request.headers.get("content-length");
  if (contentLength) {
    const size = Number(contentLength);
    if (Number.isFinite(size) && size > maxBytes) {
      return {
        ok: false,
        response: Response.json(
          { error: "Request body is too large." },
          { status: 413 },
        ),
      };
    }
  }

  let text: string;
  try {
    text = await request.text();
  } catch {
    return {
      ok: false,
      response: Response.json({ error: "Invalid request body." }, { status: 400 }),
    };
  }

  if (text.length > maxBytes) {
    return {
      ok: false,
      response: Response.json(
        { error: "Request body is too large." },
        { status: 413 },
      ),
    };
  }

  if (!text.trim()) {
    return { ok: true, body: {} };
  }

  try {
    return { ok: true, body: JSON.parse(text) as unknown };
  } catch {
    return {
      ok: false,
      response: Response.json({ error: "Invalid JSON body." }, { status: 400 }),
    };
  }
}

/** Silent success for bots that fill the honeypot field. */
export function honeypotTripped(body: unknown, field = "website"): boolean {
  if (!body || typeof body !== "object") return false;
  const value = (body as Record<string, unknown>)[field];
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}
