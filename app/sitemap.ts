import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://tanzaiai.com'
  return ['', '/chat', '/pricing', '/login', '/signup'].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }))
}
