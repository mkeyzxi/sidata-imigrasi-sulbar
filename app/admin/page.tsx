'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import {
  ArrowLeft,
  LogOut,
  Users,
  FileEdit,
  Database,
  LayoutDashboard,
  Building2,
  Shield,
  Newspaper,
  Plus,
  CheckCircle,
  X,
  Coins,
} from 'lucide-react'
import { roleLabel, roleColor } from '@/lib/utils/access'
import { UNIT_SLUG_MAP } from '@/lib/utils/access'

type User = {
  id: string
  email: string | null
  full_name: string | null
  role: string
  unit_slug: string | null
  avatar_url: string | null
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null)

  useEffect(() => {
    const client = createSupabaseBrowserClient()
    setSupabase(client)

    const checkAuth = async () => {
      const { data: { session } } = await client.auth.getSession()

      if (!session?.user) {
        window.location.href = '/login'
        return
      }

      // Ambil profil login via server endpoint (bebas infinite recursion)
      try {
        const res = await fetch('/api/auth/profile')
        if (res.ok) {
          const json = await res.json()
          if (json.profile) {
            setUser(json.profile as User)
            setLoading(false)
            return
          }
        }
      } catch {
        // Fallback ke browser client
      }

      const { data: profile } = await client
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        setUser(profile as User)
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <main className="min-h-[calc(100dvh-5rem)] bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary-dark border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text/60 font-medium">Memuat data profil...</p>
        </div>
      </main>
    )
  }

  const getRoleLabel = (role: string) => roleLabel(role)

  const getRoleColor = (role: string) => roleColor(role)

  return (
    <main className="min-h-[calc(100dvh-5rem)] bg-background py-12 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Back Navigation */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-bold text-text/60 hover:text-primary-dark transition-colors tracking-wider uppercase"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* User Profile Card */}
        <div className="bg-surface rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-primary-dark rounded-2xl flex items-center justify-center text-2xl font-black text-white">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-black text-primary-dark tracking-tight">
                  {user?.full_name}
                </h1>
                <p className="text-text/60 font-medium">{user?.email}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getRoleColor(user?.role || '')}`}>
                    {getRoleLabel(user?.role || '')}
                  </span>
                  {user?.unit_slug && (
                    <span className="text-xs text-text/50 font-medium">
                      Unit: {UNIT_SLUG_MAP[user.unit_slug]?.label ?? user.unit_slug}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>

        {/* Admin Dashboard */}
        <div className="bg-surface rounded-2xl shadow-sm p-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent mb-2">
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard Administrator
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-heading tracking-tight">
              Modul Pengelolaan Konten
            </h2>
            <p className="text-text/70 mt-2">
              Kelola berita, kegiatan, dan data sesuai peran Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Berita / Kegiatan */}
            <Link
              href={`/admin/kegiatan${user?.unit_slug ? `?unit=${user.unit_slug}` : ''}`}
              className="group flex flex-col p-6 bg-background rounded-xl border border-border hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                  <Newspaper className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-heading group-hover:text-primary-dark transition-colors">
                  Berita & Kegiatan
                </h3>
              </div>
              <p className="text-sm text-text/70">
                Tambah, edit, dan hapus artikel/kegiatan — tersimpan ke Supabase
                dan otomatis tampil di menu <Link href="/berita" className="text-accent hover:underline">Berita</Link>
              </p>
            </Link>

            {/* Data */}
            <Link
              href={`/admin/data${user?.unit_slug ? `?unit=${user.unit_slug}` : ''}`}
              className="group flex flex-col p-6 bg-background rounded-xl border border-border hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-heading group-hover:text-primary-dark transition-colors">
                  Data Statistik
                </h3>
              </div>
              <p className="text-sm text-text/70">
                Perbarui data paspor, izin tinggal, dan anggaran
              </p>
            </Link>

            {/* Serapan Anggaran Kanwil (kanwil & superadmin only) */}
            {(user?.role === 'superadmin' ||
              (user?.role === 'admin_kanwil' && user.unit_slug === 'kanwil-sulbar') ||
              (user?.role === 'admin' && user.unit_slug === 'kanwil-sulbar')) && (
              <Link
                href="/admin/serapan"
                className="group flex flex-col p-6 bg-background rounded-xl border border-border hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                    <Coins className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-heading group-hover:text-primary-dark transition-colors">
                    Serapan Anggaran
                  </h3>
                </div>
                <p className="text-sm text-text/70">
                  Input realisasi anggaran per bidang & bulan untuk Kanwil
                </p>
              </Link>
            )}

            {/* User Management (Superadmin only) */}
            {user?.role === 'superadmin' && (
              <Link
                href="/admin/users"
                className="group flex flex-col p-6 bg-background rounded-xl border border-border hover:shadow-md transition-all md:col-span-2"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-heading group-hover:text-primary-dark transition-colors">
                    Manajemen Pengguna
                  </h3>
                </div>
                <p className="text-sm text-text/70">
                  Kelola akun Super Admin dan Admin Unit (Kanwil Sulbar, Kanim Mamuju, Kanim Polman)
                </p>
              </Link>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-surface rounded-2xl shadow-sm p-8">
          <h3 className="text-lg font-bold text-heading mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            Informasi Akses
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-background rounded-xl p-4">
              <div className="text-sm font-bold text-heading mb-2">Superadmin</div>
              <p className="text-xs text-text/70">
                Akses penuh ke semua menu, user, dan unit
              </p>
            </div>
            <div className="bg-background rounded-xl p-4">
              <div className="text-sm font-bold text-heading mb-2">Admin Unit</div>
              <p className="text-xs text-text/70">
                Kelola berita dan data untuk unit masing-masing
              </p>
            </div>
            <div className="bg-background rounded-xl p-4">
              <div className="text-sm font-bold text-heading mb-2">Viewer</div>
              <p className="text-xs text-text/70">
                Hanya dapat melihat data, tidak bisa edit
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
