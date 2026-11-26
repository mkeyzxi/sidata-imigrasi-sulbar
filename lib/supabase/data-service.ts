import {createSupabaseServerClient} from '@/lib/supabase/server'
import {
  mamujuPassportData as defaultMamujuPassport,
  mamujuIzinTinggal as defaultMamujuIzinTinggal,
  mamujuWNA as defaultMamujuWNA,
  mamujuTAK as defaultMamujuTAK,
  mamujuBAP as defaultMamujuBAP,
  mamujuIntelWas as defaultMamujuIntelWas,
  mamujuPerlintasan as defaultMamujuPerlintasan,
  mamujuKegiatan as defaultMamujuKegiatan,
  mamujuSerapanBulanan as defaultMamujuSerapan,
  mamujuAnggaran as defaultMamujuAnggaran,
  mamujuPNBP as defaultMamujuPNBP,
} from '@/lib/data/mamuju'
import {
  polmanPassportData as defaultPolmanPassport,
  polmanIzinTinggal as defaultPolmanIzinTinggal,
  polmanAnggaran as defaultPolmanAnggaran,
  polmanPNBP as defaultPolmanPNBP,
  polmanKegiatan as defaultPolmanKegiatan,
  polmanSerapanBulanan as defaultPolmanSerapan,
} from '@/lib/data/polman'
import {
  kanwilBidang as defaultKanwilBidang,
  kanwilKegiatan as defaultKanwilKegiatan,
  kanwilSerapanBidang as defaultKanwilSerapan,
} from '@/lib/data/kanwil'
import {daftarKegiatanStatis, KegiatanStatis} from '@/lib/data/kegiatan'
import {resolveActivityImage, resolveActivityGallery} from '@/lib/supabase/image-url'

const UNIT_NAME_MAP: Record<string, string> = {
  'kanwil-sulbar': 'Kanwil Sulbar',
  'imigrasi-mamuju': 'Imigrasi Mamuju',
  'imigrasi-polman': 'Imigrasi Polman',
}

export type KegiatanItem = Omit<KegiatanStatis, 'source'> & {
  bidang?: string
  bidang_id?: string
  /** Penanda sumber data: 'statis' (bawaan) atau 'supabase' */
  source?: 'statis' | 'supabase'
}

/**
 * Data statis bawaan (koordinasi BKN 17 November 2026) —
 * selalu tampil sebagai bagian dari daftar kegiatan tanpa perlu
 * menunggu database.
 */
const kegiatanStatis: KegiatanItem[] = daftarKegiatanStatis.map((b) => ({
  id: b.id,
  title: b.title,
  date: b.date,
  location: b.location,
  type: b.type,
  description: b.description,
  image: b.image,
  gallery: b.gallery,
  unit: b.unit,
  unit_id: b.unit_id,
  source: 'statis',
}))

/**
 * Deteksi apakah kolom `gallery` sudah ada di tabel kegiatan (migration 012).
 * Dikumpulkan sekali per process; bila belum ada, query tidak akan memilih
 * field gallery agar tidak error, dan galeri dinonaktifkan sementara.
 */
/**
 * Baris hasil query tabel `kegiatan` — memuat kolom `gallery` (JSONB) yang
 * hanya ada setelah migration 012. Dipakai sebagai type-alias agar select
 * eksplisit (dengan field dinamis) tetap lolos type-check.
 */
type KEGIATAN_ROW = {
  id: number
  title: string
  description: string | null
  date: string
  location: string | null
  type: string | null
  image_url: string | null
  unit_id: string
  bidang_id: string | null
  published: boolean
  /** Hanya terisi bila kolom gallery sudah ada di DB (migration 012) */
  gallery?: unknown
  bidang?: {name: string} | null
}

let _galleryColumnAvailable: boolean | null = null
async function hasGalleryColumn(
  supabase: ReturnType<typeof createSupabaseServerClient>,
): Promise<boolean> {
  if (_galleryColumnAvailable !== null) return _galleryColumnAvailable
  try {
    const {error} = await supabase.from('kegiatan').select('id, gallery').limit(1)
    _galleryColumnAvailable = !error
  } catch {
    _galleryColumnAvailable = false
  }
  return _galleryColumnAvailable
}

/**
 * Mengambil daftar berita & kegiatan publik yang terbit dari Supabase.
 * Daftar kegiatan statis (bawaan) selalu disertakan di awal; data Supabase
 * akan melanjutkan/melanjutkan daftar tersebut.
 */
export async function getKegiatanList(options?: {
  unit_id?: string
  bidang_id?: string
  limit?: number
}): Promise<KegiatanItem[]> {
  let supabaseData: KegiatanItem[] = []

  try {
    const supabase = createSupabaseServerClient()
    // Pilih field eksplisit. Field `gallery` hanya dimasukkan bila
    // kolomnya sudah ada (migration 012) agar tidak error di DB lama.
    const galleryAvail = await hasGalleryColumn(supabase)
    const selectFields = galleryAvail
      ? 'id, title, description, date, location, type, image_url, unit_id, bidang_id, published, gallery, bidang:bidang(name)'
      : 'id, title, description, date, location, type, image_url, unit_id, bidang_id, published, bidang:bidang(name)'

    let query = supabase
      .from('kegiatan')
      .select(selectFields)
      .eq('published', true)
      .order('date', {ascending: false})

    if (options?.unit_id && options.unit_id !== 'all') {
      query = query.eq('unit_id', options.unit_id)
    }
    if (options?.bidang_id) {
      query = query.eq('bidang_id', options.bidang_id)
    }
    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const {data, error} = await (query as unknown as {
      then: (
        r: (v: {data: KEGIATAN_ROW[] | null; error: {message: string} | null}) => void,
      ) => void
    })

    if (!error && data && data.length > 0) {
      supabaseData = data.map((item) => {
        // Bangun galeri dari kolom `gallery` maupun JSON array di `image_url` (maks 3 gambar)
        const gallery = resolveActivityGallery(
          Array.isArray(item.gallery) ? (item.gallery as string[]) : undefined,
          item.image_url,
        ).slice(0, 3)

        const displayImage =
          gallery[0] ||
          resolveActivityImage(item.image_url) ||
          'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80'

        return {
          id: item.id,
          title: item.title,
          date: item.date,
          location: item.location || '',
          type: item.type || 'Intel-WAS',
          description: item.description || '',
          image: displayImage,
          gallery: gallery.length > 1 ? gallery : undefined,
          unit: UNIT_NAME_MAP[item.unit_id] || item.unit_id,
          unit_id: item.unit_id,
          bidang: item.bidang?.name || undefined,
          bidang_id: item.bidang_id || undefined,
          source: 'supabase' as const,
        } satisfies KegiatanItem
      })
    }
  } catch (err) {
    console.warn('[data-service] Gagal memuat kegiatan dari Supabase, menggunakan fallback:', err)
  }

  // Gabungan: statis (bawaan) + Supabase. Jika ada filter unit, terapkan
  // juga ke data statis agar konsisten.
  let combined: KegiatanItem[]
  if (options?.unit_id && options.unit_id !== 'all') {
    combined = [...kegiatanStatis, ...supabaseData].filter((k) => k.unit_id === options.unit_id)
  } else {
    combined = [...kegiatanStatis, ...supabaseData]
  }

  if (options?.bidang_id) {
    combined = combined.filter((k) => k.bidang_id === options.bidang_id)
  }

  return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Mengambil detail satu berita/kegiatan berdasarkan ID dari Supabase
 */
export async function getKegiatanDetail(id: number | string) {
  const supabase = createSupabaseServerClient()
  let item: KEGIATAN_ROW | null = null

  // 1. Coba cari di data statis bawaan (berita koordinasi BKN dkk)
  const foundStatis = kegiatanStatis.find((k) => String(k.id) === String(id))
  if (foundStatis) {
    return {
      ...foundStatis,
      image: resolveActivityImage(foundStatis.image),
      gallery:
        foundStatis.gallery && foundStatis.gallery.length > 1
          ? resolveActivityGallery(foundStatis.gallery)
          : undefined,
      published: true,
    }
  }

  // 2. Coba dari Supabase (hanya jika terbit)
  const galleryAvail = await hasGalleryColumn(supabase)
  const selectFields = galleryAvail
    ? 'id, title, description, date, location, type, image_url, unit_id, bidang_id, published, gallery, bidang:bidang(name)'
    : 'id, title, description, date, location, type, image_url, unit_id, bidang_id, published, bidang:bidang(name)'
  const {data, error} = await (
    supabase
      .from('kegiatan')
      .select(selectFields)
      .eq('id', Number(id))
      .eq('published', true)
      .single() as unknown as {
      data: KEGIATAN_ROW | null
      error: {message: string} | null
    }
  )

  if (!error && data) {
    item = data
  }

  // Fallback ke data default legacy (lib/data/*) bila tidak ada di DB
  if (!item) {
    const allDefault = [
      ...defaultKanwilKegiatan.map((k) => ({
        ...k,
        unit: 'Kanwil Sulbar',
        unit_id: 'kanwil-sulbar',
      })),
      ...defaultMamujuKegiatan.map((k) => ({
        ...k,
        unit: 'Imigrasi Mamuju',
        unit_id: 'imigrasi-mamuju',
      })),
      ...defaultPolmanKegiatan.map((k) => ({
        ...k,
        unit: 'Imigrasi Polman',
        unit_id: 'imigrasi-polman',
      })),
    ]
    const found = allDefault.find((k: Record<string, unknown>) => String(k.id) === String(id)) as
      | (KegiatanItem & Record<string, unknown>)
      | undefined
    if (!found) return null
    return {
      id: found.id,
      title: found.title,
      date: found.date,
      location: found.location || '',
      type: found.type || 'Intel-WAS',
      description: found.description || '',
      image: resolveActivityImage(
        found.image || 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80',
      ),
      unit: found.unit,
      unit_id: found.unit_id,
      bidang: found.bidang || undefined,
      bidang_id: found.bidang_id || undefined,
      published: true,
    }
  }

  const gallery = resolveActivityGallery(
    Array.isArray(item.gallery) ? (item.gallery as string[]) : undefined,
    item.image_url,
  ).slice(0, 3)

  const displayImage =
    gallery[0] ||
    resolveActivityImage(item.image_url) ||
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80'

  return {
    id: item.id,
    title: item.title,
    date: item.date,
    location: item.location || '',
    type: item.type || 'Intel-WAS',
    description: item.description || '',
    image: displayImage,
    gallery: gallery.length > 1 ? gallery : undefined,
    unit: UNIT_NAME_MAP[item.unit_id] || item.unit_id,
    unit_id: item.unit_id,
    bidang: item.bidang?.name || undefined,
    bidang_id: item.bidang_id || undefined,
    published: true,
    source: 'supabase' as const,
  }
}

/**
 * Mengambil data agregat regional Sulbar dari Supabase
 */
export async function getRegionalStats(year: number = 2026) {
  try {
    const supabase = createSupabaseServerClient()
    const {data, error} = await supabase.from('statistik_pendaftaran').select('*').eq('tahun', year)

    if (!error && data && data.length > 0) {
      // Hitung paspor Mamuju & Polman
      const mamujuRows = data.filter((d) => d.unit_id === 'imigrasi-mamuju')
      const polmanRows = data.filter((d) => d.unit_id === 'imigrasi-polman')

      const mamujuPasporTotal =
        mamujuRows.find(
          (d) => d.kategori === 'paspor' && (d.label === 'Total Paspor' || d.label === 'Total'),
        )?.nilai ?? defaultMamujuPassport.total

      const polmanPasporTotal =
        polmanRows.find(
          (d) => d.kategori === 'paspor' && (d.label === 'Total Paspor' || d.label === 'Total'),
        )?.nilai ?? defaultPolmanPassport.total

      // Hitung Izin Tinggal
      const mamujuItk =
        mamujuRows.find((d) => d.kategori === 'izin_tinggal' && d.label === 'ITK')?.nilai ??
        defaultMamujuIzinTinggal.itk
      const mamujuItas =
        mamujuRows.find((d) => d.kategori === 'izin_tinggal' && d.label === 'ITAS')?.nilai ??
        defaultMamujuIzinTinggal.itas
      const mamujuItap =
        mamujuRows.find((d) => d.kategori === 'izin_tinggal' && d.label === 'ITAP')?.nilai ??
        defaultMamujuIzinTinggal.itap

      const polmanItk =
        polmanRows.find((d) => d.kategori === 'izin_tinggal' && d.label === 'ITK')?.nilai ??
        defaultPolmanIzinTinggal.itk
      const polmanItas =
        polmanRows.find((d) => d.kategori === 'izin_tinggal' && d.label === 'ITAS')?.nilai ??
        defaultPolmanIzinTinggal.itas
      const polmanItap =
        polmanRows.find((d) => d.kategori === 'izin_tinggal' && d.label === 'ITAP')?.nilai ??
        defaultPolmanIzinTinggal.itap

      const totalPasporSulbar = mamujuPasporTotal + polmanPasporTotal
      const totalItk = mamujuItk + polmanItk
      const totalItas = mamujuItas + polmanItas
      const totalItap = mamujuItap + polmanItap
      const totalIzinTinggalSulbar = totalItk + totalItas + totalItap

      return {
        totalPasporSulbar,
        totalIzinTinggalSulbar,
        totalItk,
        totalItas,
        totalItap,
        mamujuPasporTotal,
        polmanPasporTotal,
        mamujuIzinTinggalTotal: mamujuItk + mamujuItas + mamujuItap,
        polmanIzinTinggalTotal: polmanItk + polmanItas + polmanItap,
      }
    }
  } catch (err) {
    console.warn('[data-service] Gagal memuat agregat dari Supabase:', err)
  }

  // Fallback
  const totalPasporSulbar = defaultMamujuPassport.total + defaultPolmanPassport.total
  const totalIzinTinggalSulbar = defaultMamujuIzinTinggal.total + defaultPolmanIzinTinggal.total
  const totalItk = defaultMamujuIzinTinggal.itk + defaultPolmanIzinTinggal.itk
  const totalItap = defaultMamujuIzinTinggal.itap + defaultPolmanIzinTinggal.itap
  const totalItas = defaultMamujuIzinTinggal.itas + defaultPolmanIzinTinggal.itas

  return {
    totalPasporSulbar,
    totalIzinTinggalSulbar,
    totalItk,
    totalItas,
    totalItap,
    mamujuPasporTotal: defaultMamujuPassport.total,
    polmanPasporTotal: defaultPolmanPassport.total,
    mamujuIzinTinggalTotal: defaultMamujuIzinTinggal.total,
    polmanIzinTinggalTotal: defaultPolmanIzinTinggal.total,
  }
}

export interface MamujuPassportData {
  total: number
  year: number
  breakdown: {
    baru: { l: number; p: number; total: number }
    baruPercepatan: { l: number; p: number; total: number }
    gantiMasaBerlaku: { l: number; p: number; total: number }
    gantiHilang: { l: number; p: number; total: number }
    gantiRusak: { l: number; p: number; total: number }
    gantiHalamanPenuh: { l: number; p: number; total: number }
    gantiMasihBerlakuPercepatan: { l: number; p: number; total: number }
    pasporBiasa: { total: number }
    pasporElektronik: { total: number }
  }
}

export interface MamujuData {
  passportData: MamujuPassportData
  izinTinggal: {
    total: number
    itk: number
    itap: number
    itas: number
  }
  wna: {
    total: number
    aktif: number
    akanExpired: number
    sudahExpired: number
  }
  tak: {
    total: number
    orang: number
    jenisPerTAK: {
      bertempat: number
      deportasi: number
      pencegahan: number
    }
  }
  bap: {
    wni: number
    wna: number
    total: number
    hilang: number
    rusak: number
  }
  intelWas: {
    total: number
    totalPetugas: number
    breakdown: {
      operasiIntelijen: { kegiatan: number; petugas: number }
      operasiMandiri: { kegiatan: number; petugas: number }
      patroli: { kegiatan: number; petugas: number }
      opGabungan: { kegiatan: number; petugas: number }
      rapatTimpora: { kegiatan: number; petugas: number }
      desaBinaan: { kegiatan: number; petugas: number }
    }
  }
  perlintasan: {
    total: number
    kedatangan: number
    keberangkatan: number
  }
  anggaran: {
    pagu: number
    realisasi: number
    persentase: number
  }
  pnbp: {
    target: number
    realisasi: number
    persentase: number
  }
  serapanBulanan: { bulan: string; jumlah: number }[]
}

/**
 * Mengambil data statistik lengkap untuk Kanim Mamuju dari Supabase
 */
export async function getMamujuData(year: number = 2026): Promise<MamujuData> {
  try {
    const supabase = createSupabaseServerClient()
    const {data, error} = await supabase
      .from('statistik_pendaftaran')
      .select('*')
      .eq('unit_id', 'imigrasi-mamuju')
      .eq('tahun', year)

    if (!error && data && data.length > 0) {
      const getVal = (kat: string, lbl: string, fb: number) => {
        const found = data.find(
          (d) => d.kategori === kat && d.label?.toLowerCase() === lbl.toLowerCase(),
        )
        return found ? Number(found.nilai) : fb
      }

      // PASPOR - Struktur baru: Biasa + Elektronik
      const totalPaspor = getVal('paspor', 'Total Paspor', defaultMamujuPassport.total)
      const pasporBiasa = getVal('paspor', 'Paspor Biasa 48 Halaman', 0)
      const pasporElektronik = getVal('paspor', 'Paspor Elektronik 48 Halaman', 0)
      // Fallback ke struktur lama jika data baru tidak ada
      const baru = getVal('paspor', 'Baru', defaultMamujuPassport.breakdown.baru.total)
      const baruPercepatan = getVal(
        'paspor',
        'Baru Percepatan',
        defaultMamujuPassport.breakdown.baruPercepatan.total,
      )
      const gantiMasaBerlaku = getVal(
        'paspor',
        'Ganti Masa Berlaku',
        defaultMamujuPassport.breakdown.gantiMasaBerlaku.total,
      )
      const gantiHilang = getVal(
        'paspor',
        'Ganti Hilang',
        defaultMamujuPassport.breakdown.gantiHilang.total,
      )
      const gantiRusak = getVal(
        'paspor',
        'Ganti Rusak',
        defaultMamujuPassport.breakdown.gantiRusak.total,
      )
      const gantiHalamanPenuh = getVal(
        'paspor',
        'Ganti Halaman Penuh',
        defaultMamujuPassport.breakdown.gantiHalamanPenuh.total,
      )
      const gantiMasihBerlakuPercepatan = getVal(
        'paspor',
        'Ganti Masih Berlaku Percepatan',
        defaultMamujuPassport.breakdown.gantiMasihBerlakuPercepatan.total,
      )

      // IZIN TINGGAL
      const itk = getVal('izin_tinggal', 'ITK', defaultMamujuIzinTinggal.itk)
      const itas = getVal('izin_tinggal', 'ITAS', defaultMamujuIzinTinggal.itas)
      const itap = getVal('izin_tinggal', 'ITAP', defaultMamujuIzinTinggal.itap)
      const totalIzinTinggal = getVal('izin_tinggal', 'Total Izin Tinggal', defaultMamujuIzinTinggal.total)

      // WNA
      const totalWna = getVal('WNA', 'Total WNA', defaultMamujuWNA.total)

      // TAK - Struktur baru
      const totalTak = getVal('TAK', 'Total TAK', defaultMamujuTAK.total)

      // BAP - Struktur baru: Hilang + Rusak
      const bapHilang = getVal('BAP', 'BAP Hilang', 0)
      const bapRusak = getVal('BAP', 'BAP Rusak', 0)
      const totalBap = getVal('BAP', 'Total BAP', defaultMamujuBAP.wni + defaultMamujuBAP.wna)

      // INTEL-WAS - Struktur baru
      const totalIntelWas = getVal('intel_was', 'Total Kegiatan Intel-WAS', defaultMamujuIntelWas.total)
      const opsIntelijen = getVal('intel_was', 'Operasi Intelijen', defaultMamujuIntelWas.breakdown.operasiIntelijen.kegiatan)
      const opsMandiri = getVal('intel_was', 'Operasi Mandiri/Pengawasan', defaultMamujuIntelWas.breakdown.operasiMandiri.kegiatan)
      const patroli = getVal('intel_was', 'Patroli Pengawasan Orang Asing', defaultMamujuIntelWas.breakdown.patroli.kegiatan)
      const opsGabungan = getVal('intel_was', 'Operasi Gabungan', defaultMamujuIntelWas.breakdown.opGabungan.kegiatan)
      const timpora = getVal('intel_was', 'Rapat Timpora', 0)
      const desaBinaan = getVal('intel_was', 'Desa Binaan', 0)

      // PERLINTASAN (Kategori baru)
      const perlintasanKedatangan = getVal('perlintasan', 'Kedatangan', 0)
      const perlintasanKeberangkatan = getVal('perlintasan', 'Keberangkatan', 0)
      const totalPerlintasan = getVal('perlintasan', 'Total Perlintasan', 0)

      // ANGGARAN
      const paguAnggaran = getVal('anggaran', 'Pagu Anggaran', defaultMamujuAnggaran.pagu)
      const realisasiAnggaran = getVal('anggaran', 'Realisasi Anggaran', defaultMamujuAnggaran.realisasi)

      // PNBP
      const targetPNBP = getVal('pnbp', 'Target PNBP', defaultMamujuPNBP.target)
      const realisasiPNBP = getVal('pnbp', 'Realisasi PNBP', defaultMamujuPNBP.realisasi)

      return {
        passportData: {
          total: totalPaspor,
          year,
          breakdown: {
            baru: {...defaultMamujuPassport.breakdown.baru, total: baru},
            baruPercepatan: {
              ...defaultMamujuPassport.breakdown.baruPercepatan,
              total: baruPercepatan,
            },
            gantiMasaBerlaku: {
              ...defaultMamujuPassport.breakdown.gantiMasaBerlaku,
              total: gantiMasaBerlaku,
            },
            gantiHilang: {...defaultMamujuPassport.breakdown.gantiHilang, total: gantiHilang},
            gantiRusak: {...defaultMamujuPassport.breakdown.gantiRusak, total: gantiRusak},
            gantiHalamanPenuh: {
              ...defaultMamujuPassport.breakdown.gantiHalamanPenuh,
              total: gantiHalamanPenuh,
            },
            gantiMasihBerlakuPercepatan: {
              ...defaultMamujuPassport.breakdown.gantiMasihBerlakuPercepatan,
              total: gantiMasihBerlakuPercepatan,
            },
            // New fields
            pasporBiasa: { total: pasporBiasa },
            pasporElektronik: { total: pasporElektronik },
          },
        },
        izinTinggal: {
          total: totalIzinTinggal,
          itk,
          itap,
          itas,
        },
        wna: {...defaultMamujuWNA, total: totalWna},
        tak: {...defaultMamujuTAK, total: totalTak},
        bap: {
          wni: totalBap - bapRusak, // WNI = Total - Rusak
          wna: 0,
          total: totalBap,
          hilang: bapHilang,
          rusak: bapRusak,
        },
        intelWas: {
          total: totalIntelWas,
          totalPetugas: defaultMamujuIntelWas.totalPetugas,
          breakdown: {
            operasiIntelijen: {kegiatan: opsIntelijen, petugas: defaultMamujuIntelWas.breakdown.operasiIntelijen.petugas},
            operasiMandiri: {kegiatan: opsMandiri, petugas: defaultMamujuIntelWas.breakdown.operasiMandiri.petugas},
            patroli: {kegiatan: patroli, petugas: defaultMamujuIntelWas.breakdown.patroli.petugas},
            opGabungan: {kegiatan: opsGabungan, petugas: defaultMamujuIntelWas.breakdown.opGabungan.petugas},
            rapatTimpora: {kegiatan: timpora, petugas: defaultMamujuIntelWas.breakdown.rapatTimpora.petugas},
            desaBinaan: {kegiatan: desaBinaan, petugas: defaultMamujuIntelWas.breakdown.desaBinaan.petugas},
          },
        },
        perlintasan: {
          total: totalPerlintasan,
          kedatangan: perlintasanKedatangan,
          keberangkatan: perlintasanKeberangkatan,
        },
        anggaran: {
          pagu: paguAnggaran,
          realisasi: realisasiAnggaran,
          persentase: realisasiAnggaran > 0 ? Math.round((realisasiAnggaran / paguAnggaran) * 10000) / 100 : 0,
        },
        pnbp: {
          target: targetPNBP,
          realisasi: realisasiPNBP,
          persentase: realisasiPNBP > 0 ? Math.round((realisasiPNBP / targetPNBP) * 10000) / 100 : 0,
        },
        serapanBulanan: defaultMamujuSerapan,
      }
    }
  } catch (err) {
    console.warn('[data-service] Gagal memuat data Mamuju dari Supabase:', err)
  }

  return {
    passportData: defaultMamujuPassport,
    izinTinggal: defaultMamujuIzinTinggal,
    wna: defaultMamujuWNA,
    tak: defaultMamujuTAK,
    bap: defaultMamujuBAP,
    intelWas: defaultMamujuIntelWas,
    perlintasan: defaultMamujuPerlintasan,
    anggaran: defaultMamujuAnggaran,
    pnbp: defaultMamujuPNBP,
    serapanBulanan: defaultMamujuSerapan,
  }
}

export interface PolmanData {
  passportData: {
    total: number
    year: number
    breakdown: {
      baru: number
      penggantian: number
    }
  }
  izinTinggal: {
    total: number
    itk: number
    itap: number
    itas: number
  }
  anggaran: {
    pagu: number
    realisasi: number
    persentase: number
    breakdown: {
      pegawai: { pagu: number; realisasi: number }
      barang: { pagu: number; realisasi: number }
      modal: { pagu: number; realisasi: number }
    }
  }
  pnbp: {
    target: number
    realisasi: number
    persentase: number
  }
  serapanBulanan: { bulan: string; jumlah: number }[]
}

/**
 * Mengambil data statistik lengkap untuk Kanim Polman dari Supabase
 */
export async function getPolmanData(year: number = 2026): Promise<PolmanData> {
  try {
    const supabase = createSupabaseServerClient()
    const {data, error} = await supabase
      .from('statistik_pendaftaran')
      .select('*')
      .eq('unit_id', 'imigrasi-polman')
      .eq('tahun', year)

    if (!error && data && data.length > 0) {
      const getVal = (kat: string, lbl: string, fb: number) => {
        const found = data.find(
          (d) => d.kategori === kat && d.label?.toLowerCase() === lbl.toLowerCase(),
        )
        return found ? Number(found.nilai) : fb
      }

      const totalPaspor = getVal('paspor', 'Total Paspor', defaultPolmanPassport.total)
      const baru = getVal('paspor', 'Paspor Baru', defaultPolmanPassport.breakdown.baru)
      const penggantian = getVal(
        'paspor',
        'Paspor Penggantian',
        defaultPolmanPassport.breakdown.penggantian,
      )

      const itk = getVal('izin_tinggal', 'ITK', defaultPolmanIzinTinggal.itk)
      const itas = getVal('izin_tinggal', 'ITAS', defaultPolmanIzinTinggal.itas)
      const itap = getVal('izin_tinggal', 'ITAP', defaultPolmanIzinTinggal.itap)
      const totalIzinTinggal = getVal('izin_tinggal', 'Total Izin Tinggal', defaultPolmanIzinTinggal.total)

      // ANGGARAN - Struktur baru dengan breakdown per jenis
      const paguAnggaran = getVal('anggaran', 'Pagu Anggaran', 0)
      const realisasiAnggaran = getVal('anggaran', 'Realisasi Anggaran', 0)
      const paguPegawai = getVal('anggaran', 'Pagu Pegawai', 0)
      const realisasiPegawai = getVal('anggaran', 'Realisasi Pegawai', 0)
      const paguBarang = getVal('anggaran', 'Pagu Barang', 0)
      const realisasiBarang = getVal('anggaran', 'Realisasi Barang', 0)
      const paguModal = getVal('anggaran', 'Pagu Modal', 0)
      const realisasiModal = getVal('anggaran', 'Realisasi Modal', 0)

      // PNBP
      const targetPNBP = getVal('pnbp', 'Target PNBP', 0)
      const realisasiPNBP = getVal('pnbp', 'Realisasi PNBP', 0)

      return {
        passportData: {
          total: totalPaspor,
          year,
          breakdown: {
            baru,
            penggantian,
          },
        },
        izinTinggal: {
          total: totalIzinTinggal,
          itk,
          itap,
          itas,
        },
        anggaran: {
          pagu: paguAnggaran,
          realisasi: realisasiAnggaran,
          persentase: paguAnggaran > 0 ? Math.round((realisasiAnggaran / paguAnggaran) * 10000) / 100 : 0,
          breakdown: {
            pegawai: {pagu: paguPegawai, realisasi: realisasiPegawai},
            barang: {pagu: paguBarang, realisasi: realisasiBarang},
            modal: {pagu: paguModal, realisasi: realisasiModal},
          },
        },
        pnbp: {
          target: targetPNBP,
          realisasi: realisasiPNBP,
          persentase: targetPNBP > 0 ? Math.round((realisasiPNBP / targetPNBP) * 10000) / 100 : 0,
        },
        serapanBulanan: defaultPolmanSerapan,
      }
    }
  } catch (err) {
    console.warn('[data-service] Gagal memuat data Polman dari Supabase:', err)
  }

  return {
    passportData: defaultPolmanPassport,
    izinTinggal: defaultPolmanIzinTinggal,
    anggaran: defaultPolmanAnggaran,
    pnbp: defaultPolmanPNBP,
    serapanBulanan: defaultPolmanSerapan,
  } as PolmanData
}

/**
 * Mengambil struktur bidang dan serapan anggaran Kanwil Sulbar dari Supabase
 */
export async function getKanwilData() {
  try {
    const supabase = createSupabaseServerClient()

    // 1. Ambil bidang
    const {data: bidangList} = await supabase
      .from('bidang')
      .select('*')
      .eq('unit_id', 'kanwil-sulbar')

    // 2. Ambil serapan anggaran
    const {data: serapanRows} = await supabase
      .from('serapan_anggaran')
      .select('*')
      .eq('tahun', 2026)

    // 3. Ambil jumlah kegiatan
    const {count: kegiatanCount} = await supabase
      .from('kegiatan')
      .select('*', {count: 'exact', head: true})
      .eq('unit_id', 'kanwil-sulbar')
      .eq('published', true)

    if (bidangList && bidangList.length > 0) {
      // Map serapan per bidang
      const serapanByBidang: Record<string, {bulan: string; jumlah: number}[]> = {}
      const monthNames = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ]

      if (serapanRows && serapanRows.length > 0) {
        serapanRows.forEach((row) => {
          if (!serapanByBidang[row.bidang_id]) {
            serapanByBidang[row.bidang_id] = []
          }
          serapanByBidang[row.bidang_id].push({
            bulan: monthNames[row.bulan - 1] || `Bulan ${row.bulan}`,
            jumlah: Number(row.jumlah),
          })
        })
      }

      return {
        bidang: bidangList,
        serapanByBidang:
          Object.keys(serapanByBidang).length > 0 ? serapanByBidang : defaultKanwilSerapan,
        totalKegiatan: kegiatanCount ?? defaultKanwilKegiatan.length,
      }
    }
  } catch (err) {
    console.warn('[data-service] Gagal memuat data Kanwil dari Supabase:', err)
  }

  return {
    bidang: defaultKanwilBidang,
    serapanByBidang: defaultKanwilSerapan,
    totalKegiatan: defaultKanwilKegiatan.length,
  }
}

/**
 * Mengambil detail bidang berdasarkan slug dari Supabase
 */
export async function getBidangDetail(slug: string) {
  try {
    const supabase = createSupabaseServerClient()

    const {data: bidang} = await supabase.from('bidang').select('*').eq('slug', slug).single()

    if (bidang) {
      // Ambil kegiatan untuk bidang ini
      const {data: kegiatan} = await supabase
        .from('kegiatan')
        .select('*')
        .eq('bidang_id', bidang.id)
        .eq('published', true)
        .order('date', {ascending: false})

      // Ambil serapan anggaran untuk bidang ini
      const {data: serapan} = await supabase
        .from('serapan_anggaran')
        .select('*')
        .eq('bidang_id', bidang.id)
        .order('bulan', {ascending: true})

      const monthNames = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ]

      const formattedSerapan = (serapan || []).map((s) => ({
        bulan: monthNames[s.bulan - 1] || `Bulan ${s.bulan}`,
        jumlah: Number(s.jumlah),
      }))

      return {
        bidang,
        kegiatan: (kegiatan || []).map((k) => {
          const kGallery = resolveActivityGallery(
            Array.isArray((k as {gallery?: unknown}).gallery)
              ? ((k as {gallery?: string[]}).gallery as string[])
              : undefined,
            k.image_url,
          ).slice(0, 3)
          return {
            id: k.id,
            title: k.title,
            date: k.date,
            location: k.location || '',
            type: k.type || 'Intel-WAS',
            description: k.description || '',
            image:
              kGallery[0] ||
              resolveActivityImage(k.image_url) ||
              'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80',
            gallery: kGallery.length > 1 ? kGallery : undefined,
            unit: 'Kanwil Sulbar',
            unit_id: 'kanwil-sulbar',
            bidang: bidang.name,
          }
        }),
        serapan:
          formattedSerapan.length > 0
            ? formattedSerapan
            : defaultKanwilSerapan[bidang.id as keyof typeof defaultKanwilSerapan] || [],
      }
    }
  } catch (err) {
    console.warn('[data-service] Gagal memuat detail bidang dari Supabase:', err)
  }

  // Fallback
  const found = defaultKanwilBidang.find((b) => b.slug === slug)
  if (!found) return null

  const kegiatan = defaultKanwilKegiatan
    .filter((k) => k.bidang === found.name)
    .map((k) => ({...k, unit: 'Kanwil Sulbar', unit_id: 'kanwil-sulbar'}))
  const serapan = defaultKanwilSerapan[found.id as keyof typeof defaultKanwilSerapan] || []

  return {
    bidang: found,
    kegiatan,
    serapan,
  }
}
