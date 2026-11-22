'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Newspaper,
  Calendar,
  MapPin,
  Image,
  Loader2,
  X,
} from 'lucide-react'

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
  const searchParams = useSearchParams()
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Kegiatan | null>(null)
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    type: 'Intel-WAS',
    image_url: '',
    unit_id: '',
    published: true,
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
      setUser(profile)

      const { data: unitsData } = await client
        .from('units')
        .select('*')
      setUnits(unitsData || [])

      // Load kegiatan based on user's unit access
      let query = client
        .from('kegiatan')
        .select('*')
        .order('date', { ascending: false })

      if (profile && profile.role !== 'superadmin' && profile.unit_slug) {
        query = query.eq('unit_id', profile.unit_slug)
      }

      const { data: kegiatanData } = await query
      setKegiatan(kegiatanData || [])
      setLoading(false)
    }
    loadData()
  }, [])

  const canManageUnit = (unitId: string) => {
    if (!user) return false
    if (user.role === 'superadmin') return true
    if (user.role === 'admin_kanwil' && unitId === 'kanwil-sulbar') return true
    if (user.role === 'admin_mamuju' && unitId === 'imigrasi-mamuju') return true
    if (user.role === 'admin_polman' && unitId === 'imigrasi-polman') return true
    return false
  }

  const openModal = (k?: Kegiatan) => {
    if (k) {
      setEditing(k)
      setFormData({
        title: k.title,
        description: k.description || '',
        date: k.date,
        location: k.location || '',
        type: k.type || 'Intel-WAS',
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
        type: 'Intel-WAS',
        image_url: '',
        unit_id: user?.unit_slug || 'kanwil-sulbar',
        published: true,
      })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!supabase) return
    const payload = {
      ...formData,
      date: formData.date,
    }

    if (editing) {
      await supabase.from('kegiatan').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('kegiatan').insert(payload)
    }

    setShowModal(false)
    // Refresh
    const query = supabase.from('kegiatan').select('*').order('date', { ascending: false })
    const filter = user?.role !== 'superadmin' && user?.unit_slug ? query.eq('unit_id', user.unit_slug) : query
    const { data } = await filter
    setKegiatan(data || [])
  }

  const handleDelete = async (id: number) => {
    if (!supabase) return
    if (!confirm('Hapus kegiatan ini?')) return
    await supabase.from('kegiatan').delete().eq('id', id)
    setKegiatan(kegiatan.filter((k) => k.id !== id))
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
              Kelola Berita & Kegiatan
            </h1>
            <p className="text-text/70 mt-1">
              {kegiatan.length} kegiatan tercatat
            </p>
          </div>

          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-dark text-white font-bold text-sm rounded-xl hover:bg-primary transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Kegiatan
          </button>
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

              {canManageUnit(k.unit_id) && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(k)}
                    className="p-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(k.id)}
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

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-heading mb-1.5">
                      Unit Kerja
                    </label>
                    <select
                      value={formData.unit_id}
                      onChange={(e) => setFormData({ ...formData, unit_id: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                      disabled={user?.role !== 'superadmin'}
                    >
                      {units
                        .filter((u) => canManageUnit(u.id))
                        .map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.short_name}
                          </option>
                        ))}
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
                        <option value="Intel-WAS">Intel-WAS</option>
                        <option value="Koordinasi">Koordinasi</option>
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
                    className="flex-1 py-2.5 bg-background text-heading font-bold rounded-xl hover:bg-muted transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-2.5 bg-primary-dark text-white font-bold rounded-xl hover:bg-primary transition-colors"
                  >
                    {editing ? 'Simpan Perubahan' : 'Tambah Kegiatan'}
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
