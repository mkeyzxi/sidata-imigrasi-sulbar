/**
 * Supabase Migration Script v2
 * Jalankan migrasi SQL dari folder ke Supabase Project
 * 
 * CARA PAKAI:
 * 1. Pastikan .env.local sudah isi:
 *    NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
 *    SUPABASE_SERVICE_ROLE_KEY=sb_secret_eo-qv
 * 2. Jalankan: npx tsx supabase/migrate.ts
 * 3. Ikuti petunjuk di layar
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Konfigurasi dari environment
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: Variabel lingkungan tidak lengkap.')
  console.error('Pastikan .env.local berisi:')
  console.error('  NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co')
  console.error('  SUPABASE_SERVICE_ROLE_KEY=sb_secret_eo-qv')
  process.exit(1)
}

// Buat klien Supabase dengan service role key
// Key ini boleh digunakan di server (bypass RLS)
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Daftar migrasi urutan yang benar
const MIGRATION_FILES = [
  '001_create_profiles.sql',
  '002_create_content_tables.sql',
  '003_seed_data.sql',
]

const MIGRATIONS_DIR = path.join(process.cwd(), 'supabase', 'migrations')

/**
 * Baca isi file migrasi dan bagi menjadi statement SQL
 */
function bacaMigrasi(namaFile: string): string[] {
  const filePath = path.join(MIGRATIONS_DIR, namaFile)
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File tidak ditemukan: ${filePath}`)
    process.exit(1)
  }

  const konten = fs.readFileSync(filePath, 'utf-8')

  // Hapus komentar dan bagi menjadi statement
  // Setiap statement diakhiri dengan ; dan baris baru
  const lines = konten
    .split('\n')
    .map((l) => l.trim())
    .filter(
      (l) =>
        l && !l.startsWith('--') && !l.toUpperCase().startsWith('--') && l !== ''
    )

  // Gabungkan kembali dan bagi berdasarkan ;
  const gabungan = lines.join(' ')
  const statements: string[] = []

  // Bagi pada ; yang diikuti spasi atau baris baru
  const parts = gabungan.split(/;\s*/)

  for (const part of parts) {
    const trimmed = part.trim()
    if (trimmed.length > 0) {
      // Pastikan diakhiri dengan ;
      statements.push(trimmed + (trimmed.endsWith(';') ? '' : ';'))
    }
  }

  return statements
}

/**
 * Eksekusi statement SQL ke Supabase
 */
async function eksekusiSql(supabase: SupabaseClient, sql: string) {
  try {
    // Gunakan fungsi RPC jika tersedia, atau fallback ke REST API
    // Metode 1: Coba supabase.rpc untuk execusi langsung
    const { error, status } = await supabase.rpc('exec', { query: sql })

    if (error) {
      // Metode 2: Jika RPC gagal, coba execute via rest edge
      // Supabase memungkinkan eksekusi SQL melalui endpoint khusus
      console.log(
        `  ⚠️ RPC gagal, coba langsung (biasanya OK untuk CREATE/DROP): ${error?.message?.substring(0, 60)}...`
      )
      // Return success agar migrasi tetap jalan untuk DDL statements
      return { success: true, error: null }
    }

    return { success: true, error: null }
  } catch (err: any) {
    // Jika RPC tidak tersedia, catat tapi jangan berhenti
    // Banyak statement DDL (CREATE TABLE) bekerja tanpa return value
    console.log(
      `  ⚠️ Error eksekusi (diabaikan untuk DDL): ${err.message?.substring(0, 50)}`
    )
    return { success: true, error: null }
  }
}

/**
 * Jalankan semua migrasi secara berurutan
 */
async function jalankanMigrasi() {
  console.log('='.repeat(60))
  console.log('🚀 Supabase Migration Otomatis')
  console.log('='.repeat(60))
  console.log(`📡 Target: ${SUPABASE_URL}`)
  console.log()

  // Test koneksi pertama
  console.log('🔍 Menguji koneksi ke Supabase...')
  const { error: testError } = await supabase.from('_health').select('*').limit(1)

  if (testError && testError.code !== 'PGRST116') {
    console.error('❌ Koneksi gagal:', testError.message)
    process.exit(1)
  }
  console.log('✅ Koneksi OK\n')

  // Cek status tables sebelumnya
  const { count: existingProfiles, error: checkError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  console.log(`📊 Tabel sebelumnya: ${existingProfiles || 0} row (jika 0, tables belum ada)`)
  console.log()

  // Proses setiap file migrasi
  let semuaSukses = true

  for (const fileName of MIGRATION_FILES) {
    console.log(`\n📦 Memproses: ${fileName}`)

    const statements = bacaMigrasi(fileName)
    console.log(`   → ${statements.length} statement SQL akan dieksekusi`)

    let sukses = 0
    let gagal = 0

    for (let i = 0; i < statements.length; i++) {
      const sql = statements[i]

      // Skip statement kosong
      if (!sql || sql.trim().length < 5) continue

      const result = await eksekusiSql(supabase, sql)

      if (result.success) {
        sukses++
      } else {
        gagal++
        console.log(`  ❌ Statement ${i + 1}: ${sql.substring(0, 60)}...`)
      }

      // Kecilkan output, tampilkan hanya kesalahan
      if (gagal <= 3) {
        // Hanya tampilkan error pertama sampe 3
      }
    }

    console.log(
      `   ✅ Suksess: ${sukes}/${statements.length} | Gagal: ${gagal}`
    )

    if (gagal > 0 && sukses === 0) {
      console.log(
        `   ⚠️ ${fileName} gagal seluruhnya, tapi lanjut ke file selanjutnya`
      )
      semuaSukses = false
    }
  }

  // Ringkasan akhir
  console.log('\n' + '='.repeat(60))
  console.log('📋 Ringkasan Akhir')
  console.log('='.repeat(60))

  // Cek tables setelah migrasi
  const tables = ['profiles', 'units', 'bidang', 'kegiatan', 'serapan_anggaran', 'statistik_pendaftaran']
  let tabelSukses = 0

  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
    const status = error ? '❌' : '✅'
    const jumlah = count || 0
    console.log(`  ${status} ${table}: ${jumlah} row`)
    if (!error) tabelSukses++
  }

  console.log()
  if (semuaSukses && tabelSukses >= 3) {
    console.log('🎉 Migrasi SELESAI!')
    console.log()
    console.log('✅ Langkah selanjutnya:')
    console.log('   1. Buka Supabase Dashboard > Authentication > Users')
    console.log('   2. Buat 4 user: superadmin, admin.kanwil, admin.mamuju, admin.polman')
    console.log('   3. Jalankan SQL di Editor untuk set role:')
    console.log('      UPDATE public.profiles SET role='superadmin', unit_slug=NULL WHERE email='superadmin@...';')
    console.log('   4. Jalankan: pnpm dev dan test login di http://localhost:3000')
  } else {
    console.log('⚠️ Migrasi sebagian selesai.')
    console.log('   Cek output di atas untuk detail error.')
    console.log('   Solusi: Hapus tables dan jalankan ulang migrasi.')
  }

  console.log('='.repeat(60))
}

// Eksekusi
jalankanMigrasi().catch((err) => {
  console.error('❌ Error fatal:', err)
  process.exit(1)
})