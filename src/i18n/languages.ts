export const SUPPORTED_LANGUAGES = ['tr', 'en', 'de', 'ar'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LOCALE: SupportedLanguage = 'tr'

export const LOCALE_LABELS: Record<SupportedLanguage, string> = {
  tr: 'Türkçe',
  en: 'English',
  de: 'Deutsch',
  ar: 'العربية',
}

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)
}

export function isRtlLocale(locale: string): boolean {
  return locale === 'ar'
}