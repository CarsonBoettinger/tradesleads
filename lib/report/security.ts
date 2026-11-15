import { timingSafeEqual } from "node:crypto";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string) {
  return UUID_RE.test(value);
}

export function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function clampText(value: string, max: number) {
  return value.trim().slice(0, max);
}

export function isValidPlaceId(value: string) {
  if (!value || value.length > 256) return false;
  // Google place ids / demo ids
  return /^[A-Za-z0-9_.:-]+$/.test(value);
}
