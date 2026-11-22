'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import {
  ArrowLeft,
  Users,
  Plus,
  Shield,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react'

type Profile = {
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

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'viewer',
    unit_slug: '',
  })

  useEffect(() => {
    const client = createSupabaseBrowserClient()
    setSupabase(client)

    const loadData = async () => {
      const { data: { session } } = await client.auth.getSession()
      if (!session?.user) {
        window.location.href = '/login'
        return
      }

      const { data: profile } = await client
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      setUser(profile as Profile | null)

      if (profile?.role !== 'superadmin') {
        window.location.href = '/admin'
        return
      }

      const { data: allProfiles } = await client.from('profiles').select('*')
      setProfiles(allProfiles || [])
      setLoading(false)
    }
    loadData()
  }, [])

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'superadmin': return 'Super Admin'
      case 'admin_kanwil': return 'Admin Kanwil'
      case 'admin_mamuju': return 'Admin Mamuju'
      case 'admin_polman': return 'Admin Polman'
      default: return 'Viewer'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'bg-accent/10 text-accent'
      case 'admin_kanwil': return 'bg-blue-100 text-blue-700'
      case 'admin_mamuju': return 'bg-green-100 text-green-700'
      case 'admin_polman': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const handleCreateUser = async () => {
    if (!supabase) return
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.email.split('@')[0] + '@2026',
        email_confirm: true,
        user_metadata: {
          full_name: formData.full_name,
        },
      })

      if (error) throw error

      // Update the profile
      await supabase.from('profiles').update({
        role: formData.role,
        unit_slug: formData.unit_slug || null,
      }).eq('id', data.user!.id)

      // Refresh list
      const { data: allProfiles } = await supabase.from('profiles').select('*')
      setProfiles(allProfiles || [])
      setShowModal(false)
    } catch (error: any) {
      alert('Error: ' + error.message)
    }
  }

  const handleDeleteProfile = async (id: string) => {
    if (!supabase) return
    if (!confirm('Hapus user ini dari sistem?')) return

    // Deactivate instead of delete (safer)
    await supabase.from('profiles').update({ is_active: false }).eq('id', id)
    setProfiles(profiles.filter((p) => p.id !== id))
  }

  const toggleActive = async (profile: Profile) => {
    if (!supabase) return
    await supabase.from('profiles').update({ is_active: !profile.is_active }).eq('id', profile.id)
    setProfiles(profiles.map((p) =>
      p.id === profile.id ? { ...p, is_active: !p.is_active } : p
    ))
  }

  if (loading) {
    return (
      <main className="min-h-[calc(100dvh-5rem)] bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary-dark" />
          <p className="text-text/60">Memuat daftar pengguna...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100dvh-5rem)] bg-background py-12 px-6">
      <div className="max-w-5xl mx-auto">

        <div className="mb-10">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm font-bold text-text/60 hover:text-primary-dark transition-colors tracking-wider uppercase"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Admin
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-primary-dark tracking-tight">
              Manajemen Pengguna
            </h1>
            <p className="text-text/70 mt-1">
              {profiles.length} pengguna terdaftar
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-dark text-white font-bold text-sm rounded-xl hover:bg-primary transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah User
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-surface rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="text-left px-6 py-4 font-bold text-text/60 uppercase tracking-wider text-xs">
                    Nama & Email
                  </th>
                  <th className="text-left px-6 py-4 font-bold text-text/60 uppercase tracking-wider text-xs">
                    Peran
                  </th>
                  <th className="text-left px-6 py-4 font-bold text-text/60 uppercase tracking-wider text-xs">
                    Unit
                  </th>
                  <th className="text-left px-6 py-4 font-bold text-text/60 uppercase tracking-wider text-xs">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 font-bold text-text/60 uppercase tracking-wider text-xs">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-4">
                      <div className="font-bold text-heading">{p.full_name}</div>
                      <div className="text-text/50 text-xs">{p.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getRoleColor(p.role)}`}>
                        {getRoleLabel(p.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text/60">
                      {p.unit_slug || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(p)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          p.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {p.is_active ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteProfile(p.id)}
                        className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create User Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-2xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl font-black text-heading mb-4">
                  Tambah Pengguna Baru
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-heading mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                      placeholder="nama@sidata-imigrasi-sulbar.go.id"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-heading mb-1.5">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                      placeholder="Nama Lengkap"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-heading mb-1.5">
                      Peran
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="admin_kanwil">Admin Kanwil Sulbar</option>
                      <option value="admin_mamuju">Admin Imigrasi Mamuju</option>
                      <option value="admin_polman">Admin Imigrasi Polman</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                  </div>

                  {formData.role !== 'viewer' && formData.role !== 'superadmin' && (
                    <div>
                      <label className="block text-sm font-semibold text-heading mb-1.5">
                        Unit Kerja
                      </label>
                      <select
                        value={formData.unit_slug}
                        onChange={(e) => setFormData({ ...formData, unit_slug: e.target.value })}
                        className="w-full px-4 py-2.5 bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                      >
                        <option value="kanwil-sulbar">Kanwil Sulbar</option>
                        <option value="imigrasi-mamuju">Imigrasi Mamuju</option>
                        <option value="imigrasi-polman">Imigrasi Polman</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 bg-background text-heading font-bold rounded-xl hover:bg-muted transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleCreateUser}
                    className="flex-1 py-2.5 bg-primary-dark text-white font-bold rounded-xl hover:bg-primary transition-colors"
                  >
                    Buat User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
