import Link from 'next/link'
import {
  ArrowLeft,
  ChevronRight,
  Database,
  Layers,
  FileCheck,
  ShieldCheck,
  Coins,
  ArrowRight,
  Building2,
  TrendingUp,
  BarChart3,
  Compass,
} from 'lucide-react'
import { units } from '@/lib/data/units'
import { mamujuPassportData, mamujuIzinTinggal } from '@/lib/data/mamuju'
import { polmanPassportData, polmanIzinTinggal } from '@/lib/data/polman'
import { formatNumber } from '@/lib/utils/format'

export default function DataPage() {
  const totalPasporSulbar = mamujuPassportData.total + polmanPassportData.total
  const totalIzinTinggalSulbar = mamujuIzinTinggal.total + polmanIzinTinggal.total

  const totalItk = mamujuIzinTinggal.itk + polmanIzinTinggal.itk
  const totalItap = mamujuIzinTinggal.itap + polmanIzinTinggal.itap
  const totalItas = mamujuIzinTinggal.itas + polmanIzinTinggal.itas

  // Helper untuk menghitung persentase proporsi
  const getPercentage = (value: number, total: number) => {
    if (!total) return 0
    return Math.round((value / total) * 100)
  }

  return (
    <main className="min-h-screen bg-background text-text pb-28 selection:bg-accent selection:text-white">
      {/* Contextual Nav & Clean Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-6 pt-8 mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-bold text-text/60 hover:text-primary-dark transition-colors tracking-wider uppercase group mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
          Kembali ke Halaman Utama
        </Link>

        <div className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-text/50">
          <Link href="/" className="hover:text-primary-dark transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3 h-3 text-accent" />
          <span className="text-primary-dark">Pusat Data</span>
        </div>
      </nav>

      {/* Header Section */}
      <header className="max-w-7xl mx-auto px-6 mb-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm tracking-wider uppercase mb-6">
            <Database className="w-3.5 h-3.5" />
            Agregat Regional Sulawesi Barat
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary-dark tracking-tight leading-[1.08] mb-6">
            Pusat Data Keimigrasian
          </h1>
          <p className="text-lg sm:text-lg text-text/75 leading-relaxed font-normal">
            Rekapitulasi terpusat statistik layanan dokumen perjalanan, izin tinggal orang asing,
            serta indikator operasional dari seluruh unit kerja di wilayah Sulawesi Barat.
          </p>
        </div>
      </header>

      {/* Quick Stats - Executive Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="bg-surface p-6 sm:p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-text/60">
                Unit Pelayanan
              </span>
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-primary-dark tracking-tight">03</div>
              <span className="text-sm font-medium text-text/60 mt-1 block">Kanwil, Kanim Mamuju, Kanim Polman</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface p-6 sm:p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-text/60">
                Akumulasi Paspor
              </span>
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <FileCheck className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-primary-dark tracking-tight">
                {formatNumber(totalPasporSulbar)}
              </div>
              <span className="text-sm font-medium text-text/60 mt-1 block">Dokumen Paspor diterbitkan</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface p-6 sm:p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-text/60">
                Izin Tinggal Aktif
              </span>
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-primary-dark tracking-tight">
                {formatNumber(totalIzinTinggalSulbar)}
              </div>
              <span className="text-sm font-medium text-text/60 mt-1 block">Total ITAS, ITAP, dan ITK</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-surface p-6 sm:p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-text/60">
                Periode Rekam
              </span>
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-heading tracking-tight">2026</div>
              <span className="text-sm font-medium text-text/60 mt-1 block">Tahun anggaran berjalan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Comparison Table Section with Visual Proportions */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="bg-surface p-6 sm:p-8 rounded-2xl shadow-sm">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              Komparasi Langsung
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-heading tracking-tight">
              Perbandingan Regional Kantor Imigrasi
            </h2>
            <p className="text-text/70 text-base mt-1">
              Perbandingan volume indikator utama antara Kantor Imigrasi Mamuju dan Polman Tahun 2026.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background rounded-xl">
                  <th className="p-4 text-sm font-bold uppercase tracking-wider text-text/60 rounded-l-xl w-2/6">
                    Indikator Layanan
                  </th>
                  <th className="p-4 text-sm font-bold uppercase tracking-wider text-text/60 text-center w-1/6">
                    Mamuju
                  </th>
                  <th className="p-4 text-sm font-bold uppercase tracking-wider text-text/60 text-center w-1/6">
                    Polman
                  </th>
                  <th className="p-4 text-sm font-bold uppercase tracking-wider text-text/60 text-center w-1/6">
                    Total Regional
                  </th>
                  <th className="p-4 text-sm font-bold uppercase tracking-wider text-text/60 text-center rounded-r-xl w-2/6">
                    Proporsi (Mamuju vs Polman)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/10 text-base">
                {/* Row 1: Total Paspor */}
                <tr className="hover:bg-background/50 transition-colors">
                  <td className="p-4 font-bold text-heading">Total Penerbitan Paspor</td>
                  <td className="p-4 text-center font-bold text-primary-dark">
                    {formatNumber(mamujuPassportData.total)}
                  </td>
                  <td className="p-4 text-center font-bold text-primary-dark">
                    {formatNumber(polmanPassportData.total)}
                  </td>
                  <td className="p-4 text-center font-black text-heading">
                    {formatNumber(totalPasporSulbar)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-accent w-8 text-right">
                        {getPercentage(mamujuPassportData.total, totalPasporSulbar)}%
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-background overflow-hidden flex">
                        <div
                          className="bg-accent h-full rounded-l-full transition-all duration-500"
                          style={{
                            width: `${getPercentage(mamujuPassportData.total, totalPasporSulbar)}%`,
                          }}
                        />
                        <div
                          className="bg-primary-dark h-full rounded-r-full transition-all duration-500"
                          style={{
                            width: `${getPercentage(polmanPassportData.total, totalPasporSulbar)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-primary-dark w-8">
                        {getPercentage(polmanPassportData.total, totalPasporSulbar)}%
                      </span>
                    </div>
                  </td>
                </tr>

                {/* Row 2: ITK */}
                <tr className="hover:bg-background/50 transition-colors">
                  <td className="p-4 font-semibold text-heading/90">Izin Tinggal Kunjungan (ITK)</td>
                  <td className="p-4 text-center font-semibold text-text/80">
                    {formatNumber(mamujuIzinTinggal.itk)}
                  </td>
                  <td className="p-4 text-center font-semibold text-text/80">
                    {formatNumber(polmanIzinTinggal.itk)}
                  </td>
                  <td className="p-4 text-center font-bold text-heading">
                    {formatNumber(totalItk)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-accent w-8 text-right">
                        {getPercentage(mamujuIzinTinggal.itk, totalItk)}%
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-background overflow-hidden flex">
                        <div
                          className="bg-accent h-full rounded-l-full transition-all duration-500"
                          style={{
                            width: `${getPercentage(mamujuIzinTinggal.itk, totalItk)}%`,
                          }}
                        />
                        <div
                          className="bg-primary-dark h-full rounded-r-full transition-all duration-500"
                          style={{
                            width: `${getPercentage(polmanIzinTinggal.itk, totalItk)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-primary-dark w-8">
                        {getPercentage(polmanIzinTinggal.itk, totalItk)}%
                      </span>
                    </div>
                  </td>
                </tr>

                {/* Row 3: ITAP */}
                <tr className="hover:bg-background/50 transition-colors">
                  <td className="p-4 font-semibold text-heading/90">Izin Tinggal Tetap (ITAP)</td>
                  <td className="p-4 text-center font-semibold text-text/80">
                    {formatNumber(mamujuIzinTinggal.itap)}
                  </td>
                  <td className="p-4 text-center font-semibold text-text/80">
                    {formatNumber(polmanIzinTinggal.itap)}
                  </td>
                  <td className="p-4 text-center font-bold text-heading">
                    {formatNumber(totalItap)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-accent w-8 text-right">
                        {getPercentage(mamujuIzinTinggal.itap, totalItap)}%
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-background overflow-hidden flex">
                        <div
                          className="bg-accent h-full rounded-l-full transition-all duration-500"
                          style={{
                            width: `${getPercentage(mamujuIzinTinggal.itap, totalItap)}%`,
                          }}
                        />
                        <div
                          className="bg-primary-dark h-full rounded-r-full transition-all duration-500"
                          style={{
                            width: `${getPercentage(polmanIzinTinggal.itap, totalItap)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-primary-dark w-8">
                        {getPercentage(polmanIzinTinggal.itap, totalItap)}%
                      </span>
                    </div>
                  </td>
                </tr>

                {/* Row 4: ITAS */}
                <tr className="hover:bg-background/50 transition-colors">
                  <td className="p-4 font-semibold text-heading/90">Izin Tinggal Terbatas (ITAS)</td>
                  <td className="p-4 text-center font-semibold text-text/80">
                    {formatNumber(mamujuIzinTinggal.itas)}
                  </td>
                  <td className="p-4 text-center font-semibold text-text/80">
                    {formatNumber(polmanIzinTinggal.itas)}
                  </td>
                  <td className="p-4 text-center font-bold text-heading">
                    {formatNumber(totalItas)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-accent w-8 text-right">
                        {getPercentage(mamujuIzinTinggal.itas, totalItas)}%
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-background overflow-hidden flex">
                        <div
                          className="bg-accent h-full rounded-l-full transition-all duration-500"
                          style={{
                            width: `${getPercentage(mamujuIzinTinggal.itas, totalItas)}%`,
                          }}
                        />
                        <div
                          className="bg-primary-dark h-full rounded-r-full transition-all duration-500"
                          style={{
                            width: `${getPercentage(polmanIzinTinggal.itas, totalItas)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-primary-dark w-8">
                        {getPercentage(polmanIzinTinggal.itas, totalItas)}%
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Data by Unit - Interactive Directory */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent mb-2">
            <Compass className="w-3.5 h-3.5" />
            Navigasi Sektoral
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-heading tracking-tight">
            Eksplorasi Berdasarkan Unit Kerja
          </h2>
          <p className="text-text/70 text-base mt-1">
            Pilih unit kerja di bawah untuk melihat rincian operasional secara mendalam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {units.map((unit) => (
            <Link
              key={unit.id}
              href={`/${unit.slug}`}
              className="group flex flex-col justify-between p-7 sm:p-8 bg-surface rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div>
                <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-2.5">
                  Unit Kerja {unit.id}
                </span>
                <h3 className="text-xl font-bold text-heading group-hover:text-primary-dark transition-colors mb-3">
                  {unit.shortName}
                </h3>
                <p className="text-sm sm:text-base text-text/70 leading-relaxed mb-6">{unit.description}</p>
              </div>

              <div className="flex items-center text-sm font-bold text-accent uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-300">
                Lihat Data Lengkap <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Data Categories Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent mb-2">
            <Layers className="w-3.5 h-3.5" />
            Pilar Informasi
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-heading tracking-tight">
            Klasifikasi Kategori Data
          </h2>
          <p className="text-text/70 text-base mt-1">Fokus utama cakupan informasi keimigrasian daerah.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Category 1 */}
          <div className="bg-surface p-6 sm:p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-5">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-heading text-lg mb-2">Penerbitan Paspor</h3>
            <p className="text-sm sm:text-base text-text/70 leading-relaxed">
              Statistik permohonan paspor baru serta penggantian akibat habis masa berlaku, hilang,
              maupun rusak.
            </p>
          </div>

          {/* Category 2 */}
          <div className="bg-surface p-6 sm:p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-heading text-lg mb-2">Izin Tinggal</h3>
            <p className="text-sm sm:text-base text-text/70 leading-relaxed">
              Pengelolaan data resmi pemegang ITK, ITAP, dan ITAS bagi Warga Negara Asing di wilayah
              Sulbar.
            </p>
          </div>

          {/* Category 3 */}
          <div className="bg-surface p-6 sm:p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-5">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-heading text-lg mb-2">Intelijen & Pengawasan</h3>
            <p className="text-sm sm:text-base text-text/70 leading-relaxed">
              Rekapitulasi kegiatan operasi mandiri, patroli, dan pengawasan gabungan orang asing.
            </p>
          </div>

          {/* Category 4 */}
          <div className="bg-surface p-6 sm:p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-5">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-heading text-lg mb-2">Anggaran & PNBP</h3>
            <p className="text-sm sm:text-base text-text/70 leading-relaxed">
              Transparansi realisasi serapan anggaran belanja serta pencapaian target Pendapatan
              Negara Bukan Pajak.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}