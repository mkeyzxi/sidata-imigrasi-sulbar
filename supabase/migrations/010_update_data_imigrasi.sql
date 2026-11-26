-- Migration 010: Update data imigrasi dari folder "data imigrasi"
-- Sumber data: C:\belajarku\Belajar NextJS\sidata-imigrasi-sulbar\data imigrasi
-- Periode: Januari - 24 November 2026
-- Run AFTER migration 009 (rebrand bidang imigrasi)

-- ============================================================
-- 1. DELETE EXISTING DATA FOR UPDATING CATEGORIES
-- ============================================================

-- Delete old Mamuju data that will be replaced
DELETE FROM public.statistik_pendaftaran 
WHERE unit_id = 'imigrasi-mamuju' 
AND tahun = 2026 
AND kategori IN ('paspor', 'izin_tinggal', 'WNA', 'TAK', 'BAP', 'intel_was', 'anggaran', 'pnbp', 'serapan_bulanan');

-- Delete old Polman data that will be replaced
DELETE FROM public.statistik_pendaftaran 
WHERE unit_id = 'imigrasi-polman' 
AND tahun = 2026 
AND kategori IN ('paspor', 'izin_tinggal', 'WNA', 'TAK', 'BAP', 'intel_was', 'anggaran', 'pnbp', 'serapan_bulanan');

-- ============================================================
-- 2. IMIGRASI MAMUJU - PASPOR
-- ============================================================
-- Sumber: Rekapan Data Keimigrasian 2026.pdf
-- Paspor Biasa 48 Halaman: 1
-- Paspor Elektronik 48 Halaman: 3.078
-- Total: 3.079

INSERT INTO public.statistik_pendaftaran (unit_id, kategori, sub_kategori, label, nilai, detail, tahun) VALUES
  ('imigrasi-mamuju', 'paspor', 'biasa', 'Paspor Biasa 48 Halaman', 1, '{"jenis": "biasa", "halaman": 48}', 2026),
  ('imigrasi-mamuju', 'paspor', 'elektronik', 'Paspor Elektronik 48 Halaman', 3078, '{"jenis": "elektronik", "halaman": 48}', 2026),
  ('imigrasi-mamuju', 'paspor', null, 'Total Paspor', 3079, '{"biasa": 1, "elektronik": 3078}', 2026),

-- ============================================================
-- 3. IMIGRASI MAMUJU - IZIN TINGGAL
-- ============================================================
-- Sumber: Rekapan Data Keimigrasian 2026.pdf
-- ITK: 16, ITAS: 17, ITAP: 8
-- Total: 41

  ('imigrasi-mamuju', 'izin_tinggal', 'ITK', 'ITK', 16, '{}', 2026),
  ('imigrasi-mamuju', 'izin_tinggal', 'ITAS', 'ITAS', 17, '{}', 2026),
  ('imigrasi-mamuju', 'izin_tinggal', 'ITAP', 'ITAP', 8, '{}', 2026),
  ('imigrasi-mamuju', 'izin_tinggal', null, 'Total Izin Tinggal', 41, '{"ITK": 16, "ITAS": 17, "ITAP": 8}', 2026),

-- ============================================================
-- 4. IMIGRASI MAMUJU - PERLINTASAN (BARU)
-- ============================================================
-- Sumber: Rekapan Data Keimigrasian 2026.pdf
-- Kedatangan: 946, Keberangkatan: 1.240
-- Total: 2.186

  ('imigrasi-mamuju', 'perlintaan', 'kedatangan', 'Kedatangan', 946, '{}', 2026),
  ('imigrasi-mamuju', 'perlintaan', 'keberangkatan', 'Keberangkatan', 1240, '{}', 2026),
  ('imigrasi-mamuju', 'perlintaan', null, 'Total Perlintasan', 2186, '{"kedatangan": 946, "keberangkatan": 1240}', 2026),

-- ============================================================
-- 5. IMIGRASI MAMUJU - BAP
-- ============================================================
-- Sumber: Rekapan Data Keimigrasian 2026.pdf
-- Hilang: 71, Rusak: 5
-- Total: 76

  ('imigrasi-mamuju', 'BAP', 'hilang', 'BAP Hilang', 71, '{}', 2026),
  ('imigrasi-mamuju', 'BAP', 'rusak', 'BAP Rusak', 5, '{}', 2026),
  ('imigrasi-mamuju', 'BAP', null, 'Total BAP', 76, '{"hilang": 71, "rusak": 5}', 2026),

-- ============================================================
-- 6. IMIGRASI MAMUJU - INTEL-WAS
-- ============================================================
-- Sumber: Rekapan Data Keimigrasian 2026.pdf
-- Operasi Intelijen: 44
-- Operasi Mandiri/Pengawasan: 23
-- Patroli Pengawasan Orang Asing: 9
-- Operasi Gabungan: 2
-- Timpora: 3
-- Desa Binaan: 4
-- Total: 93

  ('imigrasi-mamuju', 'intel_was', 'ops_intelijen', 'Operasi Intelijen', 44, '{}', 2026),
  ('imigrasi-mamuju', 'intel_was', 'ops_mandiri', 'Operasi Mandiri/Pengawasan', 23, '{}', 2026),
  ('imigrasi-mamuju', 'intel_was', 'patroli', 'Patroli Pengawasan Orang Asing', 9, '{}', 2026),
  ('imigrasi-mamuju', 'intel_was', 'ops_gabungan', 'Operasi Gabungan', 2, '{}', 2026),
  ('imigrasi-mamuju', 'intel_was', 'timpora', 'Rapat Timpora', 3, '{}', 2026),
  ('imigrasi-mamuju', 'intel_was', 'desa_binaan', 'Desa Binaan', 4, '{}', 2026),
  ('imigrasi-mamuju', 'intel_was', null, 'Total Kegiatan Intel-WAS', 93, '{"ops_intelijen": 44, "ops_mandiri": 23, "patroli": 9, "ops_gabungan": 2, "timpora": 3, "desa_binaan": 4}', 2026),

-- ============================================================
-- 7. IMIGRASI MAMUJU - TAK
-- ============================================================
-- Sumber: Rekapan Data Keimigrasian 2026.pdf
-- TAK: 23 (8 orang)

  ('imigrasi-mamuju', 'TAK', null, 'Total TAK', 23, '{"orang": 8}', 2026),

-- ============================================================
-- 8. IMIGRASI MAMUJU - PNBP & ANGGARAN
-- ============================================================
-- Sumber: Rekapan Data Keimigrasian 2026.pdf
-- PNBP Target: 1.92 M, Realisasi: 2.58 M, Progress: 134.8%
-- Anggaran Pagu: 12.74 M, Realisasi: 11.19 M, Progress Serapan: 87.8%

  ('imigrasi-mamuju', 'pnbp', 'target', 'Target PNBP', 1920000000, '{}', 2026),
  ('imigrasi-mamuju', 'pnbp', 'realisasi', 'Realisasi PNBP', 2580000000, '{"persentase": 134.8}', 2026),
  ('imigrasi-mamuju', 'anggaran', 'pagu', 'Pagu Anggaran', 12740000000, '{}', 2026),
  ('imigrasi-mamuju', 'anggaran', 'realisasi', 'Realisasi Anggaran', 11190000000, '{"persentase": 87.8}', 2026),

-- ============================================================
-- 9. IMIGRASI POLMAN - PASPOR
-- ============================================================
-- Sumber: Jumlah Penerbitan Paspor Kanim Polman Per Januari sampai 24 Nov 2026.pdf
-- Data ini belum tereka (PDF tidak dapat diekstrak otomatis)
-- Gunakan data lama sebagai placeholder atau update manual

  ('imigrasi-polman', 'paspor', null, 'Total Paspor', 2235, '{"catatan": "Data lama - perlu update dari PDF"}', 2026),
  ('imigrasi-polman', 'paspor', 'baru', 'Paspor Baru', 1420, '{}', 2026),
  ('imigrasi-polman', 'paspor', 'penggantian', 'Paspor Penggantian', 815, '{}', 2026),

-- ============================================================
-- 10. IMIGRASI POLMAN - IZIN TINGGAL
-- ============================================================
-- Sumber: Jumlah Penerbitan Paspor Kanim Polman Per Januari sampai 24 Nov 2026.pdf
-- Data ini belum tereka, gunakan data lama

  ('imigrasi-polman', 'izin_tinggal', 'ITK', 'ITK', 21, '{}', 2026),
  ('imigrasi-polman', 'izin_tinggal', 'ITAP', 'ITAP', 8, '{}', 2026),
  ('imigrasi-polman', 'izin_tinggal', 'ITAS', 'ITAS', 37, '{}', 2026),
  ('imigrasi-polman', 'izin_tinggal', null, 'Total Izin Tinggal', 66, '{"ITK": 21, "ITAP": 8, "ITAS": 37}', 2026),

-- ============================================================
-- 11. IMIGRASI POLMAN - ANGARAN
-- ============================================================
-- Sumber: Realisasi Anggaran Januari s.d Oktober 2026.pdf
-- Untuk KANTOR IMIGRASI KELAS II NON TPI POLEWALI MANDAR
-- GRAND TOTAL PAGU: 10.742.707.000
-- GRAND TOTAL REALISASI: 7.765.276.808 (72.28%)
-- SISA: 2.977.430.192
-- 
-- Detail per jenis belanja:
-- Pegawai: PAGU 4.939.094.000, REALISASI 4.148.943.119 (84.00%), SISA 790.150.881
-- Barang: PAGU 5.363.613.000, REALISASI 3.185.242.989 (59.39%), SISA 2.178.370.011
-- Modal: PAGU 440.000.000, REALISASI 431.090.700 (97.98%), SISA 8.909.300

  ('imigrasi-polman', 'anggaran', 'pagu', 'Pagu Anggaran', 10742707000, '{}', 2026),
  ('imigrasi-polman', 'anggaran', 'realisasi', 'Realisasi Anggaran', 7765276808, '{"persentase": 72.28, "sisa": 2977430192}', 2026),
  ('imigrasi-polman', 'anggaran', 'pegawai', 'Pagu Pegawai', 4939094000, '{}', 2026),
  ('imigrasi-polman', 'anggaran', 'realisasi_pegawai', 'Realisasi Pegawai', 4148943119, '{"persentase": 84.00}', 2026),
  ('imigrasi-polman', 'anggaran', 'barang', 'Pagu Barang', 5363613000, '{}', 2026),
  ('imigrasi-polman', 'anggaran', 'realisasi_barang', 'Realisasi Barang', 3185242989, '{"persentase": 59.39}', 2026),
  ('imigrasi-polman', 'anggaran', 'modal', 'Pagu Modal', 440000000, '{}', 2026),
  ('imigrasi-polman', 'anggaran', 'realisasi_modal', 'Realisasi Modal', 431090700, '{"persentase": 97.98}', 2026);

-- ============================================================
-- 12. IMIGRASI POLMAN - PNBP
-- ============================================================
-- Sumber: realisasi PNBP 1 JANUARI -24 NOVEMBER 2026.xlsx
-- Target: 3.190.726.160
-- Realisasi: 5.883.600.000
-- Persentase: =B2/A2*100 → 184.4%

  ('imigrasi-polman', 'pnbp', 'target', 'Target PNBP', 3190726160, '{}', 2026),
  ('imigrasi-polman', 'pnbp', 'realisasi', 'Realisasi PNBP', 5883600000, '{"persentase": 184.4}', 2026);
