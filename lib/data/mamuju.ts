// Data terupdate dari "data imigrasi" - Rekapan Data Keimigrasian 2026.pdf
// Periode: Januari - November 2026
export const mamujuPassportData = {
  total: 3079,
  year: 2026,
  breakdown: {
    baru: { l: 0, p: 0, total: 0 },
    baruPercepatan: { l: 0, p: 0, total: 0 },
    gantiHalamanPenuh: { l: 0, p: 0, total: 0 },
    gantiHilang: { l: 0, p: 0, total: 0 },
    gantiMasaBerlaku: { l: 0, p: 0, total: 0 },
    gantiMasihBerlakuPercepatan: { l: 0, p: 0, total: 0 },
    gantiRusak: { l: 0, p: 0, total: 0 },
    // Struktur baru dari rekap
    pasporBiasa: { total: 1 },
    pasporElektronik: { total: 3078 },
  }
};

export const mamujuIzinTinggal = {
  total: 41,
  itk: 16,
  itap: 8,
  itas: 17
};

export const mamujuWNA = {
  total: 0, // Data WNA aktif belum tersedia di rekap
  aktif: 0,
  akanExpired: 0,
  sudahExpired: 0
};

export const mamujuTAK = {
  total: 23,
  orang: 8,
  jenisPerTAK: {
    bertempat: 0,
    deportasi: 0,
    pencegahan: 0
  }
};

export const mamujuBAP = {
  wni: 71, // Total BAP 76 - Rusak 5
  wna: 0,
  total: 76,
  hilang: 71,
  rusak: 5,
  detail: {
    pasporHilang: 71,
    pasporRusak: 5,
    perubahanData: 0
  }
};

export const mamujuIntelWas = {
  total: 93,
  totalPetugas: 0, // Data petugas tidak tersedia di rekap
  breakdown: {
    operasiIntelijen: { kegiatan: 44, petugas: 0 },
    operasiMandiri: { kegiatan: 23, petugas: 0 },
    patroli: { kegiatan: 9, petugas: 0 },
    opGabungan: { kegiatan: 2, petugas: 0 },
    rapatTimpora: { kegiatan: 3, petugas: 0 },
    desaBinaan: { kegiatan: 4, petugas: 0 }
  }
};

export const mamujuPerlintasan = {
  total: 2186,
  kedatangan: 946,
  keberangkatan: 1240
};

export const mamujuAnggaran = {
  pagu: 12740000000, // 12.74 M
  realisasi: 11190000000, // 11.19 M
  persentase: 87.8
};

export const mamujuPNBP = {
  target: 1920000000, // 1.92 M
  realisasi: 2580000000, // 2.58 M
  persentase: 134.8
};

export const mamujuKegiatan = [
  {
    id: "1",
    title: "Operasi Intelijen Keimigrasian",
    date: "2026-09-12",
    location: "Mamuju",
    type: "Intel-WAS",
    description: "Kegiatan operasi intelijen dan pengawasan orang asing di wilayah Mamuju",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80"
  },
  {
    id: "2",
    title: "Pengawasan Orang Asing",
    date: "2026-09-18",
    location: "Mamuju Tengah",
    type: "Intel-WAS",
    description: "Pengawasan dan monitoring terhadap keberadaan orang asing",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80"
  },
  {
    id: "3",
    title: "Patroli Keimigrasian",
    date: "2026-09-25",
    location: "Pasangkayu",
    type: "Intel-WAS",
    description: "Kegiatan patroli keimigrasian di wilayah perbatasan",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80"
  },
  {
    id: "4",
    title: "Rapat Koordinasi Timpora",
    date: "2026-09-28",
    location: "Mamuju",
    type: "Koordinasi",
    description: "Rapat koordinasi Tim Pengawasan Orang Asing",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80"
  }
];

export const mamujuSerapanBulanan = [
  { bulan: "Januari", jumlah: 850000000 },
  { bulan: "Februari", jumlah: 920000000 },
  { bulan: "Maret", jumlah: 1100000000 },
  { bulan: "April", jumlah: 980000000 },
  { bulan: "Mei", jumlah: 1050000000 },
  { bulan: "Juni", jumlah: 1150000000 },
  { bulan: "Juli", jumlah: 890000000 },
  { bulan: "Agustus", jumlah: 960000000 },
  { bulan: "September", jumlah: 830000000 }
];
