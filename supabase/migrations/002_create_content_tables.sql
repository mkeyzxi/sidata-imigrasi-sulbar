-- Migration 002: Create content tables (units, bidang, kegiatan, serapan_anggaran, statistik)
-- Supabase: sidata-imigrasi-sulbar
-- Date: 2026-11-22

-- ============================================================
-- 1. UNITS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.units (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT,
  type TEXT NOT NULL CHECK (type IN ('kanwil', 'imigrasi')),
  description TEXT,
  image_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read units (public data)
CREATE POLICY "Public can read units"
  ON public.units FOR SELECT
  USING (true);

-- Policy: Superadmin can insert units
CREATE POLICY "Superadmin can insert units"
  ON public.units FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'superadmin'
        AND is_active = true
    )
  );

-- Policy: Superadmin can update units
CREATE POLICY "Superadmin can update units"
  ON public.units FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'superadmin'
        AND is_active = true
    )
  );

-- ============================================================
-- 2. BIDANG TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bidang (
  id TEXT PRIMARY KEY,
  unit_id TEXT NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.bidang ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read bidang"
  ON public.bidang FOR SELECT
  USING (true);

CREATE POLICY "Superadmin can insert bidang"
  ON public.bidang FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'superadmin'
        AND is_active = true
    )
  );

CREATE POLICY "Admin kanwil can insert bidang for kanwil"
  ON public.bidang FOR INSERT
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

CREATE POLICY "Superadmin can update bidang"
  ON public.bidang FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'superadmin'
        AND is_active = true
    )
  );

CREATE POLICY "Admin kanwil can update bidang for kanwil"
  ON public.bidang FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin_kanwil', 'superadmin')
        AND is_active = true
    )
    AND (
      unit_id = 'kanwil-sulbar'
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role = 'superadmin'
          AND is_active = true
      )
    )
  );

-- ============================================================
-- 3. KEGIATAN TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.kegiatan (
  id SERIAL PRIMARY KEY,
  unit_id TEXT NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  bidang_id TEXT REFERENCES public.bidang(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  location TEXT,
  type TEXT DEFAULT 'Intel-WAS',
  image_url TEXT,
  published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.kegiatan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published kegiatan"
  ON public.kegiatan FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated can read all kegiatan"
  ON public.kegiatan FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Superadmin can insert kegiatan"
  ON public.kegiatan FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'superadmin'
        AND is_active = true
    )
  );

CREATE POLICY "Admin kanwil can insert kegiatan for kanwil"
  ON public.kegiatan FOR INSERT
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

CREATE POLICY "Admin mamuju can insert kegiatan for mamuju"
  ON public.kegiatan FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin_mamuju', 'superadmin')
        AND is_active = true
    )
    AND unit_id = 'imigrasi-mamuju'
  );

CREATE POLICY "Admin polman can insert kegiatan for polman"
  ON public.kegiatan FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin_polman', 'superadmin')
        AND is_active = true
    )
    AND unit_id = 'imigrasi-polman'
  );

CREATE POLICY "Superadmin can update kegiatan"
  ON public.kegiatan FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'superadmin'
        AND is_active = true
    )
  );

CREATE POLICY "Admin kanwil can update kegiatan for kanwil"
  ON public.kegiatan FOR UPDATE
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

CREATE POLICY "Admin mamuju can update kegiatan for mamuju"
  ON public.kegiatan FOR UPDATE
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

CREATE POLICY "Admin polman can update kegiatan for polman"
  ON public.kegiatan FOR UPDATE
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

-- ============================================================
-- 4. SERAPAN_ANGGARAN TABLE
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

CREATE POLICY "Public can read serapan_anggaran"
  ON public.serapan_anggaran FOR SELECT
  USING (true);

CREATE POLICY "Admin kanwil can insert serapan_anggaran"
  ON public.serapan_anggaran FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin_kanwil', 'superadmin')
        AND is_active = true
    )
  );

CREATE POLICY "Admin kanwil can update serapan_anggaran"
  ON public.serapan_anggaran FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin_kanwil', 'superadmin')
        AND is_active = true
    )
  );

-- ============================================================
-- 5. STATISTIK_PENDAFTRAN table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.statistik_pendaftaran (
  id SERIAL PRIMARY KEY,
  unit_id TEXT NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  kategori TEXT NOT NULL,
  sub_kategori TEXT,
  label TEXT,
  nilai NUMERIC NOT NULL DEFAULT 0,
  detail JSONB,
  tahun INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.statistik_pendaftaran ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read statistik_pendaftaran"
  ON public.statistik_pendaftaran FOR SELECT
  USING (true);

CREATE POLICY "Superadmin can insert statistik_pendaftaran"
  ON public.statistik_pendaftaran FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'superadmin'
        AND is_active = true
    )
  );

CREATE POLICY "Admin mamuju can insert statistik for mamuju"
  ON public.statistik_pendaftaran FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin_mamuju', 'superadmin')
        AND is_active = true
    )
    AND unit_id = 'imigrasi-mamuju'
  );

CREATE POLICY "Admin polman can insert statistik for polman"
  ON public.statistik_pendaftaran FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin_polman', 'superadmin')
        AND is_active = true
    )
    AND unit_id = 'imigrasi-polman'
  );

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
