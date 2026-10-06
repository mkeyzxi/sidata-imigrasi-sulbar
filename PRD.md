# PRD — SI DATA IMIGRASI SULBAR

## Sistem Informasi Data Keimigrasian Terintegrasi Sulawesi Barat

**Platform:** Web  
**Framework:** Next.js App Router + TypeScript  
**Tahap saat ini:** UI/UX + Dummy Data  
**Target pengguna:** Masyarakat, pegawai, pimpinan, dan pihak yang membutuhkan informasi data keimigrasian Sulawesi Barat  
**Konsep utama:** Data-first, institutional, modern, sederhana, cepat dipahami

---

# 1. RINGKASAN PRODUK

**SI DATA IMIGRASI SULBAR** adalah website informasi dan visualisasi data keimigrasian yang menyajikan informasi berdasarkan unit kerja di wilayah Sulawesi Barat.

Website tidak dirancang sebagai website company profile konvensional.

Website **tidak menggunakan halaman depan dengan navigasi Home, Beranda, Tentang, dan menu marketing lainnya**.

Sebaliknya, pengalaman utama website dimulai langsung dari pemilihan unit kerja.

Saat pengguna membuka website:

```text
┌────────────────────────────────────────────────────────┐
│                                                        │
│             SI DATA IMIGRASI SULBAR                    │
│ Sistem Informasi Data Keimigrasian Terintegrasi Sulbar │
│                                                        │
│   ┌───────────┐  ┌───────────┐  ┌───────────┐         │
│   │           │  │           │  │           │         │
│   │  KANWIL   │  │  MAMUJU   │  │  POLMAN   │         │
│   │           │  │           │  │           │         │
│   │     →     │  │     →     │  │     →     │         │
│   └───────────┘  └───────────┘  └───────────┘         │
│                                                        │
└────────────────────────────────────────────────────────┘
```

Pengguna memilih salah satu dari tiga unit.

Kemudian website berpindah ke halaman unit tersebut.

---

# 2. NAMA DAN IDENTITAS

## Nama Pendek

```text
SI DATA IMIGRASI SULBAR
```

## Nama Lengkap

```text
Sistem Informasi Data Keimigrasian
Terintegrasi Sulawesi Barat
```

## Identitas Visual

Dominan:

```text
Biru + Kuning
```

Biru digunakan sebagai warna institusional utama.

Kuning digunakan sebagai accent dan visual emphasis.

---

# 3. MASALAH YANG INGIN DISELESAIKAN

Informasi keimigrasian dapat tersebar dalam berbagai bentuk:

- data layanan;
- data penerbitan paspor;
- data izin tinggal;
- kegiatan;
- kegiatan Intel-WAS;
- data bidang/seksi;
- serapan anggaran.

Pengguna membutuhkan cara yang lebih sederhana untuk memahami:

> Unit mana yang ingin dilihat?

kemudian:

> Data apa yang dimiliki unit tersebut?

kemudian:

> Kegiatan apa yang dilakukan?

dan:

> Bagaimana data dan kegiatan tersebut dapat dilihat berdasarkan periode?

SI DATA IMIGRASI SULBAR menyelesaikan masalah tersebut dengan pendekatan:

```text
Pilih Unit
↓
Pilih Bidang / Seksi / Data
↓
Lihat Data
↓
Lihat Kegiatan
↓
Lihat Anggaran
```

---

# 4. TUJUAN PRODUK

## Tujuan utama

Menyediakan satu portal visual yang membuat data keimigrasian Sulawesi Barat mudah:

- ditemukan;
- dipahami;
- dibandingkan;
- ditelusuri berdasarkan unit;
- ditelusuri berdasarkan periode;
- ditelusuri berdasarkan bidang/seksi;
- dilihat kegiatan dan anggarannya.

---

# 5. TUJUAN UX

Pengguna harus dapat memahami struktur website tanpa perlu mempelajari cara menggunakannya.

Target pengalaman:

```text
Buka website
↓
Melihat 3 unit
↓
Klik unit
↓
Langsung memahami struktur data
↓
Klik bidang/seksi/data
↓
Melihat informasi
```

Tidak boleh ada proses:

```text
Buka website
↓
Baca navbar
↓
Cari Home
↓
Cari menu
↓
Cari unit
↓
Cari data
```

---

# 6. PERSYARATAN UTAMA LANDING SCREEN

Ini merupakan requirement penting.

## Saat website pertama kali dibuka:

Halaman harus:

```text
width: 100vw
height: 100vh
```

dan:

```text
overflow: hidden
```

Tidak boleh ada vertical scrolling pada landing screen.

Tidak boleh ada:

- navbar;
- menu Home;
- menu Beranda;
- menu Tentang;
- menu Kontak;
- footer;
- sidebar;
- dashboard navigation;
- section panjang;
- carousel otomatis.

---

# 7. LANDING SCREEN

Landing screen hanya memiliki beberapa elemen inti:

```text
Logo / Nama
Judul
Deskripsi singkat
3 Unit Card
```

Tidak boleh terlalu ramai.

---

## Struktur landing screen

```text
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                    SI DATA IMIGRASI                       │
│                         SULBAR                            │
│                                                          │
│       Sistem Informasi Data Keimigrasian                  │
│              Terintegrasi Sulawesi Barat                  │
│                                                          │
│                                                          │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│   │              │ │              │ │              │     │
│   │  KANWIL      │ │  MAMUJU      │ │  POLMAN      │     │
│   │              │ │              │ │              │     │
│   │      →       │ │      →       │ │      →       │     │
│   └──────────────┘ └──────────────┘ └──────────────┘     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

# 8. TIGA CARD UTAMA

Tiga card utama adalah pintu masuk seluruh sistem.

## Card 01

```text
KANTOR WILAYAH
SULAWESI BARAT
```

Link:

```text
/kanwil-sulbar
```

---

## Card 02

```text
KANTOR IMIGRASI KELAS II
NON TPI MAMUJU
```

Link:

```text
/imigrasi-mamuju
```

---

## Card 03

```text
KANTOR IMIGRASI KELAS II
NON TPI POLMAN
```

Link:

```text
/imigrasi-polman
```

---

# 9. CARD HOMEPAGE

Card bukan sekadar tombol.

Setiap card harus memperlihatkan identitas unit.

Recommended:

```text
┌──────────────────────────────┐
│                              │
│       FOTO GEDUNG            │
│                              │
├──────────────────────────────┤
│ 01                           │
│                              │
│ Kantor Wilayah               │
│ Sulawesi Barat               │
│                              │
│ Lihat Data                →  │
└──────────────────────────────┘
```

Untuk Mamuju dan Polman gunakan foto gedung masing-masing jika tersedia.

Untuk Kanwil gunakan foto gedung Kanwil jika tersedia.

---

# 10. FOTO GEDUNG

Foto gedung merupakan elemen visual penting.

Gunakan:

```text
Foto gedung nyata
```

bukan:

```text
AI generated government building
```

Prioritas:

```text
Foto resmi
↓
Dokumentasi institusi
↓
Foto lapangan yang relevan
```

Foto digunakan untuk memberikan identitas nyata pada masing-masing unit.

---

# 11. CLICK BEHAVIOR

Saat card diklik:

```text
Card
↓
Transition
↓
Halaman Unit
```

Tidak menggunakan modal.

Tidak menggunakan popup.

Tidak menggunakan accordion sebagai pengganti halaman.

Navigasi menggunakan route.

---

# 12. GLOBAL NAVIGATION RULE

Website publik **tidak menggunakan navbar tradisional**.

Tidak ada menu:

```text
Home
Beranda
Tentang
Kontak
Layanan
```

di bagian atas setiap halaman.

Navigasi dilakukan secara kontekstual.

Contoh:

```text
← Kembali
```

atau:

```text
← Kanwil Sulbar
```

Navigasi harus membantu pengguna kembali, bukan menjadi menu besar.

---

# 13. INFORMASI ARSITEKTUR

Struktur utama:

```text
SI DATA IMIGRASI SULBAR
│
├── 1. KANTOR WILAYAH SULAWESI BARAT
│   │
│   ├── Bidang 1
│   │   ├── Kegiatan
│   │   └── Serapan Anggaran
│   │
│   ├── Bidang 2
│   │   ├── Kegiatan
│   │   └── Serapan Anggaran
│   │
│   └── Bidang 3
│       ├── Kegiatan
│       └── Serapan Anggaran
│
├── 2. IMIGRASI MAMUJU
│   │
│   ├── Penerbitan Paspor
│   ├── Izin Tinggal
│   │   ├── ITK
│   │   ├── ITAP
│   │   └── ITAS
│   │
│   └── GIAT INTEL-WAS
│       ├── Seksi
│       ├── Kegiatan
│       └── Serapan Anggaran
│
└── 3. IMIGRASI POLMAN
    │
    ├── Penerbitan Paspor
    ├── Izin Tinggal
    │   ├── ITK
    │   ├── ITAP
    │   └── ITAS
    │
    └── GIAT INTEL-WAS
        ├── Seksi
        ├── Kegiatan
        └── Serapan Anggaran
```

---

# 14. CATATAN NOMENKLATUR IZIN TINGGAL

Jenis data yang disediakan:

```text
ITK
ITAP
ITAS
```

Referensi PINTAS menggunakan nomenklatur:

```text
ITAS / ITAP / ITK
```



Pada PRD ini, UI direkomendasikan menggunakan istilah resmi **ITAS — Izin Tinggal Terbatas**.

Jika sumber data internal menggunakan istilah berbeda seperti `UTAS`, lakukan pemetaan di layer data, bukan mengubah struktur UI secara sembarangan.

---

# 15. RULE IZIN TINGGAL

**JANGAN MENAMPILKAN PERSENTASE.**

Tidak boleh:

```text
ITK 40%
ITAP 20%
ITAS 40%
```

Gunakan angka absolut:

```text
ITK     32
ITAP    12
ITAS    48
```

Tujuannya agar data tetap sederhana dan tidak memberikan interpretasi yang tidak diperlukan.

---

# 16. HALAMAN KANWIL SULBAR

Route:

```text
/kanwil-sulbar
```

Halaman ini merupakan halaman utama untuk:

```text
Kantor Wilayah Sulawesi Barat
```

Fokus utama:

```text
3 Bidang
↓
Kegiatan
↓
Serapan Anggaran
```

---

# 17. KANWIL — STRUCTURE

Halaman:

```text
← Kembali

KANTOR WILAYAH
SULAWESI BARAT

Pilih bidang yang ingin dilihat.

01  Bidang 1                  →
02  Bidang 2                  →
03  Bidang 3                  →
```

Tidak perlu membuat navbar.

---

# 18. BIDANG 1 / BIDANG 2 / BIDANG 3

Setiap bidang harus mempunyai halaman detail.

Contoh:

```text
/kanwil-sulbar/bidang/1
```

atau:

```text
/kanwil-sulbar/bidang/[slug]
```

---

# 19. BIDANG DETAIL

Struktur:

```text
← Kanwil Sulbar

BIDANG 1

Deskripsi singkat bidang.

KEGIATAN
↓
Daftar kegiatan
↓
Tanggal
↓
Lokasi / informasi
↓
Serapan anggaran bulanan
```

---

# 20. KEGIATAN BIDANG

Setiap kegiatan mempunyai minimal:

```text
ID
Judul
Tanggal
Lokasi
Deskripsi
Unit
Bidang
Foto
```

Contoh:

```text
SOSIALISASI PELAYANAN KEIMIGRASIAN

12 September 2026
Mamuju

Kegiatan sosialisasi pelayanan keimigrasian
kepada masyarakat.
```

---

# 21. FORMAT KEGIATAN

Activity card:

```text
12 SEPTEMBER 2026

Sosialisasi Pelayanan Keimigrasian

Bidang 1
Kantor Wilayah Sulawesi Barat

Lihat kegiatan →
```

Jika dokumentasi tersedia:

```text
Foto
+
Tanggal
+
Judul
+
Informasi
```

---

# 22. DAFTAR KEGIATAN

Kegiatan harus dapat ditampilkan sebagai:

```text
Timeline
```

atau:

```text
Editorial List
```

Bukan seluruhnya dalam kumpulan card besar.

Contoh:

```text
SEPTEMBER 2026

12
Sosialisasi Pelayanan Keimigrasian

18
Koordinasi Antarinstansi

25
Evaluasi Pelaksanaan Program
```

---

# 23. SERAPAN ANGGARAN BIDANG

Setiap bidang mempunyai data anggaran sendiri.

Contoh struktur:

```text
Bidang 1
 └── Anggaran
     ├── Januari
     ├── Februari
     ├── Maret
     ├── April
     └── ...
```

Demikian pula:

```text
Bidang 2
Bidang 3
```

---

# 24. ANGGARAN BULANAN

Minimal mempunyai:

```text
Bulan
Pagu
Realisasi
```

Contoh:

```text
September 2026

Pagu
Rp 50.000.000

Realisasi
Rp 37.500.000
```

Visual:

```text
September

Rp 37.500.000

████████████████
```

---

# 25. HALAMAN IMIGRASI MAMUJU

Route:

```text
/imigrasi-mamuju
```

Halaman harus langsung menunjukkan bahwa pengguna berada di:

```text
Kantor Imigrasi Kelas II Non TPI Mamuju
```

---

# 26. MAMUJU — STRUCTURE

```text
← Kembali

KANTOR IMIGRASI
KELAS II NON TPI MAMUJU

[ Foto Gedung ]

PENERBITAN PASPOR
1.248

IZIN TINGGAL
ITK   32
ITAP  12
ITAS  48

GIAT INTEL-WAS
→

```

---

# 27. DATA PENERBITAN PASPOR

Gunakan istilah:

```text
Penerbitan Paspor
```

bukan "penertiban paspor".

Minimal:

```text
Total
Periode
```

Jika data tersedia lebih rinci:

```text
Paspor Baru
Penggantian
Total
```

---

# 28. MAMUJU — PASSPORT DETAIL

Contoh:

```text
PENERBITAN PASPOR

1.248

September 2026

Paspor Baru       780
Penggantian       468
```

Data bisa dilengkapi tren per bulan.

---

# 29. MAMUJU — IZIN TINGGAL

Tampilkan:

```text
IZIN TINGGAL

ITK
32

ITAP
12

ITAS
48
```

Tidak ada:

```text
%
percentage
donut
pie chart
```

---

# 30. MAMUJU — GIAT INTEL-WAS

Route:

```text
/imigrasi-mamuju/intel-was
```

Halaman ini mempunyai struktur berbeda karena fokus pada kegiatan.

```text
← Mamuju

GIAT INTEL-WAS

Sekilas kegiatan intelijen dan pengawasan.

SEKSI
↓
Kegiatan
↓
Serapan Anggaran
```

---

# 31. STRUKTUR SEKSI INTEL-WAS

Setiap seksi mempunyai:

```text
Nama Seksi
Deskripsi
Kegiatan
Anggaran
```

Contoh struktur:

```text
GIAT INTEL-WAS

01
Seksi A
→

02
Seksi B
→

03
Seksi C
→
```

**Nama seksi tidak boleh dibuat-buat oleh AI.**

Nama resmi harus berasal dari data/master institusi.

---

# 32. SEKSI DETAIL

Route:

```text
/imigrasi-mamuju/intel-was/[seksi]
```

Struktur:

```text
← GIAT INTEL-WAS

NAMA SEKSI

KEGIATAN

12 September 2026
Pengawasan ...

18 September 2026
Koordinasi ...

25 September 2026
Patroli ...
```

Kemudian:

```text
SERAPAN ANGGARAN

Januari
Februari
Maret
...
```

---

# 33. HALAMAN IMIGRASI POLMAN

Route:

```text
/imigrasi-polman
```

Strukturnya mengikuti Mamuju:

```text
Foto Gedung

Penerbitan Paspor

Izin Tinggal
ITK
ITAP
ITAS

GIAT Intel-WAS

Seksi
Kegiatan
Anggaran
```

Namun tidak harus 100% identik secara komposisi visual.

---

# 34. POLMAN — PASPOR

Minimal:

```text
Total Penerbitan Paspor
Periode
```

Jika data rinci tersedia:

```text
Paspor Baru
Penggantian
Total
```

---

# 35. POLMAN — IZIN TINGGAL

```text
ITK
ITAP
ITAS
```

Hanya jumlah absolut.

Tidak ada persentase.

---

# 36. POLMAN — GIAT INTEL-WAS

Struktur:

```text
GIAT INTEL-WAS
↓
Seksi
↓
Kegiatan
↓
Tanggal
↓
Anggaran Bulanan
```

---

# 37. KEGIATAN — DATA MODEL

Setiap kegiatan minimal memiliki:

```typescript
type Activity = {
  id: string
  title: string
  date: string
  location?: string
  description?: string
  image?: string
  unitId: string
  organizationType: "bidang" | "seksi"
  organizationId: string
}
```

---

# 38. ANGGARAN — DATA MODEL

```typescript
type BudgetRecord = {
  id: string
  organizationId: string
  month: number
  year: number
  budgetCeiling: number
  realization: number
}
```

`organizationId` dapat menunjuk ke:

```text
Bidang
```

atau:

```text
Seksi
```

Dengan demikian anggaran dapat melekat langsung pada bidang/seksi.

---

# 39. UNIT DATA MODEL

```typescript
type Unit = {
  id: string
  name: string
  type: "kanwil" | "imigrasi"
  slug: string
  description?: string
  buildingImage?: string
}
```

---

# 40. BIDANG DATA MODEL

```typescript
type Division = {
  id: string
  unitId: string
  name: string
  slug: string
  description?: string
}
```

---

# 41. SEKSI DATA MODEL

```typescript
type Section = {
  id: string
  unitId: string
  name: string
  slug: string
  description?: string
}
```

---

# 42. PASPOR DATA MODEL

```typescript
type PassportData = {
  unitId: string
  period: string
  total: number
  newPassport?: number
  replacement?: number
}
```

---

# 43. IZIN TINGGAL DATA MODEL

```typescript
type StayPermitData = {
  unitId: string
  period: string
  itk: number
  itap: number
  itas: number
}
```

Tidak ada field:

```text
percentage
ratio
percent
```

---

# 44. HOMEPAGE DATA

Homepage hanya membutuhkan:

```text
3 Unit
```

Tidak perlu mengambil seluruh data kegiatan dan anggaran.

Tujuannya agar landing screen tetap ringan.

---

# 45. LANDING SCREEN RESPONSIVE

## Desktop

```text
3 card horizontal
```

## Tablet

```text
3 card dengan ukuran lebih compact
```

## Mobile

Dua pendekatan:

### Preferred

Tetap 3 card dalam satu viewport jika ukuran memungkinkan.

### Fallback

```text
2 card
+
1 card
```

dengan layout yang tetap menjaga keseluruhan layar terasa sebagai satu entrance screen.

Body tetap tidak boleh mempunyai scrolling pada landing screen.

Untuk browser mobile modern, implementasi dapat menggunakan `100dvh` sebagai fallback teknis terhadap perubahan address bar browser, tanpa mengubah konsep utama `100vh`.

---

# 46. TRANSITION LANDING

Saat card ditekan:

```text
scale 0.98
↓
fade / slide subtle
↓
page transition
```

Durasi:

```text
150ms – 300ms
```

Tidak menggunakan animasi berat.

---

# 47. BACK NAVIGATION

Karena tidak ada navbar global, halaman dalam harus mempunyai contextual back navigation.

Contoh:

```text
← Kembali
```

atau:

```text
← Kanwil Sulbar
```

atau:

```text
← Mamuju
```

Back navigation cukup kecil dan tidak menguasai header.

---

# 48. PAGE HEADER

Inner page:

```text
← Kembali

KANTOR IMIGRASI
KELAS II NON TPI MAMUJU

Data layanan, kegiatan, dan informasi
keimigrasian.
```

Tidak ada:

```text
Home
About
Contact
```

---

# 49. VISUAL DESIGN

## Primary Blue

```text
#0B3A82
```

## Secondary Blue

```text
#1558A6
```

## Yellow

```text
#F4C542
```

## Background

```text
#F8FAFC
```

## Text

```text
#172033
```

---

# 50. COLOR USAGE

Biru:

```text
60–70%
```

Neutral:

```text
20–30%
```

Kuning:

```text
5–10%
```

Kuning hanya sebagai:

- line;
- marker;
- active state;
- number;
- CTA tertentu.

---

# 51. TYPOGRAPHY

Primary:

```text
Inter
```

Karakter:

```text
Modern
Institutional
Highly readable
```

Tidak perlu menggunakan banyak font family.

---

# 52. CARD STYLE

Card:

```text
border: 1px solid #E5EAF0
border-radius: 12px
background: #FFFFFF
```

Hover:

```text
translateY(-2px)
border-color: #1558A6
```

Tidak ada:

```text
heavy shadow
glass
gradient
glow
```

---

# 53. CARD HIERARCHY

Tiga card awal harus memiliki hierarchy.

Contoh:

```text
Card 01
featured

Card 02
normal

Card 03
normal
```

Atau:

```text
Card 01
Card 02
Card 03
```

dengan ukuran sama tetapi visual image berbeda.

---

# 54. CARD CONTENT

Minimal:

```text
Nomor
Foto
Nama unit
Short label
Arrow
```

Jangan menambahkan:

```text
6 badge
4 icon
3 statistic
long paragraph
```

pada card homepage.

---

# 55. DATA VISUALIZATION

Gunakan:

```text
Bar
Line
Table
Timeline
```

Tidak perlu:

```text
3D chart
Gauge
Donut
Decorative pie
```

---

# 56. SERAPAN ANGGARAN

Setiap bidang/seksi harus dapat menampilkan:

```text
Periode
Pagu
Realisasi
```

Recommended visual:

```text
MONTHLY

JAN  ███████
FEB  █████████
MAR  ██████
APR  ███████████
```

Detail:

```text
Januari
Pagu       Rp 40.000.000
Realisasi  Rp 32.000.000
```

---

# 57. ACTIVITY DATA

Setiap kegiatan harus mempunyai tanggal.

Format:

```text
12 September 2026
```

Jangan gunakan tanggal ambigu.

---

# 58. ACTIVITY DETAIL

Route:

```text
/kegiatan/[slug]
```

Halaman:

```text
← Kembali

JUDUL KEGIATAN

12 September 2026
Kantor / Lokasi

[ FOTO ]

Deskripsi kegiatan

Unit:
...
Bidang/Seksi:
...
```

---

# 59. FOTO KEGIATAN

Jika foto tersedia:

```text
gunakan foto dokumentasi nyata
```

Jika belum tersedia:

Jangan membuat gambar AI seolah-olah itu dokumentasi resmi.

Gunakan placeholder yang jelas:

```text
Dokumentasi kegiatan belum tersedia
```

---

# 60. FILTER DATA

Filter hanya pada halaman dengan dataset yang banyak.

Contoh:

```text
Tahun
Bulan
Bidang
Seksi
```

Tidak perlu filter pada landing screen.

---

# 61. SEARCH

Search dapat digunakan pada:

```text
Daftar kegiatan
```

Contoh:

```text
[Cari kegiatan...]
```

Search tidak dibutuhkan pada halaman awal.

---

# 62. SEO

Homepage:

```text
Title:
SI DATA IMIGRASI SULBAR

Description:
Sistem Informasi Data Keimigrasian
Terintegrasi Sulawesi Barat.
```

Unit:

```text
Kantor Imigrasi Kelas II Non TPI Mamuju —
SI DATA IMIGRASI SULBAR
```

---

# 63. PERFORMANCE

Karena landing screen sangat sederhana:

Target:

```text
Fast initial load
Low JavaScript
Optimized images
```

Homepage tidak perlu mengambil data berat.

Foto gedung harus dioptimalkan dengan:

```text
WebP / AVIF
next/image
proper sizes
```

---

# 64. ACCESSIBILITY

Wajib:

- keyboard accessible;
- focus state jelas;
- kontras warna cukup;
- alt text;
- semantic HTML;
- button/card mempunyai accessible name;
- touch target minimal 44px.

---

# 65. PUBLIC VS ADMIN

## Public

Fokus:

```text
Baca
Eksplorasi
Data
Kegiatan
Anggaran
```

Tidak perlu login.

---

## Admin

Tahap berikutnya:

```text
Login
↓
Dashboard
↓
Kelola unit
↓
Kelola bidang
↓
Kelola seksi
↓
Kelola kegiatan
↓
Kelola data
↓
Kelola anggaran
↓
Kelola media
```

---

# 66. ADMIN MASTER DATA

Admin dapat mengelola:

```text
Unit Kerja
Bidang
Seksi
```

---

# 67. ADMIN DATA

Admin dapat mengelola:

```text
Penerbitan Paspor
Izin Tinggal
GIAT Intel-WAS
```

---

# 68. ADMIN KEGIATAN

Field:

```text
Judul
Tanggal
Lokasi
Deskripsi
Foto
Unit
Bidang/Seksi
```

---

# 69. ADMIN ANGGARAN

Field:

```text
Unit
Bidang/Seksi
Bulan
Tahun
Pagu
Realisasi
```

---

# 70. ADMIN MEDIA

Admin dapat:

```text
Upload foto gedung
Upload foto kegiatan
Menghapus foto
Mengganti foto
```

---

# 71. URL STRUCTURE

## Entry

```text
/
```

## Kanwil

```text
/kanwil-sulbar
/kanwil-sulbar/bidang/[slug]
```

## Mamuju

```text
/imigrasi-mamuju
/imigrasi-mamuju/paspor
/imigrasi-mamuju/izin-tinggal
/imigrasi-mamuju/intel-was
/imigrasi-mamuju/intel-was/[seksi]
```

## Polman

```text
/imigrasi-polman
/imigrasi-polman/paspor
/imigrasi-polman/izin-tinggal
/imigrasi-polman/intel-was
/imigrasi-polman/intel-was/[seksi]
```

## Kegiatan

```text
/kegiatan
/kegiatan/[slug]
```

---

# 72. PAGE MAP

```text
ENTRY
/
│
├── CARD 01
│   └── /kanwil-sulbar
│       ├── /bidang/1
│       ├── /bidang/2
│       └── /bidang/3
│
├── CARD 02
│   └── /imigrasi-mamuju
│       ├── /paspor
│       ├── /izin-tinggal
│       └── /intel-was
│           └── /[seksi]
│
└── CARD 03
    └── /imigrasi-polman
        ├── /paspor
        ├── /izin-tinggal
        └── /intel-was
            └── /[seksi]
```

---

# 73. MVP SCOPE

## Wajib

```text
✓ Landing screen 100vw × 100vh
✓ Tanpa scrolling
✓ 3 unit card
✓ Card click navigation
✓ Kanwil
✓ 3 Bidang
✓ Kegiatan per bidang
✓ Serapan anggaran per bidang
✓ Mamuju
✓ Total penerbitan paspor
✓ ITK
✓ ITAP
✓ ITAS
✓ Intel-WAS
✓ Seksi
✓ Kegiatan per seksi
✓ Anggaran bulanan per seksi
✓ Polman
✓ Struktur data yang sama
✓ Foto gedung
✓ Responsive
```

---

# 74. OUT OF SCOPE MVP

Belum perlu:

```text
✗ Login user umum
✗ Komentar
✗ Chat
✗ Notification
✗ Payment
✗ Mobile app
✗ Realtime WebSocket
✗ Integrasi API eksternal
✗ Social media feed
✗ Forum
```

CMS dapat dibuat setelah frontend public stabil.

---

# 75. PRINCIPLE: DATA FIRST

Halaman tidak boleh dibuat hanya untuk terlihat indah.

Setiap elemen visual harus membantu:

```text
Finding Information
Understanding Data
Navigating Context
```

---

# 76. PRINCIPLE: ONE SCREEN, ONE PURPOSE

Pada landing:

> Memilih unit.

Pada Kanwil:

> Memilih bidang.

Pada Bidang:

> Memahami kegiatan dan anggaran.

Pada Mamuju:

> Memahami data layanan dan Intel-WAS.

Pada Polman:

> Memahami data layanan dan Intel-WAS.

---

# 77. PRINCIPLE: NO GENERIC NAVIGATION

Tidak ada:

```text
Home
About
Services
Contact
```

hanya karena template website biasanya memiliki menu tersebut.

Navigasi mengikuti kebutuhan data.

---

# 78. PRINCIPLE: NO UNNECESSARY SCROLL

Landing page harus:

```text
100vw
100vh
overflow: hidden
```

Jangan membuat:

```text
Hero
↓
About
↓
Services
↓
Stats
↓
Footer
```

pada halaman entry.

Landing hanyalah **gateway** menuju data.

---

# 79. USER FLOW UTAMA

```text
USER
 ↓
Open /
 ↓
See SI DATA IMIGRASI SULBAR
 ↓
See 3 Cards
 ↓
Choose Unit
 ↓
Unit Page
 ↓
Choose Bidang / Data / Intel-WAS
 ↓
See Activities
 ↓
See Monthly Budget
 ↓
Open Activity Detail
```

---

# 80. USER FLOW KANWIL

```text
/
↓
Kantor Wilayah Sulawesi Barat
↓
3 Bidang
↓
Bidang 1 / Bidang 2 / Bidang 3
↓
Kegiatan
↓
Tanggal kegiatan
↓
Detail kegiatan
↓
Serapan anggaran bulanan
```

---

# 81. USER FLOW MAMUJU

```text
/
↓
Mamuju
↓
Penerbitan Paspor
atau
Izin Tinggal
atau
GIAT Intel-WAS
↓
Seksi
↓
Kegiatan
↓
Serapan Anggaran Bulanan
```

---

# 82. USER FLOW POLMAN

```text
/
↓
Polman
↓
Penerbitan Paspor
atau
Izin Tinggal
atau
GIAT Intel-WAS
↓
Seksi
↓
Kegiatan
↓
Serapan Anggaran Bulanan
```

---

# 83. ACCEPTANCE CRITERIA — ENTRY PAGE

Landing screen dinyatakan berhasil apabila:

- [ ] Membuka dalam satu viewport.
- [ ] Lebar 100vw.
- [ ] Tinggi 100vh.
- [ ] Tidak dapat discroll.
- [ ] Hanya ada tiga unit utama.
- [ ] Tidak ada navbar.
- [ ] Tidak ada menu Home/Beranda/Tentang.
- [ ] Ketiga card dapat diklik.
- [ ] Card mengarah ke route yang benar.
- [ ] Foto gedung digunakan.
- [ ] Identitas biru-kuning terlihat jelas.

---

# 84. ACCEPTANCE CRITERIA — KANWIL

- [ ] Halaman Kanwil dapat dibuka dari card.
- [ ] Terdapat 3 bidang.
- [ ] Setiap bidang mempunyai halaman/detail.
- [ ] Setiap bidang memiliki daftar kegiatan.
- [ ] Kegiatan mempunyai tanggal.
- [ ] Setiap bidang memiliki data anggaran.
- [ ] Anggaran dapat dilihat per bulan.
- [ ] Tidak ada informasi yang dibuat tanpa sumber/dummy label.

---

# 85. ACCEPTANCE CRITERIA — MAMUJU

- [ ] Menampilkan nama lengkap kantor.
- [ ] Menampilkan foto gedung.
- [ ] Menampilkan total penerbitan paspor.
- [ ] Menampilkan ITK.
- [ ] Menampilkan ITAP.
- [ ] Menampilkan ITAS.
- [ ] Tidak menampilkan persentase izin tinggal.
- [ ] Menampilkan GIAT Intel-WAS.
- [ ] Intel-WAS memiliki seksi.
- [ ] Seksi memiliki kegiatan.
- [ ] Seksi memiliki serapan anggaran bulanan.

---

# 86. ACCEPTANCE CRITERIA — POLMAN

- [ ] Menampilkan nama lengkap kantor.
- [ ] Menampilkan foto gedung.
- [ ] Menampilkan total penerbitan paspor.
- [ ] Menampilkan ITK.
- [ ] Menampilkan ITAP.
- [ ] Menampilkan ITAS.
- [ ] Tidak menampilkan persentase izin tinggal.
- [ ] Menampilkan GIAT Intel-WAS.
- [ ] Intel-WAS memiliki seksi.
- [ ] Seksi memiliki kegiatan.
- [ ] Seksi memiliki serapan anggaran bulanan.

---

# 87. ACCEPTANCE CRITERIA — VISUAL

- [ ] Biru menjadi warna utama.
- [ ] Kuning digunakan sebagai accent.
- [ ] Tidak ada gradient biru-ungu.
- [ ] Tidak ada glassmorphism.
- [ ] Tidak ada glow.
- [ ] Tidak semua bagian menggunakan rounded card.
- [ ] Tidak semua informasi dibuat sebagai metric card.
- [ ] Tidak menggunakan icon besar tanpa fungsi.
- [ ] Tidak menggunakan AI-generated government imagery.
- [ ] Foto gedung menjadi visual utama.
- [ ] Layout mempunyai variasi.
- [ ] Whitespace cukup.
- [ ] Typography jelas.

---

# 88. ACCEPTANCE CRITERIA — CONTENT

- [ ] Menggunakan Bahasa Indonesia.
- [ ] Tidak ada lorem ipsum.
- [ ] Tidak ada copywriting SaaS generik.
- [ ] Tidak ada data palsu yang seolah-olah resmi.
- [ ] Data dummy ditandai.
- [ ] Tanggal menggunakan format Indonesia.
- [ ] Nominal menggunakan format Rupiah.
- [ ] Izin tinggal hanya menggunakan jumlah absolut.
- [ ] Tidak ada persentase izin tinggal.

---

# 89. FINAL PRODUCT EXPERIENCE

Ketika seseorang membuka:

```text
SI DATA IMIGRASI SULBAR
```

yang dirasakan harus:

> "Saya langsung tahu bahwa saya harus memilih unit."

Bukan:

> "Saya harus mencari menu."

Setelah memilih unit:

> "Saya langsung tahu data apa saja yang tersedia."

Setelah memilih data:

> "Saya bisa melihat kegiatan dan anggaran yang berhubungan dengan data tersebut."

---

# 90. GOLDEN USER JOURNEY

```text
BUKA
 ↓
PILIH
 ↓
PAHAMI
 ↓
TELUSURI
 ↓
LIHAT KEGIATAN
 ↓
LIHAT ANGGARAN
```

Bukan:

```text
BUKA
 ↓
SCROLL PANJANG
 ↓
CARI MENU
 ↓
CARI DATA
 ↓
BINGUNG
```

---

# 91. FINAL PRODUCT PRINCIPLE

> **SI DATA IMIGRASI SULBAR bukan website company profile.**

> **SI DATA IMIGRASI SULBAR adalah portal eksplorasi data keimigrasian berbasis unit kerja.**

Karena itu struktur utamanya harus:

```text
UNIT
↓
BIDANG / SEKSI
↓
DATA
↓
KEGIATAN
↓
ANGGARAN
```

Dan halaman pertama harus sesederhana:

```text
SI DATA IMIGRASI SULBAR

[ KANWIL SULBAR ]
[ MAMUJU ]
[ POLMAN ]
```

**Tidak lebih dari yang diperlukan.**

---

# 92. ONE-LINE PRODUCT BRIEF

> **Bangun SI DATA IMIGRASI SULBAR sebagai portal data keimigrasian Sulawesi Barat yang langsung membawa pengguna ke tiga pilihan unit dalam satu layar 100vw × 100vh tanpa scrolling dan tanpa navigasi Home/Beranda/About; setiap unit kemudian membuka struktur data yang relevan, yaitu Kanwil → Bidang → Kegiatan + Anggaran, atau Mamuju/Polman → Paspor + Izin Tinggal ITK/ITAP/ITAS + Intel-WAS → Seksi → Kegiatan + Serapan Anggaran Bulanan, dengan fotografi gedung nyata, warna biru-kuning yang kuat, dan layout modern yang tetap sederhana serta data-first.**