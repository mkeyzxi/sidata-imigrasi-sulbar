'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Newspaper,
  CalendarDays,
  MapPin,
  Building2,
  Tag,
  Database,
  Newspaper as NewsIcon,
  Loader2,
} from 'lucide-react'
import {daftarBeritaStatis} from '@/lib/data/berita'
import BeritaSlider from '@/components/berita/BeritaSlider'
import {formatDate} from '@/lib/utils/format'

type ItemBerita = {
  id: string
  title: string
  date: string
  location?: string
  type?: string
  description?: string
  image?: string
  gallery?: string[]
  unit: string
  unit_id: string
  source: 'statis' | 'supabase'
}

/**
 * Gabungan berita:
 * 1) Berita statis (bawaan) selalu muncul tanpa menunggu database.
 * 2) Berita yang ditambahkan admin via Supabase melanjutkan daftar tersebut.
 */
const initialBerita: ItemBerita[] = [...daftarBeritaStatis]

export default function BeritaPage() {
  const [berita, setBerita] = useState<ItemBerita[]>(initialBerita)
  const [loadingDb, setLoadingDb] = useState(true)

  // Muat berita tambahan dari Supabase (melalui API publik)
  useEffect(() => {
    async function fetchBeritaSupabase() {
      try {
        const res = await fetch('/api/kegiatan')
        if (res.ok) {
          const json = await res.json()
          const dariDb: ItemBerita[] = (json.kegiatan || []).map(
            (k: Record<string, unknown>) => ({
              id: String(k.id),
              title: String(k.title ?? ''),
              date: String(k.date ?? ''),
              location: k.location ? String(k.location) : undefined,
              type: k.type ? String(k.type) : undefined,
              description: k.description ? String(k.description) : undefined,
              image: k.image ? String(k.image) : undefined,
              unit: String(k.unit ?? ''),
              unit_id: String(k.unit_id ?? ''),
              source: 'supabase',
            }),
          )
          // Berita Supabase melanjutkan daftar statis
          setBerita([...initialBerita, ...dariDb])
        }
      } catch (err) {
        console.warn('[Berita] Gagal memuat berita dari Supabase:', err)
      } finally {
        setLoadingDb(false)
      }
    }
    fetchBeritaSupabase()
  }, [])

  // Urutkan: terbaru dulu (berita statis tetap ikut)
  const beritaTerurut = [...berita].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  // Berita utama = artikel pertama (berita statis)
  const artikelUtama = beritaTerurut[0]

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

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 mb-12">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm tracking-wider uppercase mb-6">
          <Newspaper className="w-3.5 h-3.5" />
          Pusat Berita & Kegiatan
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary-dark tracking-tight leading-[1.08] mb-6">
          Berita & Kegiatan
        </h1>
        <p className="text-lg sm:text-lg text-text/75 leading-relaxed max-w-3xl font-normal">
          Rangkaian berita, kegiatan, dan perkembangan terbaru dari lingkungan
          Kantor Wilayah Direktorat Jenderal Imigrasi Sulawesi Barat.
        </p>
      </header>

      {/* ===== BERITA UTAMA (STATIS, langsung tampil tanpa database) ===== */}
      {artikelUtama.source === 'statis' && (
        <article className="max-w-7xl mx-auto px-6 mb-16">
          <div className="rounded-3xl overflow-hidden bg-surface shadow-md border border-border/40">
            {/* Meta badge */}
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3.5 py-1.5 rounded-full bg-accent text-white font-black text-xs uppercase tracking-widest inline-flex items-center gap-1.5">
                  <NewsIcon className="w-3.5 h-3.5" />
                  Berita Utama
                </span>
                {artikelUtama.type && (
                  <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-bold text-xs uppercase tracking-wider">
                    {artikelUtama.type}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface shadow-xs border border-border/50 text-xs font-bold text-text/70 uppercase tracking-wider">
                  <Building2 className="w-3.5 h-3.5 text-primary-dark" />
                  {artikelUtama.unit}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary-dark tracking-tight leading-[1.15] mb-6 max-w-4xl">
                {artikelUtama.title}
              </h2>

              {/* Meta grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-y border-border/60 py-5 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-text/50">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest leading-none mb-1">
                      Tanggal Kegiatan
                    </p>
                    <p className="text-sm font-bold text-heading">
                      {formatDate(artikelUtama.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-text/50">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest leading-none mb-1">
                      Lokasi
                    </p>
                    <p className="text-sm font-bold text-heading">
                      {artikelUtama.location || 'Sulawesi Barat'}
                    </p>
                  </div>
                </div>
                {artikelUtama.type && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-text/50">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest leading-none mb-1">
                        Kategori
                      </p>
                      <p className="text-sm font-bold text-heading">
                        {artikelUtama.type}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Narasi */}
              <div className="text-text/80 leading-relaxed space-y-5 max-w-none">
                {(artikelUtama.description || '')
                  .split('\n')
                  .filter(Boolean)
                  .map((para, i) => (
                    <p key={i} className="text-base sm:text-lg">
                      {para}
                    </p>
                  ))}
              </div>

              {/* Galeri 3 placeholder */}
              {artikelUtama.gallery && artikelUtama.gallery.length > 0 && (
                <div className="mt-10">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-0.5 bg-accent" />
                    <h3 className="font-black text-heading uppercase tracking-widest text-sm">
                      Galeri Dokumentasi
                    </h3>
                  </div>
                  <BeritaSlider
                    images={artikelUtama.gallery}
                    alt={artikelUtama.title}
                    captions={[
                      '[Image 1] — Suasana rapat koordinasi di BKN',
                      '[Image 2] — Diskusi bersama Panitia Pusat',
                      '[Image 3] — Penutupan dan foto bersama',
                    ]}
                  />
                </div>
              )}
            </div>
          </div>
        </article>
      )}

      {/* ===== DAFTAR BERITA LAINNYA ===== */}
      {beritaTerurut.length > 1 && (
        <section className="max-w-7xl mx-auto px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent mb-2">
                <Newspaper className="w-3.5 h-3.5" />
                Arsip Berita
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-heading tracking-tight">
                Berita & Kegiatan Lain
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {beritaTerurut
              .filter((b) => b.id !== artikelUtama?.id)
              .map((b) => (
                <div
                  key={b.id}
                  className="bg-surface rounded-2xl overflow-hidden shadow-sm border border-border/40 flex flex-col transition-shadow hover:shadow-md"
                >
                  {b.image && (
                    <div className="aspect-[16/10] relative">
                      <Image
                        src={b.image}
                        alt={b.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {b.type && (
                        <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent font-bold text-[11px] uppercase tracking-wider">
                          {b.type}
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          b.source === 'supabase'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-muted/60 text-text/60'
                        }`}
                      >
                        {b.source === 'supabase' ? (
                            <>
                              <Database className="w-3 h-3" />
                              Dari Supabase
                            </>
                        ) : (
                            'Statis'
                        )}
                      </span>
                    </div>
                    <h3 className="font-black text-heading text-lg leading-snug mb-2 line-clamp-2">
                      {b.title}
                    </h3>
                    <p className="text-sm text-text/70 mb-4 line-clamp-3 flex-1">
                      {(b.description || '').split('\n')[0]}
                    </p>
                    <div className="flex items-center justify-between text-xs font-bold text-text/50 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {formatDate(b.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {b.unit}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Status loading data dinamis */}
          {loadingDb && (
            <div className="mt-10 flex items-center justify-center gap-3 text-sm text-text/50">
              <Loader2 className="w-4 h-4 animate-spin" />
              Memuat berita tambahan dari database…
            </div>
          )}
        </section>
      )}
    </main>
  )
}
