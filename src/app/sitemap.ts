import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/app-url'
import { SUPPORTED_LANGUAGES } from '@/i18n/languages'

const PAGES = ['', '/features', '/pricing', '/contact'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  const now = new Date()

  return SUPPORTED_LANGUAGES.flatMap((locale) =>
    PAGES.map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === '' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? 1 : 0.8,
    })),
  )
}
