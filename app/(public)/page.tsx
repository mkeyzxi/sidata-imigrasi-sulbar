import Link from 'next/link'
import Image from 'next/image'
import {ArrowRight} from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Beranda | SI Data Imigrasi Sulbar',
  description: 'Portal data keimigrasian terpadu seluruh unit kerja di wilayah Sulawesi Barat. Akses informasi resmi, transparan, dan terintegrasi.',
}

const units = [
  {
    id: '01',
    code: 'KANWIL',
    name: 'Kantor Wilayah\nDirektorat Jenderal Imigrasi Sulawesi Barat',
    desc: 'Pusat koordinasi dan pengawasan keimigrasian wilayah Sulawesi Barat.',
    href: '/kanwil-sulbar',
    image: '/hero-image/kanwil-sulbar.webp',
  },
  {
    id: '02',
    code: 'KANIM MAMUJU',
    name: 'Kantor Imigrasi Kelas II\nNon TPI Mamuju',
    desc: 'Pelayanan dokumen perjalanan dan pengawasan keimigrasian Mamuju.',
    href: '/imigrasi-mamuju',
    image: '/hero-image/kanwil-mamuju.webp',
  },
  {
    id: '03',
    code: 'KANIM POLMAN',
    name: 'Kantor Imigrasi Kelas II\nNon TPI Polman',
    desc: 'Pelayanan keimigrasian wilayah Polewali Mandar dan sekitarnya.',
    href: '/imigrasi-polman',
    image: '/hero-image/kanwil-polman.webp',
  },
]

export default function Home() {
  return (
    <main className="w-full min-h-[90dvh] lg:h-[90dvh] lg:max-h-[100dvh] lg:overflow-hidden bg-background text-text flex flex-col lg:items-center justify-start lg:justify-center p-6 lg:p-10 lg:lg:p-12 selection:bg-accent selection:text-white">
      <div className="w-full max-w-[1600px] h-full min-h-0 flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch justify-between">
        {/* LEFT PANEL */}
        <div className="w-full lg:w-5/12 min-w-0 flex flex-col justify-between py-2 lg:py-6 z-10 shrink-0">
          {/* TITLE & DESCRIPTION */}
          <div className="my-auto py-4 lg:py-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary-dark tracking-tight leading-[1.08] mb-6">
              SI DATA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-dark via-primary to-accent">
                IMIGRASI SULBAR
              </span>
            </h1>

            <p className="text-lg sm:text-lg text-text/75 leading-relaxed max-w-lg font-normal">
              Portal data keimigrasian terpadu seluruh unit kerja di wilayah Sulawesi Barat. Akses
              informasi resmi, transparan, dan terintegrasi.
            </p>
          </div>

          {/* FOOTER INSIDE LEFT PANEL */}
          <div className="hidden sm:flex items-center gap-3 text-sm text-text/50">
            <span className="font-medium">Kemenimipas RI</span>

            <span className="w-1 h-1 rounded-full bg-text/30" />

            <span>Korelatif & Terintegrasi</span>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full lg:w-7/12 min-w-0 min-h-0 flex flex-col sm:flex-row lg:flex-row gap-4 sm:gap-5 overflow-visible lg:overflow-hidden py-2">
          {units.map((unit) => (
            <Link
              key={unit.id}
              href={unit.href}
              className="
                group
                relative
                flex-1
                min-w-0
                min-h-0
                min-h-[280px]
                sm:min-h-0
                flex
                flex-col
                justify-end
                overflow-hidden
                rounded-3xl
                bg-surface
                transition-all
                duration-500
                ease-out
                hover:flex-[1.25]
                shadow-sm
                hover:shadow-2xl
                hover:-translate-y-1
                cursor-pointer
                outline-none
                focus-visible:ring-4
                focus-visible:ring-accent/60
                focus-visible:ring-offset-2
                animate-card-breathe
                hover:animate-none
              "
            >
              {/* BACKGROUND IMAGE */}
              <div className="absolute inset-0 w-full h-full bg-muted overflow-hidden">
                <Image
                  src={unit.image}
                  alt={`Gedung ${unit.name.replace('\n', ' ')}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="
                    object-cover
                    object-center
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-110
                  "
                />

                {/* OVERLAY */}
                <div
                  className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/90
                  via-black/50
                  to-black/20
                  opacity-90
                  group-hover:opacity-80
                  transition-opacity
                  duration-500
                  
                "
                />
              </div>

              {/* TOP BADGE */}
              <div
                className="
                absolute
                top-5
                left-5
                right-5
                z-10
                flex
                items-center
                justify-between
              "
              >
                <span
                  className="
                  px-3.5
                  py-1.5
                  rounded-full
                  text-sm
                  font-semibold
                  tracking-wider
                  bg-white/20
                  backdrop-blur-md
                  text-white
                  shadow-sm
                "
                >
                  {unit.id} • {unit.code}
                </span>

                {/* <div
                  className="
                  w-9
                  h-9
                  rounded-full
                  bg-white/20
                  backdrop-blur-md
                 flex
                 
                 
                  items-center
                  justify-center
                  text-white
                  opacity-40
                  group-hover:opacity-100
                  transition-all
                  duration-300
                  group-hover:scale-110
                    hidden
                  hover:visible

                "
                > */}
                <div
                  className="
    w-6
    h-6
    rounded-full
    bg-accent/20
    backdrop-blur-md
    flex
    items-center
    justify-center
    text-white
    opacity-0
    group-hover:opacity-100
    transition-all
    duration-300
    group-hover:scale-110
    pointer-events-none
    group-hover:pointer-events-auto
    border-accent
    border-2
  "
                >
                  <ArrowRight
                    className="
                    w-4
                    h-4
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                  
                  "
                  />
                </div>
              </div>

              {/* HIGHLIGHT RING — terlihat saat hover/focus */}
              <div
                className="
                absolute
                inset-0
                z-20
                pointer-events-none
                rounded-3xl
                ring-2
                ring-inset
                ring-accent
                opacity-0
                group-hover:opacity-100
                focus-visible:opacity-100
                transition-opacity
                duration-300
              "
              />

              {/* CARD CONTENT */}
              <div
                className="
                relative
                z-10
                p-6
                md:p-8
                flex
                flex-col
                justify-end
                min-w-0
              "
              >
                <h2
                  className="
                  text-xl
                  sm:text-2xl
                  font-bold
                  text-white
                  leading-snug
                  mb-2
                  group-hover:text-accent
                  transition-colors
                  duration-300
                "
                >
                  {unit.name.split('\n').map((line, idx) => (
                    <span key={idx} className="block">
                      {line}
                    </span>
                  ))}
                </h2>

                {/* DESCRIPTION */}
                <p
                  className="
                  text-sm
                  sm:text-base
                  text-white/70
                  line-clamp-2
                  max-h-0
                  opacity-0
                  group-hover:max-h-20
                  group-hover:opacity-100
                  transition-all
                  duration-500
                  ease-in-out
                  font-light
                "
                >
                  {unit.desc}
                </p>

                {/* ACTION — pill shape agar jelas bisa diklik */}
                <div
                  className="
                  mt-4
                  inline-flex
                  items-center
                  gap-2
                  self-start
                  px-3.5
                  py-1.5
                  rounded-full
                  text-xs
                  sm:text-sm
                  font-semibold
                  text-white
                  bg-accent/90
                  shadow-md
                  shadow-accent/25
                  transition-all
                  duration-300
                  group-hover:bg-accent
                  group-hover:gap-3
                "
                >
                  <span>Lihat Data Unit</span>

                  <ArrowRight
                    className="
                    w-3.5
                    h-3.5
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
