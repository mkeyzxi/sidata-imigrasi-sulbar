import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Create a Supabase server client for use in Server Components
 * and API routes. This client uses cookies for session management.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component. Safe to ignore when
            // cookies() is not a request cookie store (e.g. during
            // static generation).
          }
        },
      },
    }
  )
}

/**
 * Create a Supabase server client for use in Route Handlers (app/api).
 * This client receives the request headers directly.
 */
export function createSupabaseRouteClient(requestHeaders: Headers) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        getAll() {
          const cookies: { name: string; value: string }[] = []
          requestHeaders.get('cookie')
            ?.split(';')
            .map((c) => c.trim())
            .filter(Boolean)
            .forEach((c) => {
              const [name, ...rest] = c.split('=')
              cookies.push({ name, value: rest.join('=') })
            })
          return cookies
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            supabase.auth.setSession({
              access_token: value,
              refresh_token: value,
            })
          })
        },
      },
    }
  )
  return supabase
}

/**
 * Get the current authenticated user from the Supabase session.
 * Safe to call in Server Components or Route Handlers.
 */
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Get the current user's profile (role, unit_slug, etc.).
 */
export async function getCurrentProfile() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

/**
 * Check if the current user has a specific role.
 */
export async function hasRole(roles: string[]) {
  const profile = await getCurrentProfile()
  if (!profile) return false
  return roles.includes(profile.role)
}

/**
 * Check if the current user can access a specific unit's admin area.
 */
export async function canAccessUnit(unitSlug: string | null) {
  const profile = await getCurrentProfile()
  if (!profile) return false

  if (profile.role === 'superadmin') return true

  // Unit admin can only access their own unit
  if (profile.role === 'admin_kanwil' && unitSlug === 'kanwil-sulbar') return true
  if (profile.role === 'admin_mamuju' && unitSlug === 'imigrasi-mamuju') return true
  if (profile.role === 'admin_polman' && unitSlug === 'imigrasi-polman') return true

  return false
}
