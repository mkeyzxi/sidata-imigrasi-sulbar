import {createSupabaseServerClient} from '@/lib/supabase/server'
import {
  mamujuPassportData as defaultMamujuPassport,
  mamujuIzinTinggal as defaultMamujuIzinTinggal,
  mamujuWNA as defaultMamujuWNA,
  mamujuTAK as defaultMamujuTAK,
  mamujuBAP as defaultMamujuBAP,
  mamujuIntelWas as defaultMamujuIntelWas,
  mamujuKegiatan as defaultMamujuKegiatan,
  mamujuSerapanBulanan as defaultMamujuSerapan,
  mamujuAnggaran as defaultMamujuAnggaran,
  mamujuPNBP as defaultMamujuPNBP,
} from '@/lib/data/mamuju'
import {
  polmanPassportData as defaultPolmanPassport,
  polmanIzinTinggal as defaultPolmanIzinTinggal,
  polmanKegiatan as defaultPolmanKegiatan,
  polmanSerapanBulanan as defaultPolmanSerapan,
} from '@/lib/data/polman'
import {
  kanwilBidang as defaultKanwilBidang,
  kanwilKegiatan as defaultKanwilKegiatan,
  kanwilSerapanBidang as defaultKanwilSerapan,
} from '@/lib/data/kanwil'

const UNIT_NAME_MAP: Record<string, string> = {
  'kanwil-sulbar': 'Kanwil Sulbar',
  'imigrasi-mamuju': 'Imigrasi Mamuju',
  'imigrasi-polman': 'Imigrasi Polman',
}

export type KegiatanItem = {
  id: string | number
  title: string
  date: string
  location?: string
  type?: string
  description?: string
  image?: string
  unit: string
  unit_id: string
  bidang?: string
  bidang_id?: string
}

/**
 * Mengambil daftar berita & kegiatan publik yang terbit dari Supabase
 */
export async function getKegiatanList(options?: {
  unit_id?: string
  bidang_id?: string
  limit?: number
}): Promise<KegiatanItem[]> {
  try {
    const supabase = createSupabaseServerClient()
    let query = supabase
      .from('kegiatan')
      .select('*, bidang:bidang(name)')
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

    const {data, error} = await query

    if (!error && data && data.length > 0) {
      return data.map((item) => ({
        id: item.id,
        title: item.title,
        date: item.date,
        location: item.location || '',
        type: item.type || 'Intel-WAS',
        description: item.description || '',
        image:
          item.image_url ||
          'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80',
        unit: UNIT_NAME_MAP[item.unit_id] || item.unit_id,
        unit_id: item.unit_id,
        bidang: item.bidang?.name || undefined,
        bidang_id: item.bidang_id || undefined,
      }))
    }
  } catch (err) {
    console.warn('[data-service] Gagal memuat kegiatan dari Supabase, menggunakan fallback:', err)
  }

  // Fallback
  const allDefault: KegiatanItem[] = [
    ...defaultKanwilKegiatan.map((k) => ({...k, unit: 'Kanwil Sulbar', unit_id: 'kanwil-sulbar'})),
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

  let filtered = allDefault
  if (options?.unit_id && options.unit_id !== 'all') {
    filtered = filtered.filter((k) => k.unit_id === options.unit_id)
  }
  if (options?.bidang_id) {
    filtered = filtered.filter((k) => k.bidang_id === options.bidang_id)
  }
  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Mengambil detail satu berita/kegiatan berdasarkan ID dari Supabase
 */
export async function getKegiatanDetail(id: number | string) {
  const supabase = createSupabaseServerClient()
  let item = null

  // 1. Coba dari Supabase (hanya jika terbit)
  const {data, error} = await supabase
    .from('kegiatan')
    .select('*, bidang:bidang(name)')
    .eq('id', Number(id))
    .eq('published', true)
    .single()

  if (!error && data) {
    item = data
  }

  // Fallback ke data default bila tidak ada di DB
  if (!item) {
    const allDefault: KegiatanItem[] = [
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
    const found = allDefault.find((k) => String(k.id) === String(id))
    if (!found) return null
    return {
      id: found.id,
      title: found.title,
      date: found.date,
      location: found.location || '',
      type: found.type || 'Intel-WAS',
      description: found.description || '',
      image: found.image || 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80',
      unit: found.unit,
      unit_id: found.unit_id,
      bidang: found.bidang || undefined,
      bidang_id: found.bidang_id || undefined,
      published: true,
    }
  }

  return {
    id: item.id,
    title: item.title,
    date: item.date,
    location: item.location || '',
    type: item.type || 'Intel-WAS',
    description: item.description || '',
    image:
      item.image_url ||
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80',
    unit: UNIT_NAME_MAP[item.unit_id] || item.unit_id,
    unit_id: item.unit_id,
    bidang: item.bidang?.name || undefined,
    bidang_id: item.bidang_id || undefined,
    published: true,
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

/**
 * Mengambil data statistik lengkap untuk Kanim Mamuju dari Supabase
 */
export async function getMamujuData(year: number = 2026) {
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

      const totalPaspor = getVal('paspor', 'Total Paspor', defaultMamujuPassport.total)
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

      const itk = getVal('izin_tinggal', 'ITK', defaultMamujuIzinTinggal.itk)
      const itas = getVal('izin_tinggal', 'ITAS', defaultMamujuIzinTinggal.itas)
      const itap = getVal('izin_tinggal', 'ITAP', defaultMamujuIzinTinggal.itap)
      const totalIzinTinggal = itk + itas + itap

      const totalWna = getVal('WNA', 'Total WNA', defaultMamujuWNA.total)
      const totalTak = getVal('TAK', 'Total TAK', defaultMamujuTAK.total)

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
        bap: defaultMamujuBAP,
        intelWas: defaultMamujuIntelWas,
        anggaran: defaultMamujuAnggaran,
        pnbp: defaultMamujuPNBP,
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
    anggaran: defaultMamujuAnggaran,
    pnbp: defaultMamujuPNBP,
    serapanBulanan: defaultMamujuSerapan,
  }
}

/**
 * Mengambil data statistik lengkap untuk Kanim Polman dari Supabase
 */
export async function getPolmanData(year: number = 2026) {
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
      const baru = getVal('paspor', 'Baru', defaultPolmanPassport.breakdown.baru)
      const penggantian = getVal(
        'paspor',
        'Penggantian',
        defaultPolmanPassport.breakdown.penggantian,
      )

      const itk = getVal('izin_tinggal', 'ITK', defaultPolmanIzinTinggal.itk)
      const itas = getVal('izin_tinggal', 'ITAS', defaultPolmanIzinTinggal.itas)
      const itap = getVal('izin_tinggal', 'ITAP', defaultPolmanIzinTinggal.itap)
      const totalIzinTinggal = itk + itas + itap

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
        serapanBulanan: defaultPolmanSerapan,
      }
    }
  } catch (err) {
    console.warn('[data-service] Gagal memuat data Polman dari Supabase:', err)
  }

  return {
    passportData: defaultPolmanPassport,
    izinTinggal: defaultPolmanIzinTinggal,
    serapanBulanan: defaultPolmanSerapan,
  }
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
        kegiatan: (kegiatan || []).map((k) => ({
          id: k.id,
          title: k.title,
          date: k.date,
          location: k.location || '',
          type: k.type || 'Intel-WAS',
          description: k.description || '',
          image:
            k.image_url ||
            'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80',
          unit: 'Kanwil Sulbar',
          unit_id: 'kanwil-sulbar',
          bidang: bidang.name,
        })),
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
