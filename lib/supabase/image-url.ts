/**
 * Helper untuk membangun URL publik gambar yang disimpan di Supabase Storage.
 *
 * Kolom `kegiatan.image_url` & `kegiatan.gallery` dapat berisi salah satu:
 *  - URL absolut (http/https)  → dipakai apa adanya
 *  - path storage relatif (mis. "kanwil-sulbar/xxx.webp" atau "kegiatan/kanwil-sulbar/xxx.webp")
 *    → dibangun menjadi URL publik:
 *      {SUPABASE_URL}/storage/v1/object/public/kegiatan/{path}
 *  - JSON array string (mis. '["path1.webp","path2.webp"]') ketika kolom `gallery`
 *    belum tersedia di database → di-parse secara otomatis agar multi-gambar tetap tampil.
 */

const KEGIATAN_BUCKET = 'kegiatan'

/**
 * Mengekstrak daftar path/URL mentah dari string `image_url`
 * (mendukung string tunggal maupun JSON array string).
 */
export function parseRawImageList(rawImageUrl?: string | null, rawGallery?: unknown): string[] {
  const collected: string[] = []

  if (typeof rawImageUrl === 'string' && rawImageUrl.trim()) {
    const trimmed = rawImageUrl.trim()
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          parsed.forEach((p) => {
            if (typeof p === 'string' && p.trim()) collected.push(p.trim())
          })
        }
      } catch {
        collected.push(trimmed)
      }
    } else {
      collected.push(trimmed)
    }
  }

  if (Array.isArray(rawGallery)) {
    rawGallery.forEach((p) => {
      if (typeof p === 'string' && p.trim()) collected.push(p.trim())
    })
  }

  return Array.from(new Set(collected))
}

/**
 * Konversi satu nilai image_url / gallery item menjadi URL yang bisa
 * dirender. Mengembalikan string kosong bila input kosong/undefined.
 */
export function resolveActivityImage(raw?: string | null): string {
  if (!raw) return ''
  let value = String(raw).trim()
  if (!value) return ''

  // Jika input adalah JSON array string, ambil elemen pertamanya
  if (value.startsWith('[')) {
    const list = parseRawImageList(value)
    value = list[0] || ''
    if (!value) return ''
  }

  // Sudah URL absolut atau path publik lokal (diawali '/') → pakai apa adanya
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) {
    return value
  }

  // Path relatif storage → bangun URL publik
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '')
  if (!base) {
    return value
  }

  // Jika sudah diawali nama bucket, jangan duplikasi
  const cleanPath = value.startsWith(`${KEGIATAN_BUCKET}/`)
    ? value
    : `${KEGIATAN_BUCKET}/${value}`
  return `${base}/storage/v1/object/public/${cleanPath}`
}

/**
 * Konversi array path storage (kolom gallery JSONB dan/atau image_url)
 * menjadi array URL publik yang sudah dide-duplikasi.
 */
export function resolveActivityGallery(
  rawGallery?: unknown,
  rawImageUrl?: string | null,
): string[] {
  const combined = parseRawImageList(rawImageUrl, rawGallery)
  return Array.from(
    new Set(combined.map((p) => resolveActivityImage(p)).filter(Boolean)),
  )
}
