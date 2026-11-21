import { after } from "next/server";
import { requireDashboardUser, requireStaff } from "@/lib/auth/profile";
import { inferTrade } from "@/lib/report/keywords";
import { clampText, isValidPlaceId } from "@/lib/report/security";
import {
  createBrandFromPlace,
  listBrandsForProfile,
} from "@/lib/sites/brands";
import { createGenerationJob } from "@/lib/sites/jobs";
import { runGeneration } from "@/lib/sites/run";
import {
  enforceRateLimit,
  readJsonBody,
  rejectCrossOrigin,
} from "@/lib/http-guard";

export async function GET() {
  const session = await requireDashboardUser();
  if (!session) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const brands = await listBrandsForProfile(session.profile);
  return Response.json({ brands, role: session.profile.role });
}

export async function POST(request: Request) {
  const crossOrigin = rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const staff = await requireStaff();
  if (!staff) {
    return Response.json({ error: "Staff only." }, { status: 403 });
  }

  const limited = await enforceRateLimit({
    request,
    key: "dashboard-brand-create",
    limit: 20,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const parsedBody = await readJsonBody(request, 8_192);
  if (!parsedBody.ok) return parsedBody.response;
  const raw = (parsedBody.body ?? {}) as Record<string, unknown>;

  const placeId = clampText(
    typeof raw.placeId === "string" ? raw.placeId : "",
    256,
  );
  const name = clampText(
    typeof raw.name === "string" ? raw.name : "",
    160,
  );
  const address = clampText(
    typeof raw.address === "string" ? raw.address : "",
    240,
  );
  const types = Array.isArray(raw.types)
    ? raw.types
        .filter((item): item is string => typeof item === "string")
        .slice(0, 20)
    : [];
  const lat =
    typeof raw.lat === "number" && Number.isFinite(raw.lat) ? raw.lat : null;
  const lng =
    typeof raw.lng === "number" && Number.isFinite(raw.lng) ? raw.lng : null;
  const generate = raw.generate !== false;

  if (!isValidPlaceId(placeId) || !name) {
    return Response.json(
      { error: "Select a Google Business Profile." },
      { status: 400 },
    );
  }

  const trade = inferTrade({ types, name });
  const brand = await createBrandFromPlace({
    name,
    placeId,
    address,
    lat,
    lng,
    trade,
    createdBy: staff.user.id,
  });

  let jobId: string | null = null;
  if (generate) {
    const job = await createGenerationJob(brand.id);
    jobId = job.id as string;
    after(() => runGeneration(jobId!));
  }

  return Response.json({ brand, jobId });
}
