import Link from 'next/link'
import {
  ArrowLeft,
  Lock,
  Layers,
  FileEdit,
  ShieldCheck,
  Coins,
  Image as ImageIcon,
  ChevronRight,
  Network,
  TrendingUp,
} from 'lucide-react'

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background text-text py-16 px-6">
      {/* Contextual Back Navigation */}
      <div className="max-w-3xl mx-auto mb-10">
        <Link
          href="/"
          className="inline-flex items-center text-base font-semibold text-muted hover:text-primary transition-colors tracking-wide"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          KEMBALI KE HALAMAN UTAMA
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Administrative Header Box */}
        <div className="bg-surface border border-border p-8 md:p-12 rounded-sm mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-soft text-primary rounded-sm flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-accent block">
                Sistem Terbatas
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-primary-dark tracking-tight">
                Panel Kontrol Administrator
              </h1>
            </div>
          </div>

          <p className="text-muted leading-relaxed mb-8 max-w-2xl">
            Modul manajemen konten terpusat (CMS) untuk pengelolaan unit kerja, data layanan
            keimigrasian, penambahan kegiatan, serta pencatatan realisasi anggaran saat ini berada
            dalam tahap purwarupa *(Prototype Phase)* dan dijadwalkan pada fase pengembangan
            berikutnya.
          </p>

          {/* Roadmap Fitur CMS */}
          <div className="border border-border bg-background p-6 rounded-sm mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-heading mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              Modul Manajemen yang Akan Hadir:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base text-text">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-accent" />
                <span>Autentikasi & Hak Akses Pegawai</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Network className="w-4 h-4 text-accent" />
                <span>Manajemen Struktur Unit & Bidang</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FileEdit className="w-4 h-4 text-accent" />
                <span>CRUD Data Arsip & Kegiatan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span>Pembaruan Statistik Paspor & IT</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Coins className="w-4 h-4 text-accent" />
                <span>Pencatatan Serapan Anggaran & PNBP</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 text-accent" />
                <span>Media Library & Dokumentasi Foto</span>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="flex-center justify-center px-6 py-3 bg-primary text-white font-semibold text-base rounded-sm hover:bg-primary-dark transition-colors text-center"
            >
              Kembali ke Beranda
            </Link>

            <Link
              href="/data"
              className="flex-center justify-center px-6 py-3 bg-surface text-primary font-semibold text-base rounded-sm border border-secondary hover:bg-blue-soft/30 transition-colors text-center"
            >
              Eksplorasi Data Publik
            </Link>
          </div>
        </div>

        {/* System Status Footer */}
        <div className="text-center">
          <span className="text-sm font-medium text-muted uppercase tracking-wider">
            Status Sistem: Prototype Phase 1 — UI/UX Mode Terstruktur
          </span>
        </div>
      </div>
    </main>
  )
}
