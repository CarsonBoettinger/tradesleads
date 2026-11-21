import "server-only";

type TurnstileResult =
  | { ok: true }
  | { ok: false; response: Response };

/**
 * Verify a Cloudflare Turnstile token.
 * When TURNSTILE_SECRET_KEY is unset outside production, verification is skipped
 * so local/dev still works. Production without a secret rejects requests.
 */
export async function verifyTurnstile(input: {
  token: unknown;
  request: Request;
}): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const token =
    typeof input.token === "string" ? input.token.trim().slice(0, 2048) : "";

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("[turnstile] TURNSTILE_SECRET_KEY is not configured.");
      return {
        ok: false,
        response: Response.json(
          { error: "Bot protection is not configured." },
          { status: 503 },
        ),
      };
    }
    return { ok: true };
  }

  if (!token) {
    return {
      ok: false,
      response: Response.json(
        { error: "Complete the security check and try again." },
        { status: 400 },
      ),
    };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  const ip =
    input.request.headers.get("cf-connecting-ip")?.trim() ||
    input.request.headers.get("x-real-ip")?.trim() ||
    input.request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip) body.set("remoteip", ip.slice(0, 64));

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        signal: AbortSignal.timeout(8_000),
      },
    );
    const data = (await response.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };
    if (!data.success) {
      return {
        ok: false,
        response: Response.json(
          { error: "Security check failed. Refresh and try again." },
          { status: 403 },
        ),
      };
    }
    return { ok: true };
  } catch (error) {
    console.error("[turnstile] siteverify failed:", error);
    return {
      ok: false,
      response: Response.json(
        { error: "Security check unavailable. Try again shortly." },
        { status: 503 },
      ),
    };
  }
}

export function turnstileConfigured() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());
}
