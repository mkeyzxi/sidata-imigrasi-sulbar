# DESIGN SYSTEM — SI DATA IMIGRASI SULBAR

> **Project:** SI DATA IMIGRASI SULBAR  
> **Nama lengkap:** Sistem Informasi Data Keimigrasian Terintegrasi Sulawesi Barat  
> **Platform:** Web  
> **Framework:** Next.js App Router + TypeScript + Tailwind CSS  
> **Primary Theme:** Biru + Kuning  
> **Design Direction:** Institutional, Editorial, Modern, Informative, Human, Data-First

---

# 1. PURPOSE

File ini adalah **single source of truth untuk visual design** SI DATA IMIGRASI SULBAR.

AI coding agent, frontend developer, dan designer **WAJIB membaca file ini sebelum membuat atau mengubah UI**.

Tujuan utama:

- membuat website terlihat profesional;
- membangun identitas visual yang kuat;
- menjaga kombinasi biru dan kuning tetap konsisten;
- menghindari tampilan generic AI-generated;
- membuat data mudah dibaca;
- menggunakan layout yang kreatif tetapi tetap relevan;
- menjaga website terasa seperti portal institusi, bukan template SaaS.

---

# 2. DESIGN PHILOSOPHY

Website harus terasa seperti:

> **Portal institusi pemerintah + editorial website + data information platform**

Karakter:

- Profesional
- Resmi
- Modern
- Bersih
- Informatif
- Tenang
- Terpercaya
- Human-centered
- Data-oriented

Website **bukan**:

- startup landing page;
- SaaS dashboard;
- template admin;
- website dengan AI-generated decoration;
- kumpulan card dengan gradient.

---

# 3. PRIMARY VISUAL IDENTITY

Identitas utama adalah:

```text
BLUE
+
YELLOW
+
WHITE / OFF-WHITE
+
REAL PHOTOGRAPHY
+
STRONG TYPOGRAPHY
```

Biru = identitas institusi.

Kuning = aksen dan penekanan.

Putih/off-white = ruang dan keterbacaan.

Fotografi = wajah institusi.

Typography = struktur informasi.

---

# 4. COLOR SYSTEM

## 4.1 Primary Blue

```text
#0B3A82
```

Token:

```css
--color-primary: #0B3A82;
```

Digunakan untuk:

- primary button;
- navbar;
- active navigation;
- heading tertentu;
- footer;
- section emphasis;
- link;
- accent border;
- visual identity.

---

## 4.2 Deep Blue

```text
#082B5F
```

Token:

```css
--color-primary-dark: #082B5F;
```

Digunakan untuk:

- hover primary;
- footer;
- dark section;
- overlay foto;
- high-contrast panel.

---

## 4.3 Secondary Blue

```text
#1558A6
```

Token:

```css
--color-secondary: #1558A6;
```

Digunakan untuk:

- link;
- data visualization;
- secondary action;
- active state;
- chart;
- informational highlight.

---

## 4.4 Soft Blue

```text
#EAF2FB
```

Digunakan sebagai:

- background informasi;
- selected state;
- light panel;
- filter state;
- highlight data.

---

## 4.5 Main Yellow

```text
#F4C542
```

Token:

```css
--color-accent: #F4C542;
```

Ini adalah **warna aksen utama website**.

Gunakan untuk:

- garis aksen;
- indicator aktif;
- numbering;
- highlight;
- small label;
- CTA tertentu;
- decorative edge;
- data emphasis.

### Jangan menggunakan kuning untuk:

- seluruh background;
- paragraph;
- body text;
- semua tombol;
- semua card;
- section besar secara berlebihan.

---

## 4.6 Soft Yellow

```text
#FFF7D6
```

Digunakan untuk:

- notice;
- information box;
- subtle highlight;
- warning ringan;
- contextual accent.

---

# 5. NEUTRAL COLORS

```css
--color-background: #F8FAFC;
--color-surface: #FFFFFF;
--color-text: #172033;
--color-heading: #0F172A;
--color-muted: #64748B;
--color-border: #E5EAF0;
```

### Background

```text
#F8FAFC
```

Default page background.

### Surface

```text
#FFFFFF
```

Untuk:

- card;
- panel;
- modal;
- table;
- navigation.

---

# 6. SEMANTIC COLORS

Success:

```text
#18794E
```

Warning:

```text
#B7791F
```

Danger:

```text
#B42318
```

Informasi:

```text
#1558A6
```

Warna semantic harus tetap digunakan secara terbatas.

---

# 7. COLOR BALANCE

Recommended visual ratio:

```text
60% Neutral / White
25% Blue
10% Dark Text / Neutral
5% Yellow Accent
```

Prinsip:

> **Biru menjadi identitas. Kuning menjadi kejutan visual.**

Kuning tidak boleh mendominasi.

---

# 8. ABSOLUTELY NO RANDOM COLORS

AI agent **dilarang menambahkan warna baru secara sembarangan**.

Jangan menggunakan:

```text
Purple
Pink
Neon green
Cyan gradient
Orange gradient
Blue-purple gradient
```

kecuali benar-benar dibutuhkan untuk status tertentu dan didefinisikan sebagai design token.

---

# 9. TYPOGRAPHY

## Primary Font

Gunakan:

```text
Inter
```

Fallback:

```text
system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

Next.js:

```tsx
import { Inter } from "next/font/google";
```

---

# 10. TYPOGRAPHY HIERARCHY

## Display

```text
56px – 92px
font-weight: 700
line-height: 0.95 – 1.05
letter-spacing: -0.05em
```

Gunakan hanya untuk hero dengan judul pendek.

---

## H1

```text
40px – 64px
font-weight: 700
line-height: 1.05
letter-spacing: -0.04em
```

---

## H2

```text
32px – 44px
font-weight: 700
line-height: 1.1
```

---

## H3

```text
22px – 28px
font-weight: 650
line-height: 1.2
```

---

## Body

```text
16px
line-height: 1.65
```

---

## Small

```text
14px
line-height: 1.5
```

---

## Eyebrow / Label

```text
12px
font-weight: 600
letter-spacing: 0.08em
text-transform: uppercase
```

---

# 11. TYPOGRAPHY RULES

Gunakan hierarchy:

```text
Eyebrow
↓
Heading
↓
Description
↓
Metadata
↓
Data
```

Jangan membuat semua teks:

```text
BOLD
UPPERCASE
CENTERED
```

Heading harus jelas.

Body harus nyaman dibaca.

Metadata harus lebih kecil dan muted.

---

# 12. CONTAINER

Desktop:

```text
max-width: 1280px
```

Preferred horizontal padding:

```text
32px – 40px
```

Tablet:

```text
24px
```

Mobile:

```text
16px – 20px
```

Gunakan container konsisten.

---

# 13. GRID SYSTEM

Desktop:

```text
12 columns
```

Tablet:

```text
8 columns
```

Mobile:

```text
4 columns
```

Gunakan grid untuk membuat komposisi asimetris yang tetap terstruktur.

---

# 14. LAYOUT PRINCIPLE

Jangan membuat setiap section seperti:

```text
[ CARD ] [ CARD ] [ CARD ]
```

Variasikan:

```text
[ IMAGE ] [ CONTENT ]

[ LARGE FEATURE ]
[ SMALL LIST ]

[ DATA ] [ SUMMARY ]

[ TIMELINE ]

[ TABLE ]

[ IMAGE + OVERLAP ]

[ LARGE NUMBER + TEXT ]
```

---

# 15. SPACING SYSTEM

Basis:

```text
4
8
12
16
24
32
40
48
64
80
96
120
```

Section normal:

```text
80px – 96px
```

Section besar:

```text
96px – 120px
```

Hero:

```text
120px – 160px
```

Mobile:

```text
56px – 72px
```

---

# 16. BORDER RADIUS

Gunakan:

```text
4px
8px
12px
16px
```

Rekomendasi:

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
```

Hindari:

```text
rounded-3xl
rounded-[32px]
```

untuk hampir semua komponen.

`rounded-full` hanya untuk:

- status dot;
- avatar;
- pill;
- circular button.

---

# 17. SHADOW

Default:

```text
Tidak menggunakan shadow
```

Lebih utamakan:

```text
border
spacing
background contrast
```

Bila diperlukan:

```css
box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
```

Hindari shadow besar.

---

# 18. ANTI AI-SLOP RULES

## DILARANG

### Gradient

Jangan menggunakan:

```text
blue → purple
blue → pink
yellow → orange
```

### Glassmorphism

Jangan menggunakan:

```text
backdrop-blur
transparent glass cards
frosted UI
```

secara default.

### Glow

Jangan menggunakan:

```text
blue glow
yellow glow
neon edge
```

### Excessive Rounded Cards

Jangan membuat:

```text
section
  ↓
card
  ↓
card
  ↓
card
```

semuanya memiliki radius besar.

### Generic SaaS Dashboard

Jangan membuat halaman publik seperti:

```text
Stats Card
Stats Card
Stats Card
Stats Card
Chart
Chart
Chart
```

### Meaningless Icons

Jangan membuat:

```text
icon besar
+
judul
+
deskripsi
```

untuk setiap data.

### Fake Decorative Shapes

Jangan menggunakan:

```text
blob
circle
random gradient shape
floating orb
```

jika tidak mempunyai fungsi.

### Fake AI Image

Jangan menggunakan gambar:

- manusia generik;
- gedung generik;
- kantor futuristik;
- pejabat AI;
- ilustrasi fake government.

Prioritas:

> **Foto gedung dan dokumentasi kegiatan nyata.**

---

# 19. IMAGE DIRECTION

Visual utama harus berupa **fotografi nyata**.

Prioritas:

```text
Gedung Kantor
↓
Kegiatan Resmi
↓
Pelayanan
↓
Dokumentasi Lapangan
```

---

# 20. HERO PHOTO

Hero ideal:

```text
┌─────────────────────────────────────────┐
│ CONTENT                  REAL PHOTO      │
│                                         │
│ SI DATA IMIGRASI        GEDUNG IMIGRASI │
│ SULBAR                                  │
│                                         │
│ Description                              │
│                                         │
│ [ Jelajahi Data ]                       │
└─────────────────────────────────────────┘
```

Hero tidak boleh berupa:

```text
full screen gradient
centered text
floating cards
```

---

# 21. IMAGE RATIO

Hero:

```text
4:3
5:4
16:10
```

Activity:

```text
16:10
4:3
3:2
```

Jangan semua image memakai:

```text
1:1
```

---

# 22. IMAGE TREATMENT

Gunakan:

- natural color;
- crop yang baik;
- subtle overlay;
- caption;
- border;
- yellow accent.

Hindari:

- heavy filter;
- excessive blur;
- duotone;
- neon;
- artificial glow.

---

# 23. NAVBAR

Desktop:

```text
┌───────────────────────────────────────────────┐
│ LOGO   Beranda  Unit Kerja  Kegiatan  Data   │
│                                      Tentang  │
└───────────────────────────────────────────────┘
```

Karakter:

- clean;
- tinggi 72–84px;
- white background;
- thin bottom border;
- active item menggunakan blue atau yellow indicator.

Jangan menggunakan glass navbar.

---

# 24. HERO STRUCTURE

Recommended:

```text
EYEBROW

SI DATA
IMIGRASI
SULBAR

Portal informasi dan data keimigrasian
terintegrasi di Sulawesi Barat.

[ Jelajahi Data ]

                    [ FOTO GEDUNG ]
```

Tambahkan small metadata:

```text
SULAWESI BARAT
PORTAL DATA KEIMIGRASIAN
```

---

# 25. HERO ACCENT

Gunakan yellow sebagai:

```text
3px – 5px line
```

Contoh:

```text
SI DATA
IMIGRASI
SULBAR
────────
```

atau:

```text
01
YELLOW LINE
```

Aksen kecil lebih elegan daripada memenuhi hero dengan warna kuning.

---

# 26. SECTION HEADER

Gunakan:

```text
EYEBROW
Heading
Description
```

Contoh:

```text
UNIT KERJA

Jelajahi unit kerja

Temukan data dan informasi berdasarkan
unit kerja keimigrasian di Sulawesi Barat.
```

Tidak semua section membutuhkan description panjang.

---

# 27. CARD DESIGN PHILOSOPHY

Card bukan default layout.

Gunakan card hanya bila:

> informasi perlu dipisahkan sebagai unit mandiri.

Gunakan list/table bila:

> informasi lebih cocok dibaca sebagai kumpulan item.

---

# 28. CARD PATTERN 01 — UNIT CARD

```text
┌──────────────────────────────┐
│                              │
│         FOTO GEDUNG          │
│                              │
├──────────────────────────────┤
│ 01                           │
│                              │
│ Kantor Wilayah               │
│ Sulawesi Barat               │
│                              │
│ Data • Kegiatan • Anggaran → │
└──────────────────────────────┘
```

Gunakan untuk:

- Kanwil;
- Mamuju;
- Polman.

---

# 29. CARD PATTERN 02 — FEATURE CARD

```text
┌─────────────────────────────────────────┐
│                                         │
│                PHOTO                    │
│                                         │
├──────────────────────────┬──────────────┤
│ Judul Kegiatan           │ 12           │
│                           │ SEP 2026     │
└──────────────────────────┴──────────────┘
```

Digunakan untuk kegiatan utama.

---

# 30. CARD PATTERN 03 — NUMBER CARD

Gunakan angka sebagai visual utama.

```text
TOTAL PENERBITAN PASPOR

1.248

September 2026
Mamuju
```

Jangan menambahkan icon besar hanya agar card terlihat menarik.

---

# 31. CARD PATTERN 04 — DIRECTORY ROW

Untuk bidang/seksi:

```text
01   Bidang 1                           →
02   Bidang 2                           →
03   Bidang 3                           →
```

Lebih baik daripada tiga card identik jika kontennya sederhana.

---

# 32. CARD PATTERN 05 — SPLIT CARD

```text
┌────────────────────────────────────┐
│ IMAGE           │ CONTENT          │
│                 │                  │
│                 │ Judul            │
│                 │ Description      │
│                 │                  │
└────────────────────────────────────┘
```

Gunakan untuk kegiatan dan artikel.

---

# 33. CARD PATTERN 06 — ACCENT EDGE

```text
┌─┬───────────────────────────────┐
│Y│ INFORMASI                     │
│E│                               │
│L│ Data diperbarui September     │
│L│ 2026.                         │
│O│                               │
│W│                               │
└─┴───────────────────────────────┘
```

Gunakan yellow sebagai vertical edge.

---

# 34. CARD PATTERN 07 — TIMELINE

```text
12 SEP
   │
   ● Sosialisasi Pelayanan
   │
18 SEP
   │
   ● Pengawasan
   │
25 SEP
   │
   ● Evaluasi
```

Cocok untuk:

- kegiatan;
- Intel-WAS;
- chronology.

---

# 35. CARD PATTERN 08 — BUDGET ROW

```text
SEPTEMBER 2026

Rp 21.500.000

██████████████████
```

Kemudian:

```text
Oktober
November
Desember
```

Gunakan horizontal bar.

---

# 36. CARD PATTERN 09 — EDITORIAL OVERLAP

```text
┌─────────────────────────────┐
│                             │
│          IMAGE              │
│                             │
└─────────────────────────────┘
          ┌──────────────────┐
          │ 18 SEP 2026      │
          │                  │
          │ GIAT INTEL-WAS   │
          └──────────────────┘
```

Gunakan hanya untuk feature content.

---

# 37. CARD PATTERN 10 — BENTO TERBATAS

Bento diperbolehkan hanya jika konten memang memiliki prioritas berbeda.

```text
┌───────────────────────┬──────────────┐
│                       │ DATA         │
│   FEATURE IMAGE       │ 1.248        │
│                       ├──────────────┤
│                       │ KEGIATAN     │
│                       │ 32           │
└───────────────────────┴──────────────┘
```

Jangan membuat semua halaman menjadi bento grid.

---

# 38. HOMEPAGE STRUCTURE

Recommended:

```text
Navbar
↓
Hero
↓
Unit Kerja
↓
Kegiatan Terbaru
↓
Data Snapshot
↓
Budget Preview
↓
Tentang Sistem
↓
Footer
```

---

# 39. HOMEPAGE — UNIT SECTION

Tampilkan tiga unit:

```text
01  Kantor Wilayah Sulawesi Barat
02  Imigrasi Mamuju
03  Imigrasi Polman
```

Gunakan **visual hierarchy berbeda**:

- Unit pertama dapat menjadi feature.
- Unit kedua dan ketiga dapat menjadi supporting cards.

Jangan membuat 3 card identik jika layout dapat dibuat lebih editorial.

---

# 40. HOMEPAGE — ACTIVITY SECTION

Gunakan:

```text
1 FEATURE
+
2 SMALL ITEMS
```

Contoh:

```text
┌──────────────────────────┬────────────────┐
│                          │ 12 SEP         │
│       FOTO BESAR         │ Sosialisasi    │
│                          ├────────────────┤
│                          │ 18 SEP         │
│                          │ Pengawasan     │
└──────────────────────────┴────────────────┘
```

---

# 41. DATA SNAPSHOT

Gunakan data utama saja.

Contoh:

```text
1.248
Penerbitan Paspor Mamuju

987
Penerbitan Paspor Polman

XX
Kegiatan Terdata
```

Jangan menampilkan 10–15 metric sekaligus.

---

# 42. KANWIL SULAWESI BARAT

Layout:

```text
Hero
↓
Direktori 3 Bidang
↓
Kegiatan
↓
Anggaran
↓
Dokumentasi
```

---

# 43. BIDANG DETAIL

Struktur:

```text
Breadcrumb
↓
Hero / Title
↓
Deskripsi Bidang
↓
Kegiatan
↓
Budget
```

Jika informasi hanya nama dan deskripsi, gunakan directory/list daripada card berlebihan.

---

# 44. IMIGRASI MAMUJU

Primary hierarchy:

```text
Gedung
↓
Total Paspor
↓
Izin Tinggal
↓
GIAT Intel-WAS
↓
Kegiatan
↓
Anggaran
```

---

# 45. IMIGRASI POLMAN

Gunakan hierarchy yang sama dengan Mamuju untuk menjaga consistency.

Namun jangan memaksa identik secara visual.

Contoh variasi:

Mamuju:

```text
Large stat + image
```

Polman:

```text
Image + split data
```

---

# 46. PASPOR SECTION

Data yang penting:

```text
Total
Paspor Baru
Penggantian
Periode
```

Contoh:

```text
PENERBITAN PASPOR

1.248
September 2026

780 Paspor Baru
468 Penggantian
```

---

# 47. IZIN TINGGAL

Jenis:

```text
ITK
ITAP
ITAS
```

Tampilkan sebagai structured list.

Contoh:

```text
IZIN TINGGAL

ITK                 32
ITAP                12
ITAS                48
```

### IMPORTANT

> **Jangan menampilkan persentase untuk data izin tinggal.**

Gunakan jumlah absolut saja.

---

# 48. GIAT INTEL-WAS

Intel-WAS sebaiknya menggunakan:

```text
timeline
+
activity list
+
photo
```

Contoh:

```text
GIAT INTEL-WAS

12 SEP
Pengawasan orang asing

18 SEP
Koordinasi pengawasan

25 SEP
Kegiatan lapangan
```

---

# 49. BUDGET / ANGGARAN

Gunakan:

```text
Bar chart
+
Table
```

Contoh:

```text
Serapan Anggaran

JAN ███████
FEB ███████████
MAR █████████
APR █████████████
```

Tampilkan nominal.

```text
Januari
Rp 18.000.000
```

Jangan hanya chart tanpa nilai.

---

# 50. TABLE GUIDELINES

Table digunakan ketika:

- data banyak;
- exact number diperlukan;
- user perlu membandingkan item;
- daftar kegiatan panjang.

Contoh:

```text
Kegiatan | Tanggal | Unit | Bidang
```

Gunakan header sederhana.

Jangan membuat setiap row seperti card.

---

# 51. CHART GUIDELINES

Gunakan chart jika chart benar-benar membantu.

### Gunakan

- Bar;
- Column;
- Line.

### Hindari

- Pie;
- Donut;
- 3D;
- Gauge;
- Decorative chart.

Semua chart harus mempunyai:

```text
Title
Period
Unit
Legend jika diperlukan
Source / last updated
```

---

# 52. DATA LABELING

Setiap data harus mempunyai context.

Buruk:

```text
1.248
```

Baik:

```text
1.248
Total Penerbitan Paspor
September 2026
Mamuju
```

---

# 53. DATE FORMAT

Gunakan format Indonesia.

Contoh:

```text
12 September 2026
```

Bukan:

```text
09/12/26
```

untuk tampilan utama.

---

# 54. CURRENCY FORMAT

Gunakan:

```text
Rp 21.500.000
```

Bukan:

```text
21.5M
Rp21.500.000
21,500,000
```

---

# 55. CONTENT WRITING

Bahasa:

- Bahasa Indonesia;
- formal;
- singkat;
- jelas;
- natural.

Contoh:

### Good

> Data kegiatan keimigrasian Sulawesi Barat yang dihimpun berdasarkan unit kerja.

### Bad

> Nikmati pengalaman revolusioner untuk menjelajahi ekosistem keimigrasian digital modern.

---

# 56. NO LOREM IPSUM

Dilarang menggunakan:

```text
Lorem ipsum
This is some text
Welcome to our dashboard
Your journey starts here
```

Gunakan content yang relevan dengan konteks imigrasi.

---

# 57. DUMMY DATA

Dummy data diperbolehkan untuk prototype.

Tetapi harus ditandai sebagai:

```text
Data Simulasi
```

atau:

```text
Data Dummy — Prototype
```

Jangan membuat dummy data terlihat seperti data resmi.

---

# 58. DATA HIERARCHY

Gunakan hierarchy:

```text
UNIT
↓
BIDANG / SEKSI
↓
DATA / KEGIATAN
↓
ANGGARAN
```

Pengguna harus dapat mengetahui:

> "Saya sedang melihat data unit apa?"

dalam waktu singkat.

---

# 59. BREADCRUMB

Untuk halaman dalam:

```text
Beranda
/
Imigrasi Mamuju
/
Intel-WAS
```

Style:

```text
12–14px
muted
```

Breadcrumb bukan focal point.

---

# 60. FILTER

Gunakan filter hanya ketika dibutuhkan.

Contoh:

```text
[ Tahun 2026 ]
[ Bulan September ]
[ Unit Mamuju ]
```

Jangan membuat form filter memenuhi layar.

---

# 61. SEARCH

Search hanya ditampilkan ketika dataset cukup besar.

Contoh:

```text
[ Cari kegiatan... ] [ Tahun ] [ Unit ]
```

Search bukan hero decoration.

---

# 62. BUTTON SYSTEM

### Primary

```text
Blue background
White text
```

Contoh:

```text
Jelajahi Data →
```

### Secondary

```text
White background
Blue border
Blue text
```

### Ghost

```text
Transparent
Blue text
```

### Yellow CTA

Yellow hanya digunakan untuk CTA tertentu.

Text:

```text
#172033
```

---

# 63. BUTTON SHAPE

Default:

```text
8px – 12px
```

Jangan semua tombol:

```text
pill
```

---

# 64. ICON SYSTEM

Gunakan:

```text
Lucide React
```

Icon:

```text
16px
20px
24px
```

Ikon harus memiliki fungsi.

Dilarang membuat:

```text
icon 64px
+
judul
+
deskripsi
```

untuk setiap metric hanya demi mengisi ruang.

---

# 65. DECORATION SYSTEM

Elemen dekoratif yang diperbolehkan:

```text
01
02
03

Yellow line

Thin divider

Small square

Large background number

Subtle grid
```

Dekorasi harus mendukung hierarchy.

Bukan mengambil perhatian dari data.

---

# 66. PAGE RHYTHM

Setiap halaman harus mempunyai ritme:

```text
OPEN
↓
DENSE
↓
OPEN
↓
DENSE
↓
OPEN
```

Contoh:

```text
Hero          → Open
Data          → Dense
Activity      → Medium
Photo         → Open
Budget        → Dense
Footer        → Open
```

---

# 67. VISUAL FOCAL POINT

Setiap halaman harus memiliki satu fokus visual.

Homepage:

```text
Hero + Gedung
```

Mamuju:

```text
Passport Data
```

Polman:

```text
Passport Data
```

Intel-WAS:

```text
Timeline / Activity
```

Budget:

```text
Monthly Budget Visualization
```

---

# 68. RESPONSIVE DESIGN

## Mobile

Breakpoint:

```text
< 640px
```

Tablet:

```text
640px – 1023px
```

Desktop:

```text
>= 1024px
```

Large desktop:

```text
>= 1280px
```

---

# 69. MOBILE RULE

Desktop:

```text
2-column
3-column
12-grid
```

Mobile:

```text
1-column
```

Tetapi jangan hanya mengecilkan semuanya.

Layout harus **diatur ulang berdasarkan prioritas**.

---

# 70. MOBILE HERO

Desktop:

```text
Text | Image
```

Mobile:

```text
Text
↓
CTA
↓
Image
```

---

# 71. MOBILE TABLE

Jika table terlalu lebar:

Gunakan:

```text
horizontal scroll
```

Jangan mengecilkan font sampai sulit dibaca.

---

# 72. MOBILE CARD

3 card:

```text
Desktop:
[1] [2] [3]

Mobile:
[1]
[2]
[3]
```

Namun prioritas card pertama dapat dibuat lebih besar.

---

# 73. MOTION

Durasi:

```text
150ms – 250ms
```

Gunakan:

```text
opacity
transform
border color
image scale
```

Contoh:

```text
translateY(-2px)
```

Image:

```text
scale(1.02)
```

---

# 74. ANIMATION DILARANG

Jangan menggunakan:

- bounce;
- spin dekoratif;
- excessive parallax;
- scroll hijacking;
- particle system;
- cursor trail;
- text scrambling;
- animation setiap elemen.

Website harus terasa stabil.

---

# 75. ACCESSIBILITY

Target minimal:

```text
WCAG AA
```

Wajib:

- keyboard navigation;
- visible focus;
- proper labels;
- alt text;
- sufficient contrast;
- touch target minimal 44px;
- semantic HTML;
- reduced motion support.

---

# 76. IMAGE ALT

Contoh:

```text
Foto gedung Kantor Imigrasi Kelas II Non TPI Mamuju
```

Bukan:

```text
image
photo
building
```

---

# 77. NEXT.JS RULES

Gunakan:

```text
next/image
next/font
metadata
```

Hero image boleh diberikan priority sesuai kebutuhan LCP.

Image non-hero:

```text
lazy loading
```

Server Components adalah default.

Client Component hanya bila diperlukan.

---

# 78. COMPONENT ARCHITECTURE

Recommended:

```text
components/
├── ui/
│   ├── Button
│   ├── Card
│   ├── Badge
│   └── Container
│
├── layout/
│   ├── Navbar
│   └── Footer
│
├── hero/
│   └── PageHero
│
├── activity/
│   ├── ActivityCard
│   ├── ActivityFeature
│   └── ActivityTimeline
│
├── data/
│   ├── StatBlock
│   ├── DataTable
│   ├── PassportStats
│   ├── StayPermitStats
│   └── BudgetChart
│
└── unit/
    ├── UnitCard
    └── DirectoryList
```

---

# 79. REUSABLE COMPONENT RULE

Gunakan:

```tsx
<UnitCard unit={unit} />
```

bukan:

```text
MamujuCard
PolmanCard
KanwilCard
```

jika struktur visual sama.

---

# 80. CSS TOKENS

Gunakan:

```css
:root {
  --color-primary: #0B3A82;
  --color-primary-dark: #082B5F;
  --color-secondary: #1558A6;
  --color-blue-soft: #EAF2FB;

  --color-accent: #F4C542;
  --color-accent-soft: #FFF7D6;

  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;

  --color-heading: #0F172A;
  --color-text: #172033;
  --color-muted: #64748B;
  --color-border: #E5EAF0;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;

  --container-width: 1280px;
}
```

---

# 81. TAILWIND RULE

Gunakan design token daripada arbitrary style.

Prioritas:

```text
Design Token
↓
Reusable Component
↓
Utility Class
↓
Arbitrary Value hanya jika benar-benar diperlukan
```

Jangan membuat:

```text
bg-[#randomcolor]
```

di banyak tempat.

---

# 82. CMS / ADMIN DESIGN

CMS boleh lebih padat.

Namun tetap harus menggunakan:

```text
blue
yellow
white
neutral
```

Structure:

```text
Sidebar
+
Topbar
+
Main Content
```

---

# 83. ADMIN SIDEBAR

```text
DASHBOARD

MASTER DATA
Unit Kerja
Bidang
Seksi

DATA
Kegiatan
Paspor
Izin Tinggal
Intel-WAS
Anggaran

MEDIA
Dokumentasi
```

Gunakan section label kecil.

---

# 84. ADMIN DASHBOARD

Admin boleh menggunakan lebih banyak card.

Contoh:

```text
3
Unit

12
Bidang / Seksi

124
Kegiatan

Rp ...
Anggaran
```

Tetapi tetap berikan konteks pada setiap angka.

---

# 85. FORM DESIGN

Struktur:

```text
Label
Input
Helper
Validation
Error
```

Contoh:

```text
Nama Kegiatan

[_______________________________]

Tanggal

[ 12 September 2026 ]
```

---

# 86. EMPTY STATE

Gunakan:

```text
Belum ada kegiatan

Belum ada kegiatan yang tercatat
untuk periode ini.
```

Bukan:

```text
Oops!
Nothing here.
```

---

# 87. ERROR STATE

Gunakan:

```text
Data tidak dapat dimuat

Terjadi kendala saat mengambil data.

[ Coba Lagi ]
```

---

# 88. LOADING

Gunakan skeleton sederhana.

Jangan menggunakan shimmer yang terlalu mencolok.

Loading mempertahankan struktur layout asli.

---

# 89. DESIGN QA

Sebelum sebuah halaman dianggap selesai, periksa:

### Color

- [ ] Biru dominan.
- [ ] Kuning hanya accent.
- [ ] Tidak ada warna random.
- [ ] Tidak ada purple/blue gradient.

### Layout

- [ ] Tidak semua section berupa card.
- [ ] Ada variasi layout.
- [ ] Grid tetap teratur.
- [ ] Whitespace cukup.
- [ ] Hierarchy jelas.

### Content

- [ ] Bahasa Indonesia.
- [ ] Tidak ada lorem ipsum.
- [ ] Data memiliki context.
- [ ] Dummy data ditandai.
- [ ] Nominal rupiah benar.

### Photography

- [ ] Foto relevan.
- [ ] Foto gedung digunakan pada hero unit.
- [ ] Tidak ada AI-looking stock image.
- [ ] Image crop baik.

### UX

- [ ] CTA jelas.
- [ ] Breadcrumb tersedia pada inner page.
- [ ] Pengguna tahu unit yang sedang dilihat.
- [ ] Filter hanya jika dibutuhkan.

### Responsive

- [ ] Mobile tidak overflow.
- [ ] Table dapat di-scroll.
- [ ] Hero tetap nyaman.
- [ ] Navigation mobile bekerja.
- [ ] Typography tidak terlalu kecil.

### Accessibility

- [ ] Focus state terlihat.
- [ ] Alt text tersedia.
- [ ] Contrast memadai.
- [ ] Semua input memiliki label.

---

# 90. AI CODING AGENT — MANDATORY RULES

AI agent **WAJIB**:

1. Membaca file `design.md` sebelum membuat UI.
2. Menggunakan warna biru dan kuning sesuai token.
3. Memakai Inter.
4. Menggunakan foto nyata ketika tersedia.
5. Menggunakan reusable components.
6. Mengutamakan data dan hierarchy.
7. Membuat variasi layout sesuai konteks.
8. Menjaga whitespace.
9. Menjaga responsive behavior.
10. Memastikan desain tidak terasa seperti template AI.

---

# 91. AI CODING AGENT — FORBIDDEN

AI agent **TIDAK BOLEH**:

```text
❌ Gradient biru-ungu
❌ Glassmorphism
❌ Neon glow
❌ Excessive shadow
❌ Card radius berlebihan
❌ Semua section 3-card
❌ Semua data menjadi metric card
❌ Icon besar tanpa fungsi
❌ Fake AI image
❌ Decorative blob
❌ Dashboard publik yang terlalu padat
❌ Typography random
❌ Warna random
❌ Lorem ipsum
❌ Copywriting generik
❌ Chart dekoratif
❌ Pie chart hanya untuk estetika
❌ Percentage untuk izin tinggal
```

---

# 92. RULE OF RELEVANCE

Setiap elemen harus menjawab satu pertanyaan:

> **"Mengapa elemen ini ada?"**

Jika jawabannya:

> "Agar tampilannya lebih bagus."

maka evaluasi kembali apakah elemen tersebut benar-benar diperlukan.

---

# 93. RULE OF HIERARCHY

Setiap viewport harus mempunyai:

```text
1 Primary Focus
1–2 Secondary Focus
Supporting Information
```

Jangan membuat semua elemen memiliki visual weight yang sama.

---

# 94. RULE OF VARIETY

Variasi diperbolehkan pada:

```text
Card composition
Image placement
Column ratio
Section background
Typography hierarchy
```

Namun jangan bervariasi pada:

```text
Core color
Typography family
Radius system
Button system
Spacing logic
```

---

# 95. CREATIVE LAYOUT RULE

Desain boleh kreatif melalui:

```text
Asymmetric grid
Editorial overlap
Large typography
Large numbers
Photo composition
Vertical line
Horizontal divider
Offset content
```

Bukan melalui:

```text
Gradient
Glow
3D
Floating blobs
Random shapes
```

---

# 96. PAGE INVENTORY

## Public

```text
/
```

```text
/kanwil-sulbar
/kanwil-sulbar/bidang/[slug]
```

```text
/imigrasi-mamuju
/imigrasi-mamuju/paspor
/imigrasi-mamuju/izin-tinggal
/imigrasi-mamuju/intel-was
```

```text
/imigrasi-polman
/imigrasi-polman/paspor
/imigrasi-polman/izin-tinggal
/imigrasi-polman/intel-was
```

```text
/kegiatan
/kegiatan/[slug]
```

```text
/data
/data/paspor
/data/izin-tinggal
/data/anggaran
```

---

# 97. CORE INFORMATION ARCHITECTURE

```text
SI DATA IMIGRASI SULBAR
│
├── Kanwil Sulawesi Barat
│   ├── Bidang 1
│   ├── Bidang 2
│   └── Bidang 3
│
├── Imigrasi Mamuju
│   ├── Paspor
│   ├── Izin Tinggal
│   ├── Intel-WAS
│   ├── Kegiatan
│   └── Anggaran
│
├── Imigrasi Polman
│   ├── Paspor
│   ├── Izin Tinggal
│   ├── Intel-WAS
│   ├── Kegiatan
│   └── Anggaran
│
├── Kegiatan
├── Data
└── Tentang
```

---

# 98. DATA SIMULATION RULE

Prototype dapat menggunakan data simulasi.

Contoh:

```text
Mamuju
Total Paspor: 1.248
ITK: 32
ITAP: 12
ITAS: 48
```

Tetapi UI harus menampilkan:

```text
Data Simulasi
```

jika data belum berasal dari sumber resmi.

---

# 99. DATA TERMINOLOGY RULE

Gunakan nomenklatur resmi yang tersedia dari institusi.

Jangan menciptakan istilah baru hanya agar UI terlihat menarik.

Untuk istilah layanan seperti:

```text
ITK
ITAP
ITAS
```

gunakan nomenklatur resmi yang telah ditetapkan oleh sumber data.

---

# 100. MASTER DESIGN PRINCIPLE

Pegang prinsip berikut dalam seluruh project:

> **Biru memberikan identitas. Kuning memberikan aksen. Foto memberikan karakter. Typography memberikan struktur. Data memberikan makna. Layout membantu pengguna memahami semuanya.**

---

# 101. FINAL DESIGN BRIEF

Gunakan instruksi ini sebagai prompt utama untuk AI coding agent:

> **Bangun SI DATA IMIGRASI SULBAR sebagai portal data keimigrasian institusional yang modern, profesional, editorial, dan mudah dibaca. Gunakan biru navy sebagai warna utama dan kuning sebagai accent color, dengan white/off-white sebagai background. Gunakan foto gedung imigrasi dan dokumentasi kegiatan nyata sebagai visual utama. Gunakan Inter sebagai font utama. Prioritaskan typography hierarchy, whitespace, strong grid, asymmetric editorial layouts, large meaningful numbers, timeline, structured lists, tables, dan variasi card berdasarkan fungsi. Jangan membuat website seperti generic SaaS dashboard. Hindari gradient, glassmorphism, neon glow, excessive rounded cards, heavy shadows, random decorative blobs, excessive icon cards, fake AI imagery, generic copywriting, dan layout 3-card berulang. Setiap elemen harus memiliki alasan keberadaan dan setiap data harus memiliki konteks periode, unit, dan label.**

---

# 102. FINAL QUALITY BAR

Website dianggap memiliki kualitas visual yang benar apabila pengguna dapat merasakan:

```text
"Ini portal resmi dan serius."
```

sebelum mereka berpikir:

```text
"Ini website yang keren."
```

Target akhirnya:

> **Terpercaya terlebih dahulu, menarik kemudian.**

---

# 103. GOLDEN RULE

> **Jangan membuat desain untuk mengisi ruang. Buat desain untuk mengarahkan perhatian.**

> **Jangan membuat card karena card terlihat modern. Gunakan card ketika informasi memang membutuhkan container.**

> **Jangan menggunakan warna untuk dekorasi. Gunakan warna untuk hierarchy.**

> **Jangan menggunakan gambar hanya agar hero terlihat ramai. Gunakan gambar untuk memberikan wajah pada institusi.**

> **Jangan membuat dashboard. Bangun portal data.**