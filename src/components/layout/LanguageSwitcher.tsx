'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import DE from 'country-flag-icons/react/3x2/DE'
import GB from 'country-flag-icons/react/3x2/GB'
import SA from 'country-flag-icons/react/3x2/SA'
import TR from 'country-flag-icons/react/3x2/TR'
import { usePathname, useRouter } from '@/i18n/navigation'
import {
  LOCALE_LABELS,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
  isSupportedLanguage,
} from '@/i18n/languages'
import { cn } from '@/lib/utils'

const LOCALE_FLAGS = {
  tr: TR,
  en: GB,
  de: DE,
  ar: SA,
} as const

function FlagIcon({
  locale,
  className,
}: {
  locale: SupportedLanguage
  className?: string
}) {
  const Flag = LOCALE_FLAGS[locale]
  return <Flag className={cn('h-3.5 w-auto shrink-0 rounded-[2px]', className)} aria-hidden />
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const current = isSupportedLanguage(locale) ? locale : 'tr'
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const select = (lang: SupportedLanguage) => {
    setOpen(false)
    if (lang !== current) {
      router.replace(pathname, { locale: lang })
    }
  }

  return (
    <div ref={rootRef} className={cn('relative shrink-0', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={LOCALE_LABELS[current]}
        className={cn(
          'inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white/80 px-2.5 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800',
          open && 'border-indigo-300 bg-slate-50 dark:border-indigo-700 dark:bg-slate-800',
        )}
      >
        <FlagIcon locale={current} />
        <ChevronDown
          className={cn('h-3.5 w-3.5 opacity-60 transition', open && 'rotate-180')}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute end-0 top-[calc(100%+6px)] z-50 min-w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const selected = lang === current
            return (
              <li key={lang} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => select(lang)}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm font-medium transition',
                    selected
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
                  )}
                >
                  <FlagIcon locale={lang} />
                  <span>{LOCALE_LABELS[lang]}</span>
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
