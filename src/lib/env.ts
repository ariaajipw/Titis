// Satu modul konfigurasi untuk membaca environment variables (ARCHITECTURE §6.1 aturan 5).
// Semua nilai `VITE_*` dianggap publik; jangan pernah menaruh secret di sini.

export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  supabasePublishableKey: import.meta.env
    .VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined,
} as const

export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabasePublishableKey)
}
