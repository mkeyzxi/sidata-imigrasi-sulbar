import {NextResponse} from 'next/server'
import {cookies} from 'next/headers'
import {createServerClient} from '@supabase/ssr'
import {createSupabaseServerClient} from '@/lib/supabase/server'
import {roleFromEmail} from '@/lib/utils/access'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!url || !anonKey) {
    return NextResponse.json(
      {error: 'Supabase URL atau Anon Key belum dikonfigurasi'},
      {status: 500},
    )
  }

  const cookieStore = await cookies()
  const auth = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({name, value, options}) => cookieStore.set(name, value, options))
        } catch {
          // Ignore
        }
      },
    },
  })

  const {
    data: {user},
  } = await auth.auth.getUser()

  if (!user) {
    return NextResponse.json({error: 'Tidak ada sesi aktif'}, {status: 401})
  }

  // Gunakan service role server client untuk mem-bypass RLS (mencegah infinite recursion)
  const service = createSupabaseServerClient()

  let {data: profile} = await service.from('profiles').select('*').eq('id', user.id).single()

  // Jika profile belum ada di database, buat otomatis
  if (!profile) {
    const defaultMeta = roleFromEmail(user.email || '')
    const newProfile = {
      id: user.id,
      email: user.email,
      full_name: (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || '',
      role: defaultMeta?.role || 'viewer',
      unit_slug: defaultMeta?.unit_slug || null,
      is_active: true,
    }

    const {data: created} = await service.from('profiles').insert(newProfile).select('*').single()

    profile = created || newProfile
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
    },
    profile,
  })
}
