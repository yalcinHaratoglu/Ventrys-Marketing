'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Logo } from '@/components/brand/Logo'
import { getAppRegisterUrl } from '@/lib/app-url'

export function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')

  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-slate-600 dark:text-slate-400">{t('tagline')}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t('product')}</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <Link href="/features" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                {nav('features')}
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                {nav('pricing')}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                {nav('contact')}
              </Link>
            </li>
            <li>
              <a href={getAppRegisterUrl()} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                {nav('register')}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t('legal')}</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>{t('privacy')}</li>
            <li>{t('terms')}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
        © {new Date().getFullYear()} Ventrys. {t('rights')}
      </div>
    </footer>
  )
}
