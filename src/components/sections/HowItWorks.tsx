'use client'

import { useTranslations } from 'next-intl'
import { Reveal, StaggerChildren, StaggerItem } from '@/components/motion/Reveal'

export function HowItWorks() {
  const t = useTranslations('howItWorks')
  const steps = ['1', '2', '3'] as const

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{t('subtitle')}</p>
        </Reveal>

        <StaggerChildren className="relative mt-16 grid gap-8 md:grid-cols-3">
          <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-0.5 bg-gradient-to-r from-transparent via-indigo-300 to-transparent md:block dark:via-indigo-700" />
          {steps.map((step) => (
            <StaggerItem key={step}>
              <div className="relative rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                  {t(`steps.${step}.title`)}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {t(`steps.${step}.description`)}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
