import Link from 'next/link'
import { units } from '@/lib/data/units'
import { ArrowLeft, Target, Layers, Users, ShieldCheck, Info, ArrowRight } from 'lucide-react'

export default function TentangPage() {
  return (
    <main className="min-h-screen bg-background text-text pb-28 selection:bg-accent selection:text-white">
      {/* Contextual Back Navigation */}
      <nav className="max-w-4xl mx-auto px-6 pt-8 mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-bold text-text/60 hover:text-primary-dark transition-colors tracking-wider uppercase group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
          Kembali ke Halaman Utama
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6">
        {/* Header Section - Clean & Editorial */}
        <header className="mb-16">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm tracking-wider uppercase mb-6">
            <Info className="w-3.5 h-3.5" />
            Informasi Sistem
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary-dark tracking-tight leading-[1.08] mb-6">
            Sistem Informasi Data Keimigrasian Terintegrasi
          </h1>

          <p className="text-lg sm:text-lg text-text/75 leading-relaxed font-normal">
            Platform satu pintu untuk menelusuri data layanan, serapan anggaran, dan kegiatan
            operasional dari seluruh unit kerja keimigrasian di wilayah Sulawesi Barat.
          </p>
        </header>

        {/* Content Flow */}
        <div className="space-y-16">
          {/* Section: Latar Belakang & Tujuan */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
            <div className="md:col-span-4">
              <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent mb-2">
                <Target className="w-3.5 h-3.5" />
                Visi & Misi
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-heading tracking-tight flex items-center gap-2.5">
                <Target className="w-5 h-5 text-accent shrink-0" />
                Tujuan Sistem
              </h2>
            </div>
            <div className="md:col-span-8 bg-surface p-7 sm:p-8 rounded-2xl shadow-sm text-text/80 leading-relaxed text-base sm:text-lg space-y-4">
              <p>
                SI DATA IMIGRASI SULBAR dibangun untuk mengeliminasi fragmentasi informasi. Sistem
                ini menyajikan transparansi data secara terstruktur tanpa mengharuskan pengguna
                mencari melalui berbagai platform yang berbeda.
              </p>
              <p>
                Fokus utama sistem ini adalah kemudahan akses informasi publik seperti data
                penerbitan paspor, statistik izin tinggal, hingga pemantauan kegiatan Intel-WAS
                secara langsung berdasarkan unit kerja masing-masing.
              </p>
            </div>
          </section>

          {/* Section: Tiga Unit Utama */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
            <div className="md:col-span-4">
              <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent mb-2">
                <Layers className="w-3.5 h-3.5" />
                Jangkauan Data
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-heading tracking-tight flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-accent shrink-0" />
                Cakupan Unit
              </h2>
            </div>
            <div className="md:col-span-8">
              <div className="grid grid-cols-1 gap-3.5">
                {units.map((unit, index) => (
                  <Link
                    key={unit.id}
                    href={unit.slug}
                    className="group flex items-center justify-between p-5 bg-surface rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-black text-accent text-base sm:text-lg transition-transform duration-300 group-hover:scale-110">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-bold text-heading group-hover:text-primary-dark transition-colors text-base sm:text-lg">
                        {unit.name.replace('\n', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center text-sm font-bold text-accent uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-300">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Section: Target Pengguna */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
            <div className="md:col-span-4">
              <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                Otorisasi & Akses
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-heading tracking-tight flex items-center gap-2.5">
                <Users className="w-5 h-5 text-accent shrink-0" />
                Pengguna
              </h2>
            </div>
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 sm:p-7 bg-surface rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-heading mb-2 text-lg">Akses Publik</h3>
                <p className="text-sm sm:text-base text-text/70 leading-relaxed">
                  Masyarakat dan instansi terkait dapat langsung mengakses seluruh data agregat
                  tanpa perlu melakukan autentikasi atau <em>login</em>.
                </p>
              </div>
              <div className="p-6 sm:p-7 bg-surface rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-heading mb-2 text-lg">Administrator</h3>
                <p className="text-sm sm:text-base text-text/70 leading-relaxed">
                  Pegawai berwenang memiliki akses ke <em>Content Management System</em> (CMS) untuk
                  pembaruan data layanan dan dokumentasi.
                </p>
              </div>
            </div>
          </section>

          {/* Notice Box */}
          <section className="pt-4">
            <div className="flex items-start gap-4 p-6 sm:p-7 bg-accent/10 rounded-2xl text-heading shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center text-accent shrink-0 mt-0.5">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-wider text-accent mb-1.5">
                  Status Purwarupa (Prototype)
                </h3>
                <p className="text-sm sm:text-base text-text/80 leading-relaxed">
                  Data statistik, nominal anggaran, dan daftar kegiatan yang disajikan saat ini
                  bersifat simulasi (<em>dummy</em>) untuk keperluan demonstrasi arsitektur UI/UX. Sistem
                  belum terhubung ke <em>database</em> produksi keimigrasian.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}