/**
 * Script untuk menjalankan migration 010_update_data_imigrasi.sql
 * Eksekusi langsung ke Supabase menggunakan service role key
 * 
 * Cara pakai:
 *   pnpm tsx tools/execute-migration-010.ts
 * 
 * atau dengan node setelah build:
 *   node dist/tools/execute-migration-010.js
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { execSync } from 'child_process'

// Baca environment variables dari .env.local
function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), '.env.local')
    const content = readFileSync(envPath, 'utf8')
    for (const line of content.split('\n')) {
      if (line.startsWith('#') || !line.includes('=')) continue
      const [key, ...values] = line.split('=')
      const value = values.join('=').trim()
      if (value && !process.env[key]) {
        process.env[key] = value
      }
    }
  } catch (err) {
    console.warn('Gagal membaca .env.local:', err)
  }
}

loadEnv()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak ada di .env.local')
  process.exit(1)
}

async function main() {
  console.log('=== MIGRATION 010: Update Data Imigrasi ===')
  console.log('Target:', SUPABASE_URL)
  console.log('')

  const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!)

  // ============================================================
  // 1. DELETE EXISTING DATA
  // ============================================================
  console.log('Step 1: Menghapus data lama...')

  const delMamuju = await supabase.from('statistik_pendaftaran')
    .delete()
    .eq('unit_id', 'imigrasi-mamuju')
    .eq('tahun', 2026)
    .in('kategori', ['paspor', 'izin_tinggal', 'WNA', 'TAK', 'BAP', 'intel_was', 'anggaran', 'pnbp', 'serapan_bulanan'])
  
  if (delMamuju.error) {
    console.error('  ERROR hapus Mamuju:', delMamuju.error.message)
  } else {
    console.log('  ✓ Data lama Imigrasi Mamuju dihapus')
  }

  const delPolman = await supabase.from('statistik_pendaftaran')
    .delete()
    .eq('unit_id', 'imigrasi-polman')
    .eq('tahun', 2026)
    .in('kategori', ['paspor', 'izin_tinggal', 'WNA', 'TAK', 'BAP', 'intel_was', 'anggaran', 'pnbp', 'serapan_bulanan'])

  if (delPolman.error) {
    console.error('  ERROR hapus Polman:', delPolman.error.message)
  } else {
    console.log('  ✓ Data lama Imigrasi Polman dihapus')
  }

  // ============================================================
  // 2. INSERT NEW DATA - IMIGRASI MAMUJU
  // ============================================================
  console.log('\nStep 2: Menyisipkan data baru Imigrasi Mamuju...')

  const mamujuData = [
    // PASPOR
    { unit_id: 'imigrasi-mamuju', kategori: 'paspor', sub_kategori: 'biasa', label: 'Paspor Biasa 48 Halaman', nilai: 1, detail: { jenis: 'biasa', halaman: 48 }, tahun: 2026 },
    { unit_id: 'imigrasi-mamuju', kategori: 'paspor', sub_kategori: 'elektronik', label: 'Paspor Elektronik 48 Halaman', nilai: 3078, detail: { jenis: 'elektronik', halaman: 48 }, tahun: 2026 },
    { unit_id: 'imigrasi-mamuju', kategori: 'paspor', sub_kategori: null, label: 'Total Paspor', nilai: 3079, detail: { biasa: 1, elektronik: 3078 }, tahun: 2026 },
    
    // IZIN TINGGAL
    { unit_id: 'imigrasi-mamuju', kategori: 'izin_tinggal', sub_kategori: 'ITK', label: 'ITK', nilai: 16, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-mamuju', kategori: 'izin_tinggal', sub_kategori: 'ITAS', label: 'ITAS', nilai: 17, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-mamuju', kategori: 'izin_tinggal', sub_kategori: 'ITAP', label: 'ITAP', nilai: 8, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-mamuju', kategori: 'izin_tinggal', sub_kategori: null, label: 'Total Izin Tinggal', nilai: 41, detail: { ITK: 16, ITAS: 17, ITAP: 8 }, tahun: 2026 },
    
    // PERLINTASAN (KATEGORI BARU)
    { unit_id: 'imigrasi-mamuju', kategori: 'perlintasan', sub_kategori: 'kedatangan', label: 'Kedatangan', nilai: 946, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-mamuju', kategori: 'perlintasan', sub_kategori: 'keberangkatan', label: 'Keberangkatan', nilai: 1240, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-mamuju', kategori: 'perlintasan', sub_kategori: null, label: 'Total Perlintasan', nilai: 2186, detail: { kedatangan: 946, keberangkatan: 1240 }, tahun: 2026 },
    
    // BAP
    { unit_id: 'imigrasi-mamuju', kategori: 'BAP', sub_kategori: 'hilang', label: 'BAP Hilang', nilai: 71, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-mamuju', kategori: 'BAP', sub_kategori: 'rusak', label: 'BAP Rusak', nilai: 5, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-mamuju', kategori: 'BAP', sub_kategori: null, label: 'Total BAP', nilai: 76, detail: { hilang: 71, rusak: 5 }, tahun: 2026 },
    
    // INTEL-WAS
    { unit_id: 'imigrasi-mamuju', kategori: 'intel_was', sub_kategori: 'ops_intelijen', label: 'Operasi Intelijen', nilai: 44, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-mamuju', kategori: 'intel_was', sub_kategori: 'ops_mandiri', label: 'Operasi Mandiri/Pengawasan', nilai: 23, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-mamuju', kategori: 'intel_was', sub_kategori: 'patroli', label: 'Patroli Pengawasan Orang Asing', nilai: 9, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-mamuju', kategori: 'intel_was', sub_kategori: 'ops_gabungan', label: 'Operasi Gabungan', nilai: 2, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-mamuju', kategori: 'intel_was', sub_kategori: 'timpora', label: 'Rapat Timpora', nilai: 3, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-mamuju', kategori: 'intel_was', sub_kategori: 'desa_binaan', label: 'Desa Binaan', nilai: 4, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-mamuju', kategori: 'intel_was', sub_kategori: null, label: 'Total Kegiatan Intel-WAS', nilai: 93, detail: { ops_intelijen: 44, ops_mandiri: 23, patroli: 9, ops_gabungan: 2, timpora: 3, desa_binaan: 4 }, tahun: 2026 },
    
    // TAK
    { unit_id: 'imigrasi-mamuju', kategori: 'TAK', sub_kategori: null, label: 'Total TAK', nilai: 23, detail: { orang: 8 }, tahun: 2026 },
    
    // PNBP & ANGGARAN
    { unit_id: 'imigrasi-mamuju', kategori: 'pnbp', sub_kategori: 'target', label: 'Target PNBP', nilai: 1920000000, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-mamuju', kategori: 'pnbp', sub_kategori: 'realisasi', label: 'Realisasi PNBP', nilai: 2580000000, detail: { persentase: 134.8 }, tahun: 2026 },
    { unit_id: 'imigrasi-mamuju', kategori: 'anggaran', sub_kategori: 'pagu', label: 'Pagu Anggaran', nilai: 12740000000, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-mamuju', kategori: 'anggaran', sub_kategori: 'realisasi', label: 'Realisasi Anggaran', nilai: 11190000000, detail: { persentase: 87.8 }, tahun: 2026 },
  ]

  const { error: insMamujuErr } = await supabase.from('statistik_pendaftaran').insert(mamujuData)
  if (insMamujuErr) {
    console.error('  ERROR insert Mamuju:', insMamujuErr.message)
  } else {
    console.log(`  ✓ ${mamujuData.length} baris data Imigrasi Mamuju disisipkan`)
  }

  // ============================================================
  // 3. INSERT NEW DATA - IMIGRASI POLMAN
  // ============================================================
  console.log('\nStep 3: Menyisipkan data baru Imigrasi Polman...')

  const polmanData = [
    // PASPOR (data lama - belum bisa diekstrak dari PDF)
    { unit_id: 'imigrasi-polman', kategori: 'paspor', sub_kategori: null, label: 'Total Paspor', nilai: 2235, detail: { catatan: 'Data lama - perlu update dari PDF' }, tahun: 2026 },
    { unit_id: 'imigrasi-polman', kategori: 'paspor', sub_kategori: 'baru', label: 'Paspor Baru', nilai: 1420, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-polman', kategori: 'paspor', sub_kategori: 'penggantian', label: 'Paspor Penggantian', nilai: 815, detail: {}, tahun: 2026 },
    
    // IZIN TINGGAL
    { unit_id: 'imigrasi-polman', kategori: 'izin_tinggal', sub_kategori: 'ITK', label: 'ITK', nilai: 21, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-polman', kategori: 'izin_tinggal', sub_kategori: 'ITAP', label: 'ITAP', nilai: 8, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-polman', kategori: 'izin_tinggal', sub_kategori: 'ITAS', label: 'ITAS', nilai: 37, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-polman', kategori: 'izin_tinggal', sub_kategori: null, label: 'Total Izin Tinggal', nilai: 66, detail: { ITK: 21, ITAP: 8, ITAS: 37 }, tahun: 2026 },
    
    // ANGGARAN
    { unit_id: 'imigrasi-polman', kategori: 'anggaran', sub_kategori: 'pagu', label: 'Pagu Anggaran', nilai: 10742707000, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-polman', kategori: 'anggaran', sub_kategori: 'realisasi', label: 'Realisasi Anggaran', nilai: 7765276808, detail: { persentase: 72.28, sisa: 2977430192 }, tahun: 2026 },
    { unit_id: 'imigrasi-polman', kategori: 'anggaran', sub_kategori: 'pegawai', label: 'Pagu Pegawai', nilai: 4939094000, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-polman', kategori: 'anggaran', sub_kategori: 'realisasi_pegawai', label: 'Realisasi Pegawai', nilai: 4148943119, detail: { persentase: 84.0 }, tahun: 2026 },
    { unit_id: 'imigrasi-polman', kategori: 'anggaran', sub_kategori: 'barang', label: 'Pagu Barang', nilai: 5363613000, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-polman', kategori: 'anggaran', sub_kategori: 'realisasi_barang', label: 'Realisasi Barang', nilai: 3185242989, detail: { persentase: 59.39 }, tahun: 2026 },
    { unit_id: 'imigrasi-polman', kategori: 'anggaran', sub_kategori: 'modal', label: 'Pagu Modal', nilai: 440000000, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-polman', kategori: 'anggaran', sub_kategori: 'realisasi_modal', label: 'Realisasi Modal', nilai: 431090700, detail: { persentase: 97.98 }, tahun: 2026 },
    
    // PNBP
    { unit_id: 'imigrasi-polman', kategori: 'pnbp', sub_kategori: 'target', label: 'Target PNBP', nilai: 3190726160, detail: {}, tahun: 2026 },
    { unit_id: 'imigrasi-polman', kategori: 'pnbp', sub_kategori: 'realisasi', label: 'Realisasi PNBP', nilai: 5883600000, detail: { persentase: 184.4 }, tahun: 2026 },
  ]

  const { error: insPolmanErr } = await supabase.from('statistik_pendaftaran').insert(polmanData)
  if (insPolmanErr) {
    console.error('  ERROR insert Polman:', insPolmanErr.message)
  } else {
    console.log(`  ✓ ${polmanData.length} baris data Imigrasi Polman disisipkan`)
  }

  // ============================================================
  // 4. VERIFY
  // ============================================================
  console.log('\nStep 4: Verifikasi data...')

  const { data: verifyMamuju, error: vErrMamuju } = await supabase
    .from('statistik_pendaftaran')
    .select('kategori, label, nilai')
    .eq('unit_id', 'imigrasi-mamuju')
    .eq('tahun', 2026)
    .order('kategori')

  if (vErrMamuju) {
    console.error('  ERROR verifikasi Mamuju:', vErrMamuju.message)
  } else {
    console.log(`  ✓ Imigrasi Mamuju: ${verifyMamuju.length} baris`)
  }

  const { data: verifyPolman, error: vErrPolman } = await supabase
    .from('statistik_pendaftaran')
    .select('kategori, label, nilai')
    .eq('unit_id', 'imigrasi-polman')
    .eq('tahun', 2026)
    .order('kategori')

  if (vErrPolman) {
    console.error('  ERROR verifikasi Polman:', vErrPolman.message)
  } else {
    console.log(`  ✓ Imigrasi Polman: ${verifyPolman.length} baris`)
  }

  console.log('\n=== SELESAI ===')
  console.log('Migration 010 berhasil dijalankan.')
  console.log('')
  console.log('Catatan:')
  console.log('- Kategori BARU "perlintasan" ditambahkan untuk Mamuju')
  console.log('- Data paspor Polman masih pakai data lama (perlu update manual dari PDF)')
  console.log('- Data PNBP Polman sudah update dari file xlsx')
  console.log('- Data anggaran Polman sudah update dari PDF')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
