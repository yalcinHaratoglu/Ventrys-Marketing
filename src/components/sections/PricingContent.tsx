'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Check, ChevronDown } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { MARKETING_IMAGES } from '@/lib/images'
import { getAppRegisterUrl } from '@/lib/app-url'
import { cn } from '@/lib/utils'

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4'] as const

export function PricingContent() {
  const t = useTranslations('pricingPage')
  const features = t.raw('features') as string[]
  const [openFaq, setOpenFaq] = useState<string | null>('q1')

  return (
    <div className="pb-24">
      <section className="relative overflow-hidden border-b border-slate-200 py-20 dark:border-slate-800">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50/80 to-transparent dark:from-indigo-950/30" />
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              {t('heroTitle')}
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">{t('heroSubtitle')}</p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-xl dark:border-slate-800">
            <Image
              src={MARKETING_IMAGES.pricing}
              alt=""
              width={1200}
              height={800}
              className="aspect-[4/3] w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-indigo-200 bg-white p-8 shadow-xl dark:border-indigo-900 dark:bg-slate-900">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              {t('planName')}
            </p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-bold text-slate-900 dark:text-white">{t('planPrice')}</span>
              <span className="text-slate-500 dark:text-slate-400">/ {t('planPeriod')}</span>
            </div>
            <p className="mt-4 text-slate-600 dark:text-slate-300">{t('planDescription')}</p>
            <p className="mt-6 text-sm font-semibold text-slate-900 dark:text-white">{t('includes')}</p>
            <ul className="mt-4 space-y-3">
              {features.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={getAppRegisterUrl()}
              className="mt-8 block rounded-xl bg-indigo-600 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              {t('planCta')}
            </a>
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
    </div>
  )
}
