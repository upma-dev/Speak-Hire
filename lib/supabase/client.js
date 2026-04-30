import { createBrowserClient } from "@supabase/ssr";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  cookies: {
    get(name) {
      return getCookie(name);
    },
    set(name, value, options) {
      setCookie(name, value, { path: "/", ...options });
    },
    remove(name, options) {
      deleteCookie(name, { path: "/", ...options });
    },
  },
});
