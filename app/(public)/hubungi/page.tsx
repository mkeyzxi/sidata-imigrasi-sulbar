import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hubungi Kami',
  description: 'Hubungi kantor terkait untuk pertanyaan, saran, dan laporan seputar layanan keimigrasian di Sulawesi Barat.',
}

import HubungiClient from './hubungi-client'

export default function Page() {
  return <HubungiClient />
}
