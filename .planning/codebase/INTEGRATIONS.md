# External Integrations

**Analysis Date:** 2026-01-27

## APIs & External Services

**Payments:**
- Stripe - Payment processing and bond pre-authorization
  - SDK/Client: Not yet installed (planned: `stripe`, `@stripe/stripe-js`)
  - Auth: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - Webhook: `STRIPE_WEBHOOK_SECRET`

**Shipping:**
- Australia Post API - Label generation and tracking
  - SDK/Client: Direct API integration (no SDK detected)
  - Auth: `AUSPOST_API_KEY`, `AUSPOST_ACCOUNT_NUMBER`, `AUSPOST_PASSWORD`
  - Purpose: Outbound and return shipping labels

## Data Storage

**Databases:**
- Supabase (PostgreSQL)
  - Connection: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - Client: Not yet installed (planned: `@supabase/supabase-js`)
  - Migrations: `supabase/migrations/` (directory exists, currently empty)

**File Storage:**
- Supabase Storage (planned)
  - Purpose: Product images, user uploads
  - Currently: External images from Unsplash/Pexels (configured in `next.config.mjs`)

**Caching:**
- None (relying on Next.js built-in caching)

## Authentication & Identity

**Auth Provider:**
- Supabase Auth (planned)
  - Implementation: Row-level security (RLS) policies
  - Client-side: Browser client via `@supabase/supabase-js`
  - Server-side: Server client for API routes

## Monitoring & Observability

**Error Tracking:**
- None configured (Google Analytics ID placeholder exists)

**Logs:**
- Console logging (standard Node.js)
- Firebase debug log present (`firebase-debug.log`) but Firebase not configured in dependencies

## CI/CD & Deployment

**Hosting:**
- Vercel
  - Config: `vercel.json`
  - Framework detection: Next.js
  - Build: `next build`
  - Output directory: `.next`

**CI Pipeline:**
- None (deployment via Vercel Git integration)

## Environment Configuration

**Required env vars:**
Core functionality:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

Shipping (optional for MVP):
- `AUSPOST_API_KEY`
- `AUSPOST_ACCOUNT_NUMBER`
- `AUSPOST_PASSWORD`

Email (optional):
- `RESEND_API_KEY`

Analytics (optional):
- `NEXT_PUBLIC_GA_ID`

**Secrets location:**
- Development: `.env.local` (gitignored)
- Production: Vercel dashboard environment variables
- Template: `env/.env.example`

## Webhooks & Callbacks

**Incoming:**
- Stripe webhooks (planned)
  - Path: Not yet implemented
  - Events: Payment completion, bond capture/release
  - Verification: `STRIPE_WEBHOOK_SECRET`

**Outgoing:**
- None

## Image Sources

**External CDNs:**
- Unsplash (`images.unsplash.com`, `plus.unsplash.com`)
- Pexels (`images.pexels.com`)

Configured in `next.config.mjs` for Next.js image optimization.

## Notes

**Integration Status:**
- Planning phase - Core SDKs (Supabase, Stripe) not yet installed
- Mock data mode available (`USE_MOCK_DATA=true`) for development without API keys
- Infrastructure prepared with environment templates and configuration files
- Firebase appears in debug logs but not configured in project dependencies

---

*Integration audit: 2026-01-27*
