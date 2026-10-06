import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Building2, Calendar, FileText, Network, Activity } from 'lucide-react'
import { kanwilBidang, kanwilKegiatan, kanwilSerapanBidang } from '@/lib/data/kanwil'
import ActivityCard from '@/components/activities/ActivityCard'
import { formatCurrency } from '@/lib/utils/format'

export default function KanwilSulbarPage() {
  const totalKegiatan = kanwilKegiatan.length
  const totalBidang = kanwilBidang.length

  // Mengambil total serapan dari data dummy dengan aman
  const totalAnggaranTerserap = kanwilSerapanBidang['bidang-1']
    ? kanwilSerapanBidang['bidang-1'].reduce((sum, item) => sum + item.jumlah, 0)
    : 0

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

      {/* Hero Section - Clean Editorial Split */}
      <header className="max-w-7xl mx-auto px-6 mb-16 lg:flex lg:items-center lg:gap-16">
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm tracking-wider uppercase mb-6">
            <Building2 className="w-3.5 h-3.5" />
            Unit Kerja Utama
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-primary-dark tracking-tight leading-[1.08] mb-6">
            Kantor Wilayah <br /> Sulawesi Barat
          </h1>

          <p className="text-lg sm:text-lg text-text/75 leading-relaxed max-w-lg font-normal">
            Pusat koordinasi, administrasi, dan informasi data keimigrasian di lingkungan
            Kementerian Hukum dan HAM wilayah Sulawesi Barat.
          </p>
        </div>

        {/* Foto Gedung - Seamless Elevated Card */}
        <div className="lg:w-1/2 relative h-[320px] sm:h-[400px] w-full bg-surface rounded-2xl overflow-hidden shadow-md group">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80"
            alt="Gedung Kantor Wilayah Sulawesi Barat"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/30 via-transparent to-transparent" />
        </div>
      </header>

      {/* Executive Stats Data - Floating Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 text-text/50 mb-3">
              <Building2 className="w-4 h-4 text-accent" />
              <span className="text-sm font-bold uppercase tracking-widest">Total Bidang</span>
            </div>
            <div className="text-4xl font-black text-primary-dark tracking-tight">
              {String(totalBidang).padStart(2, '0')}
            </div>
          </div>

          <div className="bg-surface p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 text-text/50 mb-3">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="text-sm font-bold uppercase tracking-widest">Giat Tercatat</span>
            </div>
            <div className="text-4xl font-black text-primary-dark tracking-tight">
              {String(totalKegiatan).padStart(2, '0')}
            </div>
          </div>

          <div className="bg-surface p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 text-text/50 mb-3">
              <FileText className="w-4 h-4 text-accent" />
              <span className="text-sm font-bold uppercase tracking-widest">
                Serapan (Bidang 1)
              </span>
            </div>
            <div className="text-3xl font-black text-primary-dark tracking-tight">
              {formatCurrency(totalAnggaranTerserap)}
            </div>
          </div>
        </div>
      </section>

      {/* Direktori Bidang - Modern Interactive List */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent mb-2">
            <Network className="w-3.5 h-3.5" />
            Struktur Organisasi
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-heading tracking-tight">
            Struktur Bidang
          </h2>
          <p className="text-text/70 mt-2 text-base sm:text-lg">
            Pilih bidang untuk menelusuri data kegiatan dan serapan anggaran secara rinci.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {kanwilBidang.map((bidang, index) => (
            <Link
              key={bidang.id}
              href={`/kanwil-sulbar/${bidang.slug}`}
              className="group flex flex-col md:flex-row md:items-center justify-between p-6 sm:p-7 bg-surface rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start md:items-center gap-6">
                <span className="font-black text-accent text-lg md:text-xl transition-transform duration-300 group-hover:scale-110">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-heading group-hover:text-primary-dark transition-colors">
                    {bidang.name}
                  </h3>
                  <p className="text-base text-text/70 mt-1 max-w-2xl">{bidang.description}</p>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex items-center text-sm font-bold uppercase tracking-wider text-accent md:opacity-0 md:-translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                Lihat Detail <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Timeline / Grid Kegiatan */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent mb-2">
              <Activity className="w-3.5 h-3.5" />
              Aktivitas Terbaru
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-heading tracking-tight">
              Kegiatan Terbaru
            </h2>
            <p className="text-text/70 mt-2 text-base sm:text-lg">
              Arsip kegiatan operasional tingkat Kanwil.
            </p>
          </div>
          <Link
            href="/kegiatan"
            className="hidden sm:inline-flex items-center text-sm font-bold uppercase tracking-wider text-accent hover:text-primary-dark transition-colors group"
          >
            Lihat Semua Kegiatan{' '}
            <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {kanwilKegiatan.map((kegiatan) => (
            <ActivityCard key={kegiatan.id} {...kegiatan} />
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Link
            href="/kegiatan"
            className="flex items-center justify-center w-full py-3.5 bg-surface text-primary-dark font-bold text-sm uppercase tracking-wider rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            Lihat Semua Kegiatan
          </Link>
        </div>
      </section>
    </main>
  )
}