'use client'

import { useTranslations } from 'next-intl'
import { Shield, FileDown, Globe, History } from 'lucide-react'
import { Reveal, StaggerChildren, StaggerItem } from '@/components/motion/Reveal'

const ICONS = [Shield, History, FileDown, Globe]
const KEYS = ['tenant', 'audit', 'export', 'i18n'] as const

export function TrustBand() {
  const t = useTranslations('trust')

  return (
    <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('title')}</h2>
        </Reveal>
        <StaggerChildren className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KEYS.map((key, i) => {
            const Icon = ICONS[i]
            return (
              <StaggerItem key={key}>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                  <Icon className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {t(`items.${key}`)}
                  </span>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerChildren>
      </div>
    </section>
  )
}
