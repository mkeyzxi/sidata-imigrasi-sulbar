// Data dummy untuk Kanwil Sulbar
export const kanwilBidang = [
  {
    id: "bidang-1",
    name: "Bidang Pelayanan Hukum",
    slug: "bidang-1",
    description: "Menangani pelayanan hukum dan bantuan hukum kepada masyarakat"
  },
  {
    id: "bidang-2",
    name: "Bidang Administrasi Hukum Umum",
    slug: "bidang-2",
    description: "Mengelola administrasi dan dokumentasi hukum umum"
  },
  {
    id: "bidang-3",
    name: "Bidang Hak Asasi Manusia",
    slug: "bidang-3",
    description: "Mengawasi dan mempromosikan hak asasi manusia"
  }
];

export const kanwilKegiatan = [
  {
    id: "1",
    title: "Sosialisasi Pelayanan Hukum",
    date: "2026-09-12",
    bidang: "Bidang Pelayanan Hukum",
    location: "Mamuju",
    description: "Sosialisasi pelayanan hukum kepada masyarakat",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80"
  },
  {
    id: "2",
    title: "Workshop Administrasi Hukum",
    date: "2026-09-18",
    bidang: "Bidang Administrasi Hukum Umum",
    location: "Mamuju",
    description: "Pelatihan administrasi hukum untuk pegawai",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80"
  },
  {
    id: "3",
    title: "Monitoring HAM",
    date: "2026-09-23",
    bidang: "Bidang Hak Asasi Manusia",
    location: "Sulawesi Barat",
    description: "Kegiatan monitoring penegakan HAM di wilayah Sulbar",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80"
  },
  {
    id: "4",
    title: "Rapat Evaluasi Program",
    date: "2026-09-28",
    bidang: "Bidang Pelayanan Hukum",
    location: "Mamuju",
    description: "Evaluasi program pelayanan publik triwulan III",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80"
  }
];

export const kanwilSerapanBidang = {
  "bidang-1": [
    { bulan: "Januari", jumlah: 12500000 },
    { bulan: "Februari", jumlah: 15200000 },
    { bulan: "Maret", jumlah: 17800000 },
    { bulan: "April", jumlah: 21000000 },
    { bulan: "Mei", jumlah: 18500000 },
    { bulan: "Juni", jumlah: 23000000 },
    { bulan: "Juli", jumlah: 16500000 },
    { bulan: "Agustus", jumlah: 19200000 },
    { bulan: "September", jumlah: 21500000 }
  ],
  "bidang-2": [
    { bulan: "Januari", jumlah: 10200000 },
    { bulan: "Februari", jumlah: 13500000 },
    { bulan: "Maret", jumlah: 15200000 },
    { bulan: "April", jumlah: 18000000 },
    { bulan: "Mei", jumlah: 16500000 },
    { bulan: "Juni", jumlah: 20000000 },
    { bulan: "Juli", jumlah: 14500000 },
    { bulan: "Agustus", jumlah: 17000000 },
    { bulan: "September", jumlah: 19200000 }
  ],
  "bidang-3": [
    { bulan: "Januari", jumlah: 9500000 },
    { bulan: "Februari", jumlah: 12000000 },
    { bulan: "Maret", jumlah: 14500000 },
    { bulan: "April", jumlah: 16800000 },
    { bulan: "Mei", jumlah: 15200000 },
    { bulan: "Juni", jumlah: 18500000 },
    { bulan: "Juli", jumlah: 13200000 },
    { bulan: "Agustus", jumlah: 15800000 },
    { bulan: "September", jumlah: 17500000 }
  ]
};
