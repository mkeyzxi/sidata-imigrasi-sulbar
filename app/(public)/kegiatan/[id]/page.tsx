import Link from 'next/link'
import Image from 'next/image'
import {notFound} from 'next/navigation'
import {ArrowLeft, CalendarDays, MapPin, Building2, Tag, ChevronRight, Share2} from 'lucide-react'
import {getKegiatanDetail} from '@/lib/supabase/data-service'
import {formatDate} from '@/lib/utils/format'

export default async function ActivityDetailPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params
  const kegiatan = await getKegiatanDetail(id)

  if (!kegiatan) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background text-text pb-28 selection:bg-accent selection:text-white">
      {/* Breadcrumbs & Navigation */}
      <nav className="max-w-5xl mx-auto px-6 pt-8 mb-8">
        <Link
          href="/kegiatan"
          className="inline-flex items-center text-sm font-bold text-text/60 hover:text-primary-dark transition-colors tracking-wider uppercase group mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
          Kembali ke Direktori
        </Link>

        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-text/40 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <Link href="/" className="hover:text-primary-dark transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/kegiatan" className="hover:text-primary-dark transition-colors">
            Kegiatan
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary-dark truncate">{kegiatan.title}</span>
        </div>
      </nav>

      <article className="max-w-5xl mx-auto px-6">
        {/* Header Content */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-bold text-xs tracking-wider uppercase">
              {kegiatan.type}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface shadow-xs border border-border/50">
              <Building2 className="w-3.5 h-3.5 text-primary-dark" />
              <span className="text-xs font-bold text-text/70 uppercase tracking-wider">
                {kegiatan.unit}
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary-dark tracking-tight leading-[1.1] mb-8">
            {kegiatan.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-y border-border/60 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-text/50">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest leading-none mb-1">
                  Tanggal Kegiatan
                </p>
                <p className="text-sm font-bold text-heading">{formatDate(kegiatan.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-text/50">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest leading-none mb-1">
                  Lokasi Pelaksanaan
                </p>
                <p className="text-sm font-bold text-heading">{kegiatan.location || 'Sulawesi Barat'}</p>
              </div>
            </div>

            {kegiatan.bidang && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-text/50">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest leading-none mb-1">
                    Bidang Terkait
                  </p>
                  <p className="text-sm font-bold text-heading">{kegiatan.bidang}</p>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        <figure className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden bg-muted mb-12 shadow-sm">
          <Image
            src={kegiatan.image || 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80'}
            alt={kegiatan.title}
            fill
            className="object-cover"
            priority
          />
        </figure>

        {/* Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="prose prose-lg max-w-none text-text/80 leading-relaxed">
              {kegiatan.description ? (
                kegiatan.description.split('\n').map((para, i) => (
                  <p key={i} className="mb-6">
                    {para}
                  </p>
                ))
              ) : (
                <p className="italic text-text/40">Tidak ada deskripsi detail untuk kegiatan ini.</p>
              )}
            </div>
            
            <div className="mt-12 pt-8 border-t border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm font-bold text-text/60 hover:text-primary-dark transition-colors">
                  <Share2 className="w-4 h-4" />
                  Bagikan
                </button>
              </div>
              <p className="text-xs font-medium text-text/40">
                Terakhir diperbarui: {kegiatan.date}
              </p>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-surface rounded-2xl p-6 border border-border/40 shadow-xs">
              <h3 className="font-black text-heading mb-4 uppercase tracking-wider text-sm">Informasi Unit</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest mb-1.5">Penyelenggara</p>
                  <p className="text-sm font-bold text-primary-dark leading-tight">{kegiatan.unit}</p>
                </div>
                <Link 
                  href={`/${kegiatan.unit_id}`}
                  className="inline-flex items-center text-xs font-bold text-accent hover:underline uppercase tracking-widest pt-2"
                >
                  Lihat Profil Unit <ChevronRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>

            <div className="bg-primary-dark text-white rounded-2xl p-6 shadow-md">
              <h3 className="font-black mb-3 uppercase tracking-wider text-sm">Butuh Informasi?</h3>
              <p className="text-white/70 text-sm mb-6 leading-relaxed">
                Hubungi layanan informasi resmi Kantor Wilayah Kemenkumham Sulawesi Barat untuk pertanyaan lebih lanjut.
              </p>
              <button className="w-full py-3 bg-accent hover:bg-accent/90 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors">
                Kontak Kami
              </button>
            </div>
          </aside>
        </div>
      </article>
    </main>
  )
}
