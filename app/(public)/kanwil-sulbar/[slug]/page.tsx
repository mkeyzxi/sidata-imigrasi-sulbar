import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Activity, PieChart, CalendarDays, FolderOpen, Coins } from 'lucide-react'
import { kanwilBidang, kanwilKegiatan, kanwilSerapanBidang } from '@/lib/data/kanwil'
import { formatCurrency } from '@/lib/utils/format'
import ActivityCard from '@/components/activities/ActivityCard'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BidangDetailPage({ params }: PageProps) {
  const { slug } = await params
  const bidang = kanwilBidang.find((b) => b.slug === slug)

  if (!bidang) {
    notFound()
  }

  const kegiatanBidang = kanwilKegiatan.filter((k) => k.bidang === bidang.name)
  const serapanData = kanwilSerapanBidang[bidang.id as keyof typeof kanwilSerapanBidang] || []
  const totalSerapan = serapanData.reduce((sum, item) => sum + item.jumlah, 0)

  return (
    <main className="min-h-screen bg-background text-text pb-28 selection:bg-accent selection:text-white">
      {/* Contextual Nav & Clean Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-6 pt-8 mb-8">
        <Link
          href="/kanwil-sulbar"
          className="inline-flex items-center text-sm font-bold text-text/60 hover:text-primary-dark transition-colors tracking-wider uppercase mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
          Kembali ke Kanwil Sulbar
        </Link>

        <div className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-text/40">
          <Link href="/" className="hover:text-primary transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3 h-3 text-text/30" />
          <Link href="/kanwil-sulbar" className="hover:text-primary transition-colors">
            Kanwil Sulbar
          </Link>
          <ChevronRight className="w-3 h-3 text-text/30" />
          <span className="text-primary-dark font-bold">{bidang.name}</span>
        </div>
      </nav>

      {/* Header - Editorial Style */}
      <header className="max-w-7xl mx-auto px-6 mb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm tracking-wider uppercase mb-6">
            <FolderOpen className="w-3.5 h-3.5" />
            Bidang / Bagian Kanwil
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary-dark tracking-tight leading-[1.08] mb-6">
            {bidang.name}
          </h1>

          <p className="text-lg sm:text-lg text-text/75 leading-relaxed font-normal">
            {bidang.description}
          </p>
        </div>
      </header>

      {/* Executive Meta Stats - Floating Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 text-text/50 mb-3">
              <Activity className="w-4 h-4 text-accent" />
              <span className="text-sm font-bold uppercase tracking-widest">Total Kegiatan</span>
            </div>
            <div className="text-4xl font-black text-primary-dark tracking-tight">
              {String(kegiatanBidang.length).padStart(2, '0')}
            </div>
          </div>

          <div className="bg-surface p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 text-text/50 mb-3">
              <PieChart className="w-4 h-4 text-accent" />
              <span className="text-sm font-bold uppercase tracking-widest">Serapan Anggaran</span>
            </div>
            <div className="text-3xl font-black text-primary-dark tracking-tight">
              {formatCurrency(totalSerapan)}
            </div>
          </div>

          <div className="bg-surface p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 text-text/50 mb-3">
              <CalendarDays className="w-4 h-4 text-accent" />
              <span className="text-sm font-bold uppercase tracking-widest">Periode Data</span>
            </div>
            <div className="text-xl font-bold text-heading">
              Januari - September <br className="hidden md:block" /> 2026
            </div>
          </div>
        </div>
      </section>

      {/* Kegiatan Section */}
      {kegiatanBidang.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent mb-2">
              <FolderOpen className="w-3.5 h-3.5" />
              Dokumentasi
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-heading tracking-tight">
              Arsip Kegiatan
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {kegiatanBidang.map((kegiatan) => (
              <ActivityCard key={kegiatan.id} {...kegiatan} />
            ))}
          </div>
        </section>
      )}

      {/* Anggaran Section - Clean Seamless Financial Table */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent mb-2">
            <Coins className="w-3.5 h-3.5" />
            Pengelolaan Keuangan
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-heading tracking-tight">
            Laporan Serapan Anggaran
          </h2>
          <p className="text-text/70 mt-2 text-base sm:text-lg">
            Detail realisasi keuangan bulanan tahun 2026.
          </p>
        </div>

        <div className="bg-surface rounded-2xl shadow-sm p-6 md:p-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm font-bold uppercase tracking-wider text-text/50">
                  <th className="pb-4 px-4 w-1/3">Bulan</th>
                  <th className="pb-4 px-4 text-right w-1/3">Realisasi (Rp)</th>
                  <th className="pb-4 px-4 w-1/3">Proporsi</th>
                </tr>
              </thead>
              <tbody className="text-base">
                {serapanData.map((item, index) => {
                  const maxValue = Math.max(...serapanData.map((d) => d.jumlah))
                  const percentage = maxValue > 0 ? (item.jumlah / maxValue) * 100 : 0

                  return (
                    <tr key={index} className="hover:bg-muted/40 transition-colors rounded-xl">
                      <td className="px-4 py-4 font-semibold text-heading rounded-l-xl">
                        {item.bulan}
                      </td>
                      <td className="px-4 py-4 font-bold text-primary-dark text-right tracking-tight">
                        {formatCurrency(item.jumlah)}
                      </td>
                      <td className="px-4 py-4 rounded-r-xl">
                        <div className="w-full bg-muted/30 rounded-full h-2 flex items-center overflow-hidden">
                          <div
                            className="bg-secondary h-2 rounded-full transition-all duration-700"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td className="pt-6 px-4 font-black text-heading uppercase text-sm tracking-wider">
                    Total Realisasi
                  </td>
                  <td className="pt-6 px-4 font-black text-primary-dark text-right text-lg tracking-tight">
                    {formatCurrency(totalSerapan)}
                  </td>
                  <td className="pt-6 px-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}