'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useState} from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  if (pathname === '/') {
    return null
  }

  return (
    <nav className="bg-white border-b border-[var(--color-border)] sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-[var(--color-primary)] font-bold text-lg tracking-tight">
              SI DATA
            </span>
            <span className="text-[var(--color-primary)] font-bold text-sm tracking-tight">
              IMIGRASI SULBAR
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-[var(--color-text)] hover:text-[var(--color-primary)] font-medium text-sm"
            >
              Beranda
            </Link>

            <Link
              href="/kegiatan"
              className="text-[var(--color-text)] hover:text-[var(--color-primary)] font-medium text-sm"
            >
              Kegiatan
            </Link>
            <Link
              href="/data"
              className="text-[var(--color-text)] hover:text-[var(--color-primary)] font-medium text-sm"
            >
              Data
            </Link>
            <Link
              href="/tentang"
              className="text-[var(--color-text)] hover:text-[var(--color-primary)] font-medium text-sm"
            >
              Tentang
            </Link>
          </div>

          <div className="hidden md:block">
            <Link
              href="/admin"
              className="px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-dark)]"
            >
              Masuk
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
                className="text-[var(--color-text)] hover:text-[var(--color-primary)] font-medium"
                onClick={() => setIsOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="/#unit-kerja"
                className="text-[var(--color-text)] hover:text-[var(--color-primary)] font-medium"
                onClick={() => setIsOpen(false)}
              >
                Unit Kerja
              </Link>
              <Link
                href="/kegiatan"
                className="text-[var(--color-text)] hover:text-[var(--color-primary)] font-medium"
                onClick={() => setIsOpen(false)}
              >
                Kegiatan
              </Link>
              <Link
                href="/data"
                className="text-[var(--color-text)] hover:text-[var(--color-primary)] font-medium"
                onClick={() => setIsOpen(false)}
              >
                Data
              </Link>
              <Link
                href="/tentang"
                className="text-[var(--color-text)] hover:text-[var(--color-primary)] font-medium"
                onClick={() => setIsOpen(false)}
              >
                Tentang
              </Link>
              <Link
                href="/admin"
                className="inline-block px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-dark)] text-center"
                onClick={() => setIsOpen(false)}
              >
                Masuk
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
