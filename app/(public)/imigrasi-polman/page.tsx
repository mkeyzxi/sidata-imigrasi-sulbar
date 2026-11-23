import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Building2,
  BarChart3,
  UserCheck,
  ShieldAlert,
  Coins,
} from 'lucide-react'
import {
  polmanPassportData,
  polmanIzinTinggal,
  polmanKegiatan,
  polmanSerapanBulanan,
} from '@/lib/data/polman'
import { formatNumber, formatCurrency } from '@/lib/utils/format'
import ActivityCard from '@/components/activities/ActivityCard'

export default function ImigrasiPolmanPage() {
  const totalGantiPaspor = polmanPassportData.breakdown.penggantian
  const totalAnggaranTerserap = polmanSerapanBulanan.reduce((sum, item) => sum + item.jumlah, 0)

  return (
    <main className="min-h-screen bg-background text-text pb-28 selection:bg-accent selection:text-white">
      {/* Contextual Nav & Clean Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-6 pt-8 mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-bold text-text/60 hover:text-primary-dark transition-colors tracking-wider uppercase mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
          Kembali ke Halaman Utama
        </Link>

        <div className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-text/40">
          <Link href="/" className="hover:text-primary transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3 h-3 text-text/30" />
          <span className="text-primary-dark font-bold">Imigrasi Polman</span>
        </div>
      </nav>

      {/* Hero Section - Soft Editorial Banner */}
      <header className="max-w-7xl mx-auto px-6 mb-20 lg:flex lg:items-center lg:gap-16">
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm tracking-wider uppercase mb-6">
            <Building2 className="w-3.5 h-3.5" />
            Kantor Imigrasi Kelas II Non TPI
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary-dark tracking-tight leading-[1.08] mb-6">
            Imigrasi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-dark via-primary to-accent">
              Polewali Mandar
            </span>
          </h1>

          <p className="text-lg sm:text-lg text-text/75 leading-relaxed max-w-lg font-normal">
            Pusat pelayanan keimigrasian terpadu meliputi penerbitan dokumen perjalanan, pengelolaan
            izin tinggal orang asing, serta pengawasan keimigrasian di wilayah Polewali Mandar.
          </p>
        </div>

        {/* Foto Gedung - Floating Modern Card */}
        <div className="lg:w-1/2 relative h-[320px] md:h-[420px] w-full bg-surface overflow-hidden rounded-3xl shadow-xl transition-all duration-500 hover:shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80"
            alt="Gedung Kantor Imigrasi Polman"
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Glass Badge */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10">
            <span className="px-4 py-2 rounded-full text-sm font-semibold tracking-wider bg-white/20 backdrop-blur-md text-white shadow-sm">
              WILAYAH SULAWESI BARAT
            </span>
          </div>
        </div>
      </header>

      {/* SECTION 1: PELAYANAN PASPOR */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            Statistik Layanan
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-heading tracking-tight">Penerbitan Paspor</h2>
        </div>

        {/* 3 Main Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <span className="text-sm font-bold uppercase tracking-widest text-text/50 block mb-3">
              Total Penerbitan
            </span>
            <div className="text-4xl font-black text-primary-dark tracking-tight">
              {formatNumber(polmanPassportData.total)}
            </div>
            <span className="text-sm text-text/50 mt-2 block font-medium">Akumulasi Tahun 2026</span>
          </div>

          <div className="bg-surface p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <span className="text-sm font-bold uppercase tracking-widest text-text/50 block mb-3">
              Paspor Baru
            </span>
            <div className="text-4xl font-black text-heading tracking-tight">
              {formatNumber(polmanPassportData.breakdown.baru)}
            </div>
            <span className="text-sm text-text/50 mt-2 block font-medium">Permohonan pemohon baru</span>
          </div>

          <div className="bg-surface p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <span className="text-sm font-bold uppercase tracking-widest text-text/50 block mb-3">
              Penggantian
            </span>
            <div className="text-4xl font-black text-heading tracking-tight">
              {formatNumber(totalGantiPaspor)}
            </div>
            <span className="text-sm text-text/50 mt-2 block font-medium">Habis berlaku, rusak, atau hilang</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: IZIN TINGGAL */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            Keimigrasian Orang Asing
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-heading tracking-tight">Data Izin Tinggal (ITAS · ITAP · ITK)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <span className="text-sm font-bold uppercase tracking-widest text-text/50 mb-2 block">
              Total Aktif
            </span>
            <div className="text-4xl font-black text-primary-dark mb-1 tracking-tight">
              {formatNumber(polmanIzinTinggal.total)}
            </div>
            <span className="text-sm text-text/50 font-medium">Seluruh pemegang izin tinggal</span>
          </div>

          <div className="bg-surface p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <span className="text-sm font-bold uppercase tracking-widest text-text/50 mb-2 block">
              ITK
            </span>
            <div className="text-3xl font-black text-heading mb-1 tracking-tight">
              {formatNumber(polmanIzinTinggal.itk)}
            </div>
            <span className="text-sm text-text/50 font-medium">Izin Tinggal Kunjungan</span>
          </div>

          <div className="bg-surface p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <span className="text-sm font-bold uppercase tracking-widest text-text/50 mb-2 block">
              ITAP
            </span>
            <div className="text-3xl font-black text-heading mb-1 tracking-tight">
              {formatNumber(polmanIzinTinggal.itap)}
            </div>
            <span className="text-sm text-text/50 font-medium">Izin Tinggal Tetap</span>
          </div>

          <div className="bg-surface p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <span className="text-sm font-bold uppercase tracking-widest text-text/50 mb-2 block">
              ITAS
            </span>
            <div className="text-3xl font-black text-heading mb-1 tracking-tight">
              {formatNumber(polmanIzinTinggal.itas)}
            </div>
            <span className="text-sm text-text/50 font-medium">Izin Tinggal Terbatas</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: GIAT INTEL-WAS (Timeline) */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            Pengawasan & Intelijen
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-heading tracking-tight">GIAT Intel-WAS</h2>
        </div>

        <div className="max-w-3xl space-y-6">
          {polmanKegiatan.map((kegiatan) => (
            <div key={kegiatan.id} className="relative pl-8 border-l-2 border-accent/20 pb-2 last:pb-0">
              {/* Indicator Dot */}
              <div className="absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full bg-accent ring-4 ring-background flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-background" />
              </div>

              <div className="bg-surface p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-text/60">
                    <Calendar className="w-3.5 h-3.5 text-accent" />
                    <span>
                      {new Date(kegiatan.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className="self-start sm:self-auto px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full uppercase tracking-wider">
                    {kegiatan.type}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-heading mb-2">{kegiatan.title}</h3>
                <p className="text-base text-text/75 leading-relaxed mb-4">{kegiatan.description}</p>

                <div className="flex items-center gap-1.5 text-sm text-text/60 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  <span>{kegiatan.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: DOKUMENTASI KEGIATAN */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-heading tracking-tight">Dokumentasi Kegiatan</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {polmanKegiatan.map((kegiatan) => (
            <ActivityCard key={kegiatan.id} {...kegiatan} />
          ))}
        </div>
      </section>

      {/* SECTION 5: KEUANGAN / SERAPAN ANGGARAN */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent mb-2">
            <Coins className="w-3.5 h-3.5" />
            Pengelolaan Keuangan
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-heading tracking-tight">Serapan Anggaran 2026</h2>
          <p className="text-text/70 mt-2 text-base sm:text-lg">
            Laporan realisasi anggaran bulanan Kantor Imigrasi Polman.
          </p>
        </div>

        {/* Serapan Bulanan Table */}
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
                {polmanSerapanBulanan.map((item, index) => {
                  const maxValue = Math.max(...polmanSerapanBulanan.map((d) => d.jumlah))
                  const percentage = maxValue > 0 ? (item.jumlah / maxValue) * 100 : 0

                  return (
                    <tr key={index} className="hover:bg-muted/40 transition-colors rounded-xl">
                      <td className="px-4 py-4 font-semibold text-heading rounded-l-xl">{item.bulan}</td>
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
                    {formatCurrency(totalAnggaranTerserap)}
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