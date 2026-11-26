'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Loader2,
  X,
  AlertCircle,
} from 'lucide-react'
import {
  canManageUnit,
  roleLabel,
  UNIT_SLUG_MAP,
  effectiveAccess,
  syncOfficialProfile,
} from '@/lib/utils/access'
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
  is_active: boolean
}

type Kegiatan = {
  id: number
  unit_id: string
  bidang_id: string | null
  title: string
  description: string | null
  date: string
  location: string | null
  type: string | null
  image_url: string | null
  published: boolean
  created_by: string | null
  created_at: string | null
  updated_at: string | null
}

type Unit = {
  id: string
  name: string
  short_name: string | null
  type: string
  description: string | null
  image_url: string | null
  slug: string
  created_at: string | null
  updated_at: string | null
}

function AdminKegiatanContent() {
  const router = useRouter()
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Kegiatan | null>(null)
  const [saving, setSaving] = useState(false)
  const [savingError, setSavingError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Kegiatan | null>(null)
  const [supabase] = useState<ReturnType<typeof createSupabaseBrowserClient>>(() =>
    createSupabaseBrowserClient(),
  )
  const { toasts, push, dismiss } = useToasts()
  const confirm = useConfirmDialog()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    type: 'Koordinasi',
    image_url: '',
    unit_id: '',
    published: true,
  })

  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/login')
        return
      }

      // Ambil profil login via server endpoint (bebas infinite recursion)
      let resolved: Profile | null = null
      try {
        const res = await fetch('/api/auth/profile')
        if (res.ok) {
          const json = await res.json()
          resolved = json.profile as Profile
        }
      } catch {
        // Fallback
      }

      if (!resolved) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        resolved = profile as Profile | null
      }

      setUser(resolved)

      const { data: unitsData } = await supabase
        .from('units')
        .select('*')
      setUnits(unitsData || [])

      const localAccess = effectiveAccess(resolved)

      // Ambil daftar kegiatan via API admin (semua unit agar seluruh data
      // yang akan tampil di halaman /kegiatan dapat dikelola & dipantau)
      try {
        const token = session.access_token
        const res = await fetch('/api/admin/kegiatan?scope=all', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (res.ok) {
          const json = await res.json()
          setKegiatan(json.kegiatan || [])
          setLoading(false)
          return
        }
      } catch {
        // Fallback ke browser client
      }

      let query = supabase
        .from('kegiatan')
        .select('*')
        .order('date', { ascending: false })

      if (localAccess.role !== 'superadmin' && localAccess.unit_slug) {
        // Viewer/unit admin yang API-nya belum tersedia: tetap batasi sesuai unit
        query = query.eq('unit_id', localAccess.unit_slug)
      }

      const { data: kegiatanData } = await query
      setKegiatan(kegiatanData || [])
      setLoading(false)
    }
    loadData()
  }, [supabase, router])

  // Peran efektif: email resmi jadi sumber kebenaran bila role di DB belum terset
  const access = useMemo(() => effectiveAccess(user), [user])

  // Tombol aksi hanya untuk superadmin & admin unit
  const canManageAny = access.role === 'superadmin' || access.role.startsWith('admin')

  // Pilihan unit untuk dropdown (fallback ke daftar statis bila tabel kosong)
  const unitOptions = useMemo(() => {
    if (units.length > 0) return units.map((u) => ({ id: u.id, label: u.short_name || u.id }))
    return Object.entries(UNIT_SLUG_MAP).map(([id, v]) => ({ id, label: v.label }))
  }, [units])

  const canManageLocalUnit = (unitId: string) => canManageUnit(access, unitId)

  const openModal = (k?: Kegiatan) => {
    setSavingError('')
    if (k) {
      setEditing(k)
      setFormData({
        title: k.title,
        description: k.description || '',
        date: k.date,
        location: k.location || '',
        type: k.type || 'Koordinasi',
        image_url: k.image_url || '',
        unit_id: k.unit_id,
        published: k.published,
      })
    } else {
      setEditing(null)
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
        type: 'Koordinasi',
        image_url: '',
        unit_id: access.unit_slug || unitOptions[0]?.id || '',
        published: true,
      })
    }
    setShowModal(true)
  }

  const validateForm = (): string => {
    if (!formData.title.trim()) return 'Judu kegiatan wajib diisi'
    if (!formData.date) return 'Tanggal wajib diisi'
    if (!formData.unit_id) return 'Pilih unit kerja'
    if (!canManageUnit(access, formData.unit_id)) {
      return 'Anda tidak berhak mengelola unit ini'
    }
    return ''
  }

  const refetch = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      const res = await fetch('/api/admin/kegiatan?scope=all', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (res.ok) {
        const json = await res.json()
        setKegiatan(json.kegiatan || [])
        return
      }
    } catch {
      // Fallback
    }

    let query = supabase
      .from('kegiatan')
      .select('*')
      .order('date', { ascending: false })
    // Fallback langsung ke Supabase: RLS membatasi admin unit hanya pada
    // unitnya sendiri (lihat migrations 006), sehingga tetap aman.
    const { data } = await query
    setKegiatan(data || [])
  }

  const handleSave = async () => {
    const err = validateForm()
    if (err) {
      setSavingError(err)
      return
    }
    setSaving(true)
    setSavingError('')

    const payload = {
      ...formData,
      ...(editing ? { id: editing.id } : {}),
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      const res = await fetch('/api/admin/kegiatan', {
        method: editing ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Gagal menyimpan data kegiatan.')
      }

      push('success', editing ? 'Kegiatan berhasil diperbarui' : 'Kegiatan baru berhasil ditambahkan')
      setShowModal(false)
      setSaving(false)
      await refetch()
    } catch (apiErr: unknown) {
      // Coba fallback ke browser client langsung jika API gagal
      const errorMsg = apiErr instanceof Error ? apiErr.message : 'Gagal menyimpan'
      if (editing) {
        const { error: dbError } = await supabase
          .from('kegiatan')
          .update(payload)
          .eq('id', editing.id)
        if (dbError) {
          setSavingError('Gagal menyimpan: ' + (dbError.message || errorMsg))
          setSaving(false)
          push('error', 'Gagal menyimpan perubahan kegiatan')
          return
        }
        push('success', 'Kegiatan berhasil diperbarui')
      } else {
        const { error: dbError } = await supabase.from('kegiatan').insert(payload)
        if (dbError) {
          setSavingError('Gagal menyimpan: ' + (dbError.message || errorMsg))
          setSaving(false)
          push('error', 'Gagal menambah kegiatan')
          return
        }
        push('success', 'Kegiatan baru berhasil ditambahkan')
      }

      setShowModal(false)
      setSaving(false)
      await refetch()
    }
  }

  const askDelete = (k: Kegiatan) => {
    setPendingDelete(k)
    confirm.openDialog({
      title: 'Hapus kegiatan ini?',
      description: k.title,
      confirmLabel: 'Ya, Hapus',
      danger: true,
    })
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      const res = await fetch(`/api/admin/kegiatan?id=${pendingDelete.id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Gagal menghapus kegiatan.')
      }
      push('success', 'Kegiatan berhasil dihapus')
      await refetch()
    } catch (apiErr: unknown) {
      // Fallback ke browser client
      const { error: dbError } = await supabase
        .from('kegiatan')
        .delete()
        .eq('id', pendingDelete.id)
      if (dbError) {
        push('error', 'Gagal menghapus: ' + dbError.message)
      } else {
        push('success', 'Kegiatan berhasil dihapus')
        await refetch()
      }
    } finally {
      setDeleting(false)
      confirm.closeDialog()
      setPendingDelete(null)
    }
  }

  const getUnitName = (unitId: string) => {
    const unit = units.find((u) => u.id === unitId)
    return unit?.short_name || unitId
  }

  if (loading) {
    return (
      <main className="min-h-[calc(100dvh-5rem)] bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary-dark" />
          <p className="text-text/60">Memuat data kegiatan...</p>
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
              Kelola Kegiatan
            </h1>
            <p className="text-text/70 mt-1">
              {kegiatan.length} kegiatan tercatat
              {user
                ? ` · ${roleLabel(access.role)}${access.unit_slug ? ' · ' + (UNIT_SLUG_MAP[access.unit_slug]?.label ?? access.unit_slug) : ''}`
                : ''}
            </p>
            <p className="text-xs text-text/50 mt-2 max-w-xl">
              Kegiatan yang ditambahkan akan tersimpan ke Supabase dan otomatis
              muncul di menu <span className="text-accent font-bold">Kegiatan</span>
              (melanjutkan daftar kegiatan statis bawaan).
            </p>
          </div>

          {canManageAny && (
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-dark text-white font-bold text-sm rounded-xl hover:bg-primary transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Kegiatan
            </button>
          )}
        </div>

        {/* Kegiatan List */}
        <div className="space-y-3">
          {kegiatan.map((k) => (
            <div
              key={k.id}
              className="bg-surface rounded-xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase">
                    {getUnitName(k.unit_id)}
                  </span>
                  <span className="text-xs text-text/50">{k.type}</span>
                </div>
                <h3 className="font-bold text-heading text-lg">{k.title}</h3>
                <div className="flex items-center gap-4 text-sm text-text/60 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {k.date}
                  </span>
                  {k.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {k.location}
                    </span>
                  )}
                  {!k.published && (
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                      Draf
                    </span>
                  )}
                </div>
              </div>

              {canManageLocalUnit(k.unit_id) && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(k)}
                    className="p-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => askDelete(k)}
                    className="p-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black text-heading">
                    {editing ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-text/40 hover:text-text"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {savingError && (
                  <div className="mb-4 px-3 py-2.5 bg-red-50 text-red-700 text-sm rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{savingError}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-heading mb-1.5">
                      Unit Kerja
                    </label>
                    <select
                      value={formData.unit_id}
                      onChange={(e) => setFormData({ ...formData, unit_id: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                    >
                      {access.role !== 'superadmin' ? (
                        // Admin unit: hanya boleh unitnya sendiri
                        <option value={access.unit_slug || ''}>
                          {UNIT_SLUG_MAP[access.unit_slug || '']?.label ||
                            access.unit_slug ||
                            '— Pilih unit —'}
                        </option>
                      ) : (
                        <>
                          <option value="">— Pilih unit —</option>
                          {unitOptions.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.label}
                            </option>
                          ))}
                          {formData.unit_id &&
                            !unitOptions.some((u) => u.id === formData.unit_id) && (
                              <option value={formData.unit_id}>{formData.unit_id}</option>
                            )}
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-heading mb-1.5">
                      Judul
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                      placeholder="Judul kegiatan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-heading mb-1.5">
                      Deskripsi
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                      placeholder="Deskripsi kegiatan"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-heading mb-1.5">
                        Tanggal
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-2.5 bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-heading mb-1.5">
                        Jenis
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-2.5 bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                      >
                        <option value="Koordinasi">Koordinasi</option>
                        <option value="Intel-WAS">Intel-WAS</option>
                        <option value="Pelayanan">Pelayanan</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-heading mb-1.5">
                      Lokasi
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                      placeholder="Lokasi kegiatan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-heading mb-1.5">
                      URL Gambar
                    </label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                      placeholder="https://..."
                    />
                  </div>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-heading">Publikasikan</span>
                  </label>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={saving}
                    className="flex-1 py-2.5 bg-background text-heading font-bold rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-2.5 bg-primary-dark text-white font-bold rounded-xl hover:bg-primary transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editing ? 'Simpan Perubahan' : 'Tambah Kegiatan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ToastViewport toasts={toasts} onDismiss={dismiss} />

        {user && !canManageAny && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 animate-pulse">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-800 text-sm mb-1">
                  Akses admin belum aktif — data hanya bisa dibaca
                </h3>
                <p className="text-amber-700 text-xs mb-2 leading-relaxed">
                  Peran terdeteksi: <strong>{roleLabel(access.role)}</strong> ·
                  unit <strong>{access.unit_slug ?? '—'}</strong>. Untuk mengaktifkan
                  CRUD (tambah/edit/hapus) pada unit Anda, jalankan migration ini di
                  Supabase SQL Editor, berurutan:
                </p>
                <div className="space-y-1 text-[11px]">
                  <div className="bg-amber-100 px-2.5 py-1.5 rounded border-l-4 border-amber-500">
                    1) <code>supabase/migrations/005_seed_admins.sql</code> — pendaftarkan profil email resmi
                  </div>
                  <div className="bg-amber-100 px-2.5 py-1.5 rounded border-l-4 border-amber-500">
                    2) <code>supabase/migrations/006_complete_admin_crud_rls.sql</code> — izinkan admin unit tulis data unitnya sendiri
                  </div>
                  <div className="bg-amber-100 px-2.5 py-1.5 rounded border-l-4 border-amber-500">
                    3) <code>supabase/migrations/007_profile_privilege_guard.sql</code> — mencegah peningkatan role sembarangan
                  </div>
                </div>
                <p className="text-amber-600 text-[11px] mt-2">
                  Setelah dijalankan, segarkan halaman ini. Jika email Anda cocok
                  dengan salah satu resmi, peran akan disejajarkan otomatis.
                </p>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          state={{
            ...confirm.state,
            loading: deleting,
            confirmLabel: 'Ya, Hapus',
            danger: true,
          }}
          onConfirm={handleDelete}
          onCancel={() => {
            confirm.closeDialog()
            setPendingDelete(null)
          }}
        />
      </div>
    </main>
  )
}

export default function AdminKegiatanPage() {
  return (
    <Suspense fallback={
      <main className="min-h-[calc(100dvh-5rem)] bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary-dark border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text/60 font-medium">Memuat...</p>
        </div>
      </main>
    }>
      <AdminKegiatanContent />
    </Suspense>
  )
}
