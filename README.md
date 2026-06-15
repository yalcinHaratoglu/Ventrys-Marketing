# Ventrys — Stok & Ön Muhasebe SaaS

> Küçük ve orta ölçekli işletmeler için **multi-tenant stok, fatura, cari ve barkod yönetimi** platformu.  
> Bu repo, ürünün **açık kaynak pazarlama sitesidir** — landing, SEO ve çok dilli tanıtım katmanı.

<p align="center">
  <a href="https://ventrys.com"><strong>🌐 ventrys.com</strong></a>
  &nbsp;·&nbsp;
  <a href="https://app.ventrys.com"><strong>📱 Canlı uygulama</strong></a>
  &nbsp;·&nbsp;
  <a href="https://app.ventrys.com/login?demo=1"><strong>🎯 Demo ile dene</strong></a>
</p>

---

## Bu repo ne?

Ventrys ekosisteminin **üç katmanından biri** olan pazarlama sitesinin kaynak kodudur. Ana uygulama (React SPA + Django API) ayrı, private bir repoda tutulabilir; **bu repo public kalır** ve portföyünüzde ürünü tanıtmanız için tasarlanmıştır.

| Katman | Teknoloji | Durum |
|--------|-----------|-------|
| **Pazarlama sitesi** (bu repo) | Next.js 15, Tailwind 4, next-intl | Public |
| **Operasyonel uygulama** | React 19, Vite, TanStack Query, Zustand | Private repo |
| **REST API** | Django 5, DRF, PostgreSQL, JWT | Private repo |

Marketing sitesi uygulama kodunu içermez; `NEXT_PUBLIC_APP_URL` ile canlı uygulamaya yönlendirir.

---

## Ürün özeti

**Ventrys**, dağınık Excel tabloları ve birbirinden kopuk araçlar yerine stok, fatura ve cariyi **tek platformda** birleştirir.

### Temel modüller

| Modül | Ne yapar? |
|-------|-----------|
| **Stok** | Kutu/adet bazlı envanter, kritik stok uyarıları, kategori yönetimi |
| **Faturalar** | Alış/satış, taslak → onay akışı; onayda stok + cari otomatik güncellenir |
| **Cari** | Müşteri & tedarikçi bakiyeleri, ödeme kayıtları, hareket geçmişi |
| **Barkod** | Kamera/USB tarama, otomatik barkod üretimi, termal & A4 etiket yazdırma |
| **Raporlar** | Dashboard KPI, Chart.js trendler, Excel/PDF export |
| **Multi-tenant** | Her şirket izole veri; admin/personel rolleri |

### Demo hesap

Canlı ortamda **kayıt olmadan** deneyebilirsiniz:

| | |
|---|---|
| **E-posta** | `demo@ventrys.app` |
| **Şifre** | `Demo2026!` |
| **Kısayol** | [app.ventrys.com/login?demo=1](https://app.ventrys.com/login?demo=1) |

Demo modu: sunucudan örnek veri bir kez yüklenir, sonraki işlemler tarayıcıda simüle edilir — veritabanı kirlenmez.

---

## Uygulama nasıl çalışır?

Ventrys üç bağımsız servisten oluşur. Kullanıcı pazarlama sitesinden kayıt olur veya giriş yapar; operasyonel işlemler React SPA üzerinden yapılır; tüm kalıcı veri Django REST API üzerinden PostgreSQL'e yazılır.

### Kullanıcı akışı

```
Kayıt (e-posta doğrulama) → Şirket + admin kullanıcı oluşturulur
        │
        ▼
Giriş → JWT access token (localStorage) + refresh token (HTTP-only cookie)
        │
        ▼
Dashboard → Stok / Fatura / Cari / Barkod / Rapor modülleri
        │
        ▼
Fatura onayı → Backend tek transaction'da stok + cari + audit günceller
        │
        ▼
Frontend → TanStack Query cache invalidation → UI anında yenilenir
```

**Demo akışı farklıdır:** Giriş sonrası sunucudan seed veri bir kez çekilir, ardından tüm CRUD istekleri tarayıcıdaki localStorage sandbox'ına yönlendirilir. Backend demo şirketine yazma engellenir (403).

---

### Backend API — teknolojiler ve kullanım

| Teknoloji | Nerede / nasıl kullanıldı |
|-----------|---------------------------|
| **Django 5** | Proje iskeleti, ORM, admin, migration |
| **Django REST Framework** | ViewSet tabanlı CRUD, pagination, filtreleme |
| **SimpleJWT** | Access token (kısa ömür) + refresh token (cookie) |
| **PostgreSQL** | Production veritabanı; tenant izolasyonu `company_id` ile |
| **django-cors-headers** | SPA origin'inden cross-origin istekler |
| **drf-spectacular** | OpenAPI şeması → `/api/docs/` Swagger UI |
| **django-environ** | `.env` ile `DATABASE_URL`, `SECRET_KEY`, JWT süreleri |
| **openpyxl** | Ürün/fatura/rapor Excel export |
| **reportlab** | Fatura PDF üretimi |
| **WhiteNoise + Gunicorn** | Production static serve & WSGI |
| **pytest + pytest-django** | Domain service ve API testleri |

#### Multi-tenant mimari

Her kullanıcı kaydında bir **Company** (kiracı) oluşur. `TenantMiddleware` isteğe `active_company` bağlar; tüm ViewSet'ler `get_queryset()` içinde `company=self.request.user.active_company` filtresi uygular. Böylece şirketler birbirinin verisini göremez.

Roller: **Company Admin** (ayarlar, ekip, şirket bilgisi) ve **Member** (operasyonel modüller).

#### Domain modülleri (Django apps)

| App | Modeller / sorumluluk | API örnekleri |
|-----|----------------------|---------------|
| `accounts` | User, Company, Membership, e-posta doğrulama | `/auth/register/`, `/auth/login/`, `/company/` |
| `inventory` | Product, Category, StockMovement | `/products/`, `/categories/`, `/products/critical/` |
| `parties` | Customer, Supplier, LedgerEntry | `/customers/`, `/suppliers/`, `/{id}/ledger/` |
| `invoicing` | Invoice, InvoiceItem, InvoicePayment | `/invoices/`, `/post_invoice/`, `/add_payment/` |
| `reporting` | Aggregasyon view'ları (DB sorgusu) | `/dashboard-summary/`, `/reports/…` |
| `audit` | ActivityLog | `/activity/` |

#### Fatura onayı — domain service

En kritik iş kuralı `InvoiceService.post_invoice()` içindedir. Taslak fatura onaylandığında **tek `atomic` transaction** içinde:

1. **Satış faturası:** Stok yeterliliği kontrol edilir → `select_for_update` ile ürün stoku düşülür → `StockMovement (OUT)` yazılır → müşteri carisine `LedgerEntry (DEBIT)` eklenir.
2. **Alış faturası:** Stok artırılır → `StockMovement (IN)` → tedarikçi carisine `LedgerEntry (CREDIT)`.
3. **Audit log** kaydı oluşturulur.

Yetersiz stok veya eksik taraf (müşteri/tedarikçi) durumunda `ValidationError` fırlatılır; transaction rollback olur.

#### Kimlik doğrulama akışı

```
POST /auth/login/  →  { access, user }  +  Set-Cookie: refresh_token (HttpOnly)
        │
Her API isteği  →  Authorization: Bearer {access}
        │
401 alınırsa  →  POST /auth/refresh/ (cookie ile)  →  yeni access token
        │
Refresh de geçersizse  →  logout, login sayfasına yönlendir
```

Kayıt akışında e-posta doğrulama token'ı gönderilir; doğrulanmadan tam erişim kısıtlanabilir.

#### Demo koruması (backend)

`DemoReadOnlyMixin`: `company.is_demo == True` olan kiracılarda POST/PUT/PATCH/DELETE istekleri **403** döner. Demo verisi `seed_demo_account` management command ile oluşturulur; canlı ortamda kirlenmez.

---

### Frontend SPA — teknolojiler ve kullanım

| Teknoloji | Nerede / nasıl kullanıldı |
|-----------|---------------------------|
| **React 19** | Tüm UI; function component + hooks |
| **Vite 6** | Dev server, HMR, production bundle |
| **TypeScript** | Strict typing; API response tipleri |
| **React Router 7** | `/dashboard`, `/products`, `/invoices/…` route'ları |
| **TanStack Query v5** | Sunucu state: `useQuery`, `useMutation`, cache invalidation |
| **Zustand** | Auth oturumu, tema, para birimi, fatura taslağı |
| **Axios** | HTTP client; JWT interceptor + demo adapter |
| **react-hook-form + Zod** | Form validasyonu (fatura, ürün, ayarlar) |
| **i18next + react-i18next** | 4 dil; `localStorage` + browser detection |
| **Tailwind CSS 4** | Utility-first styling; dark mode `class` stratejisi |
| **Chart.js + react-chartjs-2** | Dashboard aylık gelir/gider grafiği |
| **html5-qrcode** | Kamera ile barkod/QR tarama |
| **jsbarcode + react-barcode** | Etiket önizleme ve yazdırma |
| **lucide-react** | İkon seti |

#### Sayfa yapısı ve sorumluluklar

| Sayfa | Ne yapar? | Kullanılan pattern |
|-------|-----------|-------------------|
| **Dashboard** | KPI kartları, trend grafiği, son işlemler | `useQuery(['dashboard-summary'])` |
| **Ürünler** | CRUD, kritik stok filtresi, barkod atama | DataTable + modal formlar |
| **Faturalar** | Liste, filtre, durum badge'leri | Pagination + search params |
| **Fatura oluştur** | Satır ekleme, barkod tarama, taslak kaydet | Zustand draft store + RHF |
| **Fatura detay** | Onay, iptal, ödeme, PDF/Excel | Mutation + invalidation |
| **Müşteri / Tedarikçi** | Cari kart, hareket geçmişi, fatura listesi | Nested route + ledger tab |
| **Barkod etiketleri** | Termal 40×30 mm ve Avery A4 layout | Print CSS + jsbarcode |
| **Raporlar** | Gelir/gider, top ürünler, export | Aggregated API + blob download |
| **Ayarlar** | Profil, şifre, şirket, ekip, tema | Tab layout; demo'da yalnızca görünüm |
| **Activity** | Denetim izi listesi | Paginated audit log |

#### State yönetimi — iki katman

**Sunucu state (TanStack Query):** Ürünler, faturalar, dashboard verisi API'den gelir. Mutation sonrası ilgili query key'ler invalidate edilir — örneğin fatura onayından sonra `['products']`, `['invoices']`, `['dashboard-summary']` aynı anda yenilenir.

**Client state (Zustand):** Oturum bilgisi, tema tercihi, para birimi sembolü ve yarım kalmış fatura taslağı tarayıcıda tutulur; sayfa yenilense bile draft korunabilir.

#### API iletişimi

```
React bileşeni
    └── useQuery / useMutation
            └── api.get('/products/')   ← Axios instance
                    ├── Request interceptor: JWT ekle, demo ise adapter devreye al
                    └── Response interceptor: 401 → token refresh → retry
                            └── Django ViewSet → Serializer → PostgreSQL
```

Pagination DRF standardında: `{ count, next, previous, results }`. Frontend `page` ve `page_size` query param'ları gönderir.

#### Demo sandbox (frontend)

Private repoda `frontend/src/demo/` altında tam bir istemci tarafı simülasyon katmanı vardır:

1. **Bootstrap:** Giriş sonrası sunucudan GET ile seed veri çekilir → `localStorage` (`ventrys-demo-state`).
2. **Router:** Axios custom adapter, demo modda istekleri `handleDemoRequest()` fonksiyonuna yönlendirir.
3. **Logic:** Fatura onayı, stok düşüşü, cari bakiye, ödeme kaydı tarayıcıda hesaplanır — backend'e POST gitmez.
4. **Export:** Excel (CSV blob) ve fatura PDF (yazdırılabilir HTML blob) mock veriden üretilir.

Bu sayede canlı demo hesabı binlerce ziyaretçi tarafından kullanılsa bile production veritabanı değişmez.

#### Barkod sistemi

- **Kamera tarama:** `html5-qrcode` ile `BarcodeScannerModal`; fatura satırı eklerken veya ürün ararken.
- **USB okuyucu:** Klavye emülasyonu yapan HID tarayıcılar `UsbBarcodeScanButton` ile dinlenir.
- **Etiket yazdırma:** `BarcodeLabelsPage` — termal rulo (40×30 mm) veya Avery L7163 A4 sheet; `@media print` CSS ile tarayıcı yazdırma.

#### i18n ve tema

- **4 dil:** Türkçe, İngilizce, Almanca, Arapça — JSON locale dosyaları, Arapça için `dir="rtl"`.
- **Tema:** Light/dark `class` stratejisi; primary renk CSS custom property ile runtime'da değiştirilir.
- **Para birimi:** Şirket ayarından sembol; dashboard ve fatura tutarları buna göre formatlanır.

---

### Modüller arası veri akışı

Ventrys'in değer önerisi modüllerin **birbirine bağlı** çalışmasıdır:

```mermaid
flowchart LR
    A[Ürün tanımı] --> B[Fatura taslağı]
    B --> C{Onay}
    C -->|Satış| D[Stok OUT]
    C -->|Alış| E[Stok IN]
    D --> F[Cari DEBIT]
    E --> G[Cari CREDIT]
    D --> H[Activity Log]
    E --> H
    F --> I[Dashboard KPI]
    G --> I
    D --> I
```

| Olay | Stok | Cari | Rapor |
|------|------|------|-------|
| Satış faturası onayı | Adet düşer | Müşteri borcu artar | Gelir KPI güncellenir |
| Alış faturası onayı | Adet artar | Tedarikçi alacağı artar | Gider KPI güncellenir |
| Ödeme kaydı | — | Bakiye azalır | Tahsilat/ödeme raporu |
| Ürün silme (stoklu) | — | Engellenir | — |

---

### Export ve raporlama

**Backend (gerçek hesaplar):**
- `openpyxl` ile `.xlsx` — ürün listesi, fatura listesi, rapor tabloları
- `reportlab` ile fatura PDF — şirket logosu, kalem tablosu, KDV dökümü

**Frontend demo:**
- Aynı endpoint path'leri Axios adapter'da yakalanır
- CSV/HTML blob olarak indirilir; kullanıcı deneyimi production ile aynıdır

**Dashboard raporları:** Backend aggregation sorguları — aylık gelir/gider trendi, en çok satan ürünler, vadesi geçmiş faturalar, kritik stok listesi.

---

### Yapılan işler — özet

| Alan | Gerçekleştirilen |
|------|------------------|
| **Mimari** | Multi-tenant SaaS; marketing / SPA / API ayrımı; demo sandbox |
| **Backend** | 6 Django app, domain service, JWT auth, e-posta doğrulama, OpenAPI |
| **Frontend** | 15+ sayfa, CRUD modülleri, barkod, grafik, export, 4 dil RTL |
| **İş kuralları** | Fatura-stok-cari entegrasyonu, yetersiz stok kontrolü, ödeme takibi |
| **Demo** | Seed command + read-only backend + localStorage client simulation |
| **Marketing** | SEO-first landing, locale routing, OG/JSON-LD, framer-motion |
| **Kalite** | pytest, ESLint, Prettier, TypeScript strict, Husky pre-commit |
| **Deploy** | Docker Compose (PostgreSQL), Render.yaml şablonu, Vercel-ready SPA |

---

## Sistem diyagramı

```
┌──────────────────────────┐
│   Marketing (bu repo)    │  Next.js · SSG/SSR · 4 dil · SEO
│   ventrys.com            │
└────────────┬─────────────┘
             │  CTA → NEXT_PUBLIC_APP_URL
             ▼
┌──────────────────────────┐
│   Frontend SPA           │  React 19 · Vite · i18n · dark mode
│   app.ventrys.com        │  TanStack Query · Zustand · Chart.js
└────────────┬─────────────┘
             │  REST + JWT (access + refresh cookie)
             ▼
┌──────────────────────────┐
│   Backend API            │  Django 5 · DRF · PostgreSQL
│   api.ventrys.com        │  Multi-tenant · domain services
└──────────────────────────┘
```

Detaylı açıklama için yukarıdaki [Uygulama nasıl çalışır?](#uygulama-nasıl-çalışır) bölümüne bakın.

---

## Bu repoda neler var?

### Tech stack

| Alan | Kullanılan |
|------|------------|
| Framework | Next.js 15 (App Router) |
| Dil | TypeScript |
| Stil | Tailwind CSS 4 |
| i18n | next-intl — TR / EN / DE / AR |
| Tema | next-themes (dark / light) |
| Animasyon | framer-motion (scroll reveal, hero) |
| İkon | lucide-react |

### SEO & performans

- `robots.txt`, dinamik `sitemap.xml`, `manifest.webmanifest`
- Sayfa bazlı metadata, hreflang, Open Graph
- JSON-LD: `Organization`, `SoftwareApplication`
- Dinamik `opengraph-image` (Edge)
- Locale middleware ile otomatik dil yönlendirme

### Dosya yapısı

```
src/
├── app/
│   ├── [locale]/           # Ana sayfa, özellikler, fiyatlandırma
│   ├── layout.tsx
│   └── opengraph-image.tsx
├── components/
│   ├── sections/           # Hero, Features, Pricing, CTA, HowItWorks
│   ├── layout/             # Header, Footer, LanguageSwitcher
│   ├── brand/              # Logo, LogoMark (SVG)
│   ├── seo/                # JsonLd
│   └── motion/             # Reveal, PageTransition
├── messages/               # tr.json, en.json, de.json, ar.json
├── lib/                    # seo.ts, theme.ts, images.ts
└── i18n/                   # routing, request config
public/
├── brand/                  # Logo seti (light/dark)
└── favicon/                # Favicon paketi
```

---

## Kurulum (bu repo)

```bash
git clone https://github.com/<kullanici>/ventrys-marketing.git
cd ventrys-marketing
cp .env.example .env.local
pnpm install
pnpm dev        # http://localhost:3001
```

### Ortam değişkenleri

```env
NEXT_PUBLIC_APP_URL=https://app.ventrys.com
NEXT_PUBLIC_SITE_URL=https://ventrys.com
```

| Komut | Açıklama |
|-------|----------|
| `pnpm dev` | Geliştirme sunucusu (port 3001) |
| `pnpm build` | Production build |
| `pnpm start` | Production sunucu |
| `pnpm lint` | ESLint |

### Deploy

Vercel'de root olarak bu repo deploy edilir. `NEXT_PUBLIC_*` değişkenlerini Vercel dashboard'dan tanımlayın.

---

## Yetkinlikler (CV / portföy)

Bu proje kapsamında geliştirdiğim başlıca alanlar:

**Full-stack SaaS**
- Django REST API ile multi-tenant mimari, domain-driven invoice service
- React 19 SPA: stok, fatura, cari, barkod, raporlama modülleri
- JWT auth, e-posta doğrulama, rol tabanlı yetkilendirme

**Frontend mühendisliği**
- TanStack Query + Zustand ile state yönetimi
- 4 dil i18n, RTL, dark/light tema sistemi
- Barkod tarama (kamera/USB), Chart.js dashboard, PDF/Excel export
- localStorage tabanlı demo sandbox (Axios adapter pattern)

**Pazarlama & SEO**
- Next.js 15 App Router, next-intl locale routing
- Structured data, OG image, sitemap, hreflang
- Framer Motion ile performanslı landing animasyonları

**DevOps & kalite**
- PostgreSQL, Docker Compose, Render deploy şablonu
- pytest, Ruff, ESLint, Prettier, Husky pre-commit

---

## CV'ye kopyala-yapıştır

**Kısa (1 cümle):**
> Ventrys adlı multi-tenant stok & ön muhasebe SaaS'ını sıfırdan geliştirdim: Django REST API, React 19 SPA (i18n, barkod, Chart.js) ve Next.js 15 pazarlama sitesi (SEO, 4 dil).

**Orta (LinkedIn / özgeçmiş):**
> Küçük işletmeler için stok, fatura, cari ve barkod yönetimini birleştiren Ventrys platformunu full-stack olarak tasarladım ve geliştirdim. Backend'de Django + PostgreSQL ile multi-tenant izolasyon ve domain service pattern; frontend'de React 19, TanStack Query ve localStorage demo sandbox; pazarlama katmanında Next.js 15, next-intl ve kapsamlı SEO altyapısı kullandım.

**Madde listesi (CV projects bölümü):**
- Multi-tenant SaaS: şirket bazlı veri izolasyonu, JWT auth, rol yönetimi
- Fatura → stok → cari entegrasyonu (tek transaction domain service)
- Barkod tarama, termal etiket, kritik stok uyarıları
- 4 dil (TR/EN/DE/AR), dark mode, özelleştirilebilir tema
- Demo sandbox: sunucuyu kirletmeden canlı ürün deneyimi
- SEO-first marketing sitesi: JSON-LD, OG, sitemap, locale routing

---

## Ekran görüntüleri

> Deploy sonrası `docs/screenshots/` klasörüne ekleyebilirsiniz.

| Landing | Dashboard | Fatura |
|---------|-----------|--------|
| Hero + özellikler | KPI + grafikler | Taslak → onay akışı |

---

## Lisans & iletişim

Bu repo (pazarlama sitesi) public olarak paylaşılabilir. Ana uygulama kodu private repoda tutulmaktadır.

<!-- Kendi bilgilerinizi ekleyin: -->
<!-- **Geliştirici:** [Ad Soyad](https://linkedin.com/in/...) · [GitHub](https://github.com/...) -->

---

<p align="center">
  <sub>Ventrys — Stok ve ön muhasebe, tek platformda.</sub>
</p>
