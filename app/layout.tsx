import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

// Production base URL — set NEXT_PUBLIC_SITE_URL to your deployed domain.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://data-imigrasi-sulbar.my.id'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // ---- Basic tags ----
  title: {
    default:
      'SI Data Imigrasi Sulbar — Sistem Informasi Data Keimigrasian Terintegrasi',
    template: '%s | SI Data Imigrasi Sulbar',
  },
  description:
    'Portal informasi dan data keimigrasian terintegrasi di wilayah Sulawesi Barat.',
  keywords: [
    'imigrasi',
    'keimigrasian',
    'sulawesi barat',
    'kanwil',
    'direktorat jenderal imigrasi',
    'data imigrasi',
    'kanwil sulbar',
    'kantor imigrasi mamuju',
    'kantor imigrasi polman',
  ],
  applicationName: 'SI Data Imigrasi Sulbar',
  authors: [{ name: 'Kantor Wilayah Direktorat Jenderal Imigrasi Sulawesi Barat' }],
  creator: 'Kantor Wilayah Direktorat Jenderal Imigrasi Sulawesi Barat',
  publisher: 'Kantor Wilayah Direktorat Jenderal Imigrasi Sulawesi Barat',
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
  category: 'government',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },

  // ---- Icons (favicon, apple-touch, etc.) ----
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
      },
      {
        url: '/icon.png',
        sizes: '512x512',
      },
    ],
  },
  manifest: '/manifest.json',

  // ---- Open Graph (Facebook, LinkedIn, WhatsApp, Slack, …) ----
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: SITE_URL,
    siteName: 'SI Data Imigrasi Sulbar',
    title:
      'SI Data Imigrasi Sulbar — Sistem Informasi Data Keimigrasian Terintegrasi',
    description:
      'Portal informasi dan data keimigrasian terintegrasi di wilayah Sulawesi Barat.',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'SI Data Imigrasi Sulbar',
      },
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SI Data Imigrasi Sulbar',
      },
    ],
  },

  // ---- Twitter (X) card ----
  twitter: {
    card: 'summary_large_image',
    creator: '@imigrasisulbar',
    title:
      'SI Data Imigrasi Sulbar — Sistem Informasi Data Keimigrasian Terintegrasi',
    description:
      'Portal informasi dan data keimigrasian terintegrasi di wilayah Sulawesi Barat.',
    images: ['/icon.png', '/og-image.png'],
  },

  // ---- Microsoft / Bing verification (optional — fill in when you have one) ----
  // msApplication: { startUrl: SITE_URL },

  // ---- Alternate languages (optional) ----
  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  )
}
