import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildPageMetadata } from '@/lib/seo'
import type { SupportedLanguage } from '@/i18n/languages'
import { ContactForm } from '@/components/forms/ContactForm'
import { Reveal } from '@/components/motion/Reveal'

export const dynamic = 'force-static'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return buildPageMetadata(locale as SupportedLanguage, 'contact', {
    home: { title: '', description: '', keywords: '' },
    features: { title: '', description: '', keywords: '' },
    pricing: { title: '', description: '', keywords: '' },
    contact: {
      title: t('contact.title'),
      description: t('contact.description'),
      keywords: t('contact.keywords'),
    },
  })
}

function ContactFormFallback() {
  return <div className="h-96 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contactPage')

  return (
    <div className="pb-24">
      <section className="relative overflow-hidden border-b border-slate-200 py-20 dark:border-slate-800">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-indigo-50/80 to-transparent dark:from-indigo-950/30" />
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              {t('heroTitle')}
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">{t('heroSubtitle')}</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Reveal>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t('formTitle')}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('formDescription')}</p>
            <div className="mt-8">
              <Suspense fallback={<ContactFormFallback />}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
