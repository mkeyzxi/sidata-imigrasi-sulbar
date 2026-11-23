-- Migration 004: Strict unit-scoped RLS for admin roles
-- Date: 2026-11-23
--
-- Sebelumnya: semua authenticated user bisa SELECT semua kegiatan & statistik.
-- Sekarang: hanya superadmin + admin unit-nya sendiri yang bisa melihat data unit.
--
-- Admin resmi (email -> role -> unit):
--   admin.kanwil@sidata-imigrasi-sulbar.go.id  -> admin_kanwil  -> kanwil-sulbar
--   admin.mamuju@sidata-imigrasi-sulbar.go.id  -> admin_mamuju  -> imigrasi-mamuju
--   admin.polman@sidata-imigrasi-sulbar.go.id  -> admin_polman  -> imigrasi-polman
--   superadmin@sidata-imigrasi-sulbar.go.id    -> superadmin    -> semua

-- ============================================================
-- Drop old permissive SELECT policies (if any)
-- ============================================================
DROP POLICY IF EXISTS "Authenticated can read all kegiatan" ON public.kegiatan;
DROP POLICY IF EXISTS "Public can read published kegiatan" ON public.kegiatan;

DROP POLICY IF EXISTS "Authenticated can read all statistik" ON public.statistik_pendaftaran;
DROP POLICY IF EXISTS "Public can read statistik" ON public.statistik_pendaftaran;

-- ============================================================
-- Public: only published kegiatan (for public pages)
-- ============================================================
CREATE POLICY "Public can read published kegiatan"
  ON public.kegiatan FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- ============================================================
-- Unit-scoped read for admin roles
-- ============================================================
CREATE POLICY "Superadmin can read all kegiatan"
  ON public.kegiatan FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'superadmin'
        AND is_active = true
    )
  );

CREATE POLICY "Admin kanwil can read kanwil kegiatan"
  ON public.kegiatan FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'admin_kanwil'
        AND is_active = true
    )
    AND unit_id = 'kanwil-sulbar'
  );

CREATE POLICY "Admin mamuju can read mamuju kegiatan"
  ON public.kegiatan FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'admin_mamuju'
        AND is_active = true
    )
    AND unit_id = 'imigrasi-mamuju'
  );

CREATE POLICY "Admin polman can read polman kegiatan"
  ON public.kegiatan FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'admin_polman'
        AND is_active = true
    )
    AND unit_id = 'imigrasi-polman'
  );

-- ============================================================
-- statistik_pendaftaran: unit-scoped read
-- ============================================================
CREATE POLICY "Public can read statistik"
  ON public.statistik_pendaftaran FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Superadmin can read all statistik"
  ON public.statistik_pendaftaran FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'superadmin'
        AND is_active = true
    )
  );

CREATE POLICY "Admin kanwil can read kanwil statistik"
  ON public.statistik_pendaftaran FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'admin_kanwil'
        AND is_active = true
    )
    AND unit_id = 'kanwil-sulbar'
  );

CREATE POLICY "Admin mamuju can read mamuju statistik"
  ON public.statistik_pendaftaran FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'admin_mamuju'
        AND is_active = true
    )
    AND unit_id = 'imigrasi-mamuju'
  );

CREATE POLICY "Admin polman can read polman statistik"
  ON public.statistik_pendaftaran FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'admin_polman'
        AND is_active = true
    )
    AND unit_id = 'imigrasi-polman'
  );
