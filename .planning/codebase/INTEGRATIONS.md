# External Integrations

**Analysis Date:** 2026-01-24

## APIs & External Services

**Payment Processing:**
- Stripe - Payment intent processing, bond pre-authorization, payment capture
  - SDK/Client: `@stripe/stripe-js` (frontend), `stripe` (backend)
  - Auth: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (client), `STRIPE_SECRET_KEY` (server)
  - Config: `STRIPE_WEBHOOK_SECRET` for webhook signature verification

**Shipping & Logistics:**
- Australia Post (AusPost) - Parcel shipping, tracking, label generation
  - Auth: `AUSPOST_API_KEY`, `AUSPOST_ACCOUNT_NUMBER`, `AUSPOST_PASSWORD`
  - Scope: Domestic Australian parcel delivery, return tracking

**Email (Optional):**
- Resend - Transactional email delivery (commented in config, not yet integrated)
  - Auth: `RESEND_API_KEY` (optional)
  - Planned for: Order confirmations, shipping notifications, return reminders

## Data Storage

**Databases:**
- Supabase (PostgreSQL) - Primary data store
  - Connection: `NEXT_PUBLIC_SUPABASE_URL` (client), `SUPABASE_SERVICE_ROLE_KEY` (server)
  - Client: `@supabase/supabase-js` (currently not in package.json—needs to be added)
  - Authentication: Built-in Supabase Auth for user accounts
  - Features: RLS (Row Level Security), real-time subscriptions capability

**File Storage:**
- Supabase Storage (S3-compatible) - Product images and assets
  - Scope: Product catalog images, customer booking documents
  - Access: Via Supabase client SDK

**Caching:**
- Browser cache - Next.js automatic caching for static assets
- Vercel edge caching - CDN caching for pages and API responses
- No server-side caching layer currently configured

## Authentication & Identity

**Auth Provider:**
- Supabase Auth - User authentication and session management
  - Method: Email/password authentication
  - Session: JWT tokens stored in browser
  - Scope: User registration, login, account recovery

**Authorization:**
- Row Level Security (RLS) - Defined in Supabase PostgreSQL policies
- Implementation: Database-level security (no code-based checks needed)
- Scope: Users can only access their own bookings, orders, and data

## Monitoring & Observability

**Error Tracking:**
- Browser console logging - Local development only
- Vercel deployment logs - Production error capture
- Not integrated: Sentry, Datadog, or similar

**Logs:**
- `console.error()` - Application error logging
- Next.js server logs - Vercel deployment logs
- SessionStorage - Temporary order data for success page

**Analytics:**
- Google Analytics (optional, not yet configured)
  - Config var: `NEXT_PUBLIC_GA_ID` (commented in example)

## CI/CD & Deployment

**Hosting:**
- Vercel - Next.js hosting and deployment
  - Config file: `vercel.json` (framework: nextjs, buildCommand: next build)
  - Automatic deployments on Git push to main branch
  - Free tier with auto-scaling

**CI Pipeline:**
- Vercel built-in - Automatic builds on push
- Pre-deployment: Type checking via `tsc --noEmit`
- Pre-deployment: Linting via `next lint`
- No separate CI tool (GitHub Actions, Jenkins, etc.)

## Environment Configuration

**Required Environment Variables (from `env/.env.example`):**

**Application Config:**
- `NEXT_PUBLIC_APP_URL` - Application domain (e.g., http://localhost:3000)
- `NEXT_PUBLIC_APP_NAME` - "ASHIKA"
- `NEXT_PUBLIC_APP_TAGLINE` - "Indian Wear Hire Australia"

**Supabase (Database & Auth):**
- `NEXT_PUBLIC_SUPABASE_URL` - Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key (client-side queries)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role (server-side privileged access)

**Stripe (Payments):**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Public key for client library
- `STRIPE_SECRET_KEY` - Private key for payment processing
- `STRIPE_WEBHOOK_SECRET` - Webhook signature verification

**Australia Post (Shipping):**
- `AUSPOST_API_KEY` - API authentication
- `AUSPOST_ACCOUNT_NUMBER` - Account identifier
- `AUSPOST_PASSWORD` - Account password

**Optional:**
- `RESEND_API_KEY` - Email service (not yet integrated)
- `NEXT_PUBLIC_GA_ID` - Google Analytics tracking ID (not yet integrated)

**Development:**
- `USE_MOCK_DATA=true` - Flag to use mock data instead of real API calls (default: true)

**Secrets Location:**
- Development: `.env.local` (local machine, never committed)
- Production: Vercel environment variables dashboard
- Reference: `/Users/shamalkrishna/Documents/cleanupbros-os/.secrets/API_KEYS.md` (separate vault)

## Webhooks & Callbacks

**Incoming Webhooks:**
- Stripe webhook endpoint - `POST /api/webhooks/stripe` (needs implementation)
  - Triggers: `payment_intent.succeeded`, `charge.dispute.created`, `charge.refunded`
  - Signature verification: Uses `STRIPE_WEBHOOK_SECRET`
  - Scope: Process bond captures, order confirmations, refunds

- Australia Post webhook endpoint - (needs implementation)
  - Triggers: Parcel tracking updates, delivery status changes
  - Scope: Update booking status, notify customers of shipment progress

**Outgoing Webhooks:**
- Stripe PaymentIntent events - Sent to Vercel app
- Australia Post tracking - Polled via API (not webhook-based currently)

## Image & Asset Delivery

**External Image Sources (configured in `next.config.mjs`):**
- Unsplash (`images.unsplash.com`, `plus.unsplash.com`) - Demo product images
- Pexels (`images.pexels.com`) - Demo product images
- Supabase Storage - Production product images (own domain, future)

**Image Optimization:**
- Next.js Image Component - Automatic optimization, responsive sizing
- Format conversion - WEBP fallback for browsers
- Lazy loading - Images load on demand

---

*Integration audit: 2026-01-24*
