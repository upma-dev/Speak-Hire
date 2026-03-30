import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Callback({ searchParams }) {
  const cookieStore = typeof cookies === "function" ? cookies() : cookies;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          if (cookieStore && typeof cookieStore.get === "function") {
            return cookieStore.get(name)?.value;
          }

          if (cookieStore && typeof cookieStore.getAll === "function") {
            const all = cookieStore.getAll(name);
            return all && all.length > 0 ? all[0]?.value : undefined;
          }

          return undefined;
        },
        set(name, value, options) {
          if (cookieStore && typeof cookieStore.set === "function") {
            cookieStore.set(name, value, options);
          } else if (
            cookieStore &&
            typeof cookieStore.setAll === "function" &&
            typeof cookieStore.getAll === "function"
          ) {
            const cookiesArr = cookieStore.getAll();
            const existing = cookiesArr.filter((c) => c.name !== name);
            existing.push({ name, value, ...options });
            cookieStore.setAll(existing);
          }
        },
        remove(name, options) {
          if (cookieStore && typeof cookieStore.delete === "function") {
            cookieStore.delete(name, options);
          } else if (cookieStore && typeof cookieStore.remove === "function") {
            cookieStore.remove(name, options);
          } else if (cookieStore && typeof cookieStore.set === "function") {
            cookieStore.set(name, "", { ...options, maxAge: 0 });
          }
        },
      },
    },
  );

  const code = searchParams.code;
  let session = null;

  if (code) {
    const { data: exchangeData, error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      redirect(`/auth?error=${encodeURIComponent(error.message)}`);
    }

    session = exchangeData?.session ?? null;
  }

  if (!session) {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError && sessionError.name !== "AuthSessionMissingError") {
      console.error("Error reading session in callback:", sessionError);
    }

    session = sessionData?.session ?? null;
  }

  if (session?.user) {
    const { error: upsertError } = await supabase.from("Users").upsert(
      {
        email: session.user.email,
        name:
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          "",
        picture:
          session.user.user_metadata?.avatar_url ||
          session.user.user_metadata?.picture ||
          "",
        credits: 3,
      },
      { onConflict: "email" },
    );

    if (upsertError) {
      console.error("Error upserting user in callback:", upsertError);
    }

    redirect("/dashboard");
  }

  const errorMsg = searchParams.error;
  if (errorMsg) {
    redirect(`/auth?error=${encodeURIComponent(errorMsg)}`);
  } else {
    redirect("/auth");
  }
}
