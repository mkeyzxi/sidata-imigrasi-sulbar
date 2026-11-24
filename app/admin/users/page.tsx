'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  AlertCircle,
  KeyRound,
  Building2,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  X,
} from 'lucide-react'
import { roleLabel, roleColor, AVAILABLE_UNITS } from '@/lib/utils/access'
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
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Profile | null>(null)
  
  const [supabase] = useState<ReturnType<typeof createSupabaseBrowserClient>>(() =>
    createSupabaseBrowserClient(),
  )

  // Form State untuk Tambah
  const [createForm, setCreateForm] = useState({
    email: '',
    full_name: '',
    role_type: 'admin', // 'superadmin' atau 'admin'
    unit_slug: 'imigrasi-mamuju',
    password: '',
  })

  // Form State untuk Edit
  const [editForm, setEditForm] = useState({
    full_name: '',
    role_type: 'admin',
    unit_slug: 'imigrasi-mamuju',
    password: '',
    is_active: true,
  })

  const { toasts, push, dismiss } = useToasts()
  const confirm = useConfirmDialog()

  // Ambil token sesi untuk API
  const getAccessToken = async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token ?? null
  }

  // Load Data
  const loadUsers = async () => {
    setLoading(true)
    try {
      // 1. Verifikasi profil admin saat ini
      const profileRes = await fetch('/api/auth/profile')
      if (!profileRes.ok) {
        router.replace('/login')
        return
      }
      const profileData = await profileRes.json()
      if (profileData.profile?.role !== 'superadmin') {
        router.replace('/admin')
        return
      }

      // 2. Ambil seluruh pengguna melalui API admin
      const token = await getAccessToken()
      const res = await fetch('/api/admin/users', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!res.ok) {
        throw new Error('Gagal memuat data pengguna.')
      }
      const data = await res.json()
      setProfiles(data.profiles || [])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat pengguna'
      push('error', msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const defaultPassword = (email: string) => {
    const prefix = email.split('@')[0] || 'User'
    return `${prefix}@2026`
  }

  // Handle Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    const email = createForm.email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Format email tidak valid.')
      return
    }
    if (!createForm.full_name.trim()) {
      setFormError('Nama lengkap wajib diisi.')
      return
    }

    if (createForm.role_type === 'admin' && !createForm.unit_slug) {
      setFormError('Unit kerja wajib dipilih untuk Admin Biasa.')
      return
    }

    const password = createForm.password.trim() || defaultPassword(email)
    if (password.length < 6) {
      setFormError('Password minimal 6 karakter.')
      return
    }

    setSaving(true)
    try {
      const token = await getAccessToken()
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          email,
          full_name: createForm.full_name.trim(),
          role: createForm.role_type === 'superadmin' ? 'superadmin' : 'admin',
          unit_slug: createForm.role_type === 'superadmin' ? null : createForm.unit_slug,
          password,
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Gagal membuat pengguna.')
      }

      push('success', `Pengguna ${email} berhasil dibuat dengan password: ${password}`)
      setShowCreateModal(false)
      setCreateForm({
        email: '',
        full_name: '',
        role_type: 'admin',
        unit_slug: 'imigrasi-mamuju',
        password: '',
      })
      await loadUsers()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan'
      setFormError(msg)
      push('error', msg)
    } finally {
      setSaving(false)
    }
  }

  // Buka Modal Edit
  const openEditModal = (p: Profile) => {
    setSelectedUser(p)
    const isSuper = p.role === 'superadmin'
    setEditForm({
      full_name: p.full_name || '',
      role_type: isSuper ? 'superadmin' : 'admin',
      unit_slug: p.unit_slug || 'kanwil-sulbar',
      password: '',
      is_active: p.is_active,
    })
    setFormError('')
    setShowEditModal(true)
  }

  // Handle Update User
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    setFormError('')

    if (!editForm.full_name.trim()) {
      setFormError('Nama lengkap wajib diisi.')
      return
    }

    setSaving(true)
    try {
      const token = await getAccessToken()
      const payload: Record<string, unknown> = {
        id: selectedUser.id,
        full_name: editForm.full_name.trim(),
        role: editForm.role_type === 'superadmin' ? 'superadmin' : 'admin',
        unit_slug: editForm.role_type === 'superadmin' ? null : editForm.unit_slug,
        is_active: editForm.is_active,
      }
      if (editForm.password.trim()) {
        payload.password = editForm.password.trim()
      }

      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Gagal memperbarui pengguna.')
      }

      push('success', `Data pengguna ${selectedUser.email} berhasil diperbarui`)
      setShowEditModal(false)
      setSelectedUser(null)
      await loadUsers()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan'
      setFormError(msg)
      push('error', msg)
    } finally {
      setSaving(false)
    }
  }

  // Handle Delete User
  const askDelete = (p: Profile) => {
    setPendingDelete(p)
    confirm.openDialog({
      title: 'Hapus Pengguna Secara Permanen?',
      description: `Akun ${p.email} (${p.full_name || 'Tanpa nama'}) akan dihapus dari sistem login dan data pengguna. Tindakan ini tidak dapat dibatalkan.`,
      confirmLabel: 'Ya, Hapus Permanen',
      danger: true,
    })
  }

  const handleDeleteUser = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      const token = await getAccessToken()
      const res = await fetch(`/api/admin/users?id=${pendingDelete.id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Gagal menghapus pengguna.')
      }

      confirm.closeDialog()
      push('success', `Pengguna ${pendingDelete.email} berhasil dihapus`)
      setPendingDelete(null)
      await loadUsers()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menghapus pengguna'
      push('error', msg)
    } finally {
      setDeleting(false)
    }
  }

  // Toggle Aktif Cepat
  const toggleActiveStatus = async (p: Profile) => {
    try {
      const token = await getAccessToken()
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          id: p.id,
          is_active: !p.is_active,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Gagal mengubah status pengguna.')
      }

      setProfiles((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, is_active: !item.is_active } : item)),
      )
      push('success', `Status ${p.email} diubah menjadi ${!p.is_active ? 'Aktif' : 'Nonaktif'}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengubah status'
      push('error', msg)
    }
  }

  const getUnitDisplayName = (unitSlug: string | null) => {
    if (!unitSlug) return 'Semua Unit (Pusat)'
    const found = AVAILABLE_UNITS.find((u) => u.id === unitSlug)
    return found ? found.name : unitSlug
  }

  if (loading) {
    return (
      <main className="min-h-[calc(100dvh-5rem)] bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary-dark" />
          <p className="text-text/60">Memuat manajemen pengguna...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100dvh-5rem)] bg-background py-10 px-6 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <ToastViewport toasts={toasts} onDismiss={dismiss} />

        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm font-bold text-text/60 hover:text-primary-dark transition-colors tracking-wider uppercase group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Kembali ke Dashboard
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-semibold text-xs tracking-wider uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Kontrol Akses Terpusat
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-primary-dark tracking-tight">
              Manajemen Pengguna
            </h1>
            <p className="text-text/70 text-sm mt-1">
              Kelola akun Super Admin dan Admin Unit (Kanwil Sulbar, Kanim Mamuju, Kanim Polman).
            </p>
          </div>

          <button
            onClick={() => {
              setFormError('')
              setShowCreateModal(true)
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-dark text-white font-bold text-sm rounded-xl hover:bg-primary transition-all shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4" />
            Buat Akun Baru
          </button>
        </div>

        {/* Users Table Card */}
        <div className="bg-surface rounded-2xl shadow-sm border border-border/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="text-left px-6 py-4 font-bold text-text/60 uppercase tracking-wider text-xs">
                    Pengguna
                  </th>
                  <th className="text-left px-6 py-4 font-bold text-text/60 uppercase tracking-wider text-xs">
                    Tingkat Peran
                  </th>
                  <th className="text-left px-6 py-4 font-bold text-text/60 uppercase tracking-wider text-xs">
                    Unit / Bidang Kerja
                  </th>
                  <th className="text-left px-6 py-4 font-bold text-text/60 uppercase tracking-wider text-xs">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 font-bold text-text/60 uppercase tracking-wider text-xs">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {profiles.map((p) => {
                  const isSuper = p.role === 'superadmin'
                  return (
                    <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-heading">{p.full_name || 'Tanpa Nama'}</div>
                        <div className="text-text/50 text-xs font-mono">{p.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${roleColor(
                            p.role,
                            p.unit_slug,
                          )}`}
                        >
                          {isSuper ? (
                            <ShieldAlert className="w-3.5 h-3.5" />
                          ) : (
                            <Building2 className="w-3.5 h-3.5" />
                          )}
                          {roleLabel(p.role, p.unit_slug)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-text/75 font-medium">
                        {getUnitDisplayName(p.unit_slug)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleActiveStatus(p)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            p.is_active
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          }`}
                          title="Klik untuk ubah status aktif/nonaktif"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.is_active ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          {p.is_active ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-2 text-text/60 hover:text-primary-dark hover:bg-primary-dark/10 rounded-lg transition-colors"
                            title="Edit Akun & Peran"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => askDelete(p)}
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Akun Pengguna"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL BUAT PENGGUNA BARU */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-2xl shadow-2xl max-w-lg w-full border border-border overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-dark/10 flex items-center justify-center text-primary-dark">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-black text-heading">Buat Akun Pengguna Baru</h2>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg text-text/40 hover:text-heading hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                {formError && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text/70 mb-1.5">
                    Email Pengguna
                  </label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background rounded-xl border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="misal: admin.mamuju@imigrasi.go.id"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text/70 mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.full_name}
                    onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background rounded-xl border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="misal: Petugas Kanim Mamuju"
                  />
                </div>

                {/* Pemilihan Role */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text/70 mb-1.5">
                    Peran / Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                        createForm.role_type === 'admin'
                          ? 'border-accent bg-accent/5 ring-1 ring-accent'
                          : 'border-border bg-background hover:bg-muted/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role_type"
                        value="admin"
                        checked={createForm.role_type === 'admin'}
                        onChange={() => setCreateForm({ ...createForm, role_type: 'admin' })}
                        className="sr-only"
                      />
                      <span className="font-bold text-sm text-heading">Admin Biasa</span>
                      <span className="text-xs text-text/60 mt-1">Mengurus unit / bidang kerja tertentu</span>
                    </label>

                    <label
                      className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                        createForm.role_type === 'superadmin'
                          ? 'border-accent bg-accent/5 ring-1 ring-accent'
                          : 'border-border bg-background hover:bg-muted/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role_type"
                        value="superadmin"
                        checked={createForm.role_type === 'superadmin'}
                        onChange={() => setCreateForm({ ...createForm, role_type: 'superadmin' })}
                        className="sr-only"
                      />
                      <span className="font-bold text-sm text-heading">Super Admin</span>
                      <span className="text-xs text-text/60 mt-1">Akses penuh seluruh unit & manajemen user</span>
                    </label>
                  </div>
                </div>

                {/* Jika Admin Biasa, pilih unit kerja */}
                {createForm.role_type === 'admin' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text/70 mb-1.5">
                      Tugaskan ke Unit Kerja
                    </label>
                    <select
                      value={createForm.unit_slug}
                      onChange={(e) => setCreateForm({ ...createForm, unit_slug: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background rounded-xl border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      {AVAILABLE_UNITS.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.name} ({unit.shortName})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text/70 mb-1.5">
                    Password Awal
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={createForm.password}
                      onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background rounded-xl border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent font-mono"
                      placeholder={createForm.email ? defaultPassword(createForm.email) : 'Minimal 6 karakter'}
                    />
                    <KeyRound className="w-4 h-4 text-text/40 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="mt-1.5 text-[11px] text-text/50">
                    Kosongkan untuk otomatis menggunakan password bawaan ({createForm.email ? defaultPassword(createForm.email) : '<prefix>@2026'}).
                  </p>
                </div>

                <div className="flex gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={saving}
                    className="flex-1 py-2.5 bg-background hover:bg-muted text-heading font-bold rounded-xl border border-border transition-colors text-sm"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 bg-primary-dark hover:bg-primary text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saving ? 'Membuat Akun...' : 'Simpan Pengguna'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL EDIT PENGGUNA */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-2xl shadow-2xl max-w-lg w-full border border-border overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-dark/10 flex items-center justify-center text-primary-dark">
                    <Edit2 className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-black text-heading">Edit Akun Pengguna</h2>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1 rounded-lg text-text/40 hover:text-heading hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                {formError && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text/70 mb-1.5">
                    Email
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedUser.email || ''}
                    className="w-full px-4 py-2.5 bg-muted/40 rounded-xl border border-border text-sm font-medium text-text/60 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text/70 mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background rounded-xl border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                {/* Pemilihan Role */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text/70 mb-1.5">
                    Peran / Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                        editForm.role_type === 'admin'
                          ? 'border-accent bg-accent/5 ring-1 ring-accent'
                          : 'border-border bg-background hover:bg-muted/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="edit_role_type"
                        value="admin"
                        checked={editForm.role_type === 'admin'}
                        onChange={() => setEditForm({ ...editForm, role_type: 'admin' })}
                        className="sr-only"
                      />
                      <span className="font-bold text-sm text-heading">Admin Biasa</span>
                      <span className="text-xs text-text/60 mt-1">Mengurus satu unit / bidang</span>
                    </label>

                    <label
                      className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                        editForm.role_type === 'superadmin'
                          ? 'border-accent bg-accent/5 ring-1 ring-accent'
                          : 'border-border bg-background hover:bg-muted/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="edit_role_type"
                        value="superadmin"
                        checked={editForm.role_type === 'superadmin'}
                        onChange={() => setEditForm({ ...editForm, role_type: 'superadmin' })}
                        className="sr-only"
                      />
                      <span className="font-bold text-sm text-heading">Super Admin</span>
                      <span className="text-xs text-text/60 mt-1">Akses penuh seluruh unit</span>
                    </label>
                  </div>
                </div>

                {/* Jika Admin Biasa, pilih unit kerja */}
                {editForm.role_type === 'admin' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text/70 mb-1.5">
                      Tugaskan ke Unit Kerja
                    </label>
                    <select
                      value={editForm.unit_slug}
                      onChange={(e) => setEditForm({ ...editForm, unit_slug: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background rounded-xl border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      {AVAILABLE_UNITS.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.name} ({unit.shortName})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Reset Password Opsional */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text/70 mb-1.5">
                    Ganti Password (Opsional)
                  </label>
                  <input
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background rounded-xl border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Kosongkan jika tidak ingin mengubah password"
                  />
                </div>

                {/* Status Aktif */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.is_active}
                      onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                      className="w-4 h-4 rounded text-accent focus:ring-accent border-border"
                    />
                    <span className="text-sm font-bold text-heading">Akun Aktif</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    disabled={saving}
                    className="flex-1 py-2.5 bg-background hover:bg-muted text-heading font-bold rounded-xl border border-border transition-colors text-sm"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 bg-primary-dark hover:bg-primary text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dialog Konfirmasi Hapus */}
        <ConfirmDialog
          state={{
            ...confirm.state,
            loading: deleting,
            confirmLabel: 'Ya, Hapus Permanen',
            danger: true,
          }}
          onConfirm={handleDeleteUser}
          onCancel={() => {
            confirm.closeDialog()
            setPendingDelete(null)
          }}
        />
      </div>
    </main>
  )
}
