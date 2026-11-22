import {
  clearMustChangePassword,
  requireDashboardUser,
} from "@/lib/auth/profile";
import {
  enforceRateLimit,
  readJsonBody,
  rejectCrossOrigin,
} from "@/lib/http-guard";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const crossOrigin = await rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const session = await requireDashboardUser();
  if (!session) {
    return Response.json({ error: "Sign in required." }, { status: 401 });
  }

  const limited = await enforceRateLimit({
    request,
    key: `dashboard-change-password:${session.user.id}`,
    limit: 10,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const parsedBody = await readJsonBody(request, 2_048);
  if (!parsedBody.ok) return parsedBody.response;
  const raw = (parsedBody.body ?? {}) as Record<string, unknown>;
  const password = typeof raw.password === "string" ? raw.password : "";
  const confirm =
    typeof raw.confirmPassword === "string" ? raw.confirmPassword : "";

  if (password.length < 8) {
    return Response.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }
  if (password !== confirm) {
    return Response.json(
      { error: "Passwords do not match." },
      { status: 400 },
    );
  }

  const supabase = await createServerSupabase();
  const { error: updateError } = await supabase.auth.updateUser({ password });
  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 400 });
  }

  try {
    await clearMustChangePassword(session.user.id);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Password updated, but could not clear the change flag.",
      },
      { status: 500 },
    );
  }

  // Refresh so JWT app_metadata no longer forces the change-password gate.
  await supabase.auth.refreshSession();

  return Response.json({ ok: true });
}
