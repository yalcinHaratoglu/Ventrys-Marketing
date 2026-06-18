import type { Metadata } from 'next'
import { getSiteUrl } from './app-url'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/i18n/languages'

export type PageKey = 'home' | 'features' | 'pricing' | 'contact'

type MetaMessages = {
  title: string
  description: string
  keywords: string
}

export function buildPageMetadata(
  locale: SupportedLanguage,
  page: PageKey,
  meta: Partial<Record<PageKey, MetaMessages>>,
): Metadata {
  const pageMeta = meta[page]
  if (!pageMeta) {
    throw new Error(`Missing metadata for page: ${page}`)
  }
  const { title, description, keywords } = pageMeta
  const siteUrl = getSiteUrl()
  const path = page === 'home' ? '' : `/${page}`
  const canonical = `${siteUrl}/${locale}${path}`

  const languages = Object.fromEntries(
    SUPPORTED_LANGUAGES.map((lang) => [lang, `${siteUrl}/${lang}${path}`]),
  )

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: keywords.split(',').map((k) => k.trim()),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Ventrys',
      locale,
      type: 'website',
      images: [{ url: `${siteUrl}/opengraph-image`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/opengraph-image`],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
