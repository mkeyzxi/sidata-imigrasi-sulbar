import { Metadata } from 'next'
import KegiatanClient from './kegiatan-client'

export const metadata: Metadata = {
  title: 'Data Kegiatan',
  description: 'Arsip dan jadwal operasional dari Kantor Wilayah Direktorat Jenderal Imigrasi Sulawesi Barat, Imigrasi Mamuju, dan Imigrasi Polman.',
}

export default function Page() {
  return <KegiatanClient />
}
