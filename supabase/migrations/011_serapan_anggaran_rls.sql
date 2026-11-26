-- Migration 011: Pastikan admin_kanwil & superadmin bisa upsert serapan_anggaran
-- Menunjang fitur /admin/serapan (input serapan anggaran Kanwil Sulbar per bidang & bulan)
-- Policy dasar serapan_anggaran sudah dibuat di migration 002. Migration ini
-- memastikan policy konsisten (idempotent) dan menambah guard agar hanya
-- bidang milik kanwil-sulbar yang bisa diubah admin kanwil.
-- Run AFTER migration 009.

-- ============================================================
-- 1. Pastikan tabel ada (idempotent, sudah ada di 002)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.serapan_anggaran (
  id SERIAL PRIMARY KEY,
  bidang_id TEXT NOT NULL REFERENCES public.bidang(id) ON DELETE CASCADE,
  bulan INTEGER NOT NULL CHECK (bulan BETWEEN 1 AND 12),
  tahun INTEGER NOT NULL,
  jumlah NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  UNIQUE(bidang_id, bulan, tahun)
);

ALTER TABLE public.serapan_anggaran ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. SELECT: publik & authenticated (sudah ada, idempotent)
-- ============================================================
DROP POLICY IF EXISTS "Public can read serapan_anggaran" ON public.serapan_anggaran;
CREATE POLICY "Public can read serapan_anggaran"
  ON public.serapan_anggaran FOR SELECT
  USING (true);

-- ============================================================
-- 3. INSERT: admin_kanwil (hanya bidang kanwil) & superadmin
--    Bidang kanwil = bidang dengan unit_id = 'kanwil-sulbar'
-- ============================================================
DROP POLICY IF EXISTS "Admin kanwil can insert serapan_anggaran" ON public.serapan_anggaran;
CREATE POLICY "Admin kanwil can insert serapan_anggaran"
  ON public.serapan_anggaran FOR INSERT
  TO authenticated
  WITH CHECK (
    (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role = 'superadmin'
          AND is_active = true
      )
      OR (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid()
            AND role = 'admin_kanwil'
            AND is_active = true
        )
        AND EXISTS (
          SELECT 1 FROM public.bidang
          WHERE id = serapan_anggaran.bidang_id
            AND unit_id = 'kanwil-sulbar'
        )
      )
    )
  );

-- ============================================================
-- 4. UPDATE: admin_kanwil (hanya bidang kanwil) & superadmin
-- ============================================================
DROP POLICY IF EXISTS "Admin kanwil can update serapan_anggaran" ON public.serapan_anggaran;
CREATE POLICY "Admin kanwil can update serapan_anggaran"
  ON public.serapan_anggaran FOR UPDATE
  TO authenticated
  USING (
    (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role = 'superadmin'
          AND is_active = true
      )
      OR (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid()
            AND role = 'admin_kanwil'
            AND is_active = true
        )
        AND EXISTS (
          SELECT 1 FROM public.bidang
          WHERE id = serapan_anggaran.bidang_id
            AND unit_id = 'kanwil-sulbar'
        )
      )
    )
  );

-- ============================================================
-- 5. DELETE: hanya superadmin
-- ============================================================
DROP POLICY IF EXISTS "Superadmin can delete serapan_anggaran" ON public.serapan_anggaran;
CREATE POLICY "Superadmin can delete serapan_anggaran"
  ON public.serapan_anggaran FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'superadmin'
        AND is_active = true
    )
  );

-- Catatan: fitur /admin/serapan menggunakan upsert dengan
-- onConflict 'bidang_id,bulan,tahun', yang memicu INSERT & UPDATE.
-- Kedua policy di atas sudah mencakup keduanya.
