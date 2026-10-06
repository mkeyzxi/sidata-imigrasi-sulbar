// Data dari PINTAS Imigrasi Mamuju
export const mamujuPassportData = {
  total: 2686,
  year: 2026,
  breakdown: {
    baru: { l: 822, p: 1263, total: 2085 },
    baruPercepatan: { l: 22, p: 40, total: 62 },
    gantiHalamanPenuh: { l: 7, p: 18, total: 25 },
    gantiHilang: { l: 23, p: 35, total: 58 },
    gantiMasaBerlaku: { l: 183, p: 239, total: 422 },
    gantiMasihBerlakuPercepatan: { l: 12, p: 19, total: 31 },
    gantiRusak: { l: 2, p: 1, total: 3 }
  }
};

export const mamujuIzinTinggal = {
  total: 8,
  itk: 4,
  itap: 2,
  itas: 2
};

export const mamujuWNA = {
  total: 17,
  aktif: 17,
  akanExpired: 2,
  sudahExpired: 13
};

export const mamujuTAK = {
  total: 23,
  jenisPerTAK: {
    bertempat: 8,
    deportasi: 8,
    pencegahan: 7
  }
};

export const mamujuBAP = {
  wni: 63,
  wna: 8,
  detail: {
    pasporHilang: 60,
    pasporRusak: 3,
    perubahanData: 0
  }
};

export const mamujuIntelWas = {
  total: 93,
  totalPetugas: 554,
  breakdown: {
    operasiIntelijen: { kegiatan: 43, petugas: 246 },
    operasiMandiri: { kegiatan: 29, petugas: 170 },
    patroli: { kegiatan: 8, petugas: 47 },
    opGabungan: { kegiatan: 4, petugas: 33 },
    rapatTimpora: { kegiatan: 5, petugas: 30 },
    desaBinaan: { kegiatan: 4, petugas: 28 }
  }
};

export const mamujuAnggaran = {
  pagu: 12740000000, // 12.74 M
  realisasi: 8730000000, // 8.73 M
  persentase: 68.5
};

export const mamujuPNBP = {
  target: 1920000000, // 1.92 M
  realisasi: 2130000000, // 2.13 M
  persentase: 111.3
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
