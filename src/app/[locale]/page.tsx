import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildPageMetadata } from '@/lib/seo'
import type { SupportedLanguage } from '@/i18n/languages'
import { Hero } from '@/components/sections/Hero'
import { FeatureGrid } from '@/components/sections/FeatureGrid'
import { ShowcaseSections } from '@/components/sections/ShowcaseSections'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { TrustBand } from '@/components/sections/TrustBand'
import { CtaBand } from '@/components/sections/CtaBand'

export const dynamic = 'force-static'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return buildPageMetadata(locale as SupportedLanguage, 'home', {
    home: { title: t('home.title'), description: t('home.description'), keywords: t('home.keywords') },
    features: { title: '', description: '', keywords: '' },
    pricing: { title: '', description: '', keywords: '' },
  })
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Hero />
      <FeatureGrid />
      <ShowcaseSections />
      <HowItWorks />
      <TrustBand />
      <CtaBand />
    </>
  )
}
