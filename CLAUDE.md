# EcoServe Frontend — Claude Code Context

## Project Overview
EcoServe adalah platform PWA manajemen e-waste untuk kompetisi I/O Festival 2026 (BEM FTI Universitas Tarumanagara). Platform ini menjembatani consumer dan technician repair melalui AI diagnostics (Gemini) dan geospatial routing.

## Team Structure
- Frontend: satu developer (pake Claude Code)
- Backend: satu developer (Go Fiber + PostgreSQL + PostGIS)
- Deadline: Akhir April 2026

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- TypeScript
- Tailwind CSS + shadcn/ui
- Leaflet + Leaflet Routing Machine (maps)
- Supabase Storage (profile photos only, NOT auth)
- Framer Motion (animations)
- next-pwa (PWA)

## Important Architecture Decisions

### Auth
- JWT HttpOnly Cookie dari backend (NOT Supabase Auth)
- Cookie name: `jwt`, di-set oleh `ecoserve-api.onrender.com`
- Middleware di `src/middleware.ts` adalah BYPASS — auth check pindah ke client-side via `useAuth` hook
- Alasan: cookie HttpOnly cross-origin tidak bisa dibaca middleware Next.js
- `useAuth` hit `GET /api/users/me` untuk validasi session

### API
- Base URL: `https://ecoserve-api.onrender.com`
- Wrapper: `src/lib/api.ts` (apiFetch) dengan handling rate limit 429
- Rate limit: 5 req/menit per IP
- Response format: `{ data: {...}, message: "..." }`
- Field naming dari Go backend: **PascalCase** (FullName, DeviceCategory, dst)
- Status order: UPPERCASE — `PENDING`, `ACCEPTED`, `IN_PROGRESS`, `COMPLETED`
- Role user: `"customer"` dan `"technician"` (NOT "consumer" — URL path pakai "consumer" tapi role-nya "customer")

### Caching
- In-memory cache di `src/lib/auth-cache.ts`
- User cache: 5 menit
- Orders cache: 2 menit
- Alasan: minimize rate limit hits

### Maps
- Leaflet format: `[lat, lng]`
- Backend PostGIS format: `[lng, lat]` — hati-hati saat konversi
- Routing: OSRM demo server (gratis, tidak reliable untuk production)
- SSR issue: semua Leaflet component wajib `dynamic import` dengan `ssr: false`

## Code Style Conventions

### File Structure

src/
├── app/
│   ├── (public)/          # Landing + auth
│   ├── consumer/
│   │   ├── (with-nav)/    # Pages dengan bottom nav
│   │   └── (no-nav)/      # Full-screen pages
│   └── technician/
├── components/
│   ├── auth/
│   ├── consumer/
│   ├── technician/
│   └── ui/                # shadcn components
├── hooks/
│   └── useAuth.ts
└── lib/
├── api.ts
├── auth-cache.ts
├── haversine.ts
├── logout.ts
└── utils.ts

### Component Patterns
- "use client" untuk semua page component
- Dynamic import untuk Leaflet components
- Suspense wrapper untuk pages yang pakai `useSearchParams`

### Styling
- Tailwind classes
- CSS variables dari shadcn theme
- Primary color: emerald-500 (#10b981)
- Dark mode only (for now)

## Known Issues / Tech Debt

1. **UI tidak konsisten antar halaman** — component tidak di-reuse, styling berbeda-beda (TARGETING INI DI REFACTOR)
2. **Middleware bypass** — auth full client-side, tidak optimal tapi workaround untuk cross-origin cookie
3. **localStorage untuk declined orders** — tidak sinkron antar device
4. **Earnings tidak punya history per bulan** — butuh endpoint baru dari backend
5. **Technician onboarding** — masih bug di backend (foreign key constraint)

## Refactor Goals (Current Sprint)

### Phase 1: Design System
- Buat shared primitive components di `src/components/ui/`
  - Modal (universal dengan header, body, footer)
  - Toast (notification system)
  - PageHeader (dengan back button)
  - StatsCard
  - BottomNav (unified untuk consumer & technician via props)
- Setup design tokens di `tailwind.config.ts` dan CSS variables

### Phase 2: Page Standardization
- Profile consumer dan technician pakai layout yang sama
- Semua modal pakai `Modal` component
- Semua toast pakai `Toast` component

### Phase 3: Feature Addition
- Dark/Light mode toggle
- i18n Indonesia/English
- Earnings 3-month selector
- Report complaint page

### Phase 4: UI Style Overhaul
- Apply Swiss Minimalism + Brutalism accent + Earthy palette
- Ubah color palette dari generic emerald ke earthy tones
- Typography refresh

## Testing Checklist Per Halaman
Setelah edit halaman manapun, verify:
- [ ] Login flow masih jalan
- [ ] CRUD operations masih jalan
- [ ] Mobile view (viewport 375px) tidak ada button terpotong
- [ ] Desktop view OK
- [ ] Tidak ada error di browser console
- [ ] Rate limit handling masih jalan (kalau hit 429)

## DO NOT
- Jangan ubah `src/middleware.ts` tanpa diskusi (bypass sudah intentional)
- Jangan pakai localStorage untuk data yang harus cross-device
- Jangan langsung hit endpoint tanpa apiFetch wrapper
- Jangan assume field backend lowercase — selalu cek PascalCase dulu
- Jangan gunakan `window.alert` atau `window.confirm` — pakai Modal component

## Current Branch
`refactor/design-system` — refactor ke design system baru

