import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://data-imigrasi-sulbar.my.id'
  
  const routes = [
    '',
    '/data',
    '/hubungi',
    '/imigrasi-mamuju',
    '/imigrasi-polman',
    '/kanwil-sulbar',
    '/kegiatan',
    '/tentang',
    '/login',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
}
