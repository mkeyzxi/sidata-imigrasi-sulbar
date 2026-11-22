/**
 * Create admin users in Supabase
 * Run this script via: tsx supabase/create-admins.ts
 * Or manually run each query in Supabase SQL Editor
 */

// These are the 4 users to create (1 superadmin + 3 unit admins)
// Replace emails with actual staff emails before running

const ADMINS = [
  {
    email: 'superadmin@sidata-imigrasi-sulbar.go.id',
    password: 'SuperAdmin@2026!',
    full_name: 'Super Admin',
    role: 'superadmin',
    unit_slug: null as string | null,
  },
  {
    email: 'admin.kanwil@sidata-imigrasi-sulbar.go.id',
    password: 'AdminKanwil@2026!',
    full_name: 'Admin Kanwil Sulbar',
    role: 'admin_kanwil',
    unit_slug: 'kanwil-sulbar',
  },
  {
    email: 'admin.mamuju@sidata-imigrasi-sulbar.go.id',
    password: 'AdminMamuju@2026!',
    full_name: 'Admin Imigrasi Mamuju',
    role: 'admin_mamuju',
    unit_slug: 'imigrasi-mamuju',
  },
  {
    email: 'admin.polman@sidata-imigrasi-sulbar.go.id',
    password: 'AdminPolman@2026!',
    full_name: 'Admin Imigrasi Polman',
    role: 'admin_polman',
    unit_slug: 'imigrasi-polman',
  },
]

console.log('=== Create Admin Users in Supabase ===\n')
console.log('Step 1: Create auth.users records via Supabase Dashboard or API')
console.log('Step 2: The trigger in migration 001 auto-creates profiles')
console.log('Step 3: Update profiles to set the correct role and unit_slug')
console.log()

console.log('Manual SQL to run in Supabase SQL Editor:\n')

for (const admin of ADMINS) {
  console.log(`-- ${admin.full_name} (${admin.role})`)
  console.log(`-- 1. Create user in Supabase > Authentication > Users > Add user`)
  console.log(`--    Email: ${admin.email}`)
  console.log(`--    Password: ${admin.password}`)
  console.log(`--    (Or via API: supabase.auth.signUp())`)
  console.log(``)
  console.log(`-- 2. Update the profile role (run AFTER the user is created)`)
  console.log(`UPDATE public.profiles SET role = '${admin.role}', unit_slug = ${admin.unit_slug ? `'${admin.unit_slug}'` : 'NULL'} WHERE email = '${admin.email}';`)
  console.log(``)
}

console.log('Done! Now log in with each user to verify access.')
