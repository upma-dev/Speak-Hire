import { createBrowserClient } from "@supabase/ssr";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const fallbackSupabaseUrl = "https://placeholder.supabase.co";
const fallbackSupabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder.signature";

export const supabase = createBrowserClient(
  supabaseUrl || fallbackSupabaseUrl,
  supabaseAnonKey || fallbackSupabaseAnonKey,
  {
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
},
);
