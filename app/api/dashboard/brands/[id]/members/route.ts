import { requireStaff } from "@/lib/auth/profile";
import { assignClientToBrand, listBrandMembers } from "@/lib/sites/brands";
import {
  enforceKeyedRateLimit,
  enforceRateLimit,
  readJsonBody,
  rejectCrossOrigin,
} from "@/lib/http-guard";
import { parseEmail } from "@/lib/contact";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const staff = await requireStaff();
  if (!staff) {
    return Response.json({ error: "Staff only." }, { status: 403 });
  }
  const { id } = await context.params;
  const members = await listBrandMembers(id);
  return Response.json({ members });
}

export async function POST(request: Request, context: Ctx) {
  const crossOrigin = await rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const staff = await requireStaff();
  if (!staff) {
    return Response.json({ error: "Staff only." }, { status: 403 });
  }

  const limited = await enforceRateLimit({
    request,
    key: "dashboard-assign-client",
    limit: 20,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const userLimited = await enforceKeyedRateLimit({
    key: `dashboard-assign-client-user:${staff.user.id}`,
    limit: 30,
    windowMs: 60 * 60_000,
    message: "Hourly invite limit reached.",
  });
  if (userLimited) return userLimited;

  const { id } = await context.params;
  const parsedBody = await readJsonBody(request, 4_096);
  if (!parsedBody.ok) return parsedBody.response;
  const raw = (parsedBody.body ?? {}) as Record<string, unknown>;
  const emailParsed = parseEmail(
    typeof raw.email === "string" ? raw.email : "",
  );
  const fullName =
    typeof raw.fullName === "string" ? raw.fullName.trim().slice(0, 120) : null;

  if (!emailParsed.ok) {
    return Response.json({ error: "Valid email required." }, { status: 400 });
  }

  try {
    const result = await assignClientToBrand({
      brandId: id,
      email: emailParsed.email,
      fullName,
      memberRole: raw.role === "viewer" ? "viewer" : "owner",
    });
    const members = await listBrandMembers(id);
    return Response.json({
      ok: true,
      userId: result.userId,
      email: result.email,
      created: result.created,
      emailSent: result.emailSent,
      emailError: result.emailError,
      // Shown once to staff so they can share credentials with the client.
      temporaryPassword: result.temporaryPassword,
      members,
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Could not assign client.",
      },
      { status: 500 },
    );
  }
}
