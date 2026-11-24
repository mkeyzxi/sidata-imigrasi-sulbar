'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  FileEdit,
  Database,
  Users,
  LogOut,
  Shield,
  Menu,
  ChevronRight,
} from 'lucide-react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { roleLabel, UNIT_SLUG_MAP } from '@/lib/utils/access'

type Profile = {
  id: string
  full_name: string | null
  email: string | null
  role: string
  unit_slug: string | null
}

const navItems: Array<{
  href: string
  label: string
  icon: typeof LayoutDashboard
  superadminOnly?: boolean
}> = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/kegiatan', label: 'Berita & Kegiatan', icon: FileEdit },
  { href: '/admin/data', label: 'Data Statistik', icon: Database },
  // Hanya superadmin yang boleh mengelola pengguna
  { href: '/admin/users', label: 'Manajemen Pengguna', icon: Users, superadminOnly: true },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Ambil profil login: dipakai untuk menyembunyikan menu yang tidak berhak
  useEffect(() => {
    const client = createSupabaseBrowserClient()
    let cancelled = false

    const load = async () => {
      const {
        data: { session },
      } = await client.auth.getSession()
      if (!session?.user) {
        router.replace('/login')
        return
      }
      // Tampilkan inisial dari email sesegera sesi tersedia (tidak perlu menunggu query profil)
      setUserEmail(session.user.email ?? null)

      const { data } = await client
        .from('profiles')
        .select('id, full_name, email, role, unit_slug')
        .eq('id', session.user.id)
        .single()
      if (cancelled) return
      if (data) setProfile(data as Profile)
    }
    load()

    return () => {
      cancelled = true
    }
  }, [router])

  // Jaga kedua: role selain superadmin tidak boleh berada di /admin/users
  useEffect(() => {
    if (profile && profile.role !== 'superadmin' && pathname === '/admin/users') {
      router.replace('/admin')
    }
  }, [profile, pathname, router])

  const visibleNavItems = navItems.filter(
    (item) => !item.superadminOnly || profile?.role === 'superadmin',
  )

  const initials = (() => {
    const source = profile?.full_name || userEmail || ''
    const parts = source.split(/[\s@._-]+/).filter(Boolean)
    if (parts.length === 0) return 'U'
    return parts
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join('')
  })()

  return (
    <div className="flex h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-0 z-50 flex flex-col w-72 bg-surface border-r border-[var(--color-border)] transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:static lg:inset-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-[var(--color-border)] lg:px-4">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image
              src="/lambang.png"
              alt="Logo Imigrasi Sulbar"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
            <span className="font-bold text-lg tracking-tight text-[var(--color-heading)] uppercase">
              SI DATA
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-[var(--color-text)] hover:bg-background"
            aria-label="Close sidebar"
          >
            <span className="w-[1.5px] h-5 bg-current block" />
            <span className="w-[1.5px] h-5 bg-current block mt-0.5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'text-[var(--color-text)] hover:bg-background hover:text-[var(--color-primary)]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="py-6 px-4 border-t border-[var(--color-border)]">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors rounded-xl"
          >
            <ChevronRight className="w-4 h-4" />
            Kembali ke Situs
          </Link>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top bar */}
        <header className="h-16 bg-surface border-b border-[var(--color-border)] flex items-center justify-between px-6 lg:px-8 z-20 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-md text-[var(--color-text)] hover:bg-background"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden lg:flex items-center gap-2.5">
              <Image
                src="/lambang.png"
                alt="Logo Imigrasi Sulbar"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-lg tracking-tight text-[var(--color-primary)] uppercase">SI DATA</span>
              <span className="font-medium text-sm text-[var(--color-text)]">Admin Panel</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text)] hover:bg-background transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-xs font-semibold text-[var(--color-heading)]">
                  {profile?.full_name || userEmail || ''}
                </span>
                <span className="text-[10px] text-[var(--color-text)]/70">
                  {profile
                    ? roleLabel(profile.role) +
                      (profile.unit_slug
                        ? ' · ' + (UNIT_SLUG_MAP[profile.unit_slug]?.label ?? profile.unit_slug)
                        : '')
                    : ''}
                </span>
              </div>
              <Shield className="w-4 h-4" />
            </button>

            {/* User dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-[var(--color-border)] rounded-xl shadow-lg py-2 z-50">
                <Link
                  href="/"
                  className="flex items-center justify-between px-4 py-2.5 text-sm text-[var(--color-text)] hover:bg-background transition-colors"
                >
                  <span>Kembali ke Situs</span>
                </Link>
                <div className="border-t border-[var(--color-border)] py-1" />
                <button
                  onClick={async () => {
                    setIsUserMenuOpen(false)
                    const client = createSupabaseBrowserClient()
                    await client.auth.signOut()
                    router.replace('/login')
                  }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <span>Keluar</span>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
