-- Migration 006: Complete CRUD RLS for admin unit accounts
-- Date: 2026-11-23
--
-- Temuan (sebelum migration ini):
--   statistik_pendaftaran:
--     - INSERT : hanya superadmin, admin_mamuju, admin_polman
--                (admin_kanwil TIDAK ADA -> tidak bisa tambah data!)
--     - UPDATE : hanya superadmin (admin unit TIDAK BISA edit)
--     - DELETE : TIDAK ADA policy sama sekali (bahkan superadmin)
--   kegiatan:
--     - INSERT/UPDATE : superadmin + 3 admin unit (unit-scoped) [sudah ada]
--     - DELETE        : hanya superadmin (admin unit TIDAK BISA hapus)
--
-- Sesudah migration ini: superadmin + admin unit masing-masing
-- bisa CREATE, READ, UPDATE, DELETE pada unitnya sendiri.
-- Superadmin bebas pada semua unit.
--
-- Jalankan di Supabase SQL Editor setelah 004 & 005.

-- ============================================================
-- 1. statistik_pendaftaran — INSERT: tambah admin_kanwil
-- ============================================================
DROP POLICY IF EXISTS "Admin kanwil can insert statistik for kanwil" ON public.statistik_pendaftaran;

CREATE POLICY "Admin kanwil can insert statistik for kanwil"
  ON public.statistik_pendaftaran FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin_kanwil', 'superadmin')
        AND is_active = true
    )
    AND unit_id = 'kanwil-sulbar'
  );

-- ============================================================
-- 2. statistik_pendaftaran — UPDATE per unit
-- ============================================================
DROP POLICY IF EXISTS "Superadmin can update statistik_pendaftaran" ON public.statistik_pendaftaran;
DROP POLICY IF EXISTS "Admin kanwil can update statistik for kanwil" ON public.statistik_pendaftaran;
DROP POLICY IF EXISTS "Admin mamuju can update statistik for mamuju" ON public.statistik_pendaftaran;
DROP POLICY IF EXISTS "Admin polman can update statistik for polman" ON public.statistik_pendaftaran;

CREATE POLICY "Superadmin can update statistik_pendaftaran"
  ON public.statistik_pendaftaran FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'superadmin'
        AND is_active = true
    )
  );

CREATE POLICY "Admin kanwil can update statistik for kanwil"
  ON public.statistik_pendaftaran FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin_kanwil', 'superadmin')
        AND is_active = true
    )
    AND unit_id = 'kanwil-sulbar'
  );

CREATE POLICY "Admin mamuju can update statistik for mamuju"
  ON public.statistik_pendaftaran FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin_mamuju', 'superadmin')
        AND is_active = true
    )
    AND unit_id = 'imigrasi-mamuju'
  );

CREATE POLICY "Admin polman can update statistik for polman"
  ON public.statistik_pendaftaran FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin_polman', 'superadmin')
        AND is_active = true
    )
    AND unit_id = 'imigrasi-polman'
  );

-- ============================================================
-- 3. statistik_pendaftaran — DELETE per unit
-- ============================================================
DROP POLICY IF EXISTS "Superadmin can delete statistik_pendaftaran" ON public.statistik_pendaftaran;
DROP POLICY IF EXISTS "Admin kanwil can delete statistik for kanwil" ON public.statistik_pendaftaran;
DROP POLICY IF EXISTS "Admin mamuju can delete statistik for mamuju" ON public.statistik_pendaftaran;
DROP POLICY IF EXISTS "Admin polman can delete statistik for polman" ON public.statistik_pendaftaran;

CREATE POLICY "Superadmin can delete statistik_pendaftaran"
  ON public.statistik_pendaftaran FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'superadmin'
        AND is_active = true
    )
  );

CREATE POLICY "Admin kanwil can delete statistik for kanwil"
  ON public.statistik_pendaftaran FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin_kanwil', 'superadmin')
        AND is_active = true
    )
    AND unit_id = 'kanwil-sulbar'
  );

CREATE POLICY "Admin mamuju can delete statistik for mamuju"
  ON public.statistik_pendaftaran FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin_mamuju', 'superadmin')
        AND is_active = true
    )
    AND unit_id = 'imigrasi-mamuju'
  );

CREATE POLICY "Admin polman can delete statistik for polman"
  ON public.statistik_pendaftaran FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin_polman', 'superadmin')
        AND is_active = true
    )
    AND unit_id = 'imigrasi-polman'
  );

-- ============================================================
-- 4. kegiatan — DELETE per unit (sebelumnya hanya superadmin)
-- ============================================================
DROP POLICY IF EXISTS "Superadmin can delete kegiatan" ON public.kegiatan;
DROP POLICY IF EXISTS "Admin kanwil can delete kegiatan for kanwil" ON public.kegiatan;
DROP POLICY IF EXISTS "Admin mamuju can delete kegiatan for mamuju" ON public.kegiatan;
DROP POLICY IF EXISTS "Admin polman can delete kegiatan for polman" ON public.kegiatan;

CREATE POLICY "Superadmin can delete kegiatan"
  ON public.kegiatan FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'superadmin'
        AND is_active = true
    )
  );

CREATE POLICY "Admin kanwil can delete kegiatan for kanwil"
  ON public.kegiatan FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin_kanwil', 'superadmin')
        AND is_active = true
    )
    AND unit_id = 'kanwil-sulbar'
  );

CREATE POLICY "Admin mamuju can delete kegiatan for mamuju"
  ON public.kegiatan FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin_mamuju', 'superadmin')
        AND is_active = true
    )
    AND unit_id = 'imigrasi-mamuju'
  );

CREATE POLICY "Admin polman can delete kegiatan for polman"
  ON public.kegiatan FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin_polman', 'superadmin')
        AND is_active = true
    )
    AND unit_id = 'imigrasi-polman'
  );
