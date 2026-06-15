'use client'

import { useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Barcode,
  Building2,
  FileText,
  LineChart,
  Package,
  Users,
} from 'lucide-react'
import { Reveal, StaggerChildren, StaggerItem } from '@/components/motion/Reveal'
import { cn } from '@/lib/utils'

const ICONS = [Package, FileText, Users, Barcode, LineChart, Building2] as const
const KEYS = ['stock', 'invoice', 'ledger', 'barcode', 'reports', 'multi'] as const

export function FeatureGrid() {
  const t = useTranslations('features')
  const reduce = useReducedMotion()

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{t('subtitle')}</p>
        </Reveal>

        <StaggerChildren className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {KEYS.map((key, i) => {
            const Icon = ICONS[i]
            return (
              <StaggerItem key={key}>
                <motion.article
                  whileHover={reduce ? undefined : { y: -4 }}
                  className={cn(
                    'group h-full rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60',
                  )}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition group-hover:scale-105 dark:bg-indigo-950 dark:text-indigo-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {t(`items.${key}.description`)}
                  </p>
                </motion.article>
              </StaggerItem>
            )
          })}
        </StaggerChildren>
      </div>
    </section>
  )
}
