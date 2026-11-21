import "server-only";

import { dashboardUrl } from "@/lib/hosts";

export type ClientInviteEmailInput = {
  email: string;
  fullName: string;
  temporaryPassword: string;
  brandName?: string | null;
};

export type ClientInviteEmailResult = {
  sent: boolean;
  provider: "resend" | "none";
  error?: string;
};

function inviteHtml(input: ClientInviteEmailInput) {
  const loginUrl = dashboardUrl("/dashboard/login");
  const brandLine = input.brandName
    ? `<p>You have been assigned <strong>${escapeHtml(input.brandName)}</strong>.</p>`
    : "";

  return `<!doctype html>
<html>
  <body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #1c1917;">
    <h2 style="margin: 0 0 12px;">You're invited to Kalvez</h2>
    <p>Hi ${escapeHtml(input.fullName)},</p>
    ${brandLine}
    <p>
      Your client dashboard account is ready. Sign in with the temporary
      password below, then choose a new password.
    </p>
    <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
    <p><strong>Temporary password:</strong> <code>${escapeHtml(input.temporaryPassword)}</code></p>
    <p><a href="${escapeHtml(loginUrl)}">Sign in to your dashboard</a></p>
    <p style="color: #57534e; font-size: 14px;">
      For security, you must change this password on first sign-in.
    </p>
  </body>
</html>`;
}

function inviteText(input: ClientInviteEmailInput) {
  const loginUrl = dashboardUrl("/dashboard/login");
  const brandLine = input.brandName
    ? `You have been assigned ${input.brandName}.\n\n`
    : "";

  return `You're invited to Kalvez

Hi ${input.fullName},

${brandLine}Your client dashboard account is ready. Sign in with the temporary password below, then choose a new password.

Email: ${input.email}
Temporary password: ${input.temporaryPassword}

Sign in: ${loginUrl}

For security, you must change this password on first sign-in.
`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * Sends the temporary-password invite via Resend when RESEND_API_KEY is set.
 * Supabase Auth does not email plaintext passwords itself; Resend is the
 * supported custom mailer for this project.
 */
export async function sendClientInviteEmail(
  input: ClientInviteEmailInput,
): Promise<ClientInviteEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return {
      sent: false,
      provider: "none",
      error:
        "RESEND_API_KEY is not set. Share the temporary password manually, or add Resend to send invite emails.",
    };
  }

  const from =
    process.env.CLIENT_INVITE_FROM_EMAIL?.trim() ||
    "Kalvez <onboarding@resend.dev>";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.email],
        subject: "Your Kalvez dashboard login",
        html: inviteHtml(input),
        text: inviteText(input),
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return {
        sent: false,
        provider: "resend",
        error: detail.slice(0, 300) || `Resend error (${response.status})`,
      };
    }

    return { sent: true, provider: "resend" };
  } catch (error) {
    return {
      sent: false,
      provider: "resend",
      error:
        error instanceof Error ? error.message : "Could not send invite email.",
    };
  }
}
