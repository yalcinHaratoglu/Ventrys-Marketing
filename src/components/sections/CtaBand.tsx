'use client'

import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { LogoMark } from '@/components/brand/LogoMark'
import { Reveal } from '@/components/motion/Reveal'
import { getAppLoginUrl, getAppRegisterUrl } from '@/lib/app-url'

export function CtaBand() {
  const t = useTranslations('cta')

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="cta-mesh pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <LogoMark size={56} className="mx-auto" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">{t('title')}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100">{t('subtitle')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={getAppRegisterUrl()}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
            >
              {t('primary')}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={getAppLoginUrl()}
              className="inline-flex items-center rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t('secondary')}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
