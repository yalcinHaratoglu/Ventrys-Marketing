'use client'

import { Suspense, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Check, ChevronDown } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { ContactForm } from '@/components/forms/ContactForm'
import { MARKETING_IMAGES } from '@/lib/images'
import { getAppRegisterUrl } from '@/lib/app-url'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5'] as const

function PricingFeedbackForm() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />}>
      <ContactForm />
    </Suspense>
  )
}

export function PricingContent() {
  const t = useTranslations('pricingPage')
  const trialFeatures = t.raw('trialFeatures') as string[]
  const premiumFeatures = t.raw('premiumFeatures') as string[]
  const [openFaq, setOpenFaq] = useState<string | null>('q1')

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

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                {t('trialBadge')}
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">{t('trialPrice')}</span>
                <span className="text-slate-500 dark:text-slate-400">/ {t('trialPeriod')}</span>
              </div>
              <p className="mt-4 text-slate-600 dark:text-slate-300">{t('trialDescription')}</p>
              <p className="mt-6 text-sm font-semibold text-slate-900 dark:text-white">{t('includes')}</p>
              <ul className="mt-4 flex-1 space-y-3">
                {trialFeatures.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={getAppRegisterUrl()}
                className="mt-8 block rounded-xl bg-emerald-600 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                {t('trialCta')}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col rounded-2xl border border-indigo-200 bg-white p-8 shadow-xl dark:border-indigo-900 dark:bg-slate-900">
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                {t('premiumBadge')}
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">{t('premiumPrice')}</span>
                <span className="text-slate-500 dark:text-slate-400">/ {t('premiumPeriod')}</span>
              </div>
              <p className="mt-4 text-slate-600 dark:text-slate-300">{t('premiumDescription')}</p>
              <p className="mt-6 text-sm font-semibold text-slate-900 dark:text-white">{t('includes')}</p>
              <ul className="mt-4 flex-1 space-y-3">
                {premiumFeatures.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact?category=premium_upgrade"
                className="mt-8 block rounded-xl bg-indigo-600 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                {t('premiumCta')}
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 shadow-xl dark:border-slate-800">
            <Image
              src={MARKETING_IMAGES.pricing}
              alt=""
              width={1200}
              height={800}
              className="aspect-21/9 w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 1200px"
            />
          </div>
        </Reveal>
      </div>

      <section className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('faqTitle')}</h2>
        </Reveal>
        <div className="mt-8 space-y-3">
          {FAQ_KEYS.map((key) => {
            const isOpen = openFaq === key
            return (
              <Reveal key={key}>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white"
                    onClick={() => setOpenFaq(isOpen ? null : key)}
                    aria-expanded={isOpen}
                  >
                    {t(`faq.${key}`)}
                    <ChevronDown className={cn('h-4 w-4 shrink-0 transition', isOpen && 'rotate-180')} />
                  </button>
                  {isOpen ? (
                    <div className="border-t border-slate-200 px-5 py-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
                      {t(`faq.a${key.slice(1)}`)}
                    </div>
                  ) : null}
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-2xl px-4 sm:px-6">
        <Reveal>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t('feedbackTitle')}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('feedbackDescription')}</p>
            <div className="mt-8">
              <PricingFeedbackForm />
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
