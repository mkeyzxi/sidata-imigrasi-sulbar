/**
 * Helper untuk membangun URL publik gambar yang disimpan di Supabase Storage.
 *
 * Kolom `kegiatan.image_url` & `kegiatan.gallery` dapat berisi salah satu:
 *  - URL absolut (http/https)  → dipakai apa adanya
 *  - path storage relatif (mis. "kegiatan/kanwil-sulbar/xxx.webp")
 *    → dibangun menjadi URL publik:
 *      {SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}
 *
 * Fungsi ini dipakai di data-service agar data yang dikembalikan ke client
 * selalu berupa URL yang bisa langsung di-render oleh <next/image>.
 */

const KEGIATAN_BUCKET = 'kegiatan'

/**
 * Konversi satu nilai image_url / gallery item menjadi URL yang bisa
 * dirender. Mengembalikan string kosong bila input kosong/undefined.
 */
export function resolveActivityImage(raw?: string | null): string {
  if (!raw) return ''
  const value = String(raw).trim()
  if (!value) return ''
  // Sudah URL absolut → pakai apa adanya
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }
  // Path relatif storage → bangun URL publik
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '')
  if (!base) {
    // Jika env belum tersedia (mis. saat build static), kembalikan path apa adanya
    // sehingga tidak ada runtime error; browser akan gagal load tapi tidak crash.
    return value
  }
  // Jika sudah diawali nama bucket, jangan duplikasi
  const cleanPath = value.startsWith(`${KEGIATAN_BUCKET}/`)
    ? value
    : `${KEGIATAN_BUCKET}/${value}`
  return `${base}/storage/v1/object/public/${cleanPath}`
}

/**
 * Konversi array path storage (kolom gallery JSONB) menjadi array URL.
 */
export function resolveActivityGallery(
  raw?: unknown,
): string[] {
  if (!raw || !Array.isArray(raw)) return []
  return raw
    .filter((p): p is string => typeof p === 'string')
    .map((p) => resolveActivityImage(p))
    .filter(Boolean)
}
