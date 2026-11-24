import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/**
 * POST /api/admin/users — buat pengguna baru (Supabase Auth) + set profilnya.
 *
 * `supabase.auth.admin.*` hanya bisa dipanggil dengan service role,
 * jadi endpoint ini dilakukan di server dengan SUPABASE_SERVICE_ROLE_KEY,
 * dan hanya setelah pemanggil dipastikan superadmin lewat sesi cookie-nya.
 *
 * Body JSON: { email, full_name, role, unit_slug?, password? }
 * Password default: <bagian-sebelum-@>@2026
 */

const VALID_ROLES = ['superadmin', 'admin_kanwil', 'admin_mamuju', 'admin_polman', 'viewer']

type Gate =
  | { status: number; error: string }
  | { service: ReturnType<typeof createSupabaseServerClient> }

async function requireSuperadmin(): Promise<Gate> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  if (!url || !anonKey) {
    return { status: 500, error: 'Konfigurasi Supabase belum lengkap di server.' }
  }

  const cookieStore = await cookies()
  const auth = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Route handler tidak selalu boleh menulis cookie — abaikan.
        }
      },
    },
  })

  const {
    data: { user },
  } = await auth.auth.getUser()
  if (!user) return { status: 401, error: 'Sesi login tidak valid. Silakan masuk ulang.' }

  const service = createSupabaseServerClient()
  const { data: profile } = await service
    .from('profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'superadmin' || !profile.is_active) {
    return { status: 403, error: 'Hanya superadmin yang boleh mengelola pengguna.' }
  }

  return { service }
}

export async function POST(req: Request) {
  const gate = await requireSuperadmin()
  if ('error' in gate) {
    return NextResponse.json({ error: gate.error }, { status: gate.status })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body permintaan tidak valid.' }, { status: 400 })
  }

  const email = String(body.email ?? '').trim().toLowerCase()
  const fullName = String(body.full_name ?? '').trim()
  const role = String(body.role ?? 'viewer')
  const unitSlugRaw = body.unit_slug ? String(body.unit_slug) : ''
  const password = String(body.password ?? '').trim() || email.split('@')[0] + '@2026'

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Format email tidak valid.' }, { status: 400 })
  }
  if (!VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: 'Peran tidak valid.' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: 'Password minimal 6 karakter.' },
      { status: 400 },
    )
  }

  // Unit wajib untuk role admin unit, tidak berlaku untuk superadmin/viewer
  const unitSlug = role.startsWith('admin') ? unitSlugRaw || null : null
  if (role.startsWith('admin') && !unitSlug) {
    return NextResponse.json(
      { error: 'Unit kerja wajib dipilih untuk peran admin unit.' },
      { status: 400 },
    )
  }

  const { data, error } = await gate.service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const { error: profileError } = await gate.service
    .from('profiles')
    .update({
      role,
      unit_slug: unitSlug,
      full_name: fullName || null,
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', data.user.id)

  if (profileError) {
    return NextResponse.json(
      {
        error:
          'Pengguna dibuat, tetapi gagal menyetel peran/profil: ' + profileError.message,
      },
      { status: 500 },
    )
  }

  return NextResponse.json({ id: data.user.id, email, password })
}
