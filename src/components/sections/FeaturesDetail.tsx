'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Barcode,
  Check,
  FileText,
  Globe,
  LineChart,
  Package,
  Users,
} from 'lucide-react'
import { Reveal, StaggerChildren, StaggerItem } from '@/components/motion/Reveal'
import { MARKETING_IMAGES } from '@/lib/images'
import { isRtlLocale } from '@/i18n/languages'
import { cn } from '@/lib/utils'

const MODULES = [
  { key: 'stock', icon: Package, image: MARKETING_IMAGES.stock, accent: 'from-emerald-500/20 to-teal-500/5' },
  { key: 'invoice', icon: FileText, image: MARKETING_IMAGES.invoice, accent: 'from-indigo-500/20 to-violet-500/5' },
  { key: 'ledger', icon: Users, image: MARKETING_IMAGES.ledger, accent: 'from-amber-500/20 to-orange-500/5' },
  { key: 'barcode', icon: Barcode, image: MARKETING_IMAGES.barcode, accent: 'from-sky-500/20 to-cyan-500/5' },
  { key: 'reports', icon: LineChart, image: MARKETING_IMAGES.reports, accent: 'from-rose-500/20 to-pink-500/5' },
  { key: 'global', icon: Globe, image: MARKETING_IMAGES.global, accent: 'from-violet-500/20 to-indigo-500/5' },
] as const

type ModuleKey = (typeof MODULES)[number]['key']

const WORKFLOW_STEPS = ['1', '2', '3', '4'] as const

export function FeaturesDetail() {
  const t = useTranslations('featuresPage')
  const locale = useLocale()
  const rtl = isRtlLocale(locale)
  const reduce = useReducedMotion()
  const [active, setActive] = useState<ModuleKey>('stock')

  const activeModule = MODULES.find((m) => m.key === active)!
  const ActiveIcon = activeModule.icon
  const highlights = t.raw(`sections.${active}.highlights`) as string[]

  return (
    <div className="pb-24">
      {/* Hero — split layout + bento preview */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="noise-overlay absolute inset-0 opacity-30" />
        </div>

        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-end lg:py-28">
          <div className="flex flex-col">
            <Reveal>
              <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300">
                {t('heroBadge')}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                {t('heroTitle')}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                {t('heroSubtitle')}
              </p>
            </Reveal>
            <StaggerChildren className="mt-10 grid grid-cols-3 gap-3">
              {(['modules', 'languages', 'export'] as const).map((key) => (
                <StaggerItem key={key} className="h-full">
                  <div className="flex h-full min-h-20 flex-col items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 px-2 py-4 text-center backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {t(`stats.${key}.value`)}
                    </p>
                    <p className="mt-1 text-xs leading-snug text-slate-500 dark:text-slate-400">
                      {t(`stats.${key}.label`)}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>

          <Reveal direction={rtl ? 'right' : 'left'} delay={0.1}>
            <div className="grid grid-cols-3 gap-3">
              {MODULES.map(({ key, icon: Icon, accent }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActive(key)}
                  className={cn(
                    'group relative flex h-20 flex-col justify-end overflow-hidden rounded-2xl border p-4 text-left transition',
                    active === key
                      ? 'border-indigo-400 bg-indigo-50 shadow-lg shadow-indigo-500/10 dark:border-indigo-600 dark:bg-indigo-950/50'
                      : 'border-slate-200/80 bg-white/60 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700',
                  )}
                >
                  <div
                    className={cn(
                      'pointer-events-none absolute inset-0 bg-linear-to-br opacity-60',
                      accent,
                    )}
                  />
                  <Icon
                    className={cn(
                      'relative mb-auto h-5 w-5',
                      active === key
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-500 group-hover:text-indigo-500 dark:text-slate-400',
                    )}
                  />
                  <p className="relative text-sm font-semibold text-slate-900 dark:text-white">
                    {t(`sections.${key}.short`)}
                  </p>
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Module explorer — sticky tabs + detail panel */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {t('explorerTitle')}
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{t('explorerSubtitle')}</p>
        </Reveal>

        <div className="mt-12 lg:sticky lg:top-20 lg:z-20">
          <div
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
            role="tablist"
            aria-label={t('explorerTitle')}
          >
            {MODULES.map(({ key, icon: Icon }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active === key}
                onClick={() => setActive(key)}
                className={cn(
                  'flex h-11 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-medium whitespace-nowrap transition',
                  active === key
                    ? 'border-indigo-500 bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{t(`sections.${key}.short`)}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40"
            role="tabpanel"
          >
            <div className="grid lg:grid-cols-5">
              <div className="relative aspect-16/10 overflow-hidden lg:col-span-3 lg:aspect-auto lg:h-96">
                <Image
                  src={activeModule.image}
                  alt={t(`sections.${active}.alt`)}
                  width={1200}
                  height={800}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent lg:bg-linear-to-r lg:from-transparent lg:via-transparent lg:to-slate-950/20" />
              </div>
              <div className="flex flex-col justify-center p-8 lg:col-span-2 lg:h-96 lg:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <ActiveIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
                  {t(`sections.${active}.title`)}
                </h3>
                <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
                  {t(`sections.${active}.description`)}
                </p>
                <ul className="mt-6 space-y-3">
                  {highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Integration workflow */}
      <section className="border-t border-slate-200 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-900/30 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              {t('workflow.title')}
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{t('workflow.subtitle')}</p>
          </Reveal>

          <StaggerChildren className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:items-stretch">
            <div className="pointer-events-none absolute left-[12%] right-[12%] top-10 hidden h-px bg-linear-to-r from-transparent via-indigo-300 to-transparent lg:block dark:via-indigo-700" />
            {WORKFLOW_STEPS.map((step) => (
              <StaggerItem key={step} className="h-full">
                <div className="relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                    {step}
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                    {t(`workflow.steps.${step}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {t(`workflow.steps.${step}.description`)}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>
    </div>
  )
}
