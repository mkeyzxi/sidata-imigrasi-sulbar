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

// GET: Ambil daftar kegiatan (dengan batas unit untuk admin biasa)
export async function GET(req: Request) {
  const gate = await verifyAuth(req)
  if ('error' in gate) {
    return NextResponse.json({error: gate.error}, {status: gate.status})
  }

  const {searchParams} = new URL(req.url)

  // ?scope=all -> semua unit (hanya superadmin; default tetap sesuai peran)
  const scope = searchParams.get('scope')

  let query = gate.service
    .from('kegiatan')
    .select('*')
    .order('date', {ascending: false})

  // Jika bukan superadmin, paksa query hanya untuk unit yang dimiliki
  if (gate.profile.role !== 'superadmin') {
    const userUnit = gate.profile.unit_slug
    if (!userUnit) {
      return NextResponse.json({kegiatan: []})
    }
    query = query.eq('unit_id', userUnit)
  } else if (scope !== 'all') {
    // Superadmin: tetap boleh filter per unit bila diminta
    const unitFilter = searchParams.get('unit_id')
    if (unitFilter && unitFilter !== 'all') {
      query = query.eq('unit_id', unitFilter)
    }
  }

  const {data, error} = await query

  if (error) {
    return NextResponse.json({error: error.message}, {status: 500})
  }

  return NextResponse.json({kegiatan: data || []})
}

// POST: Tambah kegiatan baru
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
  const title = String(body.title ?? '').trim()
  const date = String(body.date ?? '').trim()
  const description = body.description ? String(body.description).trim() : null
  const location = body.location ? String(body.location).trim() : null
  const type = body.type ? String(body.type).trim() : 'Intel-WAS'
  const imageUrl = body.image_url ? String(body.image_url).trim() : null
  const published = body.published !== undefined ? Boolean(body.published) : true
  const bidangId = body.bidang_id ? String(body.bidang_id).trim() : null

  if (!title) {
    return NextResponse.json({error: 'Judul kegiatan wajib diisi.'}, {status: 400})
  }
  if (!unitId) {
    return NextResponse.json({error: 'Unit kerja wajib ditentukan.'}, {status: 400})
  }
  if (!date) {
    return NextResponse.json({error: 'Tanggal kegiatan wajib diisi.'}, {status: 400})
  }

  // Validasi otorisasi unit
  if (!canManageUnit(gate.profile, unitId)) {
    return NextResponse.json(
      {error: 'Anda tidak memiliki hak akses untuk mengelola data unit ini.'},
      {status: 403},
    )
  }

  const {data, error} = await gate.service
    .from('kegiatan')
    .insert({
      unit_id: unitId,
      bidang_id: bidangId,
      title,
      description,
      date,
      location,
      type,
      image_url: imageUrl,
      published,
      created_by: gate.profile.id,
      updated_at: new Date().toISOString(),
    })
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({error: error.message}, {status: 500})
  }

  return NextResponse.json({kegiatan: data})
}

// PATCH: Perbarui kegiatan
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
    return NextResponse.json({error: 'ID kegiatan wajib disertakan.'}, {status: 400})
  }

  // Periksa data kegiatan lama untuk memastikan hak akses unit
  const {data: existing, error: existError} = await gate.service
    .from('kegiatan')
    .select('unit_id')
    .eq('id', id)
    .single()

  if (existError || !existing) {
    return NextResponse.json({error: 'Kegiatan tidak ditemukan.'}, {status: 404})
  }

  if (!canManageUnit(gate.profile, existing.unit_id)) {
    return NextResponse.json(
      {error: 'Anda tidak memiliki izin mengubah data pada unit ini.'},
      {status: 403},
    )
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (body.title !== undefined) updates.title = String(body.title).trim()
  if (body.description !== undefined)
    updates.description = body.description ? String(body.description).trim() : null
  if (body.date !== undefined) updates.date = String(body.date).trim()
  if (body.location !== undefined)
    updates.location = body.location ? String(body.location).trim() : null
  if (body.type !== undefined) updates.type = body.type ? String(body.type).trim() : 'Intel-WAS'
  if (body.image_url !== undefined)
    updates.image_url = body.image_url ? String(body.image_url).trim() : null
  if (body.published !== undefined) updates.published = Boolean(body.published)
  if (body.bidang_id !== undefined)
    updates.bidang_id = body.bidang_id ? String(body.bidang_id).trim() : null

  // Hanya superadmin yang boleh memindahkan kegiatan ke unit lain
  if (body.unit_id !== undefined && gate.profile.role === 'superadmin') {
    updates.unit_id = String(body.unit_id).trim()
  }

  const {data, error} = await gate.service
    .from('kegiatan')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({error: error.message}, {status: 500})
  }

  return NextResponse.json({kegiatan: data})
}

// DELETE: Hapus kegiatan
export async function DELETE(req: Request) {
  const gate = await verifyAuth(req)
  if ('error' in gate) {
    return NextResponse.json({error: gate.error}, {status: gate.status})
  }

  const {searchParams} = new URL(req.url)
  const idStr = searchParams.get('id')
  const id = idStr ? Number(idStr) : 0

  if (!id) {
    return NextResponse.json({error: 'ID kegiatan tidak valid.'}, {status: 400})
  }

  const {data: existing, error: existError} = await gate.service
    .from('kegiatan')
    .select('unit_id')
    .eq('id', id)
    .single()

  if (existError || !existing) {
    return NextResponse.json({error: 'Kegiatan tidak ditemukan.'}, {status: 404})
  }

  if (!canManageUnit(gate.profile, existing.unit_id)) {
    return NextResponse.json(
      {error: 'Anda tidak memiliki izin menghapus data pada unit ini.'},
      {status: 403},
    )
  }

  const {error} = await gate.service.from('kegiatan').delete().eq('id', id)

  if (error) {
    return NextResponse.json({error: error.message}, {status: 500})
  }

  return NextResponse.json({success: true, message: 'Kegiatan berhasil dihapus.'})
}
