import { NextResponse } from "next/server";
import { rejectCrossOrigin } from "@/lib/http-guard";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const crossOrigin = rejectCrossOrigin(request, { requireOrigin: true });
  if (crossOrigin) return crossOrigin;

  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  const url = new URL("/dashboard/login", request.url);
  return NextResponse.redirect(url, { status: 303 });
}
