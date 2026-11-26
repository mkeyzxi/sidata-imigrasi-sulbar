'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

import {
  Loader2,
  Database,
  Coins,
  Plus,
  Save,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  
} from 'lucide-react'
import {
  roleLabel,
  UNIT_SLUG_MAP,
  effectiveAccess,
  syncOfficialProfile,
} from '@/lib/utils/access'
import {
  useToasts,
  ToastViewport,
} from '@/components/admin/feedback'

type Profile = {
  id: string
  email: string | null
  full_name: string | null
  role: string
  unit_slug: string | null
  is_active: boolean
}

type Bidang = {
  id: string
  unit_id: string
  name: string
  slug: string
  description: string | null
}

type SerapanRow = {
  bidang_id: string
  bulan: number
  tahun: number
  jumlah: number
}

const TAHUN = 2026
const BULAN_LIST = [
  { no: 1, nama: 'Januari' },
  { no: 2, nama: 'Februari' },
  { no: 3, nama: 'Maret' },
  { no: 4, nama: 'April' },
  { no: 5, nama: 'Mei' },
  { no: 6, nama: 'Juni' },
  { no: 7, nama: 'Juli' },
  { no: 8, nama: 'Agustus' },
  { no: 9, nama: 'September' },
  { no: 10, nama: 'Oktober' },
  { no: 11, nama: 'November' },
  { no: 12, nama: 'Desember' },
]

function formatRupiah(n: number) {
  return 'Rp ' + (n || 0).toLocaleString('id-ID')
}

export default function AdminSerapanPage() {
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [user, setUser] = useState<Profile | null>(null)
  const [bidangList, setBidangList] = useState<Bidang[]>([])
  // Matrix: { [bidang_id]: { [bulan]: string } }
  const [grid, setGrid] = useState<Record<string, Record<number, string>>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingBidang, setSavingBidang] = useState<string | null>(null)

  const { toasts, push, dismiss } = useToasts()

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/login')
        return
      }

      let resolved: Profile | null = null
      try {
        const res = await fetch('/api/auth/profile')
        if (res.ok) {
          const json = await res.json()
          resolved = json.profile as Profile
        }
      } catch {
        // fallback
      }

      if (!resolved) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        resolved = (profile as Profile) || null
        // Self-heal role berdasarkan email resmi
        if (resolved?.email) {
          const synced = await syncOfficialProfile(supabase, resolved)
          if (synced) resolved = synced as unknown as Profile
        }
      }

      setUser(resolved)

      // Hanya admin kanwil & superadmin yang boleh melanjutkan
      const access = effectiveAccess(resolved)
      const canEdit =
        access.role === 'superadmin' ||
        (access.role === 'admin_kanwil' && access.unit_slug === 'kanwil-sulbar')
      if (!canEdit) {
        setLoading(false)
        return
      }

      // Ambil bidang kanwil
      const { data: bidang } = await supabase
        .from('bidang')
        .select('*')
        .eq('unit_id', 'kanwil-sulbar')
        .order('id')
      setBidangList((bidang as Bidang[]) || [])

      // Ambil serapan tahun berjalan
      const { data: serapanRows } = await supabase
        .from('serapan_anggaran')
        .select('*')
        .eq('tahun', TAHUN)
      const rows = (serapanRows || []) as SerapanRow[]

      // Bangun grid
      const initial: Record<string, Record<number, string>> = {}
      for (const b of bidang as Bidang[]) {
        initial[b.id] = {}
      }
      for (const r of rows) {
        if (initial[r.bidang_id]) {
          initial[r.bidang_id][r.bulan] = String(r.jumlah ?? 0)
        }
      }
      setGrid(initial)
      setLoading(false)
    }
    load()
  }, [supabase, router])

  const access = useMemo(() => effectiveAccess(user), [user])

  const canEdit =
    access.role === 'superadmin' ||
    (access.role === 'admin_kanwil' && access.unit_slug === 'kanwil-sulbar')

  const setCell = (bidangId: string, bulan: number, value: string) => {
    setGrid((prev) => ({
      ...prev,
      [bidangId]: { ...prev[bidangId], [bulan]: value },
    }))
  }

  const totalBidang = (bidangId: string) => {
    const cells = grid[bidangId] || {}
    return BULAN_LIST.reduce((sum, b) => {
      const v = parseFloat(cells[b.no])
      return sum + (isNaN(v) ? 0 : v)
    }, 0)
  }

  const totalSemua = bidangList.reduce((sum, b) => sum + totalBidang(b.id), 0)

  const saveBidang = async (bidang: Bidang) => {
    setSavingBidang(bidang.id)
    const cells = grid[bidang.id] || {}

    // Hapus semua baris lama bidang ini, lalu insert ulang (upsert per bulan)
    // Gunakan upsert dengan onConflict (bidang_id, bulan, tahun)
    const payload = BULAN_LIST.map((b) => ({
      bidang_id: bidang.id,
      bulan: b.no,
      tahun: TAHUN,
      jumlah: parseFloat(cells[b.no]) || 0,
    }))

    const { error } = await supabase.from('serapan_anggaran').upsert(payload, {
      onConflict: 'bidang_id,bulan,tahun',
    })

    if (error) {
      push('error', 'Gagal menyimpan ' + bidang.name + ': ' + error.message)
    } else {
      push('success', bidang.name + ' berhasil disimpan')
    }
    setSavingBidang(null)
  }

  const saveSemua = async () => {
    setSaving(true)
    let okCount = 0
    for (const b of bidangList) {
      const cells = grid[b.id] || {}
      const payload = BULAN_LIST.map((bl) => ({
        bidang_id: b.id,
        bulan: bl.no,
        tahun: TAHUN,
        jumlah: parseFloat(cells[bl.no]) || 0,
      }))
      const { error } = await supabase.from('serapan_anggaran').upsert(payload, {
        onConflict: 'bidang_id,bulan,tahun',
      })
      if (!error) okCount++
    }
    setSaving(false)
    if (okCount === bidangList.length) {
      push('success', 'Semua bidang berhasil disimpan (' + okCount + '/' + bidangList.length + ')')
    } else {
      push('error', 'Sebagian bidang gagal disimpan (' + okCount + '/' + bidangList.length + ')')
    }
  }

  if (loading) {
    return (
      <main className="min-h-[calc(100dvh-5rem)] bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary-dark" />
          <p className="text-text/60">Memuat serapan anggaran...</p>
        </div>
      </main>
    )
  }

  if (!user) return null

  return (
    <main className="min-h-[calc(100dvh-5rem)] bg-background py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <ToastViewport toasts={toasts} onDismiss={dismiss} />

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-primary-dark tracking-tight">
            Kelola Serapan Anggaran
          </h1>
          <p className="text-text/70 mt-1">
            {roleLabel(access.role)} · Input realisasi anggaran per bidang dan bulan (Tahun {TAHUN})
          </p>
        </div>

        {/* Akses */}
        {!canEdit ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-amber-800 text-sm">
                <strong>Anda tidak memiliki akses</strong> untuk mengelola serapan anggaran
                Kanwil Sulbar. Halaman ini hanya untuk <em>Admin Kanwil Sulbar</em> atau{' '}
                <em>Super Admin</em>.
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Total ringkas */}
            <div className="bg-surface rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-text/50">
                    Total Serapan Seluruh Bidang
                  </div>
                  <div className="text-xl font-black text-primary-dark">
                    {formatRupiah(totalSemua)}
                  </div>
                </div>
              </div>
              <button
                onClick={saveSemua}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-dark text-white font-bold text-sm rounded-xl hover:bg-primary transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan Semua
              </button>
            </div>

            {bidangList.length === 0 ? (
              <div className="bg-surface rounded-xl shadow-sm p-12 text-center">
                <Database className="w-12 h-12 mx-auto text-text/20 mb-3" />
                <p className="text-text/60 font-medium">Belum ada bidang terdaftar</p>
              </div>
            ) : (
              <div className="space-y-8">
                {bidangList.map((bidang) => (
                  <div key={bidang.id} className="bg-surface rounded-2xl shadow-sm p-5 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-heading">{bidang.name}</h3>
                        <span className="text-xs text-text/40">{bidang.slug}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-text/50">
                            Total
                          </div>
                          <div className="text-lg font-black text-primary-dark">
                            {formatRupiah(totalBidang(bidang.id))}
                          </div>
                        </div>
                        <button
                          onClick={() => saveBidang(bidang)}
                          disabled={savingBidang === bidang.id}
                          className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-bold text-sm rounded-xl hover:opacity-90 transition disabled:opacity-50"
                        >
                          {savingBidang === bidang.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Simpan
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-[11px] font-bold uppercase tracking-wider text-text/50">
                            <th className="pb-2 pr-3">Bulan</th>
                            {BULAN_LIST.map((b) => (
                              <th key={b.no} className="pb-2 pr-3 min-w-[110px]">
                                {b.nama}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-2 pr-3 text-sm font-semibold text-text/60">Realisasi</td>
                            {BULAN_LIST.map((b) => (
                              <td key={b.no} className="py-2 pr-3">
                                <input
                                  type="number"
                                  min={0}
                                  step="any"
                                  value={grid[bidang.id]?.[b.no] ?? ''}
                                  onChange={(e) =>
                                    setCell(bidang.id, b.no, e.target.value)
                                  }
                                  placeholder="0"
                                  className="w-full px-3 py-2 bg-background rounded-lg text-sm text-right font-bold text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark/30"
                                />
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-text/40 mt-6 leading-relaxed">
              <RefreshCw className="inline w-3 h-3 mr-1" />
              Nilai yang disimpan otomatis ditampilkan pada halaman{' '}
              <Link href="/kanwil-sulbar" className="text-accent underline">
                /kanwil-sulbar
              </Link>{' '}
              (Total Serapan Kantor Wilayah) dan halaman detail masing-masing bidang.
            </p>
          </>
        )}
      </div>
    </main>
  )
}
