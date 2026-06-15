import type { MetadataRoute } from 'next'
import { BRAND } from '@/lib/theme'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.name,
    short_name: BRAND.name,
    description: 'Stock and light accounting software',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: BRAND.primary,
    icons: [
      {
        src: '/favicon/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/favicon/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
