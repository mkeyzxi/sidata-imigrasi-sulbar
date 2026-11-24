// Data dummy untuk Kanwil Sulbar
export const kanwilBidang = [
  {
    id: "bidang-1",
    name: "Bagian Tata Usaha dan Umum",
    slug: "tata-usaha-dan-umum",
    description: "Mengelola administrasi, kepegawaian, keuangan, dan rumah tangga kantor"
  },
  {
    id: "bidang-2",
    name: "Bidang Doklanintaltus",
    slug: "doklanintaltus",
    description: "Bidang Dokumen Perjalanan, Izin Tinggal dan Sistem Informasi Keimigrasian"
  },
  {
    id: "bidang-3",
    name: "Bidang Gakkumpatnal",
    slug: "gakkumpatnal",
    description: "Bidang Intelijen dan Penindakan Keimigrasian"
  }
];

export const kanwilKegiatan = [
  {
    id: "1",
    title: "Rapat Koordinasi Internal",
    date: "2026-09-12",
    bidang: "Bagian Tata Usaha dan Umum",
    location: "Mamuju",
    description: "Rapat rutin koordinasi administrasi dan kepegawaian",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80"
  },
  {
    id: "2",
    title: "Pelayanan Paspor Kolektif",
    date: "2026-09-18",
    bidang: "Bidang Doklanintaltus",
    location: "Mamuju",
    description: "Kegiatan jemput bola pelayanan paspor kepada masyarakat",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80"
  },
  {
    id: "3",
    title: "Operasi Gabungan Pengawasan",
    date: "2026-09-23",
    bidang: "Bidang Gakkumpatnal",
    location: "Sulawesi Barat",
    description: "Kegiatan pengawasan orang asing bersama instansi terkait",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80"
  },
  {
    id: "4",
    title: "Evaluasi Serapan Anggaran",
    date: "2026-09-28",
    bidang: "Bagian Tata Usaha dan Umum",
    location: "Mamuju",
    description: "Evaluasi pelaksanaan anggaran triwulan III",
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
