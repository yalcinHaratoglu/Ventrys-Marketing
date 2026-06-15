import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildPageMetadata } from '@/lib/seo'
import type { SupportedLanguage } from '@/i18n/languages'
import { PricingContent } from '@/components/sections/PricingContent'
import { CtaBand } from '@/components/sections/CtaBand'

export const dynamic = 'force-static'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return buildPageMetadata(locale as SupportedLanguage, 'pricing', {
    home: { title: '', description: '', keywords: '' },
    features: { title: '', description: '', keywords: '' },
    pricing: {
      title: t('pricing.title'),
      description: t('pricing.description'),
      keywords: t('pricing.keywords'),
    },
  })
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <PricingContent />
      <CtaBand />
    </>
  )
}
