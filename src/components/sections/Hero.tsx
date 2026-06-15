'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { ArrowRight, Package } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { MARKETING_IMAGES } from '@/lib/images'
import { getAppLoginUrl, getAppRegisterUrl } from '@/lib/app-url'

export function Hero() {
  const t = useTranslations('hero')

  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-600/15" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="noise-overlay absolute inset-0 opacity-[0.35]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300">
              {t('badge')}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              {t('title')}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              {t('subtitle')}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={getAppRegisterUrl()}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"
              >
                {t('ctaPrimary')}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={getAppLoginUrl()}
                className="inline-flex items-center rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-800 backdrop-blur transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
              >
                {t('ctaSecondary')}
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal direction="left" delay={0.1}>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-2xl dark:border-slate-700/80">
              <Image
                src={MARKETING_IMAGES.hero}
                alt=""
                width={1200}
                height={800}
                priority
                className="h-[320px] w-full object-cover sm:h-[420px]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-4 left-4 right-4 flex gap-3 sm:-bottom-6 sm:left-6 sm:right-auto">
              <div className="glass-card flex items-center gap-2 px-4 py-3 text-sm">
                <Package className="h-4 w-4 text-indigo-500" />
                <span>{t('mockStock')}</span>
              </div>
              <div className="glass-card hidden px-4 py-3 text-sm sm:block">{t('mockInvoice')}</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
