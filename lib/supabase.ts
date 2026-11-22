import { createClient, type SupabaseClient } from '@supabase/ssr'

// Create a single supabase client for both server and browser
export const createSupabaseClient = (headers: Headers = new Headers()) => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    { headers }
  )
}

// Helper to get supabase client with auth
export async function getSupabaseSession(headers: Headers) {
  const supabase = createSupabaseClient(headers)
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) throw error
  return session
}