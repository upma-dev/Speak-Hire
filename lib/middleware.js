import { createMiddlewareClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error && error.name !== "AuthSessionMissingError") {
    console.error("Supabase middleware auth error:", error);
  }

  // Protect authorized routes
  if (
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/scheduled-interview") ||
    req.nextUrl.pathname.startsWith("/all-interview") ||
    req.nextUrl.pathname.startsWith("/billing") ||
    req.nextUrl.pathname.startsWith("/settings")
  ) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  // Allow /auth/callback unconditionally (auth flow landing)
  if (req.nextUrl.pathname === "/auth/callback") {
    return res;
  }

  // If already signed in, don’t let /auth stay on auth page
  if (req.nextUrl.pathname === "/auth" && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
