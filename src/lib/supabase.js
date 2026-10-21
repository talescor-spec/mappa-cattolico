import { createClient } from "@supabase/supabase-js";
import { authStorage } from "./secureStorage";

// Supabase URL and publishable key are intentionally client-safe values.
// Authorization is enforced by RLS, never by hiding the publishable key.
const DEFAULT_SUPABASE_URL = "https://sysuottboucultzzaagv.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_VhLP3-YOdwoU6-hCZa4-QQ_tDmsJE4H";

export const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  DEFAULT_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    storage: authStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
