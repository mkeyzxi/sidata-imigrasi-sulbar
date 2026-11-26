// ============================================================
// Berita & Kegiatan Statis (Bawaan)
//
// Konten berita di bawah ini bersifat statis / hardcoded:
// langsung tampil di halaman tanpa perlu mengambil data dari
// database terlebih dahulu. Berita yang ditambahkan admin
// (via Supabase) akan melanjutkan daftar ini.
// ============================================================

export type BeritaStatis = {
  id: string
  title: string
  date: string
  location?: string
  type?: string
  description?: string
  image?: string
  /** URL placeholder tambahan untuk galeri (Image 1..3) */
  gallery?: string[]
  unit: string
  unit_id: string
  /** Penanda bahwa item ini berasal dari data statis (bukan Supabase) */
  source: 'statis'
}

const IMAGE_1 = '/kegiatan-image/kordinasi-bkn-satu.webp'
const IMAGE_2 = '/kegiatan-image/kordinasi-bkn-dua.webp'
const IMAGE_3 = '/kegiatan-image/kordinasi-bkn-tiga.webp'

export const beritaUtama: BeritaStatis = {
  id: 'statis-1',
  title:
    'Koordinasi di BKN bersama Panitia Pusat, Kanwil Ditjenim, dan Kanwil Ditjenpas terkait Persiapan Uji Penyesuaian Ijazah dan Ujian Dinas',
  date: '2026-11-17',
  location: 'Jakarta — Badan Kepegawaian Negara (BKN)',
  type: 'Koordinasi',
  description: [
    'JAKARTA — Kantor Wilayah Direktorat Jenderal Imigrasi Sulawesi Barat menghadiri kegiatan koordinasi di lingkungan Badan Kepegawaian Negara (BKN) bersama Panitia Pusat, Kanwil Ditjen Imigrasi, dan Kanwil Ditjen Pemasyarakatan yang dilaksanakan pada 17 November 2026. Kegiatan ini membahas persiapan pelaksanaan Uji Penyesuaian Ijazah dan Ujian Dinas bagi CPNS di lingkungan Kementerian Hukum dan Hak Asasi Manusia.',
    'Dalam pertemuan tersebut, para peserta meninjau kembali mekanisme, kisi-kisi materi, serta jadwal pelaksanaan Ujian Dinas, termasuk skema pengelompokan peserta dan ketentuan kelulusan. Kanwil Ditjenim dan Kanwil Ditjenpas juga menyepakati langkah-langkah pendampingan bagi CPNS agar proses mengikuti seleksi dapat berjalan lancar, mulai dari penyampaian informasi jadwal, pemenuhan kelengkapan berkas, hingga pendampingan teknis saat pelaksanaan.',
    'Kegiatan koordinasi ini menjadi wujud komitmen institusional dalam memastikan setiap CPNS memperoleh kesempatan yang sama dan pendampingan yang memadai. Dengan sinergi antarsatuan kerja di lingkungan Kemenkumham, diharapkan kualitas seleksi dapat terjaga secara objektif serta menghasilkan aparatur yang siap mengemban tugas pelayanan publik di bidang keimigrasian dan pemasyarakatan.',
  ].join('\n'),
  image: IMAGE_1,
  gallery: [IMAGE_1, IMAGE_2, IMAGE_3],
  unit: 'Kanwil Sulbar',
  unit_id: 'kanwil-sulbar',
  source: 'statis',
}

export const daftarBeritaStatis: BeritaStatis[] = [beritaUtama]
