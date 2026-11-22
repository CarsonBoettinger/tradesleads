import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

type UpdateSessionOptions = {
  /** When set, responses use rewrite instead of next() (dashboard host routing). */
  rewriteTo?: URL;
};

function baseResponse(request: NextRequest, rewriteTo?: URL) {
  if (rewriteTo) {
    return NextResponse.rewrite(rewriteTo, { request });
  }
  return NextResponse.next({ request });
}

export async function updateSession(
  request: NextRequest,
  options: UpdateSessionOptions = {},
) {
  const { rewriteTo } = options;
  let response = baseResponse(request, rewriteTo);

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = baseResponse(request, rewriteTo);
        for (const { name, value, options: cookieOptions } of cookiesToSet) {
          response.cookies.set(name, value, cookieOptions);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user, supabase };
}
