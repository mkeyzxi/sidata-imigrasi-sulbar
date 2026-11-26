'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Database,
  Loader2,
  Search,
  AlertCircle,
  RefreshCw,
  Filter,
} from 'lucide-react'
import {
  canManageUnit as canManageUnitCheck,
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

type Statistik = {
  id: number
  unit_id: string
  kategori: string
  sub_kategori: string | null
  label: string | null
  nilai: number
  detail: unknown | null
  tahun: number
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

type Profile = {
  id: string
  email: string | null
  full_name: string | null
  role: string
  unit_slug: string | null
  is_active: boolean
}

const KATEGORI_OPTIONS = [
  'paspor',
  'izin_tinggal',
  'WNA',
  'TAK',
  'BAP',
  'intel_was',
  'anggaran',
  'pnbp',
  'perlintasan',
]

const TAHUN_OPTIONS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i)

/** `detail` bertipe Json di DB — bisa string, objek, angka, atau null. */
function detailText(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  try {
    return JSON.stringify(value)
  } catch {
    return ''
  }
}

export default function AdminDataPage() {
  const router = useRouter()
  const [statistik, setStatistik] = useState<Statistik[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Statistik | null>(null)
  const [saving, setSaving] = useState(false)
  const [savingError, setSavingError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Statistik | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [filterUnit, setFilterUnit] = useState<string>('all')
  const [filterKategori, setFilterKategori] = useState<string>('all')
  const [filterTahun, setFilterTahun] = useState<string>('all')

  // Form
  const [formData, setFormData] = useState({
    unit_id: '',
    kategori: '',
    sub_kategori: '',
    label: '',
    nilai: '',
    detail: '',
    tahun: new Date().getFullYear(),
  })

  const supabase = useMemo(() => createSupabaseBrowserClient(), [])

  const { toasts, push, dismiss } = useToasts()
  const confirm = useConfirmDialog()

  // Load data
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

      const { data: unitsData } = await supabase.from('units').select('*')
      setUnits(unitsData || [])

      const localAccess = effectiveAccess(resolved)

      // Ambil statistik via API server
      try {
        const token = session.access_token
        const res = await fetch(
          `/api/admin/data${localAccess.role !== 'superadmin' && localAccess.unit_slug ? `?unit_id=${localAccess.unit_slug}` : ''}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} },
        )
        if (res.ok) {
          const json = await res.json()
          setStatistik(json.statistik || [])
          setLoading(false)
          return
        }
      } catch {
        // Fallback
      }

      let query = supabase
        .from('statistik_pendaftaran')
        .select('*')
        .order('tahun', { ascending: false })
        .order('kategori', { ascending: true })

      if (localAccess.role !== 'superadmin' && localAccess.unit_slug) {
        query = query.eq('unit_id', localAccess.unit_slug)
      }

      const { data: statData } = await query
      setStatistik(statData || [])
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

  const canManageLocalUnit = (unitId: string) => canManageUnitCheck(access, unitId)

  const filteredStatistik = useMemo(() => {
    let data = statistik

    if (filterUnit !== 'all') {
      data = data.filter((s) => s.unit_id === filterUnit)
    }
    if (filterKategori !== 'all') {
      data = data.filter((s) => s.kategori === filterKategori)
    }
    if (filterTahun !== 'all') {
      data = data.filter((s) => s.tahun === parseInt(filterTahun))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(
        (s) =>
          s.label?.toLowerCase().includes(q) ||
          s.kategori.toLowerCase().includes(q) ||
          s.sub_kategori?.toLowerCase().includes(q) ||
          detailText(s.detail).toLowerCase().includes(q) ||
          s.nilai.toString().includes(q) ||
          s.tahun.toString().includes(q),
      )
    }

    return data
  }, [statistik, filterUnit, filterKategori, filterTahun, search])

  const grouped = useMemo(() => {
    const groups: Record<string, Statistik[]> = {}
    filteredStatistik.forEach((s) => {
      const key = s.kategori
      if (!groups[key]) groups[key] = []
      groups[key].push(s)
    })
    return groups
  }, [filteredStatistik])

  const openModal = (s?: Statistik) => {
    setSavingError('')
    if (s) {
      setEditing(s)
      setFormData({
        unit_id: s.unit_id,
        kategori: s.kategori,
        sub_kategori: s.sub_kategori || '',
        label: s.label || '',
        nilai: s.nilai.toString(),
        detail: detailText(s.detail),
        tahun: s.tahun,
      })
    } else {
      setEditing(null)
      setFormData({
        unit_id:
          access.unit_slug || unitOptions[0]?.id || Object.keys(UNIT_SLUG_MAP)[0] || '',
        kategori: '',
        sub_kategori: '',
        label: '',
        nilai: '',
        detail: '',
        tahun: new Date().getFullYear(),
      })
    }
    setShowModal(true)
  }

  const validateForm = (): string => {
    if (!formData.unit_id) return 'Pilih unit kerja'
    if (!formData.kategori.trim()) return 'Pilih kategori'
    const nilai = parseFloat(formData.nilai)
    if (isNaN(nilai) || nilai < 0) return 'Nilai harus angka ≥ 0'
    const tahun = parseInt(formData.tahun.toString())
    if (isNaN(tahun) || tahun < 2000 || tahun > new Date().getFullYear() + 1) {
      return `Tahun harus 2000–${new Date().getFullYear() + 1}`
    }
    if (!canManageLocalUnit(formData.unit_id)) {
      return 'Anda tidak berhak mengelola data unit ini'
    }
    return ''
  }

  const refetch = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      const res = await fetch(
        `/api/admin/data${access.role !== 'superadmin' && access.unit_slug ? `?unit_id=${access.unit_slug}` : ''}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      )
      if (res.ok) {
        const json = await res.json()
        setStatistik(json.statistik || [])
        return
      }
    } catch {
      // Fallback
    }

    let query = supabase
      .from('statistik_pendaftaran')
      .select('*')
      .order('tahun', { ascending: false })
      .order('kategori', { ascending: true })
    if (access.role !== 'superadmin' && access.unit_slug) {
      query = query.eq('unit_id', access.unit_slug)
    }
    const { data } = await query
    setStatistik(data || [])
  }

  const handleSave = async () => {
    const error = validateForm()
    if (error) {
      setSavingError(error)
      return
    }
    setSaving(true)
    setSavingError('')

    const payload = {
      ...(editing ? { id: editing.id } : {}),
      unit_id: formData.unit_id,
      kategori: formData.kategori.trim(),
      sub_kategori: formData.sub_kategori.trim() || null,
      label: formData.label.trim() || null,
      nilai: parseFloat(formData.nilai),
      detail: formData.detail.trim() || null,
      tahun: parseInt(formData.tahun.toString()),
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      const res = await fetch('/api/admin/data', {
        method: editing ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Gagal menyimpan data statistik.')
      }

      push('success', editing ? 'Data berhasil diperbarui' : 'Data baru berhasil ditambahkan')
      setShowModal(false)
      setSaving(false)
      await refetch()
    } catch (apiErr: unknown) {
      // Coba fallback ke browser client
      const errorMsg = apiErr instanceof Error ? apiErr.message : 'Gagal menyimpan'
      if (editing) {
        const { error: dbError } = await supabase
          .from('statistik_pendaftaran')
          .update(payload)
          .eq('id', editing.id)
        if (dbError) {
          setSavingError('Gagal menyimpan: ' + (dbError.message || errorMsg))
          setSaving(false)
          push('error', 'Gagal menyimpan perubahan')
          return
        }
        push('success', 'Data berhasil diperbarui')
      } else {
        const { error: dbError } = await supabase
          .from('statistik_pendaftaran')
          .insert(payload)
        if (dbError) {
          setSavingError('Gagal menyimpan: ' + (dbError.message || errorMsg))
          setSaving(false)
          push('error', 'Gagal menambah data')
          return
        }
        push('success', 'Data baru berhasil ditambahkan')
      }

      setShowModal(false)
      setSaving(false)
      await refetch()
    }
  }

  const askDelete = (s: Statistik) => {
    setPendingDelete(s)
    confirm.openDialog({
      title: 'Hapus data ini?',
      description: `${s.label || s.kategori} · ${Number(s.nilai).toLocaleString('id-ID')} (${s.tahun})`,
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
      const res = await fetch(`/api/admin/data?id=${pendingDelete.id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Gagal menghapus data.')
      }
      push('success', 'Data berhasil dihapus')
      await refetch()
    } catch (apiErr: unknown) {
      // Fallback ke browser client
      const { error: dbError } = await supabase
        .from('statistik_pendaftaran')
        .delete()
        .eq('id', pendingDelete.id)
      if (dbError) {
        push('error', 'Gagal menghapus: ' + dbError.message)
      } else {
        push('success', 'Data berhasil dihapus')
        await refetch()
      }
    } finally {
      setDeleting(false)
      confirm.closeDialog()
      setPendingDelete(null)
    }
  }

  const refreshData = async () => {
    setLoading(true)
    await refetch()
    setLoading(false)
    push('info', 'Data diperbarui')
  }

  const getUnitName = (unitId: string) => {
    const unit = units.find((u) => u.id === unitId)
    return unit?.short_name || unitId
  }

  const clearFilters = () => {
    setFilterUnit('all')
    setFilterKategori('all')
    setFilterTahun('all')
    setSearch('')
  }

  const hasFilters =
    filterUnit !== 'all' || filterKategori !== 'all' || filterTahun !== 'all' || search !== ''

  if (loading) {
    return (
      <main className="min-h-[calc(100dvh-5rem)] bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary-dark" />
          <p className="text-text/60">Memuat data statistik...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100dvh-5rem)] bg-background py-12 px-6">
      <div className="max-w-5xl mx-auto">
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

        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm font-bold text-text/60 hover:text-primary-dark transition-colors tracking-wider uppercase"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Admin
          </Link>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-primary-dark tracking-tight">
              Kelola Data Statistik
            </h1>
            <p className="text-text/70 mt-1">
              {user
                ? `${roleLabel(access.role)}${access.unit_slug ? ' · ' + (UNIT_SLUG_MAP[access.unit_slug]?.label ?? access.unit_slug) : ''}`
                : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshData}
              className="p-2.5 bg-surface border border-border rounded-xl text-text/70 hover:text-primary-dark hover:border-primary-dark/40 transition-colors"
              title="Muat ulang"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {canManageAny && (
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-dark text-white font-bold text-sm rounded-xl hover:bg-primary transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Tambah Data
              </button>
            )}
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-surface rounded-xl shadow-sm p-4 mb-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-text/50 uppercase tracking-wider mb-1">
            <Filter className="w-3.5 h-3.5" />
            Filter & Pencarian
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 min-w-0">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari label, kategori, nilai..."
                className="w-full pl-10 pr-4 py-2.5 bg-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
              />
            </div>

            <select
              value={filterUnit}
              onChange={(e) => setFilterUnit(e.target.value)}
              className="px-4 py-2.5 bg-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
            >
              <option value="all">Semua Unit</option>
              {unitOptions.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>

            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="px-4 py-2.5 bg-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
            >
              <option value="all">Semua Kategori</option>
              {KATEGORI_OPTIONS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>

            <select
              value={filterTahun}
              onChange={(e) => setFilterTahun(e.target.value)}
              className="px-4 py-2.5 bg-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
            >
              <option value="all">Semua Tahun</option>
              {TAHUN_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2.5 text-sm text-text/50 hover:text-red-500 transition-colors whitespace-nowrap"
              >
                Reset
              </button>
            )}
          </div>

          <div className="text-xs text-text/50">
            Menampilkan {filteredStatistik.length} dari {statistik.length} data
          </div>
        </div>

        {/* Data list */}
        {filteredStatistik.length === 0 ? (
          <div className="bg-surface rounded-xl shadow-sm p-12 text-center">
            <Database className="w-12 h-12 mx-auto text-text/20 mb-3" />
            <p className="text-text/60 font-medium">Tidak ada data yang cocok</p>
            <p className="text-xs text-text/40 mt-1">
              Coba ubah filter atau tambah data baru.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([kategori, items]) => (
              <div key={kategori}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-dark bg-primary/10 px-2 py-1 rounded-md">
                    {kategori}
                  </span>
                  <span className="text-xs text-text/40">{items.length} item</span>
                </div>
                <div className="space-y-2">
                  {items.map((s) => (
                    <div
                      key={s.id}
                      className="bg-surface rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold uppercase">
                            {getUnitName(s.unit_id)}
                          </span>
                          {s.sub_kategori && (
                            <span className="text-[11px] text-text/50">{s.sub_kategori}</span>
                          )}
                          <span className="text-[11px] text-text/50">Tahun {s.tahun}</span>
                        </div>
                        <div className="text-sm font-medium text-heading">
                          {s.label || s.kategori}:{' '}
                          <span className="font-bold text-primary-dark">
                            {Number(s.nilai).toLocaleString('id-ID')}
                          </span>
                        </div>
                        {detailText(s.detail) && (
                          <div className="text-xs text-text/50 mt-1">
                            {detailText(s.detail)}
                          </div>
                        )}
                      </div>

                      {canManageLocalUnit(s.unit_id) ? (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => openModal(s)}
                            className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => askDelete(s)}
                            className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-[11px] text-text/30 shrink-0">Hanya baca</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border sticky top-0 bg-surface rounded-t-2xl">
                <h2 className="text-xl font-black text-heading">
                  {editing ? `Edit Data #${editing.id}` : 'Tambah Data Baru'}
                </h2>
              </div>

              <div className="p-6">
                {savingError && (
                  <div className="mb-4 px-3 py-2.5 bg-red-50 text-red-700 text-sm rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{savingError}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-heading mb-1.5">
                      Unit Kerja *
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
                    {access.role !== 'superadmin' && (
                      <p className="mt-1 text-[11px] text-text/50">
                        Anda mengelola data milik unit Anda sendiri.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-heading mb-1.5">
                      Kategori *
                    </label>
                    <select
                      value={formData.kategori}
                      onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                    >
                      <option value="">— Pilih kategori —</option>
                      {KATEGORI_OPTIONS.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-heading mb-1.5">
                      Sub Kategori <span className="text-text/40 font-normal">(opsional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.sub_kategori}
                      onChange={(e) =>
                        setFormData({ ...formData, sub_kategori: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                      placeholder="mis. elektronik, reguler, dll."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-heading mb-1.5">
                      Label <span className="text-text/40 font-normal">(opsional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                      placeholder="mis. Total Paspor, ITK, dsb."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-heading mb-1.5">
                      Nilai *
                    </label>
                    <input
                      type="number"
                      value={formData.nilai}
                      onChange={(e) => setFormData({ ...formData, nilai: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                      placeholder="0"
                      min={0}
                      step="any"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-heading mb-1.5">
                      Detail <span className="text-text/40 font-normal">(opsional)</span>
                    </label>
                    <textarea
                      value={formData.detail}
                      onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 bg-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark/30 resize-none"
                      placeholder="Catatan tambahan..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-heading mb-1.5">
                      Tahun *
                    </label>
                    <select
                      value={formData.tahun}
                      onChange={(e) =>
                        setFormData({ ...formData, tahun: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-2.5 bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                    >
                      {TAHUN_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
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
                    {editing ? 'Simpan Perubahan' : 'Tambah Data'}
                  </button>
                </div>
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
