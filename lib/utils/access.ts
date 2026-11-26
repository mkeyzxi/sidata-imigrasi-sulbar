/**
 * Access-control helper untuk SI DATA Imigrasi Sulbar.
 *
 * Mendukung 2 Peran Utama:
 * 1. Super Admin ('superadmin') -> Hak akses penuh seluruh sistem & manajemen pengguna.
 * 2. Admin Biasa ('admin' atau 'admin_<unit>') -> Mengelola unit kerja masing-masing:
 *    - 'kanwil-sulbar'   -> Kantor Wilayah Sulawesi Barat
 *    - 'imigrasi-mamuju' -> Kantor Imigrasi Kelas II Non TPI Mamuju
 *    - 'imigrasi-polman' -> Kantor Imigrasi Kelas II Non TPI Polman
 */

export const AVAILABLE_UNITS = [
  {
    id: 'kanwil-sulbar',
    name: 'Kantor Wilayah Sulawesi Barat',
    shortName: 'Kanwil Sulbar',
    roleAlias: 'admin_kanwil',
  },
  {
    id: 'imigrasi-mamuju',
    name: 'Kantor Imigrasi Kelas II Non TPI Mamuju',
    shortName: 'Kanim Mamuju',
    roleAlias: 'admin_mamuju',
  },
  {
    id: 'imigrasi-polman',
    name: 'Kantor Imigrasi Kelas II Non TPI Polman',
    shortName: 'Kanim Polman',
    roleAlias: 'admin_polman',
  },
] as const

export const ROLE_EMAIL_MAP: Record<string, { role: string; unit_slug: string | null; label: string }> = {
  'admin.kanwil@sidata-imigrasi-sulbar.go.id': {
    role: 'admin',
    unit_slug: 'kanwil-sulbar',
    label: 'Admin Kanwil Sulbar',
  },
  'admin.mamuju@sidata-imigrasi-sulbar.go.id': {
    role: 'admin',
    unit_slug: 'imigrasi-mamuju',
    label: 'Admin Imigrasi Mamuju',
  },
  'admin.polman@sidata-imigrasi-sulbar.go.id': {
    role: 'admin',
    unit_slug: 'imigrasi-polman',
    label: 'Admin Imigrasi Polman',
  },
  'superadmin@sidata-imigrasi-sulbar.go.id': {
    role: 'superadmin',
    unit_slug: null,
    label: 'Super Admin',
  },
}

export const UNIT_SLUG_MAP: Record<string, { role: string; label: string; email: string }> = {
  'kanwil-sulbar': { role: 'admin_kanwil', label: 'Kanwil Sulbar', email: 'admin.kanwil@sidata-imigrasi-sulbar.go.id' },
  'imigrasi-mamuju': { role: 'admin_mamuju', label: 'Imigrasi Mamuju', email: 'admin.mamuju@sidata-imigrasi-sulbar.go.id' },
  'imigrasi-polman': { role: 'admin_polman', label: 'Imigrasi Polman', email: 'admin.polman@sidata-imigrasi-sulbar.go.id' },
}

/** Diberikan email, kembalikan role & unit_slug bawaan jika ada di map default */
export function roleFromEmail(email: string) {
  const match = ROLE_EMAIL_MAP[email?.toLowerCase()?.trim() ?? '']
  if (!match) return null
  return match
}

/** Role admin unit -> unit bawaannya. */
export function unitFromRole(role: string | null | undefined): string | null {
  switch (role) {
    case 'admin_kanwil':
      return 'kanwil-sulbar'
    case 'admin_mamuju':
      return 'imigrasi-mamuju'
    case 'admin_polman':
      return 'imigrasi-polman'
    default:
      return null
  }
}

/**
 * Peran EFEKTIF untuk UI & query.
 */
export function effectiveAccess(profile: {
  email?: string | null
  role?: string | null
  unit_slug?: string | null
} | null | undefined): { role: string; unit_slug: string | null; label: string; fromEmail: boolean } {
  if (!profile) {
    return { role: 'viewer', unit_slug: null, label: 'Viewer', fromEmail: false }
  }

  const role = profile.role ?? 'viewer'
  const unit_slug = profile.unit_slug ?? unitFromRole(role)

  // Jika role admin tapi unit belum terisi, coba cek email map jika ada
  if (!unit_slug && profile.email) {
    const mapped = ROLE_EMAIL_MAP[profile.email.toLowerCase().trim()]
    if (mapped) {
      return {
        role: mapped.role,
        unit_slug: mapped.unit_slug,
        label: mapped.label,
        fromEmail: true,
      }
    }
  }

  return {
    role,
    unit_slug,
    label: roleLabel(role, unit_slug),
    fromEmail: false,
  }
}

type SyncClient = {
  from(table: 'profiles'): {
    update(values: Record<string, unknown>): {
      eq(column: string, value: string): {
        select(columns: string): { single(): PromiseLike<{ data: { id: string; email: string | null; role: string; unit_slug: string | null } | null }> }
      }
    }
  }
}

/**
 * Penyelarasan profil dengan email resmi (self-heal jika kosong).
 */
export async function syncOfficialProfile(
  client: SyncClient,
  profile: { id: string; email?: string | null; role?: string | null; unit_slug?: string | null },
): Promise<{ id: string; email: string | null; role: string; unit_slug: string | null } | null> {
  const email = profile.email?.toLowerCase().trim()
  const mapped = email ? ROLE_EMAIL_MAP[email] : undefined
  if (!mapped) return null
  if (profile.role && profile.role !== 'viewer' && profile.unit_slug) return null

  try {
    const { data } = await client
      .from('profiles')
      .update({
        role: mapped.role,
        unit_slug: mapped.unit_slug,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id)
      .select('id, email, role, unit_slug')
      .single()
    return data ?? null
  } catch {
    return null
  }
}

/** Apakah profil bisa mengelola (tambah/edit/hapus) unit tertentu? */
export function canManageUnit(
  profile: { role?: string; unit_slug?: string | null } | null | undefined,
  unitId: string,
): boolean {
  if (!profile) return false
  if (profile.role === 'superadmin') return true

  // Role admin biasa dengan unit_slug
  if (profile.role === 'admin' && profile.unit_slug === unitId) return true

  // Legacy role checks
  if (profile.role === 'admin_kanwil' && unitId === 'kanwil-sulbar') return true
  if (profile.role === 'admin_mamuju' && unitId === 'imigrasi-mamuju') return true
  if (profile.role === 'admin_polman' && unitId === 'imigrasi-polman') return true

  // If unit_slug matches target unit
  if (profile.unit_slug === unitId) return true

  return false
}

/** Role label yang ramah untuk UI. */
export function roleLabel(role: string | null | undefined, unit_slug?: string | null): string {
  if (role === 'superadmin') return 'Super Admin'
  
  if (role === 'admin') {
    if (unit_slug === 'kanwil-sulbar') return 'Admin Kanwil Sulbar'
    if (unit_slug === 'imigrasi-mamuju') return 'Admin Kanim Mamuju'
    if (unit_slug === 'imigrasi-polman') return 'Admin Kanim Polman'
    return 'Admin Bidang/Unit'
  }

  switch (role) {
    case 'admin_kanwil':
      return 'Admin Kanwil Sulbar'
    case 'admin_mamuju':
      return 'Admin Imigrasi Mamuju'
    case 'admin_polman':
      return 'Admin Imigrasi Polman'
    case 'viewer':
      return 'Viewer'
    default:
      return role ?? '—'
  }
}

/** Warna badge role (Tailwind). */
export function roleColor(role: string | null | undefined, unit_slug?: string | null): string {
  if (role === 'superadmin') return 'bg-amber-100 text-amber-800 border-amber-200'
  
  const targetUnit = unit_slug ?? unitFromRole(role)
  if (targetUnit === 'kanwil-sulbar') return 'bg-blue-100 text-blue-800 border-blue-200'
  if (targetUnit === 'imigrasi-mamuju') return 'bg-emerald-100 text-emerald-800 border-emerald-200'
  if (targetUnit === 'imigrasi-polman') return 'bg-purple-100 text-purple-800 border-purple-200'

  return 'bg-gray-100 text-gray-700 border-gray-200'
}
