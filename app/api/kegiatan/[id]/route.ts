import {NextResponse} from 'next/server'
import {getKegiatanDetail} from '@/lib/supabase/data-service'

// GET /api/kegiatan/[id] — Ambil detail satu kegiatan publik
export async function GET(req: Request, {params}: {params: Promise<{id: string}>}) {
  const {id} = await params
  const kegiatan = await getKegiatanDetail(id)

  if (!kegiatan) {
    return NextResponse.json({error: 'Kegiatan tidak ditemukan'}, {status: 404})
  }

  return NextResponse.json({kegiatan})
}
