-- Migration 005: Seed 4 admin users (email -> role -> unit)
-- Date: 2026-11-23
--
-- Password default: email.split('@')[0] + '@2026'
--   - admin.kanwil@...   -> admin.kanwil@2026
--   - admin.mamuju@...   -> admin.mamuju@2026
--   - admin.polman@...   -> admin.polman@2026
--   - superadmin@...     -> superadmin@2026
--
-- Jalankan ini DI SUPABASE SQL EDITOR setelah menjalankan
-- supabase/migrations/create-admins.ts (atau script auth admin).
-- Jika akun sudah ada di Supabase Auth, hanya baris INSERT
-- profiles yang diproses (ON CONFLICT DO NOTHING).

-- ============================================================
-- Ensure profiles exist (id = Supabase Auth user id,
-- use email-based lookup when id is not known yet)
-- ============================================================

-- 1. Superadmin
INSERT INTO public.profiles (id, email, full_name, role, unit_slug, is_active)
SELECT
  auth.users.id,
  auth.users.email,
  'Super Administrator',
  'superadmin',
  NULL,
  true
FROM auth.users
WHERE auth.users.email = 'superadmin@sidata-imigrasi-sulbar.go.id'
ON CONFLICT (id) DO UPDATE
  SET role = 'superadmin',
      unit_slug = NULL,
      is_active = true;

-- 2. Admin Kanwil Sulbar
INSERT INTO public.profiles (id, email, full_name, role, unit_slug, is_active)
SELECT
  auth.users.id,
  auth.users.email,
  'Admin Kanwil Sulbar',
  'admin_kanwil',
  'kanwil-sulbar',
  true
FROM auth.users
WHERE auth.users.email = 'admin.kanwil@sidata-imigrasi-sulbar.go.id'
ON CONFLICT (id) DO UPDATE
  SET role = 'admin_kanwil',
      unit_slug = 'kanwil-sulbar',
      is_active = true;

-- 3. Admin Imigrasi Mamuju
INSERT INTO public.profiles (id, email, full_name, role, unit_slug, is_active)
SELECT
  auth.users.id,
  auth.users.email,
  'Admin Imigrasi Mamuju',
  'admin_mamuju',
  'imigrasi-mamuju',
  true
FROM auth.users
WHERE auth.users.email = 'admin.mamuju@sidata-imigrasi-sulbar.go.id'
ON CONFLICT (id) DO UPDATE
  SET role = 'admin_mamuju',
      unit_slug = 'imigrasi-mamuju',
      is_active = true;

-- 4. Admin Imigrasi Polman
INSERT INTO public.profiles (id, email, full_name, role, unit_slug, is_active)
SELECT
  auth.users.id,
  auth.users.email,
  'Admin Imigrasi Polman',
  'admin_polman',
  'imigrasi-polman',
  true
FROM auth.users
WHERE auth.users.email = 'admin.polman@sidata-imigrasi-sulbar.go.id'
ON CONFLICT (id) DO UPDATE
  SET role = 'admin_polman',
      unit_slug = 'imigrasi-polman',
      is_active = true;
