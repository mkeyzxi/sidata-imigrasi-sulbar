-- Migration 007: Guard agar user tidak bisa menaikkan hak aksesnya sendiri
-- Date: 2026-11-23
--
-- Masalah: policy "Users can update own profile" (migration 001) memakai
--   USING (auth.uid() = id) WITH CHECK (auth.uid() = id)
-- tanpa membatasi kolom — sehingga user mana pun bisa menjalankan
--   update profiles set role = 'superadmin' where id = auth.uid()
-- dan langsung menjadi superadmin.
--
-- Trigger ini memblokir perubahan role / unit_slug / is_active oleh:
--   * user atas dirinya sendiri, KECUALI hasilnya persis peta email resmi
--     (self-heal milik superadmin@ / admin.kanwil@ / admin.mamuju@ / admin.polman@)
--   * semua user yang bukan superadmin atas profil lain
-- Dan tetap mengizinkan:
--   * superadmin (baik atas profil sendiri maupun orang lain)
--   * server / service role (auth.uid() IS NULL) — API, seed, create-admins.ts
--
-- Jalankan di Supabase SQL Editor setelah 004, 005, 006.

CREATE OR REPLACE FUNCTION public.profiles_privilege_guard()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_expected_role  TEXT;
  v_expected_unit  TEXT;
  v_email          TEXT := lower(coalesce(OLD.email, ''));
BEGIN
  -- Tidak ada perubahan hak akses -> biarkan (mis. update full_name/updated_at)
  IF NEW.role IS NOT DISTINCT FROM OLD.role
     AND NEW.unit_slug IS NOT DISTINCT FROM OLD.unit_slug
     AND NEW.is_active IS NOT DISTINCT FROM OLD.is_active
  THEN
    RETURN NEW;
  END IF;

  -- Server / service role / SQL editor (tanpa konteks auth) -> boleh
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  -- Superadmin aktif -> boleh mengubah hak akses siapa pun
  IF EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'superadmin' AND p.is_active = true
  ) THEN
    RETURN NEW;
  END IF;

  -- Self-heal oleh user atas profilnya sendiri: hanya boleh bila hasilnya
  -- tepat sama dengan peta resmi milik emailnya sendiri.
  IF auth.uid() = OLD.id AND v_email IN (
    'superadmin@sidata-imigrasi-sulbar.go.id',
    'admin.kanwil@sidata-imigrasi-sulbar.go.id',
    'admin.mamuju@sidata-imigrasi-sulbar.go.id',
    'admin.polman@sidata-imigrasi-sulbar.go.id'
  ) THEN
    v_expected_role := CASE v_email
      WHEN 'superadmin@sidata-imigrasi-sulbar.go.id'   THEN 'superadmin'
      WHEN 'admin.kanwil@sidata-imigrasi-sulbar.go.id' THEN 'admin_kanwil'
      WHEN 'admin.mamuju@sidata-imigrasi-sulbar.go.id' THEN 'admin_mamuju'
      WHEN 'admin.polman@sidata-imigrasi-sulbar.go.id' THEN 'admin_polman'
    END;
    v_expected_unit := CASE v_email
      WHEN 'admin.kanwil@sidata-imigrasi-sulbar.go.id' THEN 'kanwil-sulbar'
      WHEN 'admin.mamuju@sidata-imigrasi-sulbar.go.id' THEN 'imigrasi-mamuju'
      WHEN 'admin.polman@sidata-imigrasi-sulbar.go.id' THEN 'imigrasi-polman'
      ELSE NULL
    END;

    IF NEW.role = v_expected_role
       AND NEW.unit_slug IS NOT DISTINCT FROM v_expected_unit
       AND NEW.is_active IS NOT DISTINCT FROM OLD.is_active
    THEN
      RETURN NEW;
    END IF;
  END IF;

  RAISE EXCEPTION
    'Perubahan role/unit/status hanya boleh dilakukan superadmin.';
END;
$$;

DROP TRIGGER IF EXISTS profiles_privilege_guard ON public.profiles;
CREATE TRIGGER profiles_privilege_guard
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.profiles_privilege_guard();
