import {NextResponse} from 'next/server'
import {getKegiatanList} from '@/lib/supabase/data-service'

// GET /api/kegiatan — Ambil daftar kegiatan publik yang terbit
export async function GET(req: Request) {
  const {searchParams} = new URL(req.url)
  const unit_id = searchParams.get('unit_id') || undefined
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined

  const kegiatan = await getKegiatanList({unit_id, limit})
  return NextResponse.json({kegiatan})
}
