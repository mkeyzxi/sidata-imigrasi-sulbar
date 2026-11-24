import {NextResponse} from 'next/server'
import {cookies} from 'next/headers'
import {createServerClient} from '@supabase/ssr'
import {createSupabaseServerClient} from '@/lib/supabase/server'
import {canManageUnit} from '@/lib/utils/access'

type AuthGate =
  | {status: number; error: string}
  | {
      service: ReturnType<typeof createSupabaseServerClient>
      profile: {id: string; role: string; unit_slug: string | null; is_active: boolean}
    }

async function verifyAuth(req: Request): Promise<AuthGate> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  if (!url || !anonKey) {
    return {status: 500, error: 'Konfigurasi Supabase belum lengkap di server.'}
  }

  const service = createSupabaseServerClient()
  let userId: string | null = null

  // 1. Authorization header
  const authHeader = req.headers.get('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim()
    const {
      data: {user},
    } = await service.auth.getUser(token)
    if (user) {
      userId = user.id
    }
  }

  // 2. Cookie fallback
  if (!userId) {
    const cookieStore = await cookies()
    const auth = createServerClient(url, anonKey, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    })
    const {
      data: {user},
    } = await auth.auth.getUser()
    if (user) {
      userId = user.id
    }
  }

  if (!userId) {
    return {status: 401, error: 'Sesi login tidak valid. Silakan masuk ulang.'}
  }

  const {data: profile} = await service
    .from('profiles')
    .select('id, role, unit_slug, is_active')
    .eq('id', userId)
    .single()

  if (!profile || !profile.is_active) {
    return {status: 403, error: 'Akun Anda tidak aktif atau belum terdaftar.'}
  }

  return {service, profile}
}

// GET: Ambil statistik
export async function GET(req: Request) {
  const gate = await verifyAuth(req)
  if ('error' in gate) {
    return NextResponse.json({error: gate.error}, {status: gate.status})
  }

  const {searchParams} = new URL(req.url)
  const unitFilter = searchParams.get('unit_id')
  const kategori = searchParams.get('kategori')
  const tahun = searchParams.get('tahun')

  let query = gate.service
    .from('statistik_pendaftaran')
    .select('*')
    .order('tahun', {ascending: false})
    .order('kategori', {ascending: true})

  // Pembatasan unit
  if (gate.profile.role !== 'superadmin') {
    const userUnit = gate.profile.unit_slug
    if (!userUnit) {
      return NextResponse.json({statistik: []})
    }
    query = query.eq('unit_id', userUnit)
  } else if (unitFilter && unitFilter !== 'all') {
    query = query.eq('unit_id', unitFilter)
  }

  if (kategori && kategori !== 'all') {
    query = query.eq('kategori', kategori)
  }
  if (tahun && tahun !== 'all') {
    query = query.eq('tahun', Number(tahun))
  }

  const {data, error} = await query

  if (error) {
    return NextResponse.json({error: error.message}, {status: 500})
  }

  return NextResponse.json({statistik: data || []})
}

// POST: Tambah statistik baru
export async function POST(req: Request) {
  const gate = await verifyAuth(req)
  if ('error' in gate) {
    return NextResponse.json({error: gate.error}, {status: gate.status})
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({error: 'Body permintaan tidak valid.'}, {status: 400})
  }

  const unitId = String(body.unit_id || gate.profile.unit_slug || '').trim()
  const kategori = String(body.kategori ?? '').trim()
  const subKategori = body.sub_kategori ? String(body.sub_kategori).trim() : null
  const label = body.label ? String(body.label).trim() : null
  const nilai = Number(body.nilai ?? 0)
  const tahun = Number(body.tahun ?? new Date().getFullYear())
  let detail: unknown = {}

  if (body.detail) {
    if (typeof body.detail === 'object') {
      detail = body.detail
    } else {
      try {
        detail = JSON.parse(String(body.detail))
      } catch {
        detail = {raw: String(body.detail)}
      }
    }
  }

  if (!unitId) {
    return NextResponse.json({error: 'Unit kerja wajib dipilih.'}, {status: 400})
  }
  if (!kategori) {
    return NextResponse.json({error: 'Kategori wajib diisi.'}, {status: 400})
  }

  if (!canManageUnit(gate.profile, unitId)) {
    return NextResponse.json(
      {error: 'Anda tidak memiliki hak akses untuk menambah data pada unit ini.'},
      {status: 403},
    )
  }

  const {data, error} = await gate.service
    .from('statistik_pendaftaran')
    .insert({
      unit_id: unitId,
      kategori,
      sub_kategori: subKategori,
      label,
      nilai,
      detail,
      tahun,
      updated_at: new Date().toISOString(),
    })
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({error: error.message}, {status: 500})
  }

  return NextResponse.json({statistik: data})
}

// PATCH: Perbarui statistik
export async function PATCH(req: Request) {
  const gate = await verifyAuth(req)
  if ('error' in gate) {
    return NextResponse.json({error: gate.error}, {status: gate.status})
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({error: 'Body permintaan tidak valid.'}, {status: 400})
  }

  const id = Number(body.id)
  if (!id) {
    return NextResponse.json({error: 'ID data statistik wajib disertakan.'}, {status: 400})
  }

  const {data: existing, error: existError} = await gate.service
    .from('statistik_pendaftaran')
    .select('unit_id')
    .eq('id', id)
    .single()

  if (existError || !existing) {
    return NextResponse.json({error: 'Data statistik tidak ditemukan.'}, {status: 404})
  }

  if (!canManageUnit(gate.profile, existing.unit_id)) {
    return NextResponse.json(
      {error: 'Anda tidak memiliki hak akses mengubah data unit ini.'},
      {status: 403},
    )
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (body.kategori !== undefined) updates.kategori = String(body.kategori).trim()
  if (body.sub_kategori !== undefined)
    updates.sub_kategori = body.sub_kategori ? String(body.sub_kategori).trim() : null
  if (body.label !== undefined) updates.label = body.label ? String(body.label).trim() : null
  if (body.nilai !== undefined) updates.nilai = Number(body.nilai)
  if (body.tahun !== undefined) updates.tahun = Number(body.tahun)

  if (body.detail !== undefined) {
    if (typeof body.detail === 'object') {
      updates.detail = body.detail
    } else {
      try {
        updates.detail = JSON.parse(String(body.detail))
      } catch {
        updates.detail = {raw: String(body.detail)}
      }
    }
  }

  if (body.unit_id !== undefined && gate.profile.role === 'superadmin') {
    updates.unit_id = String(body.unit_id).trim()
  }

  const {data, error} = await gate.service
    .from('statistik_pendaftaran')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({error: error.message}, {status: 500})
  }

  return NextResponse.json({statistik: data})
}

// DELETE: Hapus statistik
export async function DELETE(req: Request) {
  const gate = await verifyAuth(req)
  if ('error' in gate) {
    return NextResponse.json({error: gate.error}, {status: gate.status})
  }

  const {searchParams} = new URL(req.url)
  const idStr = searchParams.get('id')
  const id = idStr ? Number(idStr) : 0

  if (!id) {
    return NextResponse.json({error: 'ID data statistik tidak valid.'}, {status: 400})
  }

  const {data: existing, error: existError} = await gate.service
    .from('statistik_pendaftaran')
    .select('unit_id')
    .eq('id', id)
    .single()

  if (existError || !existing) {
    return NextResponse.json({error: 'Data statistik tidak ditemukan.'}, {status: 404})
  }

  if (!canManageUnit(gate.profile, existing.unit_id)) {
    return NextResponse.json(
      {error: 'Anda tidak memiliki hak akses menghapus data unit ini.'},
      {status: 403},
    )
  }

  const {error} = await gate.service.from('statistik_pendaftaran').delete().eq('id', id)

  if (error) {
    return NextResponse.json({error: error.message}, {status: 500})
  }

  return NextResponse.json({success: true, message: 'Data statistik berhasil dihapus.'})
}
