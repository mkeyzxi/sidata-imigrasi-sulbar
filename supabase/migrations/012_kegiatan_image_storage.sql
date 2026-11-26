-- Migration 012: Supabase Storage bucket "kegiatan" + kolom gallery di tabel kegiatan
-- Mendukung upload gambar kegiatan (resize + konversi ke WebP via API server).
-- Bucket bersifat PUBLIC untuk baca (gambar kegiatan ditampilkan di halaman publik),
-- tulis/hapus hanya dilakukan lewat API route (service_role) agar aman.
-- Run AFTER migration 011.

-- ============================================================
-- 1. Tambah kolom gallery (JSONB) ke tabel kegiatan
--    Menyimpan daftar path storage untuk galeri multi-gambar.
-- ============================================================
ALTER TABLE public.kegiatan
  ADD COLUMN IF NOT EXISTS gallery JSONB;

COMMENT ON COLUMN public.kegiatan.gallery IS
  'Array path storage (misal ["kegiatan/kanwil-sulbar/xxx.webp"]) untuk galeri multi-gambar. NULL jika tidak ada.';

-- ============================================================
-- 2. Buat storage bucket "kegiatan" (public)
--    Menggunakan function storage.buckets, yang sudah ada di schema Supabase.
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'kegiatan'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('kegiatan', 'kegiatan', true);
  END IF;
END
$$;

-- ============================================================
-- 3. Storage policies untuk bucket "kegiatan"
--    - SELECT: publik (gambar kegiatan tampil di halaman publik)
--    - INSERT / UPDATE / DELETE: service_role (hanya via API server,
--      bukan dari browser langsung) — upload & hapus gambar
--      ditangani oleh app/api/admin/kegiatan/upload.
-- ============================================================

-- SELECT: siapa pun bisa baca objek di bucket kegiatan
DROP POLICY IF EXISTS "Public can read kegiatan images" ON storage.objects;
CREATE POLICY "Public can read kegiatan images"
  ON storage.objects FOR SELECT
  TO public, authenticated
  USING (bucket_id = 'kegiatan');

-- INSERT: hanya service_role (API server dengan service key)
DROP POLICY IF EXISTS "Service role can write kegiatan images" ON storage.objects;
CREATE POLICY "Service role can write kegiatan images"
  ON storage.objects FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'kegiatan');

-- UPDATE: hanya service_role
DROP POLICY IF EXISTS "Service role can update kegiatan images" ON storage.objects;
CREATE POLICY "Service role can update kegiatan images"
  ON storage.objects FOR UPDATE
  TO service_role
  USING (bucket_id = 'kegiatan')
  WITH CHECK (bucket_id = 'kegiatan');

-- DELETE: hanya service_role
DROP POLICY IF EXISTS "Service role can delete kegiatan images" ON storage.objects;
CREATE POLICY "Service role can delete kegiatan images"
  ON storage.objects FOR DELETE
  TO service_role
  USING (bucket_id = 'kegiatan');

-- ============================================================
-- Catatan:
-- - Bucket public => URL objek dapat diakses tanpa token:
--   {SUPABASE_URL}/storage/v1/object/public/kegiatan/{path}
-- - Penulisan (upload) dilakukan dari server (API route) memakai
--   service_role key sehingga tidak membebankan RLS storage ke browser.
-- - Ukuran free tier Supabase: 1 GB storage + 50 GB bandwidth/bulan,
--   sangat memadai untuk gambar kegiatan (satu foto ~100–300 KB WebP).
