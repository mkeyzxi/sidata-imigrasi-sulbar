'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, SearchX, Filter, CalendarDays, Loader2, Building2 } from 'lucide-react'
import ActivityCard from '@/components/activities/ActivityCard'
import {daftarKegiatanStatis} from '@/lib/data/kegiatan'

const UNIT_FILTERS = [
  { id: 'all', label: 'Semua Unit' },
  { id: 'Kanwil Sulbar', label: 'Kanwil Sulbar' },
  { id: 'Imigrasi Mamuju', label: 'Mamuju' },
  { id: 'Imigrasi Polman', label: 'Polman' },
]

type ActivityItem = {
  id: string | number
  title: string
  date: string
  location?: string
  type?: string
  description?: string
  image?: string
  gallery?: string[]
  unit: string
  unit_id: string
}

export default function KegiatanPage() {
  // Kegiatan statis bawaan (koordinasi BKN 17 November 2026)
  // langsung muncul tanpa menunggu database
  const defaultKegiatan: ActivityItem[] = daftarKegiatanStatis.map((b) => ({
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
  }))

  const [allKegiatan, setAllKegiatan] = useState<ActivityItem[]>(defaultKegiatan)
  const [loading, setLoading] = useState(true)
  const [filterUnit, setFilterUnit] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Muat kegiatan tambahan dari Supabase melalui API (menggabungkan
  // daftar statis + data dinamis; kegiatan statis tidak akan hilang)
  useEffect(() => {
    async function fetchKegiatan() {
      try {
        const res = await fetch('/api/kegiatan', { cache: 'no-store' })
        if (res.ok) {
          const json = await res.json()
          if (json.kegiatan && json.kegiatan.length > 0) {
            setAllKegiatan(json.kegiatan as ActivityItem[])
          }
        }
      } catch (err) {
        console.warn('Gagal memuat kegiatan dari API:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchKegiatan()
  }, [])

  const filteredKegiatan = allKegiatan.filter((kegiatan) => {
    const matchUnit = filterUnit === 'all' || kegiatan.unit === filterUnit
    const matchSearch =
      searchQuery === '' ||
      kegiatan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (kegiatan.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    return matchUnit && matchSearch
  })

  return (
    <main className="min-h-screen bg-background text-text pb-28 selection:bg-accent selection:text-white">
      {/* Contextual Back Navigation */}
      <nav className="max-w-7xl mx-auto px-6 pt-8 mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-bold text-text/60 hover:text-primary-dark transition-colors tracking-wider uppercase group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
          Kembali ke Halaman Utama
        </Link>
      </nav>

      {/* Header Section - Clean & Editorial */}
      <header className="max-w-7xl mx-auto px-6 mb-12">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm tracking-wider uppercase mb-6">
          <CalendarDays className="w-3.5 h-3.5" />
          Direktori Kegiatan
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary-dark tracking-tight leading-[1.08] mb-6">
          Data Kegiatan Keimigrasian
        </h1>

        <p className="text-lg sm:text-lg text-text/75 leading-relaxed max-w-3xl font-normal">
          Arsip dan jadwal operasional dari Kantor Wilayah Direktorat Jenderal Imigrasi Sulawesi Barat, Imigrasi Mamuju, dan
          Imigrasi Polman.
        </p>
      </header>

      {/* Control Panel: Floating Filter & Search */}
      <section className="max-w-7xl mx-auto px-6 mb-10">
        <div className="bg-surface/90 backdrop-blur-md shadow-sm rounded-2xl p-4 sm:p-5 md:p-5 space-y-4">
          {/* Unit Filters — scroll horizontal di mobile */}
          <div className="flex items-center gap-2.5 overflow-x-auto hide-scrollbar">
            <Filter className="w-4 h-4 text-accent shrink-0" />
            <div className="flex items-center gap-2">
              {UNIT_FILTERS.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => setFilterUnit(unit.id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    filterUnit === unit.id
                      ? 'bg-primary-dark text-white shadow-sm'
                      : 'bg-background text-text/70 hover:bg-muted/50 hover:text-heading'
                  }`}
                >
                  {unit.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama kegiatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background rounded-full text-base font-medium focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all text-heading placeholder:text-text/40"
            />
          </div>
        </div>
      </section>

      {/* Results Meta Info */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <p className="text-sm font-semibold text-text/60 tracking-wide uppercase">
          Menampilkan <span className="text-primary-dark font-black">{filteredKegiatan.length}</span>{' '}
          kegiatan
          {filterUnit !== 'all' && (
            <span>
              {' '}
              untuk unit <span className="text-primary-dark font-black">{filterUnit}</span>
            </span>
          )}
          {searchQuery && (
            <span>
              {' '}
              dengan kata kunci &quot;<span className="text-primary-dark font-black">{searchQuery}</span>
              &quot;
            </span>
          )}
        </p>
      </div>

      {/* Data Grid / Empty State */}
      <section className="max-w-7xl mx-auto px-6">
        {filteredKegiatan.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredKegiatan.map((kegiatan, index) => (
              <ActivityCard key={`${kegiatan.unit}-${kegiatan.id}-${index}`} {...kegiatan} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 rounded-2xl bg-surface shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-5">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-heading mb-2">Tidak ada kegiatan ditemukan</h3>
            <p className="text-text/70 text-base max-w-md leading-relaxed">
              Pencarian untuk kriteria yang Anda masukkan tidak menghasilkan data. Cobalah menghapus
              filter atau menggunakan kata kunci yang berbeda.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setFilterUnit('all')
              }}
              className="mt-6 px-6 py-3 bg-primary-dark text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-sm hover:bg-primary transition-all"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </section>
    </main>
  )
}