# SI DATA IMIGRASI SULBAR
> **Sistem Informasi & Portal Data Keimigrasian Terpadu**  
> Kantor Wilayah Direktorat Jenderal Imigrasi Sulawesi Barat

Portal data resmi dan terpadu untuk koordinasi, pelaporan statistik layanan, publikasi kegiatan, dan pengelolaan data keimigrasian di seluruh unit kerja wilayah Sulawesi Barat (Kanwil Sulbar, Kanim Kelas II Non TPI Mamuju, dan Kanim Kelas II Non TPI Polman).

---

## 🔑 Akun & Kredensial Akses

Sistem menggunakan pembagian **2 Tingkat Peran Utama**:
1. **Super Admin**: Mengelola seluruh sistem, memiliki hak akses penuh ke seluruh unit kerja, serta memegang kendali **Manajemen Pengguna** (membuat akun, menentukan peran, mengatur penugasan wilayah, dan mereset password).
2. **Admin Biasa (Admin Unit / Bidang)**: Ditugaskan khusus untuk mengelola data unit/bidang kerjanya masing-masing (Kanwil Sulbar, Kanim Mamuju, atau Kanim Polman) dengan kemampuan **penuh CRUD (Create, Read, Update, Delete)** pada Berita/Kegiatan dan Data Statistik. Menu manajemen pengguna otomatis disembunyikan dan diproteksi.

### Kredensial Akun Bawaan (Default):

| Email | Password | Tingkat Peran | Wilayah / Unit Penugasan | Hak Akses |
|---|---|---|---|---|
| `superadmin@sidata-imigrasi-sulbar.go.id` | `superadmin@2026` | **Super Admin** | Semua Unit (Pusat) | Akses Penuh ke Semua Unit + Manajemen Pengguna (`/admin/users`) |
| `admin.kanwil@sidata-imigrasi-sulbar.go.id` | `admin.kanwil@2026` | **Admin Biasa** | `kanwil-sulbar` | CRUD Kegiatan, Bidang, & Anggaran Kanwil Sulbar |
| `admin.mamuju@sidata-imigrasi-sulbar.go.id` | `admin.mamuju@2026` | **Admin Biasa** | `imigrasi-mamuju` | CRUD Paspor, Izin Tinggal, & Kegiatan Kanim Mamuju |
| `admin.polman@sidata-imigrasi-sulbar.go.id` | `admin.polman@2026` | **Admin Biasa** | `imigrasi-polman` | CRUD Paspor, Izin Tinggal, & Kegiatan Kanim Polman |

> [!TIP]
> Super Admin dapat menambahkan akun baru dengan alamat email bebas melalui menu **Manajemen Pengguna** (`/admin/users`), memilih peran (**Super Admin** atau **Admin Biasa**), serta memilih unit kerja yang ditugaskan.

---

## 🚀 Panduan Memulai Cepat

### 1. Prasyarat
- Node.js versi 18+ atau 20+
- Package Manager `pnpm` (disarankan) atau `npm`

### 2. Konfigurasi Lingkungan (`.env.local`)
Pastikan file `.env.local` telah terisi kredensial Supabase Anda:


### 3. Menjalankan Server Development
```bash
# Jalankan server lokal
pnpm dev

# Akses website publik di:
http://localhost:3000

# Akses halaman login admin di:
http://localhost:3000/login
```

### 4. Build Produksi
```bash
pnpm build
pnpm start
```

---

## 🗄️ Arsitektur Integrasi Supabase

Seluruh data website publik dan panel admin terhubung langsung dengan backend **Supabase**:

### Tabel Database Utama
1. `profiles`: Menyimpan data akun pengguna, peran (`role`), unit penugasan (`unit_slug`), dan status aktif.
2. `units`: Data unit kerja keimigrasian (`kanwil-sulbar`, `imigrasi-mamuju`, `imigrasi-polman`).
3. `bidang`: Struktur bidang organisasi di lingkungan Kanwil Sulbar.
4. `kegiatan`: Direktori artikel, berita resmi, dan kegiatan operasional terpublikasi (`published = true`).
5. `statistik_pendaftaran`: Rekapitulasi kuantitatif paspor, izin tinggal (ITK, ITAS, ITAP), WNA, TAK, BAP, intel-was, dan anggaran.
6. `serapan_anggaran`: Realisasi penyerapan anggaran bulanan per bidang kerja.

### File Migrasi SQL (`supabase/migrations/`)
- `001_create_profiles.sql`: Pembuatan tabel `profiles` dan trigger profil otomatis saat registrasi.
- `002_create_content_tables.sql`: Pembuatan tabel konten (`units`, `bidang`, `kegiatan`, `serapan_anggaran`, `statistik_pendaftaran`).
- `003_seed_data.sql`: Data awal (seed) dari data riil PINTAS Mamuju & statistik regional Sulbar.
- `004_strict_unit_rls.sql`: Aturan Row Level Security (RLS) berbasis unit kerja.
- `005_seed_admins.sql`: Sinkronisasi profil 4 akun resmi ke database.
- `006_complete_admin_crud_rls.sql`: Kebijakan RLS lengkap untuk Create, Read, Update, Delete per unit.
- `007_profile_privilege_guard.sql`: Guard trigger keamanan profil.
- `008_fix_rls_infinite_recursion.sql`: **Solusi RLS Infinite Recursion** menggunakan fungsi `SECURITY DEFINER` (`is_superadmin()`, `can_manage_unit()`) untuk keandalan query penuh.

---

## 🔌 API Routes Backend (Next.js App Router)

Aplikasi dilengkapi API handler yang aman dengan validasi sesi dan izin RBAC:

- **`GET /api/auth/profile`**: Mengambil profil pengguna yang sedang login secara independen dari RLS client.
- **`/api/admin/users`**:
  - `GET`: Mengambil daftar seluruh pengguna terdaftar (khusus Superadmin).
  - `POST`: Membuat akun baru di Supabase Auth & profiles.
  - `PATCH`: Memperbarui data pengguna, peran, unit penugasan, status aktif, atau password.
  - `DELETE`: Menghapus pengguna secara permanen dari sistem.
- **`/api/admin/kegiatan`**:
  - `GET`: Mengambil daftar kegiatan (difilter berdasarkan unit kerja admin).
  - `POST`: Menambah kegiatan baru untuk unit kerja yang diizinkan.
  - `PATCH`: Mengedit kegiatan milik unit kerja admin.
  - `DELETE`: Menghapus kegiatan milik unit kerja admin.
- **`/api/admin/data`**:
  - `GET`: Mengambil data statistik pendaftaran per unit.
  - `POST`: Menambah data statistik layanan baru.
  - `PATCH`: Memperbarui data statistik.
  - `DELETE`: Menghapus entri data statistik.
- **`GET /api/kegiatan`**: Endpoint publik untuk mengambil daftar kegiatan terbit dengan filter unit dan pencarian.

---

## 🌐 Halaman Website yang Terintegrasi

| Rute Halaman | Kategori | Sumber Data Supabase |
|---|---|---|
| `/` | Beranda | Ringkasan unit kerja dan portal navigasi terpadu |
| `/data` | Pusat Data Regional | Agregasi total paspor & izin tinggal dari `statistik_pendaftaran` |
| `/kegiatan` | Direktori Kegiatan | Arsip berita terbit real-time dari tabel `kegiatan` |
| `/kanwil-sulbar` | Unit Kanwil | Data bidang dari `bidang` & realisasi dari `serapan_anggaran` |
| `/kanwil-sulbar/[slug]` | Rincian Bidang | Kegiatan spesifik bidang & tabel serapan anggaran bulanan |
| `/imigrasi-mamuju` | Kanim Mamuju | Rincian data paspor, ITK/ITAS/ITAP, WNA, TAK dari database |
| `/imigrasi-polman` | Kanim Polman | Rincian data paspor, izin tinggal, dan kegiatan dari database |
| `/login` | Otentikasi | Login aman menggunakan Supabase Auth |
| `/admin` | Dashboard Admin | Kartu ringkasan modul & informasi akses pengguna login |
| `/admin/users` | Manajemen Pengguna | Pengelolaan akun Super Admin & Admin Biasa |
| `/admin/kegiatan` | CMS Berita & Kegiatan | Panel CRUD kegiatan unit kerja |
| `/admin/data` | CMS Data Statistik | Panel CRUD data layanan keimigrasian |

---

## 🎨 Design System

- **Primary Blue**: `#0B3A82`
- **Secondary Blue**: `#1558A6`
- **Yellow Accent**: `#F4C542`
- **Background**: `#F8FAFC`
- **Font**: Inter (Google Fonts)
- **Komposisi**: 60% Netral, 25% Biru Utama, 5% Aksen Kuning, 10% Teks/Kontras.
- **Standar**: Desain editorial resmi instansi pemerintah, bersih, responsif, dan bebas elemen dekoratif artifisial.
