export const units = [
  {
    id: "kanwil-sulbar",
    name: "Kantor Wilayah Direktorat Jenderal Imigrasi Sulawesi Barat",
    shortName: "Kanwil Sulbar",
    type: "kanwil",
    description: "Informasi kegiatan dan data pada bidang di lingkungan Kantor Wilayah Direktorat Jenderal Imigrasi Sulawesi Barat.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    slug: "kanwil-sulbar"
  },
 
  {
    id: "imigrasi-polman",
    name: "Kantor Imigrasi Kelas II Non TPI Polman",
    shortName: "Kanwil Polman",
    type: "imigrasi",
    description: "Data pelayanan keimigrasian meliputi paspor, izin tinggal, dan kegiatan intelijen & pengawasan.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
    slug: "imigrasi-polman"
  }
] as const;

export type Unit = typeof units[number];
