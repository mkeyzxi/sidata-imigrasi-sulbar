import {NextResponse} from 'next/server'
import {randomUUID} from 'node:crypto'
import sharp from 'sharp'
import {createSupabaseServerClient} from '@/lib/supabase/server'

export const maxDuration = 60

// Batas ukuran upload per file (5 MB) & jumlah file (3)
const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_FILES = 3
// Dimensi target hasil resize (lebar 1600px, tinggi maksimum)
const TARGET_WIDTH = 1600

const KEGIATAN_BUCKET = 'kegiatan'

/**
 * POST /api/admin/kegiatan/upload
 *
 * Menerima form-data dengan field:
 *  - files[]  : 1..N file gambar (JPG/PNG/WebP)
 *  - unit_id  : unit tujuan (untuk membuat sub-folders & validasi akses)
 *
 * Setiap file di-resize (lebar maks 1600px) & dikonversi ke WebP,
 * lalu di-upload ke bucket storage "kegiatan" di bawah folder
 * {unit_id}/{uuid}.webp. Mengembalikan daftar path storage yang
 * berhasil diupload.
 *
 * Auth: memakai mekanisme yang sama dengan /api/admin/kegiatan
 * (Bearer token atau cookie), dan memvalidasi akses unit via canManageUnit.
 */

type AuthResult =
  | {ok: false; status: number; error: string}
  | {
      ok: true
      service: ReturnType<typeof createSupabaseServerClient>
      profile: {id: string; role: string; unit_slug: string | null; is_active: boolean}
    }

async function verifyAuth(req: Request): Promise<AuthResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  if (!url || !anonKey) {
    return {ok: false, status: 500, error: 'Konfigurasi Supabase belum lengkap di server.'}
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
    if (user) userId = user.id
  }

  // 2. Cookie fallback
  if (!userId) {
    try {
      const {cookies} = await import('next/headers')
      const cookieStore = await cookies()
      const {createServerClient} = await import('@supabase/ssr')
      const auth = createServerClient(url, anonKey, {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      })
      const {
        data: {user},
      } = await auth.auth.getUser()
      if (user) userId = user.id
    } catch {
      // abaikan, tetap lanjut tanpa userId
    }
  }

  if (!userId) {
    return {ok: false, status: 401, error: 'Sesi login tidak valid. Silakan masuk ulang.'}
  }

  const {data: profile} = await service
    .from('profiles')
    .select('id, role, unit_slug, is_active')
    .eq('id', userId)
    .single()

  if (!profile || !profile.is_active) {
    return {ok: false, status: 403, error: 'Akun Anda tidak aktif atau belum terdaftar.'}
  }

  return {ok: true, service, profile}
}

/**
 * Ambil path storage unit tujuan & validasi akses.
 * Menggunakan canManageUnit dari lib/utils/access agar konsisten
 * dengan aturan RLS kegiatan.
 */
async function resolveUploadPath(
  profile: {role: string; unit_slug: string | null},
  requestedUnit: string,
): Promise<{unit: string} | {error: string}> {
  // Unit tujuan: apa yang diminta, atau unit milik admin bila kosong
  const unit =
    (requestedUnit || profile.unit_slug || 'kanwil-sulbar').toLowerCase().trim()

  // Validasi: admin unit hanya boleh upload untuk unitnya sendiri
  const {canManageUnit} = await import('@/lib/utils/access')
  if (!canManageUnit(profile, unit)) {
    return {error: 'Anda tidak memiliki hak akses untuk unit ini.'}
  }
  return {unit}
}

export async function POST(req: Request) {
  const gate = await verifyAuth(req)
  if (!gate.ok) {
    return NextResponse.json({error: gate.error}, {status: gate.status})
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({error: 'Body form-data tidak valid.'}, {status: 400})
  }

  // field: files (multi) atau files[]
  const files = form.getAll('files').concat(form.getAll('files[]'))
  if (files.length === 0) {
    return NextResponse.json({error: 'Tidak ada file yang diupload.'}, {status: 400})
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json(
      {error: `Maksimal ${MAX_FILES} gambar per upload.`},
      {status: 400},
    )
  }

  const requestedUnit = String(form.get('unit_id') || '').trim()
  const unitResult = await resolveUploadPath(gate.profile, requestedUnit)
  if ('error' in unitResult) {
    return NextResponse.json({error: unitResult.error}, {status: 403})
  }
  const unit = unitResult.unit

  const service = gate.service
  const uploaded: string[] = []
  const errors: string[] = []

  for (const file of files) {
    if (!(file instanceof File)) continue

    if (file.size > MAX_FILE_SIZE) {
      errors.push(`${file.name}: ukuran melebihi 5 MB`)
      continue
    }
    if (!file.type.startsWith('image/')) {
      errors.push(`${file.name}: bukan file gambar`)
      continue
    }

    try {
      const buffer = Buffer.from(await file.arrayBuffer())

      // Resize: lebar maksimum 1600px, tinggi disesuaikan,
      // konversi ke WebP (quality 80).
      const webp = await sharp(buffer)
        .rotate() // hormati EXIF orientation
        .resize({width: TARGET_WIDTH, withoutEnlargement: true})
        .webp({quality: 80})
        .toBuffer()

      const filename = `${randomUUID()}.webp`
      const storagePath = `${unit}/${filename}`

      const {error: uploadError} = await service.storage
        .from(KEGIATAN_BUCKET)
        .upload(storagePath, webp, {
          contentType: 'image/webp',
          upsert: false,
        })

      if (uploadError) {
        errors.push(`${file.name}: gagal upload (${uploadError.message})`)
        continue
      }

      uploaded.push(storagePath)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      errors.push(`${file.name}: proses gagal (${msg})`)
    }
  }

  if (uploaded.length === 0) {
    return NextResponse.json(
      {error: 'Tidak ada gambar yang berhasil diproses.', details: errors},
      {status: 400},
    )
  }

  // URL publik untuk preview
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '')
  const urls = uploaded.map((p) =>
    base ? `${base}/storage/v1/object/public/${KEGIATAN_BUCKET}/${p}` : p,
  )

  return NextResponse.json({
    paths: uploaded,
    urls,
    errors: errors.length > 0 ? errors : undefined,
  })
}
