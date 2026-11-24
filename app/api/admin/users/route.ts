import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/**
 * /api/admin/users
 * Mengelola pengguna secara aman menggunakan Supabase Service Role Key.
 * Hanya bisa diakses oleh Superadmin.
 *
 * Mendukung:
 * - GET: Ambil daftar seluruh pengguna & profilnya.
 * - POST: Buat akun pengguna baru (Auth + Profile).
 * - PATCH: Perbarui data pengguna (nama, role, unit_slug, status aktif, ganti password).
 * - DELETE: Hapus akun pengguna.
 */

const VALID_ROLES = ['superadmin', 'admin', 'admin_kanwil', 'admin_mamuju', 'admin_polman', 'viewer']

type Gate =
  | { status: number; error: string }
  | { service: ReturnType<typeof createSupabaseServerClient>; currentUserId: string }

async function requireSuperadmin(req: Request): Promise<Gate> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  if (!url || !anonKey) {
    return { status: 500, error: 'Konfigurasi Supabase belum lengkap di server.' }
  }

  const service = createSupabaseServerClient()
  let userId: string | null = null

  // 1. Coba dari Authorization header (Bearer token)
  const authHeader = req.headers.get('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim()
    const { data: { user } } = await service.auth.getUser(token)
    if (user) {
      userId = user.id
    }
  }

  // 2. Fallback: coba dari cookies
  if (!userId) {
    const cookieStore = await cookies()
    const auth = createServerClient(url, anonKey, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    })
    const { data: { user } } = await auth.auth.getUser()
    if (user) {
      userId = user.id
    }
  }

  if (!userId) {
    return { status: 401, error: 'Sesi login tidak valid. Silakan masuk ulang.' }
  }

  const { data: profile } = await service
    .from('profiles')
    .select('role, is_active')
    .eq('id', userId)
    .single()

  if (!profile || profile.role !== 'superadmin' || !profile.is_active) {
    return { status: 403, error: 'Hanya superadmin yang boleh mengelola pengguna.' }
  }

  return { service, currentUserId: userId }
}

// GET: List all users and profiles
export async function GET(req: Request) {
  const gate = await requireSuperadmin(req)
  if ('error' in gate) {
    return NextResponse.json({ error: gate.error }, { status: gate.status })
  }

  const { data: profiles, error } = await gate.service
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ profiles: profiles || [] })
}

// POST: Create user
export async function POST(req: Request) {
  const gate = await requireSuperadmin(req)
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
  let role = String(body.role ?? 'admin')
  const unitSlugRaw = body.unit_slug ? String(body.unit_slug).trim() : ''
  const password = String(body.password ?? '').trim() || email.split('@')[0] + '@2026'

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Format email tidak valid.' }, { status: 400 })
  }
  if (!VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: 'Peran tidak valid.' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Password minimal 6 karakter.' }, { status: 400 })
  }

  // Jika role admin biasa, pastikan unit_slug dipilih dan petakan ke constraint database
  let unitSlug: string | null = null
  if (role === 'admin' || role.startsWith('admin')) {
    unitSlug = unitSlugRaw || null
    if (!unitSlug) {
      return NextResponse.json(
        { error: 'Pilih unit kerja (Kanwil Sulbar, Kanim Mamuju, atau Kanim Polman) untuk admin biasa.' },
        { status: 400 },
      )
    }
    // Petakan ke format DB yang valid (admin_kanwil, admin_mamuju, admin_polman)
    if (unitSlug === 'kanwil-sulbar') role = 'admin_kanwil'
    else if (unitSlug === 'imigrasi-mamuju') role = 'admin_mamuju'
    else if (unitSlug === 'imigrasi-polman') role = 'admin_polman'
  } else if (role === 'superadmin') {
    unitSlug = null
    role = 'superadmin'
  }

  const { data: authData, error: authError } = await gate.service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  const { data: updatedProfile, error: profileError } = await gate.service
    .from('profiles')
    .upsert({
      id: authData.user.id,
      email,
      full_name: fullName || null,
      role,
      unit_slug: unitSlug,
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .select('*')
    .single()

  if (profileError) {
    return NextResponse.json(
      { error: 'Akun dibuat tetapi profil gagal disimpan: ' + profileError.message },
      { status: 500 },
    )
  }

  return NextResponse.json({
    id: authData.user.id,
    email,
    password,
    profile: updatedProfile,
  })
}

// PATCH: Update user profile or password
export async function PATCH(req: Request) {
  const gate = await requireSuperadmin(req)
  if ('error' in gate) {
    return NextResponse.json({ error: gate.error }, { status: gate.status })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body permintaan tidak valid.' }, { status: 400 })
  }

  const id = String(body.id ?? '').trim()
  if (!id) {
    return NextResponse.json({ error: 'User ID wajib diisi.' }, { status: 400 })
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (body.full_name !== undefined) {
    updates.full_name = String(body.full_name ?? '').trim() || null
  }
  if (body.role !== undefined || body.unit_slug !== undefined) {
    const rawRole = body.role !== undefined ? String(body.role) : undefined
    const rawUnit = body.unit_slug !== undefined ? (body.unit_slug ? String(body.unit_slug).trim() : null) : undefined

    if (rawRole === 'superadmin') {
      updates.role = 'superadmin'
      updates.unit_slug = null
    } else if (rawRole === 'admin' || (rawRole && rawRole.startsWith('admin')) || rawUnit) {
      const targetUnit = rawUnit
      updates.unit_slug = targetUnit || null
      if (targetUnit === 'kanwil-sulbar') updates.role = 'admin_kanwil'
      else if (targetUnit === 'imigrasi-mamuju') updates.role = 'admin_mamuju'
      else if (targetUnit === 'imigrasi-polman') updates.role = 'admin_polman'
      else if (rawRole) updates.role = rawRole
    }
  }
  if (body.is_active !== undefined) {
    updates.is_active = Boolean(body.is_active)
  }

  // Update profile
  const { data: updatedProfile, error: profileError } = await gate.service
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single()

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 })
  }

  // Update password if provided
  const newPassword = String(body.password ?? '').trim()
  if (newPassword) {
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password minimal 6 karakter.' }, { status: 400 })
    }
    const { error: passError } = await gate.service.auth.admin.updateUserById(id, {
      password: newPassword,
    })
    if (passError) {
      return NextResponse.json({ error: 'Gagal mengubah password: ' + passError.message }, { status: 400 })
    }
  }

  return NextResponse.json({ profile: updatedProfile })
}

// DELETE: Remove user
export async function DELETE(req: Request) {
  const gate = await requireSuperadmin(req)
  if ('error' in gate) {
    return NextResponse.json({ error: gate.error }, { status: gate.status })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'User ID wajib disertakan.' }, { status: 400 })
  }

  if (id === gate.currentUserId) {
    return NextResponse.json({ error: 'Anda tidak dapat menghapus akun Anda sendiri.' }, { status: 400 })
  }

  // Hapus dari Auth
  const { error: authError } = await gate.service.auth.admin.deleteUser(id)
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  // Hapus dari profiles
  await gate.service.from('profiles').delete().eq('id', id)

  return NextResponse.json({ success: true, message: 'Pengguna berhasil dihapus.' })
}
