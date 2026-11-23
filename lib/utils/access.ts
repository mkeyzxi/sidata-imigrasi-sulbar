/**
 * Access-control helper untuk SI DATA Imigrasi Sulbar.
 *
 * Konvensi email resmi (sumber kebenaran untuk pembagian wilayah):
 *   - admin.kanwil@sidata-imigrasi-sulbar.go.id  -> role: admin_kanwil, unit: kanwil-sulbar
 *   - admin.mamuju@sidata-imigrasi-sulbar.go.id  -> role: admin_mamuju, unit: imigrasi-mamuju
 *   - admin.polman@sidata-imigrasi-sulbar.go.id  -> role: admin_polman, unit: imigrasi-polman
 *   - superadmin@sidata-imigrasi-sulbar.go.id    -> role: superadmin (akses penuh + manajemen user)
 *
 * Fungsi di bawah dipakai oleh UI untuk menampilkan aksi, filter data,
 * dan memvalidasi form manajemen user agar email resmi mendapat
 * role & unit_slug yang tepat secara otomatis.
 */

export const ROLE_EMAIL_MAP: Record<string, { role: string; unit_slug: string | null; label: string }> = {
  'admin.kanwil@sidata-imigrasi-sulbar.go.id': {
    role: 'admin_kanwil',
    unit_slug: 'kanwil-sulbar',
    label: 'Admin Kanwil Sulbar',
  },
  'admin.mamuju@sidata-imigrasi-sulbar.go.id': {
    role: 'admin_mamuju',
    unit_slug: 'imigrasi-mamuju',
    label: 'Admin Imigrasi Mamuju',
  },
  'admin.polman@sidata-imigrasi-sulbar.go.id': {
    role: 'admin_polman',
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

/** Diberikan email, kembalikan role & unit_slug yang cocok. */
export function roleFromEmail(email: string) {
  const match = ROLE_EMAIL_MAP[email?.toLowerCase()?.trim() ?? '']
  if (!match) return { role: 'viewer', unit_slug: null as string | null, label: 'Viewer' }
  return match
}

/** Apakah profil bisa mengelola (tambah/edit/hapus) unit tertentu? */
export function canManageUnit(
  profile: { role?: string; unit_slug?: string | null } | null | undefined,
  unitId: string,
): boolean {
  if (!profile) return false
  if (profile.role === 'superadmin') return true
  if (profile.role === 'admin_kanwil' && unitId === 'kanwil-sulbar') return true
  if (profile.role === 'admin_mamuju' && unitId === 'imigrasi-mamuju') return true
  if (profile.role === 'admin_polman' && unitId === 'imigrasi-polman') return true
  return false
}

/** Role label yang ramah untuk UI. */
export function roleLabel(role: string | null | undefined): string {
  switch (role) {
    case 'superadmin':
      return 'Super Admin'
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
export function roleColor(role: string | null | undefined): string {
  switch (role) {
    case 'superadmin':
      return 'bg-accent/10 text-accent'
    case 'admin_kanwil':
      return 'bg-blue-100 text-blue-700'
    case 'admin_mamuju':
      return 'bg-green-100 text-green-700'
    case 'admin_polman':
      return 'bg-purple-100 text-purple-700'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}
