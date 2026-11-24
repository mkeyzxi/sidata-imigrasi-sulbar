-- Migration 008: Fix RLS infinite recursion and enable generic 'admin' role per unit
-- Date: 2026-11-24
--
-- Masalah sebelumnya:
-- 1. Policy "Superadmin can read all profiles" mengecek:
--      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'superadmin')
--    Hal ini memicu infinite recursion dalam PostgreSQL RLS ketika tabel profiles di-query.
-- 2. Role di tabel profiles dibatasi CHECK (role IN ('superadmin', 'admin_kanwil', 'admin_mamuju', 'admin_polman', 'viewer'))
--    sehingga role generic 'admin' (dengan unit_slug menentukan unitnya) ditolak DB.
-- 3. Trigger 007 mengunci email tertentu secara hardcoded.
--
-- Solusi:
-- Gunakan helper SECURITY DEFINER functions (bypasses RLS) untuk mengecek hak akses,
-- sehingga bebas dari infinite recursion dan mendukung role:
--   - 'superadmin' (akses semua unit & manajemen user)
--   - 'admin' atau 'admin_<unit>' dengan unit_slug ('kanwil-sulbar', 'imigrasi-mamuju', 'imigrasi-polman')

-- ============================================================
-- 1. UPDATE CHECK CONSTRAINT ON PROFILES
-- ============================================================
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('superadmin', 'admin', 'admin_kanwil', 'admin_mamuju', 'admin_polman', 'viewer'));

-- ============================================================
-- 2. SECURITY DEFINER HELPER FUNCTIONS (No RLS recursion)
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'superadmin' AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() AND is_active = true LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_my_unit()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT unit_slug FROM public.profiles WHERE id = auth.uid() AND is_active = true LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.can_manage_unit(target_unit text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
  v_unit text;
BEGIN
  SELECT role, unit_slug INTO v_role, v_unit
  FROM public.profiles
  WHERE id = auth.uid() AND is_active = true;

  IF v_role = 'superadmin' THEN
    RETURN true;
  END IF;

  IF (v_role = 'admin' OR v_role LIKE 'admin_%') THEN
    IF v_unit = target_unit THEN
      RETURN true;
    END IF;
    IF v_role = 'admin_kanwil' AND target_unit = 'kanwil-sulbar' THEN
      RETURN true;
    END IF;
    IF v_role = 'admin_mamuju' AND target_unit = 'imigrasi-mamuju' THEN
      RETURN true;
    END IF;
    IF v_role = 'admin_polman' AND target_unit = 'imigrasi-polman' THEN
      RETURN true;
    END IF;
  END IF;

  RETURN false;
END;
$$;

-- ============================================================
-- 3. POLICIES ON PROFILES TABLE (Zero Recursion)
-- ============================================================
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Superadmin can read all profiles" ON public.profiles;
CREATE POLICY "Superadmin can read all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_superadmin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Superadmin can insert profiles" ON public.profiles;
CREATE POLICY "Superadmin can insert profiles"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_superadmin());

DROP POLICY IF EXISTS "Superadmin can update profiles" ON public.profiles;
CREATE POLICY "Superadmin can update profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_superadmin())
  WITH CHECK (public.is_superadmin());

DROP POLICY IF EXISTS "Superadmin can delete profiles" ON public.profiles;
CREATE POLICY "Superadmin can delete profiles"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (public.is_superadmin());

-- ============================================================
-- 4. POLICIES ON KEGIATAN TABLE
-- ============================================================
DROP POLICY IF EXISTS "Public can read published kegiatan" ON public.kegiatan;
CREATE POLICY "Public can read published kegiatan"
  ON public.kegiatan FOR SELECT
  TO anon, authenticated
  USING (published = true);

DROP POLICY IF EXISTS "Authenticated can read unit kegiatan" ON public.kegiatan;
DROP POLICY IF EXISTS "Superadmin can read all kegiatan" ON public.kegiatan;
DROP POLICY IF EXISTS "Admin kanwil can read kanwil kegiatan" ON public.kegiatan;
DROP POLICY IF EXISTS "Admin mamuju can read mamuju kegiatan" ON public.kegiatan;
DROP POLICY IF EXISTS "Admin polman can read polman kegiatan" ON public.kegiatan;

CREATE POLICY "Authenticated can read unit kegiatan"
  ON public.kegiatan FOR SELECT
  TO authenticated
  USING (public.can_manage_unit(unit_id));

-- INSERT
DROP POLICY IF EXISTS "Superadmin can insert kegiatan" ON public.kegiatan;
DROP POLICY IF EXISTS "Admin kanwil can insert kegiatan for kanwil" ON public.kegiatan;
DROP POLICY IF EXISTS "Admin mamuju can insert kegiatan for mamuju" ON public.kegiatan;
DROP POLICY IF EXISTS "Admin polman can insert kegiatan for polman" ON public.kegiatan;

CREATE POLICY "Admins can insert kegiatan"
  ON public.kegiatan FOR INSERT
  TO authenticated
  WITH CHECK (public.can_manage_unit(unit_id));

-- UPDATE
DROP POLICY IF EXISTS "Superadmin can update kegiatan" ON public.kegiatan;
DROP POLICY IF EXISTS "Admin kanwil can update kegiatan for kanwil" ON public.kegiatan;
DROP POLICY IF EXISTS "Admin mamuju can update kegiatan for mamuju" ON public.kegiatan;
DROP POLICY IF EXISTS "Admin polman can update kegiatan for polman" ON public.kegiatan;

CREATE POLICY "Admins can update kegiatan"
  ON public.kegiatan FOR UPDATE
  TO authenticated
  USING (public.can_manage_unit(unit_id))
  WITH CHECK (public.can_manage_unit(unit_id));

-- DELETE
DROP POLICY IF EXISTS "Superadmin can delete kegiatan" ON public.kegiatan;
DROP POLICY IF EXISTS "Admin kanwil can delete kegiatan for kanwil" ON public.kegiatan;
DROP POLICY IF EXISTS "Admin mamuju can delete kegiatan for mamuju" ON public.kegiatan;
DROP POLICY IF EXISTS "Admin polman can delete kegiatan for polman" ON public.kegiatan;

CREATE POLICY "Admins can delete kegiatan"
  ON public.kegiatan FOR DELETE
  TO authenticated
  USING (public.can_manage_unit(unit_id));

-- ============================================================
-- 5. POLICIES ON STATISTIK_PENDAFTARAN TABLE
-- ============================================================
DROP POLICY IF EXISTS "Public can read statistik" ON public.statistik_pendaftaran;
CREATE POLICY "Public can read statistik"
  ON public.statistik_pendaftaran FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Superadmin can insert statistik_pendaftaran" ON public.statistik_pendaftaran;
DROP POLICY IF EXISTS "Admin kanwil can insert statistik for kanwil" ON public.statistik_pendaftaran;
DROP POLICY IF EXISTS "Admin mamuju can insert statistik for mamuju" ON public.statistik_pendaftaran;
DROP POLICY IF EXISTS "Admin polman can insert statistik for polman" ON public.statistik_pendaftaran;

CREATE POLICY "Admins can insert statistik"
  ON public.statistik_pendaftaran FOR INSERT
  TO authenticated
  WITH CHECK (public.can_manage_unit(unit_id));

DROP POLICY IF EXISTS "Superadmin can update statistik_pendaftaran" ON public.statistik_pendaftaran;
DROP POLICY IF EXISTS "Admin kanwil can update statistik for kanwil" ON public.statistik_pendaftaran;
DROP POLICY IF EXISTS "Admin mamuju can update statistik for mamuju" ON public.statistik_pendaftaran;
DROP POLICY IF EXISTS "Admin polman can update statistik for polman" ON public.statistik_pendaftaran;

CREATE POLICY "Admins can update statistik"
  ON public.statistik_pendaftaran FOR UPDATE
  TO authenticated
  USING (public.can_manage_unit(unit_id))
  WITH CHECK (public.can_manage_unit(unit_id));

DROP POLICY IF EXISTS "Superadmin can delete statistik_pendaftaran" ON public.statistik_pendaftaran;
DROP POLICY IF EXISTS "Admin kanwil can delete statistik for kanwil" ON public.statistik_pendaftaran;
DROP POLICY IF EXISTS "Admin mamuju can delete statistik for mamuju" ON public.statistik_pendaftaran;
DROP POLICY IF EXISTS "Admin polman can delete statistik for polman" ON public.statistik_pendaftaran;

CREATE POLICY "Admins can delete statistik"
  ON public.statistik_pendaftaran FOR DELETE
  TO authenticated
  USING (public.can_manage_unit(unit_id));

-- ============================================================
-- 6. POLICIES ON SERAPAN_ANGGARAN TABLE
-- ============================================================
ALTER TABLE public.serapan_anggaran ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read serapan" ON public.serapan_anggaran;
CREATE POLICY "Public can read serapan"
  ON public.serapan_anggaran FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Kanwil and superadmin can insert serapan" ON public.serapan_anggaran;
CREATE POLICY "Kanwil and superadmin can insert serapan"
  ON public.serapan_anggaran FOR INSERT
  TO authenticated
  WITH CHECK (public.can_manage_unit('kanwil-sulbar'));

DROP POLICY IF EXISTS "Kanwil and superadmin can update serapan" ON public.serapan_anggaran;
CREATE POLICY "Kanwil and superadmin can update serapan"
  ON public.serapan_anggaran FOR UPDATE
  TO authenticated
  USING (public.can_manage_unit('kanwil-sulbar'))
  WITH CHECK (public.can_manage_unit('kanwil-sulbar'));

DROP POLICY IF EXISTS "Kanwil and superadmin can delete serapan" ON public.serapan_anggaran;
CREATE POLICY "Kanwil and superadmin can delete serapan"
  ON public.serapan_anggaran FOR DELETE
  TO authenticated
  USING (public.can_manage_unit('kanwil-sulbar'));

