import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env, isSupabaseConfigured } from './env'

// Satu instance client Supabase frontend (ARCHITECTURE §6.1 aturan 4).
// Hanya memakai URL dan publishable key yang memang dirancang publik.
// `service_role`, secret key, atau password database TIDAK boleh berada di sini.
let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null
  if (!client) {
    client = createClient(env.supabaseUrl as string, env.supabasePublishableKey as string)
  }
  return client
}
