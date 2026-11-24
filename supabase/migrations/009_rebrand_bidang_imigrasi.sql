-- Migration 009: Rebrand struktur bidang Kanwil Sulbar
-- Dari "Kementerian Hukum dan HAM" menjadi struktur
-- Kantor Wilayah Direktorat Jenderal Imigrasi Sulawesi Barat:
--   Bagian Tata Usaha dan Umum, Bidang Doklanintaltus, Bidang Gakkumpatnal
-- Date: 2026-11-24

-- 1. Perbarui nama, slug, dan deskripsi bidang
UPDATE public.bidang
SET
  name = CASE id
    WHEN 'bidang-1' THEN 'Bagian Tata Usaha dan Umum'
    WHEN 'bidang-2' THEN 'Bidang Doklanintaltus'
    WHEN 'bidang-3' THEN 'Bidang Gakkumpatnal'
    ELSE name
  END,
  slug = CASE id
    WHEN 'bidang-1' THEN 'tata-usaha-dan-umum'
    WHEN 'bidang-2' THEN 'doklanintaltus'
    WHEN 'bidang-3' THEN 'gakkumpatnal'
    ELSE slug
  END,
  description = CASE id
    WHEN 'bidang-1' THEN 'Mengelola administrasi, kepegawaian, keuangan, dan rumah tangga kantor'
    WHEN 'bidang-2' THEN 'Bidang Dokumen Perjalanan, Izin Tinggal dan Sistem Informasi Keimigrasian'
    WHEN 'bidang-3' THEN 'Bidang Intelijen dan Penindakan Keimigrasian'
    ELSE description
  END,
  updated_at = timezone('utc', now())
WHERE unit_id = 'kanwil-sulbar'
  AND id IN ('bidang-1', 'bidang-2', 'bidang-3');

-- 2. Perbarui judul kegiatan Kanwil yang masih bernuansa hukum
UPDATE public.kegiatan
SET
  title = CASE title
    WHEN 'Sosialisasi Pelayanan Hukum' THEN 'Rapat Koordinasi Internal'
    WHEN 'Workshop Administrasi Hukum' THEN 'Pelayanan Paspor Kolektif'
    WHEN 'Monitoring HAM' THEN 'Operasi Gabungan Pengawasan'
    WHEN 'Rapat Evaluasi Program' THEN 'Evaluasi Serapan Anggaran'
    ELSE title
  END,
  description = CASE title
    WHEN 'Sosialisasi Pelayanan Hukum' THEN 'Rapat rutin koordinasi administrasi dan kepegawaian'
    WHEN 'Workshop Administrasi Hukum' THEN 'Kegiatan jemput bola pelayanan paspor kepada masyarakat'
    WHEN 'Monitoring HAM' THEN 'Kegiatan pengawasan orang asing bersama instansi terkait'
    WHEN 'Rapat Evaluasi Program' THEN 'Evaluasi pelaksanaan anggaran triwulan III'
    ELSE description
  END,
  updated_at = timezone('utc', now())
WHERE unit_id = 'kanwil-sulbar';
