import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildPageMetadata } from '@/lib/seo'
import type { SupportedLanguage } from '@/i18n/languages'
import { FeaturesDetail } from '@/components/sections/FeaturesDetail'
import { CtaBand } from '@/components/sections/CtaBand'

export const dynamic = 'force-static'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return buildPageMetadata(locale as SupportedLanguage, 'features', {
    home: { title: '', description: '', keywords: '' },
    features: {
      title: t('features.title'),
      description: t('features.description'),
      keywords: t('features.keywords'),
    },
    pricing: { title: '', description: '', keywords: '' },
  })
}

export default async function FeaturesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <FeaturesDetail />
      <CtaBand />
    </>
  )
}
