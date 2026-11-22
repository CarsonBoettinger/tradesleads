import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5_000;

/** Cache Ratelimit instances by limit+window so we reuse Redis pipelines. */
const upstashLimiters = new Map<string, Ratelimit>();
let redis: Redis | null | undefined;
let warnedMissingUpstash = false;

function prune(now: number) {
  if (buckets.size < 500) return;

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }

  if (buckets.size <= MAX_BUCKETS) return;
  const overflow = buckets.size - MAX_BUCKETS;
  let removed = 0;
  for (const key of buckets.keys()) {
    buckets.delete(key);
    removed += 1;
    if (removed >= overflow) break;
  }
}

function memoryRateLimit(input: {
  key: string;
  limit: number;
  windowMs: number;
}): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  prune(now);

  const key = input.key.slice(0, 200);
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + input.windowMs });
    return { ok: true };
  }

  if (existing.count >= input.limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { ok: true };
}

function getRedis(): Redis | null {
  if (redis !== undefined) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    redis = null;
    if (process.env.NODE_ENV === "production" && !warnedMissingUpstash) {
      warnedMissingUpstash = true;
      console.warn(
        "[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN unset - falling back to in-memory limits (not durable across instances).",
      );
    }
    return null;
  }

  redis = new Redis({ url, token });
  return redis;
}

function getUpstashLimiter(limit: number, windowMs: number): Ratelimit | null {
  const client = getRedis();
  if (!client) return null;

  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
  const cacheKey = `${limit}:${windowSec}`;
  const existing = upstashLimiters.get(cacheKey);
  if (existing) return existing;

  const limiter = new Ratelimit({
    redis: client,
    limiter: Ratelimit.fixedWindow(limit, `${windowSec} s`),
    prefix: "kalvez:rl",
    analytics: false,
  });
  upstashLimiters.set(cacheKey, limiter);
  return limiter;
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  return (
    request.headers.get("x-real-ip")?.trim().slice(0, 64) ||
    request.headers.get("cf-connecting-ip")?.trim().slice(0, 64) ||
    "unknown"
  );
}

/**
 * Durable fixed-window limiter (Upstash when configured).
 * Falls back to in-process Map for local/dev without Redis.
 */
export async function rateLimit(input: {
  key: string;
  limit: number;
  windowMs: number;
}): Promise<{ ok: true } | { ok: false; retryAfterSec: number }> {
  const key = input.key.slice(0, 200);
  const limiter = getUpstashLimiter(input.limit, input.windowMs);

  if (!limiter) {
    return memoryRateLimit({ ...input, key });
  }

  try {
    const result = await limiter.limit(key);
    if (result.success) return { ok: true };
    const retryAfterSec = Math.max(
      1,
      Math.ceil((result.reset - Date.now()) / 1000),
    );
    return { ok: false, retryAfterSec };
  } catch (error) {
    console.error("[rate-limit] Upstash error, falling back to memory:", error);
    return memoryRateLimit({ ...input, key });
  }
}
