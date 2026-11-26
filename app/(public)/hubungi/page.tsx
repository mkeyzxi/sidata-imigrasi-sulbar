'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  Info,
  Building2,
} from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hubungi Kami',
  description: 'Hubungi kantor terkait untuk pertanyaan, saran, dan laporan seputar layanan keimigrasian di Sulawesi Barat.',
}

const contactInfo = [
  {
    icon: Building2,
    title: 'Kantor Wilayah Direktorat Jenderal Imigrasi Sulawesi Barat',
    items: [
      'Jl. KH. Ahmad Dahlan No. 1, Mamuju, Sulawesi Barat',
      '(0241) 767112',
      'kanwil.sulbar@imigrasi.go.id',
    ],
  },
  {
    icon: Building2,
    title: 'Kantor Imigrasi Mamuju',
    items: [
      'Jl. Lanto Djupe No. 36, Mamuju, Sulawesi Barat',
      '(0241) 762543',
      'imigrasi.mamuju@imigrasi.go.id',
    ],
  },
  {
    icon: Building2,
    title: 'Kantor Imigrasi Polewali Mandar',
    items: [
      'Jl. Soekarno-Hatta, Polewali Mandar, Sulawesi Barat',
      '(0241) 473201',
      'imigrasi.polman@imigrasi.go.id',
    ],
  },
]

const serviceHours = [
  { day: 'Senin – Jumat', time: '08.00 – 16.00 WITA' },
  { day: 'Sabtu', time: '08.00 – 12.00 WITA' },
  { day: 'Minggu & Hari Libur', time: 'Kantor Tutup' },
]

export default function HubungiPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Prototype: belum terhubung ke backend, tampilkan konfirmasi saja
    setSubmitted(true)
    setForm({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSubmitted(false), 5000)
  }

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

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section - Clean & Editorial */}
        <header className="mb-16">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm tracking-wider uppercase mb-6">
            <MessageSquare className="w-3.5 h-3.5" />
            Layanan Publik
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary-dark tracking-tight leading-[1.08] mb-6">
            Hubungi Kami
          </h1>

          <p className="text-lg sm:text-lg text-text/75 leading-relaxed font-normal">
            Kami siap membantu. Hubungi kantor terkait melalui data di bawah ini
            atau kirimkan pesan melalui formulir untuk pertanyaan, saran, dan
            laporan seputar layanan keimigrasian.
          </p>
        </header>

        {/* Content Flow */}
        <div className="space-y-16">
          {/* Section: Kontak Unit Kerja */}
          <section>
            <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent mb-4">
              <Building2 className="w-3.5 h-3.5" />
              Data Kantor
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contactInfo.map((unit) => (
                <div
                  key={unit.title}
                  className="p-6 sm:p-7 bg-surface rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                    <unit.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-heading mb-3 text-base leading-snug">
                    {unit.title}
                  </h3>
                  <ul className="space-y-2.5 text-sm text-text/70 leading-relaxed">
                    {unit.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        {i === 0 ? (
                          <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        ) : i === 1 ? (
                          <Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        ) : (
                          <Mail className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        )}
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Formulir + Jam Layanan */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
            {/* Form */}
            <div className="md:col-span-8">
              <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent mb-2">
                <Send className="w-3.5 h-3.5" />
                Kirim Pesan
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-heading tracking-tight mb-6 flex items-center gap-2.5">
                {/* <Send className="w-5 h-5 text-accent shrink-0" /> */}
                Formulir Kontak
              </h2>

              <form
                onSubmit={handleSubmit}
                className="bg-surface p-7 sm:p-8 rounded-2xl shadow-sm space-y-5"
              >
                {submitted && (
                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl p-4">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    Pesan Anda telah diterima. Tim kami akan segera
                    menindaklanjuti. Terima kasih!
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-heading mb-1.5"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Nama Anda"
                      required
                      className="w-full px-4 py-3 bg-background rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30 transition-all text-heading placeholder:text-text/40"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-heading mb-1.5"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="nama@email.com"
                      required
                      className="w-full px-4 py-3 bg-background rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30 transition-all text-heading placeholder:text-text/40"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-heading mb-1.5"
                  >
                    Subjek
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    placeholder="Topik atau hal yang ingin ditanyakan"
                    required
                    className="w-full px-4 py-3 bg-background rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30 transition-all text-heading placeholder:text-text/40"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-heading mb-1.5"
                  >
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Tulis pesan Anda di sini..."
                    required
                    className="w-full px-4 py-3 bg-background rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30 transition-all text-heading placeholder:text-text/40 resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-primary-dark text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-sm hover:bg-primary transition-all"
                >
                  <Send className="w-4 h-4" />
                  Kirim Pesan
                </button>
              </form>
            </div>

            {/* Jam Layanan */}
            <div className="md:col-span-4">
              <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent mb-2">
                <Clock className="w-3.5 h-3.5" />
                Waktu Kantor
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-heading tracking-tight mb-6 flex items-center gap-2.5">
                {/* <Clock className="w-5 h-5 text-accent shrink-0" /> */}
                Jam Layanan
              </h2>

              <div className="bg-surface p-6 sm:p-7 rounded-2xl shadow-sm space-y-4">
                {serviceHours.map((jam) => (
                  <div
                    key={jam.day}
                    className="flex items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)] last:border-0 last:pb-0"
                  >
                    <span className="text-sm font-semibold text-heading">
                      {jam.day}
                    </span>
                    <span className="text-sm text-text/60">{jam.time}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-4 p-6 sm:p-7 bg-accent/10 rounded-2xl text-heading shadow-xs mt-6">
                <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center text-accent shrink-0 mt-0.5">
                  <Info className="w-5 h-5" />
                </div>
                <p className="text-sm sm:text-base text-text/80 leading-relaxed">
                  Layanan publik dilayani pada jam kerja resmi. Untuk
                  penanganan darurat keimigrasian, hubungi unit terkait
                  melalui nomor yang tertera di atas.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
