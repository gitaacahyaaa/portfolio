import { createClient } from '@supabase/supabase-js'

// Hanya URL + anon key (memang publik). JANGAN pernah taruh service_role key di sini / di frontend.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
export const hasSupabase = Boolean(url && key)
export const supabase = hasSupabase ? createClient(url, key) : null
export const BUCKET = 'portfolio'
