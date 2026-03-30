import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          // For API routes, cookies are typically not set in the response
          // If needed, use NextResponse to set cookies
        },
        remove(name, options) {
          // For API routes, cookies are typically not removed in the response
          // If needed, use NextResponse to remove cookies
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  return Response.json(data);
}
