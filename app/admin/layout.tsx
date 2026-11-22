/**
 * Admin layout with sidebar navigation
 */
import Link from 'next/link'
import { LayoutDashboard, Users, FileEdit, Database } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-[calc(100dvh-5rem)] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-surface border-r border-border py-8 px-4">
        <div className="mb-8">
          <Link href="/admin" className="flex flex-col leading-tight">
            <span className="text-[var(--color-primary)] font-bold text-lg tracking-tight">
              SI DATA
            </span>
            <span className="text-[var(--color-primary)] font-bold text-sm tracking-tight">
              ADMIN PANEL
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-heading hover:bg-background transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-accent" />
            Dashboard
          </Link>

          <Link
            href="/admin/kegiatan"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text/70 hover:bg-background transition-colors"
          >
            <FileEdit className="w-4 h-4" />
            Berita & Kegiatan
          </Link>

          <Link
            href="/admin/data"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text/70 hover:bg-background transition-colors"
          >
            <Database className="w-4 h-4" />
            Data Statistik
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text/70 hover:bg-background transition-colors"
          >
            <Users className="w-4 h-4" />
            Manajemen Pengguna
          </Link>
        </nav>

        <div className="mt-8 pt-8 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text/50 hover:text-heading transition-colors"
          >
            ← Kembali ke Situs
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}
