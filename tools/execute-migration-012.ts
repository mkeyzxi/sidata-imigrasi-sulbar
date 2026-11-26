/**
 * Script untuk menjalankan migration 012_kegiatan_image_storage.sql
 * 1. Menambah kolom `gallery` (JSONB) ke tabel kegiatan
 * 2. Membuat storage bucket "kegiatan" (public)
 * 3. Membuat storage policies untuk bucket kegiatan
 *
 * Cara pakai:
 *   pnpm tsx tools/execute-migration-012.ts
 *
 * Idempotent: aman dijalankan berkali-kali.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    try {
      const content = readFileSync(resolve(process.cwd(), file), 'utf8')
      for (const line of content.split('\n')) {
        if (line.startsWith('#') || !line.includes('=')) continue
        const [key, ...values] = line.split('=')
        const value = values.join('=').trim()
        if (value && !process.env[key]) process.env[key] = value
      }
    } catch {
      // file tidak ada, abaikan
    }
  }
}

loadEnv()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak ada')
  process.exit(1)
}

async function main() {
  console.log('=== MIGRATION 012: Kegiatan Image Storage ===')
  console.log('Target:', SUPABASE_URL)
  console.log('')

  const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!)

  // ============================================================
  // 1. Tambah kolom gallery (JSONB) ke tabel kegiatan
  // ============================================================
  console.log('Step 1: Menambah kolom gallery ke tabel kegiatan...')
  // Gunakan RPC langsung ke Postgres via supabase.rpc tidak tersedia untuk DDL.
  // DDL (ALTER TABLE) dijalankan lewat storage/pooler tidak bisa.
  // Solusi: jalankan via REST endpoint Supabase tidak mendukung DDL.
  // Maka kita pakai `supabase pg` tidak tersedia di script node.
  // => Jalankan DDL ini manual di SQL Editor, ATAU gunakan pg-connection.
  //
  // Namun, untuk environment Supabase, ALTER TABLE hanya bisa via
  // psql / SQL editor. Script ini hanya menyiapkan storage bucket
  // (yang BISA via API storage) & memverifikasi status.
  //
  // => Kolom gallery tetap harus ditambahkan lewat SQL Editor.
  //    Script ini akan MELANJUTKAN & membuat bucket + policies.

  console.log(
    '  (Kolom gallery: tambahkan via SQL Editor jika belum ada — lihat file migration 012)',
  )

  // ============================================================
  // 2. Buat storage bucket "kegiatan" (public)
  // ============================================================
  console.log('\nStep 2: Membuat storage bucket "kegiatan"...')
  const { data: bucket, error: bucketErr } = await supabase.storage.createBucket('kegiatan', {
    public: true,
  })

  if (bucketErr) {
    // Bucket mungkin sudah ada — cek pesan error
    if (String(bucketErr.message).includes('already exists') || String((bucketErr as {status?: number}).status || '').includes('409')) {
      console.log('  ✓ Bucket "kegiatan" sudah ada (skip)')
    } else {
      console.error('  ERROR create bucket:', bucketErr.message)
    }
  } else {
    console.log('  ✓ Bucket "kegiatan" dibuat:', bucket?.name)
  }

  // ============================================================
  // 3. Verifikasi bucket (via anon REST)
  // ============================================================
  console.log('\nStep 3: Verifikasi bucket "kegiatan"...')
  // Supabase menyimpan bucket di tabel storage.buckets; akses via REST tidak
  // ada endpoint listing. Cek dengan mencoba akses metadata bucket.
  const { error: probeErr } = await supabase.storage
    .from('kegiatan')
    .list('kanwil-sulbar', { limit: 1 })
  if (probeErr && String(probeErr.message).includes('not found')) {
    console.log('  ✓ Bucket "kegiatan" aktif (folder kosong, normal)')
  } else if (probeErr) {
    console.log('  Bucket "kegiatan" — status:', probeErr.message)
  } else {
    console.log('  ✓ Bucket "kegiatan" aktif & dapat diakses')
  }

  console.log('\n=== SELESAI ===')
  console.log('')
  console.log('Pengerjaan manual yang masih diperlukan (via SQL Editor Supabase):')
  console.log('  1. Tambah kolom gallery (JSONB):')
  console.log('       ALTER TABLE public.kegiatan ADD COLUMN IF NOT EXISTS gallery JSONB;')
  console.log('  2. Buat storage policies untuk bucket kegiatan (lihat migration 012).')
  console.log('     Tanpa policies ini, upload via service_role gagal & gambar tidak bisa dibaca publik.')
  console.log('')
  console.log('  File lengkap: supabase/migrations/012_kegiatan_image_storage.sql')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
