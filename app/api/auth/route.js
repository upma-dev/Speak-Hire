import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies,
    },
  );

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("Users").upsert(
      {
        email: user.email,
        name: user.user_metadata?.full_name || "",
        picture: user.user_metadata?.avatar_url || "",
        credits: 3,
      },
      { onConflict: "email" },
    );

    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.redirect(new URL("/auth", request.url));
}

export async function POST(request) {
  try {
    const { event, session } = await request.json();
    // Handle auth state change notifications
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Auth state POST error:", error);
    return NextResponse.json({ success: true });
  }
}
