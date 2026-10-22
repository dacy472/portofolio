import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** @type {import('@supabase/supabase-js').SupabaseClient | null} */
export const supabase =
  url && anonKey ? createClient(url, anonKey, { auth: { persistSession: false } }) : null;

export function isSupabaseConfigured() {
  return Boolean(supabase);
}
