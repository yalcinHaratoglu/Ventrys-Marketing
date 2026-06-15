'use client'

import { useLayoutEffect } from 'react'
import { isRtlLocale } from '@/i18n/languages'

export function SetHtmlLang({ locale }: { locale: string }) {
  useLayoutEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = isRtlLocale(locale) ? 'rtl' : 'ltr'
  }, [locale])

  return null
}
