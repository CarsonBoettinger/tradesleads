/** Shared contact validation for demo + report unlock forms. */

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function phoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

/** NANP digits: 10 local, or 11 with leading country code 1. */
export function nationalPhoneDigits(value: string) {
  let digits = phoneDigits(value);
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }
  return digits;
}

const EMAIL_RE =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

const FAKE_PHONE_DIGITS = new Set([
  "0000000000",
  "1111111111",
  "2222222222",
  "3333333333",
  "4444444444",
  "5555555555",
  "6666666666",
  "7777777777",
  "8888888888",
  "9999999999",
  "0123456789",
  "1234567890",
  "0987654321",
]);

export function parseEmail(value: string):
  | { ok: true; email: string }
  | { ok: false; error: string } {
  const email = normalizeEmail(value);
  if (!email) {
    return { ok: false, error: "Enter an email address." };
  }
  if (email.length > 160) {
    return { ok: false, error: "That email is too long." };
  }
  if (email.includes("..") || email.startsWith(".") || email.includes("@.")) {
    return { ok: false, error: "Enter a real email address." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Enter a real email address, like name@company.com." };
  }
  const domain = email.split("@")[1] ?? "";
  const tld = domain.split(".").pop() ?? "";
  if (!/^[a-z]{2,}$/i.test(tld)) {
    return { ok: false, error: "Enter a real email address, like name@company.com." };
  }
  return { ok: true, email };
}

export function formatPhone(value: string) {
  const digits = nationalPhoneDigits(value).slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function parsePhone(value: string):
  | { ok: true; phone: string; digits: string }
  | { ok: false; error: string } {
  const digits = nationalPhoneDigits(value);
  if (!digits) {
    return { ok: false, error: "Enter a phone number." };
  }
  if (digits.length !== 10) {
    return {
      ok: false,
      error: "Enter a 10-digit phone number, like (519) 555-0123.",
    };
  }

  const area = digits.slice(0, 3);
  const exchange = digits.slice(3, 6);
  if (area.startsWith("0") || area.startsWith("1")) {
    return { ok: false, error: "Enter a real phone number." };
  }
  if (exchange.startsWith("0") || exchange.startsWith("1")) {
    return { ok: false, error: "Enter a real phone number." };
  }
  if (FAKE_PHONE_DIGITS.has(digits) || exchange === "555") {
    return { ok: false, error: "Enter a real phone number." };
  }

  return { ok: true, phone: formatPhone(digits), digits };
}
