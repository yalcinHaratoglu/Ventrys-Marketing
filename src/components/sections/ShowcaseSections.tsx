'use client'

import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Reveal } from '@/components/motion/Reveal'
import { MARKETING_IMAGES } from '@/lib/images'
import { isRtlLocale } from '@/i18n/languages'
import { cn } from '@/lib/utils'

type ShowcaseKey = 'barcode' | 'invoice'

interface ShowcaseSplitProps {
  id: ShowcaseKey
  image: string
  reverse?: boolean
}

function ShowcaseBlock({ id, image, reverse }: ShowcaseSplitProps) {
  const t = useTranslations(`showcase.${id}`)
  const locale = useLocale()
  const rtl = isRtlLocale(locale)
  const flip = reverse ? !rtl : rtl

  return (
    <div
      className={cn(
        'grid items-center gap-10 lg:grid-cols-2 lg:gap-16',
        reverse && 'lg:[&>*:first-child]:order-2',
      )}
    >
      <Reveal direction={flip ? 'right' : 'left'}>
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-xl dark:border-slate-800">
          <Image
            src={image}
            alt={t('alt')}
            width={1200}
            height={800}
            className="aspect-[4/3] w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/30 to-transparent" />
        </div>
      </Reveal>
      <Reveal direction={flip ? 'left' : 'right'}>
        <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          {t('title')}
        </h3>
        <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
          {t('description')}
        </p>
      </Reveal>
    </div>
  )
}

export function ShowcaseSections() {
  return (
    <section className="bg-slate-50 py-24 dark:bg-slate-900/40 sm:py-32">
      <div className="mx-auto flex max-w-6xl flex-col gap-20 px-4 sm:px-6 sm:gap-28">
        <ShowcaseBlock id="barcode" image={MARKETING_IMAGES.barcode} />
        <ShowcaseBlock id="invoice" image={MARKETING_IMAGES.invoice} reverse />
      </div>
    </section>
  )
}
