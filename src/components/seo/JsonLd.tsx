import { getSiteUrl } from '@/lib/app-url'
import { getTranslations } from 'next-intl/server'

export async function JsonLd() {
  const t = await getTranslations('jsonLd')
  const siteUrl = getSiteUrl()

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Ventrys',
        url: siteUrl,
        logo: `${siteUrl}/brand/logo-icon-dark.svg`,
        description: t('description'),
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Ventrys',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'TRY',
        },
        description: t('description'),
        url: siteUrl,
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
