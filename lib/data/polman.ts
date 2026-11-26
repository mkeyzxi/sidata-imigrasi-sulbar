// Data terupdate dari "data imigrasi" - Periode Januari s.d 24 November 2026
export const polmanPassportData = {
  total: 2235,
  year: 2026,
  breakdown: {
    baru: 1420,
    penggantian: 815
  }
};

export const polmanIzinTinggal = {
  total: 66,
  itk: 21,
  itap: 8,
  itas: 37
};

export const polmanAnggaran = {
  pagu: 10742707000, // Rp 10.742.707.000
  realisasi: 7765276808, // Rp 7.765.276.808
  persentase: 72.28,
  sisa: 2977430192,
  breakdown: {
    pegawai: { pagu: 4939094000, realisasi: 4148943119, persentase: 84.0 },
    barang: { pagu: 5363613000, realisasi: 3185242989, persentase: 59.39 },
    modal: { pagu: 440000000, realisasi: 431090700, persentase: 97.98 }
  }
};

export const polmanPNBP = {
  target: 3190726160, // Rp 3.190.726.160
  realisasi: 5883600000, // Rp 5.883.600.000
  persentase: 184.4
};

export const polmanKegiatan = [
  {
    id: "1",
    title: "Pengawasan Orang Asing",
    date: "2026-09-12",
    location: "Polewali Mandar",
    type: "Intel-WAS",
    description: "Kegiatan pengawasan orang asing di wilayah Polewali Mandar",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80"
  },
  {
    id: "2",
    title: "Operasi Pengawasan",
    date: "2026-09-19",
    location: "Polman",
    type: "Intel-WAS",
    description: "Operasi pengawasan dan penindakan keimigrasian",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80"
  },
  {
    id: "3",
    title: "Koordinasi Pengawasan",
    date: "2026-09-24",
    location: "Polman",
    type: "Koordinasi",
    description: "Rapat koordinasi pengawasan orang asing",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80"
  }
];

export const polmanSerapanBulanan = [
  { bulan: "Januari", jumlah: 720000000 },
  { bulan: "Februari", jumlah: 850000000 },
  { bulan: "Maret", jumlah: 920000000 },
  { bulan: "April", jumlah: 880000000 },
  { bulan: "Mei", jumlah: 950000000 },
  { bulan: "Juni", jumlah: 1020000000 },
  { bulan: "Juli", jumlah: 780000000 },
  { bulan: "Agustus", jumlah: 840000000 },
  { bulan: "September", jumlah: 760000000 }
];
