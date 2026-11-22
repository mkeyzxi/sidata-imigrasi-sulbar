'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Database,
  Loader2,
} from 'lucide-react'

type Statistik = {
  id: number
  unit_id: string
  kategori: string
  sub_kategori: string | null
  label: string | null
  nilai: number
  detail: string | null
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

export default function AdminDataPage() {
  const [statistik, setStatistik] = useState<Statistik[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Statistik | null>(null)
  const [formData, setFormData] = useState({
    unit_id: '',
    kategori: '',
    label: '',
    nilai: '',
    tahun: new Date().getFullYear(),
  })

  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null)

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

      const { data: unitsData } = await client.from('units').select('*')
      setUnits(unitsData || [])

      let query = client
        .from('statistik_pendaftaran')
        .select('*')
        .order('tahun', { ascending: false })

      if (profile && profile.role !== 'superadmin' && profile.unit_slug) {
        query = query.eq('unit_id', profile.unit_slug)
      }

      const { data: statData } = await query
      setStatistik(statData || [])
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

  const openModal = (s?: Statistik) => {
    if (s) {
      setEditing(s)
      setFormData({
        unit_id: s.unit_id,
        kategori: s.kategori,
        label: s.label || '',
        nilai: s.nilai.toString(),
        tahun: s.tahun,
      })
    } else {
      setEditing(null)
      setFormData({
        unit_id: user?.unit_slug || 'kanwil-sulbar',
        kategori: '',
        label: '',
        nilai: '',
        tahun: new Date().getFullYear(),
      })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!supabase) return
    const payload = {
      ...formData,
      nilai: parseFloat(formData.nilai) || 0,
    }

    if (editing) {
      await supabase.from('statistik_pendaftaran').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('statistik_pendaftaran').insert(payload)
    }

    setShowModal(false)

    let query = supabase.from('statistik_pendaftaran').select('*')
    if (user?.role !== 'superadmin' && user?.unit_slug) {
      query = query.eq('unit_id', user.unit_slug)
    }
    const { data } = await query
    setStatistik(data || [])
  }

  const handleDelete = async (id: number) => {
    if (!supabase) return
    if (!confirm('Hapus data ini?')) return
    await supabase.from('statistik_pendaftaran').delete().eq('id', id)
    setStatistik(statistik.filter((s) => s.id !== id))
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
          <p className="text-text/60">Memuat data statistik...</p>
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
              Kelola Data Statistik
            </h1>
            <p className="text-text/70 mt-1">
              {statistik.length} data tercatat
            </p>
          </div>

          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-dark text-white font-bold text-sm rounded-xl hover:bg-primary transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Data
          </button>
        </div>

        <div className="space-y-2">
          {statistik.map((s) => (
            <div
              key={s.id}
              className="bg-surface rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase">
                    {getUnitName(s.unit_id)}
                  </span>
                  <span className="text-xs text-text/50">{s.kategori}</span>
                </div>
                <div className="text-sm font-medium text-heading">
                  {s.label}: <span className="font-bold text-primary-dark">{Number(s.nilai).toLocaleString('id-ID')}</span>
                </div>
                <div className="text-xs text-text/50 mt-1">Tahun {s.tahun}</div>
              </div>

              {canManageUnit(s.unit_id) && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(s)}
                    className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-2xl shadow-xl max-w-lg w-full">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-black text-heading mb-4">
                  {editing ? 'Edit Data' : 'Tambah Data Baru'}
                </h2>

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
                      Kategori
                    </label>
                    <input
                      type="text"
                      value={formData.kategori}
                      onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                      placeholder="paspor, izin_tinggal, WNA, TAK, BAP, intel_was, anggaran, pnbp"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-heading mb-1.5">
                      Label
                    </label>
                    <input
                      type="text"
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                      placeholder="Total Paspor, ITK, dll."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-heading mb-1.5">
                      Nilai
                    </label>
                    <input
                      type="number"
                      value={formData.nilai}
                      onChange={(e) => setFormData({ ...formData, nilai: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-heading mb-1.5">
                      Tahun
                    </label>
                    <input
                      type="number"
                      value={formData.tahun}
                      onChange={(e) => setFormData({ ...formData, tahun: parseInt(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                    />
                  </div>
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
                    {editing ? 'Simpan' : 'Tambah'}
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
