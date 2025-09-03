import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()

let client: SupabaseClient | null = null
if (supabaseUrl && supabaseAnonKey) {
  client = createClient(supabaseUrl, supabaseAnonKey)
}

export const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey)
export function getSupabase(): SupabaseClient | null {
  return client
}
