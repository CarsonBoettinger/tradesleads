import { requireDashboardUser } from "@/lib/auth/profile";
import {
  createPhoneLead,
  isLeadStatus,
  listBrandLeads,
  parsePhoneLeadBody,
} from "@/lib/leads/crm";
import { getBrandById, userCanAccessBrand } from "@/lib/sites/brands";
import {
  enforceRateLimit,
  readJsonBody,
  rejectCrossOrigin,
} from "@/lib/http-guard";

type Ctx = { params: Promise<{ brandId: string }> };

export async function GET(request: Request, context: Ctx) {
  const session = await requireDashboardUser();
  if (!session) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { brandId } = await context.params;
  const allowed = await userCanAccessBrand(session.profile, brandId);
  if (!allowed) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  const statusParam = new URL(request.url).searchParams.get("status");
  const status =
    statusParam && isLeadStatus(statusParam) ? statusParam : null;

  try {
    const leads = await listBrandLeads({ brandId, status });
    return Response.json({ leads });
  } catch (error) {
    console.error("List brand leads failed:", error);
    return Response.json({ error: "Could not load leads." }, { status: 500 });
  }
}

export async function POST(request: Request, context: Ctx) {
  const crossOrigin = await rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const limited = await enforceRateLimit({
    request,
    key: "dashboard-leads-create",
    limit: 30,
    windowMs: 60_000,
    message: "Too many requests. Try again shortly.",
  });
  if (limited) return limited;

  const session = await requireDashboardUser();
  if (!session) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { brandId } = await context.params;
  const allowed = await userCanAccessBrand(session.profile, brandId);
  if (!allowed) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  const brand = await getBrandById(brandId);
  if (!brand) {
    return Response.json({ error: "Brand not found." }, { status: 404 });
  }

  const parsedBody = await readJsonBody(request, 8_192);
  if (!parsedBody.ok) return parsedBody.response;

  const parsed = parsePhoneLeadBody(parsedBody.body);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const lead = await createPhoneLead({
      brandId,
      brandName: brand.name,
      brandTown: brand.town,
      brandTrade: brand.trade,
      brandPlaceId: brand.place_id,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      phone: parsed.data.phone,
      email: parsed.data.email,
      comments: parsed.data.comments,
    });
    return Response.json({ lead }, { status: 201 });
  } catch (error) {
    console.error("Create phone lead failed:", error);
    return Response.json({ error: "Could not create lead." }, { status: 500 });
  }
}
