'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { roleFromEmail, roleLabel, roleColor, UNIT_SLUG_MAP } from '@/lib/utils/access'
import {
  useToasts,
  ToastViewport,
  useConfirmDialog,
  ConfirmDialog,
} from '@/components/admin/feedback'

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
  const router = useRouter()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [deactivating, setDeactivating] = useState(false)
  const [pendingDeactivate, setPendingDeactivate] = useState<Profile | null>(null)
  const [supabase] = useState<ReturnType<typeof createSupabaseBrowserClient>>(() =>
    createSupabaseBrowserClient(),
  )
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'viewer',
    unit_slug: '',
  })

  const { toasts, push, dismiss } = useToasts()
  const confirm = useConfirmDialog()

  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.replace('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      // Hanya superadmin yang boleh berada di halaman ini
      if (profile?.role !== 'superadmin') {
        router.replace('/admin')
        return
      }

      const { data: allProfiles } = await supabase.from('profiles').select('*')
      setProfiles(allProfiles || [])
      setLoading(false)
    }
    loadData()
  }, [router, supabase])

  const getRoleLabel = (role: string) => roleLabel(role)

  const getRoleColor = (role: string) => roleColor(role)

  /** Jika email resmi, isi role & unit_slug otomatis. */
  const handleEmailChange = (value: string) => {
    const match = roleFromEmail(value)
    setFormData((prev) => ({
      ...prev,
      email: value,
      role: match.role,
      unit_slug: match.unit_slug ?? (prev.role && prev.role.startsWith('admin') ? prev.unit_slug : ''),
    }))
  }

  const defaultPassword = (email: string) => email.split('@')[0] + '@2026'

  const validateForm = (): string => {
    const email = formData.email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Format email tidak valid'
    if (!formData.full_name.trim()) return 'Nama lengkap wajib diisi'
    if (formData.role.startsWith('admin') && !formData.unit_slug) {
      return 'Pilih unit kerja untuk peran admin unit'
    }
    if (profiles.some((p) => p.email?.toLowerCase() === email)) {
      return 'Email sudah terdaftar'
    }
    return ''
  }

  const handleCreateUser = async () => {
    const invalid = validateForm()
    if (invalid) {
      setCreateError(invalid)
      return
    }
    setCreating(true)
    setCreateError('')

    try {
      const { data: { session } } = await supabase!.auth.getSession()
      if (!session) throw new Error('Sesi berakhir, silakan masuk ulang.')

      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          full_name: formData.full_name.trim(),
          role: formData.role,
          unit_slug: formData.unit_slug,
        }),
      })

      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Gagal membuat pengguna.')

      const { data: allProfiles } = await supabase!.from('profiles').select('*')
      setProfiles(allProfiles || [])
      setShowModal(false)
      setFormData({ email: '', full_name: '', role: 'viewer', unit_slug: '' })
      push(
        'success',
        `Pengguna dibuat. Password: ${json.password ?? defaultPassword(formData.email)}`,
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan.'
      setCreateError(message)
      push('error', message)
    } finally {
      setCreating(false)
    }
  }

  const askDeactivate = (p: Profile) => {
    setPendingDeactivate(p)
    confirm.openDialog({
      title: 'Nonaktifkan pengguna?',
      description: `${p.full_name || p.email} tidak akan bisa masuk sampai diaktifkan kembali.`,
      confirmLabel: 'Ya, Nonaktifkan',
      danger: true,
    })
  }

  const handleDeactivate = async () => {
    if (!supabase || !pendingDeactivate) return
    setDeactivating(true)
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', pendingDeactivate.id)
    setDeactivating(false)
    confirm.closeDialog()

    if (error) {
      push('error', 'Gagal menonaktifkan: ' + error.message)
      setPendingDeactivate(null)
      return
    }
    setProfiles((prev) =>
      prev.map((p) => (p.id === pendingDeactivate.id ? { ...p, is_active: false } : p)),
    )
    push('success', 'Pengguna dinonaktifkan')
    setPendingDeactivate(null)
  }

  const toggleActive = async (profile: Profile) => {
    if (!supabase) return
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: !profile.is_active, updated_at: new Date().toISOString() })
      .eq('id', profile.id)
    if (error) {
      push('error', 'Gagal mengubah status: ' + error.message)
      return
    }
    setProfiles((prev) =>
      prev.map((p) => (p.id === profile.id ? { ...p, is_active: !p.is_active } : p)),
    )
    push('success', profile.is_active ? 'Pengguna dinonaktifkan' : 'Pengguna diaktifkan')
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
        <ToastViewport toasts={toasts} onDismiss={dismiss} />

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
              {profiles.length} pengguna terdaftar · hanya superadmin yang mengakses halaman ini
            </p>
          </div>

          <button
            onClick={() => {
              setCreateError('')
              setShowModal(true)
            }}
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
                      <div className="font-bold text-heading">{p.full_name || '—'}</div>
                      <div className="text-text/50 text-xs">{p.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getRoleColor(p.role)}`}>
                        {getRoleLabel(p.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text/60">
                      {p.unit_slug
                        ? UNIT_SLUG_MAP[p.unit_slug]?.label ?? p.unit_slug
                        : '—'}
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
                        onClick={() => askDeactivate(p)}
                        disabled={!p.is_active}
                        className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        title={p.is_active ? 'Nonaktifkan pengguna' : 'Sudah nonaktif'}
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

        <p className="mt-3 text-xs text-text/50">
          Catatan: menghapus pengguna dilakukan dengan menonaktifkan akun agar riwayat
          datanya tetap utuh. Klik status &quot;Aktif&quot; untuk mengaktifkan kembali.
        </p>

        {/* Create User Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-2xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl font-black text-heading mb-4">
                  Tambah Pengguna Baru
                </h2>

                {createError && (
                  <div className="mb-4 px-3 py-2.5 bg-red-50 text-red-700 text-sm rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{createError}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-heading mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className="w-full px-4 py-2.5 bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                      placeholder="nama@sidata-imigrasi-sulbar.go.id"
                    />
                    <p className="mt-1 text-[11px] text-text/50">
                      Email resmi otomatis menyetel peran &amp; unit yang sesuai.
                    </p>
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

                  {formData.role.startsWith('admin') && (
                    <div>
                      <label className="block text-sm font-semibold text-heading mb-1.5">
                        Unit Kerja
                      </label>
                      <select
                        value={formData.unit_slug}
                        onChange={(e) => setFormData({ ...formData, unit_slug: e.target.value })}
                        className="w-full px-4 py-2.5 bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                      >
                        <option value="">— Pilih unit —</option>
                        <option value="kanwil-sulbar">Kanwil Sulbar</option>
                        <option value="imigrasi-mamuju">Imigrasi Mamuju</option>
                        <option value="imigrasi-polman">Imigrasi Polman</option>
                      </select>
                    </div>
                  )}

                  <div className="bg-background rounded-xl p-3 text-xs text-text/60">
                    Password otomatis:{' '}
                    <span className="font-bold text-heading">
                      {formData.email
                        ? defaultPassword(formData.email.trim().toLowerCase())
                        : '<bagian-email>@2026'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={creating}
                    className="flex-1 py-2.5 bg-background text-heading font-bold rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleCreateUser}
                    disabled={creating}
                    className="flex-1 py-2.5 bg-primary-dark text-white font-bold rounded-xl hover:bg-primary transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                    {creating ? 'Membuat...' : 'Buat User'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          state={{
            ...confirm.state,
            loading: deactivating,
            confirmLabel: 'Ya, Nonaktifkan',
            danger: true,
          }}
          onConfirm={handleDeactivate}
          onCancel={() => {
            confirm.closeDialog()
            setPendingDeactivate(null)
          }}
        />
      </div>
    </main>
  )
}
