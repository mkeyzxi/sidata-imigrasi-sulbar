-- Migration 003: Seed initial data from existing hardcoded lib/data files
-- Run AFTER migration 001 (profiles) and 002 (content tables)
-- Date: 2026-11-22

-- ============================================================
-- 1. UNITS
-- ============================================================
INSERT INTO public.units (id, name, short_name, type, description, image_url, slug)
VALUES
  (
    'kanwil-sulbar',
    'Kantor Wilayah Direktorat Jenderal Imigrasi Sulawesi Barat',
    'Kanwil Sulbar',
    'kanwil',
    'Informasi kegiatan dan data pada bidang di lingkungan Kantor Wilayah Direktorat Jenderal Imigrasi Sulawesi Barat.',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    'kanwil-sulbar'
  ),
  (
    'imigrasi-mamuju',
    'Kantor Imigrasi Kelas II Non TPI Mamuju',
    'Imigrasi Mamuju',
    'imigrasi',
    'Pelayanan keimigrasian wilayah Mamuju meliputi paspor, izin tinggal, dan kegiatan intelijen & pengawasan.',
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&q=80',
    'imigrasi-mamuju'
  ),
  (
    'imigrasi-polman',
    'Kantor Imigrasi Kelas II Non TPI Polman',
    'Imigrasi Polman',
    'imigrasi',
    'Data pelayanan keimigrasian meliputi paspor, izin tinggal, dan kegiatan intelijen & pengawasan.',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
    'imigrasi-polman'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. BIDANG (for Kanwil Sulbar)
-- ============================================================
INSERT INTO public.bidang (id, unit_id, name, slug, description)
VALUES
  ('bidang-1', 'kanwil-sulbar', 'Bagian Tata Usaha dan Umum', 'tata-usaha-dan-umum', 'Mengelola administrasi, kepegawaian, keuangan, dan rumah tangga kantor'),
  ('bidang-2', 'kanwil-sulbar', 'Bidang Doklanintaltus', 'doklanintaltus', 'Bidang Dokumen Perjalanan, Izin Tinggal dan Sistem Informasi Keimigrasian'),
  ('bidang-3', 'kanwil-sulbar', 'Bidang Gakkumpatnal', 'gakkumpatnal', 'Bidang Intelijen dan Penindakan Keimigrasian')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. KEGIATAN (all units)
-- ============================================================

-- Kanwil Sulbar (4 kegiatan)
INSERT INTO public.kegiatan (unit_id, bidang_id, title, description, date, location, type, image_url, published)
VALUES
  ('kanwil-sulbar', 'bidang-1', 'Rapat Koordinasi Internal', 'Rapat rutin koordinasi administrasi dan kepegawaian', '2026-09-12', 'Mamuju', 'Koordinasi', 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80', true),
  ('kanwil-sulbar', 'bidang-2', 'Pelayanan Paspor Kolektif', 'Kegiatan jemput bola pelayanan paspor kepada masyarakat', '2026-09-18', 'Mamuju', 'Pelayanan', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80', true),
  ('kanwil-sulbar', 'bidang-3', 'Operasi Gabungan Pengawasan', 'Kegiatan pengawasan orang asing bersama instansi terkait', '2026-09-23', 'Sulawesi Barat', 'Koordinasi', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80', true),
  ('kanwil-sulbar', 'bidang-1', 'Evaluasi Serapan Anggaran', 'Evaluasi pelaksanaan anggaran triwulan III', '2026-09-28', 'Mamuju', 'Koordinasi', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80', true)
ON CONFLICT (id) DO NOTHING;

-- Imigrasi Mamuju (4 kegiatan)
INSERT INTO public.kegiatan (unit_id, title, description, date, location, type, image_url, published)
VALUES
  ('imigrasi-mamuju', 'Operasi Intelijen Keimigrasian', 'Kegiatan operasi intelijen dan pengawasan orang asing di wilayah Mamuju', '2026-09-12', 'Mamuju', 'Intel-WAS', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80', true),
  ('imigrasi-mamuju', 'Pengawasan Orang Asing', 'Pengawasan dan monitoring terhadap keberadaan orang asing', '2026-09-18', 'Mamuju Tengah', 'Intel-WAS', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80', true),
  ('imigrasi-mamuju', 'Patroli Keimigrasian', 'Kegiatan patroli keimigrasian di wilayah perbatasan', '2026-09-25', 'Pasangkayu', 'Intel-WAS', 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80', true),
  ('imigrasi-mamuju', 'Rapat Koordinasi Timpora', 'Rapat koordinasi Tim Pengawasan Orang Asing', '2026-09-28', 'Mamuju', 'Koordinasi', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80', true)
ON CONFLICT (id) DO NOTHING;

-- Imigrasi Polman (3 kegiatan)
INSERT INTO public.kegiatan (unit_id, title, description, date, location, type, image_url, published)
VALUES
  ('imigrasi-polman', 'Pengawasan Orang Asing', 'Kegiatan pengawasan orang asing di wilayah Polewali Mandar', '2026-09-12', 'Polewali Mandar', 'Intel-WAS', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80', true),
  ('imigrasi-polman', 'Operasi Pengawasan', 'Operasi pengawasan dan penindakan keimigrasian', '2026-09-19', 'Polman', 'Intel-WAS', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80', true),
  ('imigrasi-polman', 'Koordinasi Pengawasan', 'Rapat koordinasi pengawasan orang asing', '2026-09-24', 'Polman', 'Koordinasi', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. SERAPAN_ANGGARAN (3 bidang × 9 months)
-- ============================================================

-- Bidang 1 (Tata Usaha dan Umum)
INSERT INTO public.serapan_anggaran (bidang_id, bulan, tahun, jumlah) VALUES
  ('bidang-1', 1, 2026, 12500000),
  ('bidang-1', 2, 2026, 15200000),
  ('bidang-1', 3, 2026, 17800000),
  ('bidang-1', 4, 2026, 21000000),
  ('bidang-1', 5, 2026, 18500000),
  ('bidang-1', 6, 2026, 23000000),
  ('bidang-1', 7, 2026, 16500000),
  ('bidang-1', 8, 2026, 19200000),
  ('bidang-1', 9, 2026, 21500000)
ON CONFLICT (bidang_id, bulan, tahun) DO NOTHING;

-- Bidang 2 (Doklanintaltus)
INSERT INTO public.serapan_anggaran (bidang_id, bulan, tahun, jumlah) VALUES
  ('bidang-2', 1, 2026, 10200000),
  ('bidang-2', 2, 2026, 13500000),
  ('bidang-2', 3, 2026, 15200000),
  ('bidang-2', 4, 2026, 18000000),
  ('bidang-2', 5, 2026, 16500000),
  ('bidang-2', 6, 2026, 20000000),
  ('bidang-2', 7, 2026, 14500000),
  ('bidang-2', 8, 2026, 17000000),
  ('bidang-2', 9, 2026, 19200000)
ON CONFLICT (bidang_id, bulan, tahun) DO NOTHING;

-- Bidang 3 (Gakkumpatnal)
INSERT INTO public.serapan_anggaran (bidang_id, bulan, tahun, jumlah) VALUES
  ('bidang-3', 1, 2026, 9500000),
  ('bidang-3', 2, 2026, 12000000),
  ('bidang-3', 3, 2026, 14500000),
  ('bidang-3', 4, 2026, 16800000),
  ('bidang-3', 5, 2026, 15200000),
  ('bidang-3', 6, 2026, 18500000),
  ('bidang-3', 7, 2026, 13200000),
  ('bidang-3', 8, 2026, 15800000),
  ('bidang-3', 9, 2026, 17500000)
ON CONFLICT (bidang_id, bulan, tahun) DO NOTHING;

-- ============================================================
-- 5. STATISTIK_PENDAFTRAN
-- ============================================================

-- Mamuju: Paspor (total 2.686)
INSERT INTO public.statistik_pendaftaran (unit_id, kategori, label, nilai, detail, tahun) VALUES
  ('imigrasi-mamuju', 'paspor', 'Total Paspor', 2686, '{}', 2026),
  ('imigrasi-mamuju', 'paspor', 'Baru', 2085, '{"laki": 822, "perempuan": 1263}', 2026),
  ('imigrasi-mamuju', 'paspor', 'Baru Percepatan', 62, '{"laki": 22, "perempuan": 40}', 2026),
  ('imigrasi-mamuju', 'paspor', 'Ganti Halaman Penuh', 25, '{"laki": 7, "perempuan": 18}', 2026),
  ('imigrasi-mamuju', 'paspor', 'Ganti Hilang', 58, '{"laki": 23, "perempuan": 35}', 2026),
  ('imigrasi-mamuju', 'paspor', 'Ganti Masa Berlaku', 422, '{"laki": 183, "perempuan": 239}', 2026),
  ('imigrasi-mamuju', 'paspor', 'Ganti Masih Berlaku Percepatan', 31, '{"laki": 12, "perempuan": 19}', 2026),
  ('imigrasi-mamuju', 'paspor', 'Ganti Rusak', 3, '{"laki": 2, "perempuan": 1}', 2026),

  -- Mamuju: Izin Tinggal (total 8, NO percentages)
  ('imigrasi-mamuju', 'izin_tinggal', 'Total Izin Tinggal', 8, '{}', 2026),
  ('imigrasi-mamuju', 'izin_tinggal', 'ITK', 4, '{}', 2026),
  ('imigrasi-mamuju', 'izin_tinggal', 'ITAP', 2, '{}', 2026),
  ('imigrasi-mamuju', 'izin_tinggal', 'ITAS', 2, '{}', 2026),

  -- Mamuju: WNA
  ('imigrasi-mamuju', 'WNA', 'Total WNA', 17, '{}', 2026),
  ('imigrasi-mamuju', 'WNA', 'WNA Aktif', 17, '{}', 2026),
  ('imigrasi-mamuju', 'WNA', 'WNA Akan Expired', 2, '{}', 2026),
  ('imigrasi-mamuju', 'WNA', 'WNA Sudah Expired', 13, '{}', 2026),

  -- Mamuju: TAK
  ('imigrasi-mamuju', 'TAK', 'Total TAK', 23, '{}', 2026),
  ('imigrasi-mamuju', 'TAK', 'TAK Bertempat', 8, '{}', 2026),
  ('imigrasi-mamuju', 'TAK', 'TAK Deportasi', 8, '{}', 2026),
  ('imigrasi-mamuju', 'TAK', 'TAK Pencegahan', 7, '{}', 2026),

  -- Mamuju: BAP
  ('imigrasi-mamuju', 'BAP', 'BAP WNI', 63, '{}', 2026),
  ('imigrasi-mamuju', 'BAP', 'BAP WNA', 8, '{}', 2026),

  -- Mamuju: Intel-WAS
  ('imigrasi-mamuju', 'intel_was', 'Total Kegiatan', 93, '{}', 2026),
  ('imigrasi-mamuju', 'intel_was', 'Total Petugas', 554, '{}', 2026),
  ('imigrasi-mamuju', 'intel_was', 'Operasi Intelijen - Kegiatan', 43, '{"petugas": 246}', 2026),
  ('imigrasi-mamuju', 'intel_was', 'Operasi Mandiri - Kegiatan', 29, '{"petugas": 170}', 2026),
  ('imigrasi-mamuju', 'intel_was', 'Patroli - Kegiatan', 8, '{"petugas": 47}', 2026),
  ('imigrasi-mamuju', 'intel_was', 'Op Gabungan - Kegiatan', 4, '{"petugas": 33}', 2026),
  ('imigrasi-mamuju', 'intel_was', 'Rapat Timpora - Kegiatan', 5, '{"petugas": 30}', 2026),
  ('imigrasi-mamuju', 'intel_was', 'Desa Binaan - Kegiatan', 4, '{"petugas": 28}', 2026),

  -- Mamuju: Anggaran
  ('imigrasi-mamuju', 'anggaran', 'Pagu Anggaran', 12740000000, '{}', 2026),
  ('imigrasi-mamuju', 'anggaran', 'Realisasi Anggaran', 8730000000, '{"persentase": 68.5}', 2026),
  ('imigrasi-mamuju', 'pnbp', 'Target PNBP', 1920000000, '{}', 2026),
  ('imigrasi-mamuju', 'pnbp', 'Realisasi PNBP', 2130000000, '{"persentase": 111.3}', 2026),

  -- Polman: Paspor
  ('imigrasi-polman', 'paspor', 'Total Paspor', 2235, '{}', 2026),
  ('imigrasi-polman', 'paspor', 'Baru', 1420, '{}', 2026),
  ('imigrasi-polman', 'paspor', 'Penggantian', 815, '{}', 2026),

  -- Polman: Izin Tinggal
  ('imigrasi-polman', 'izin_tinggal', 'Total Izin Tinggal', 66, '{}', 2026),
  ('imigrasi-polman', 'izin_tinggal', 'ITK', 21, '{}', 2026),
  ('imigrasi-polman', 'izin_tinggal', 'ITAP', 8, '{}', 2026),
  ('imigrasi-polman', 'izin_tinggal', 'ITAS', 37, '{}', 2026);

-- ============================================================
-- 6. SERAPAN_BULANAN for Mamuju & Polman (optional, for tables)
-- ============================================================

-- Mamuju Serapan Bulanan
INSERT INTO public.statistik_pendaftaran (unit_id, kategori, label, nilai, detail, tahun) VALUES
  ('imigrasi-mamuju', 'serapan_bulanan', 'Januari', 850000000, '{}', 2026),
  ('imigrasi-mamuju', 'serapan_bulanan', 'Februari', 920000000, '{}', 2026),
  ('imigrasi-mamuju', 'serapan_bulanan', 'Maret', 1100000000, '{}', 2026),
  ('imigrasi-mamuju', 'serapan_bulanan', 'April', 980000000, '{}', 2026),
  ('imigrasi-mamuju', 'serapan_bulanan', 'Mei', 1050000000, '{}', 2026),
  ('imigrasi-mamuju', 'serapan_bulanan', 'Juni', 1150000000, '{}', 2026),
  ('imigrasi-mamuju', 'serapan_bulanan', 'Juli', 890000000, '{}', 2026),
  ('imigrasi-mamuju', 'serapan_bulanan', 'Agustus', 960000000, '{}', 2026),
  ('imigrasi-mamuju', 'serapan_bulanan', 'September', 830000000, '{}', 2026),

  -- Polman Serapan Bulanan
  ('imigrasi-polman', 'serapan_bulanan', 'Januari', 720000000, '{}', 2026),
  ('imigrasi-polman', 'serapan_bulanan', 'Februari', 850000000, '{}', 2026),
  ('imigrasi-polman', 'serapan_bulanan', 'Maret', 920000000, '{}', 2026),
  ('imigrasi-polman', 'serapan_bulanan', 'April', 880000000, '{}', 2026),
  ('imigrasi-polman', 'serapan_bulanan', 'Mei', 950000000, '{}', 2026),
  ('imigrasi-polman', 'serapan_bulanan', 'Juni', 1020000000, '{}', 2026),
  ('imigrasi-polman', 'serapan_bulanan', 'Juli', 780000000, '{}', 2026),
  ('imigrasi-polman', 'serapan_bulanan', 'Agustus', 840000000, '{}', 2026),
  ('imigrasi-polman', 'serapan_bulanan', 'September', 760000000, '{}', 2026);

-- Done!
