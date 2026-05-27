import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Build a no-op fallback that never throws during SSR/prerendering
const noOpClient = new Proxy(
  {} as SupabaseClient,
  {
    get(_target, prop) {
      if (prop === "from") {
        return () =>
          new Proxy(
            {} as any,
            {
              get(__target, __prop) {
                if (["select", "insert", "update", "upsert", "delete", "eq", "order", "limit", "single", "then"].includes(String(__prop))) {
                  return () => Promise.resolve({ data: [], error: null });
                }
                return () => Promise.resolve({ data: [], error: null });
              },
            }
          );
      }
      if (prop === "auth") {
        return { getSession: () => Promise.resolve({ data: { session: null }, error: null }) };
      }
      return () => Promise.resolve({ data: null, error: null });
    },
  }
);

export const supabase: SupabaseClient =
  url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : noOpClient;

// Server-side only admin client
export const supabaseAdmin =
  typeof window === "undefined" && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;
