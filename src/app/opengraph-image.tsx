import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Ventrys'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: 'linear-gradient(135deg, #0f172a 0%, #1B3A6B 55%, #1e40af 100%)',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: '#1B3A6B',
              border: '2px solid rgba(56, 189, 248, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            V
          </div>
          <span style={{ fontSize: 64, fontWeight: 600, letterSpacing: '0.04em' }}>ventrys</span>
        </div>
        <p style={{ marginTop: 32, fontSize: 32, opacity: 0.92, maxWidth: 900, lineHeight: 1.35 }}>
          Stok, fatura ve cari yönetimi — tek platformda
        </p>
      </div>
    ),
    { ...size },
  )
}
