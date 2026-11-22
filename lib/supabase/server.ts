import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client with service role (bypasses RLS)
// Use this for admin operations, seeding, and server API routes

export function createSupabaseServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}
