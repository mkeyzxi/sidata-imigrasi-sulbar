'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useState} from 'react'

import Image from 'next/image'

const navLinks = [
  {href: '/', label: 'Beranda'},
  {href: '/kegiatan', label: 'Kegiatan'},
  {href: '/data', label: 'Data'},
  {href: '/tentang', label: 'Tentang'},
]

// Halaman unit kerja dianggap bagian dari "Unit Kerja" (anchor beranda)
const UNIT_WORK_PATTERNS = ['/kanwil-sulbar', '/imigrasi-mamuju', '/imigrasi-polman']

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const isUnitKerjaActive = UNIT_WORK_PATTERNS.some((p) =>
    pathname.startsWith(p),
  )

  if (pathname === '/') {
    return null
  }

  // Kelas bersama untuk link menu (desktop & mobile)
  const linkClass = (active: boolean) =>
    `relative transition-all duration-300 ${
      active
        ? 'text-[var(--color-primary)] font-semibold'
        : 'text-[var(--color-text)] hover:text-[var(--color-primary)]'
    }`

  return (
    <nav className="bg-white border-b border-[var(--color-border)] sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/lambang.png"
              alt="Logo Imigrasi Sulbar"
              width={48}
              height={48}
              className="w-10 h-10 object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-[var(--color-primary)] font-bold text-lg tracking-tight uppercase">
                SI DATA
              </span>
              <span className="text-[var(--color-primary)] font-bold text-xs tracking-tight uppercase opacity-80">
                Imigrasi Sulbar
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClass(isActive(link.href))}
              >
                {link.label}
                {/* Indikator aktif: animasi scale dari tengah */}
                <span
                  className={`absolute -bottom-[13px] left-1/2 h-[2.5px] -translate-x-1/2 rounded-full bg-[var(--color-primary)] transition-all duration-300 ${
                    isActive(link.href)
                      ? 'w-full scale-x-100 opacity-100'
                      : 'w-0 scale-x-0 opacity-0'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* <div className="hidden md:block">
            <Link
              href="/login"
              className="px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-dark)]"
            >
              Masuk
            </Link>
          </div> */}
          <div className="hidden md:block">
            <Link
              href="/hubungi"
              className={`px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-all duration-300 ${
                pathname.startsWith('/hubungi')
                  ? 'ring-2 ring-[var(--color-primary-dark)] ring-offset-2 scale-[1.02]'
                  : 'hover:scale-[1.02]'
              }`}
            >
              Hubungi Kami
            </Link>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[var(--color-text)]"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-[var(--color-border)]">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className={linkClass(isActive('/'))}
              >
                Beranda
              </Link>
              <Link
                href="/#unit-kerja"
                onClick={() => setIsOpen(false)}
                className={linkClass(isUnitKerjaActive)}
              >
                Unit Kerja
              </Link>
              <Link
                href="/kegiatan"
                onClick={() => setIsOpen(false)}
                className={linkClass(isActive('/kegiatan'))}
              >
                Kegiatan
              </Link>
              <Link
                href="/data"
                onClick={() => setIsOpen(false)}
                className={linkClass(isActive('/data'))}
              >
                Data
              </Link>
              <Link
                href="/tentang"
                onClick={() => setIsOpen(false)}
                className={linkClass(isActive('/tentang'))}
              >
                Tentang
              </Link>
              {/* <Link
                href="/login"
                className="inline-block px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-dark)] text-center"
                onClick={() => setIsOpen(false)}
              >
                Masuk
              </Link> */}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
