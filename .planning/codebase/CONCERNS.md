# Codebase Concerns

**Analysis Date:** 2026-01-27

## Tech Debt

**Mock Data in Production-Ready Frontend:**
- Issue: Entire frontend built with hardcoded mock data, no backend integration exists
- Files: `src/lib/mock-data/products.ts` (289 lines), `src/lib/mock-data/availability.ts` (167 lines)
- Impact: All 63+ components render mock Unsplash images and fake product data. Cart system uses localStorage only (no server persistence). Availability calendar shows dummy blocked dates. Zero database or API integration.
- Fix approach: Phase 1-2 work (Database + Auth setup). Replace mock imports with real Supabase queries. Cart context needs server-side booking creation on checkout.

**No Backend Implementation:**
- Issue: Zero API routes, no Supabase client configuration, no authentication system, no payment integration
- Files: `src/app/api/` directory does not exist, no `src/lib/supabase/` directory
- Impact: Beautiful frontend that cannot accept real bookings, process payments, or store user data. Entire rental transaction flow is non-functional.
- Fix approach: Systematic backend buildout per roadmap. Database schema → Auth → Booking engine → Payments → Webhooks. Estimated 40-60 hours of work across Phases 1-4.

**Missing Critical Dependencies:**
- Issue: Package.json lacks essential backend packages despite being specified in CLAUDE.md rules
- Files: `package.json` missing `@supabase/supabase-js`, `@supabase/ssr`, `stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js`
- Impact: Cannot connect to database or payment provider. Frontend code ready but backend integration impossible without dependencies.
- Fix approach: Install packages in phases: Supabase packages (Phase 1), Stripe packages (Phase 3). Total ~8 packages to add.

**Architectural Mismatch in Bond Logic:**
- Issue: CLAUDE.md specifies pre-authorization bond pattern, but research shows Stripe auth windows (5-7 days) expire before rental cycle completes (10 days: 3 pre + event + 3 return + 3 cleaning)
- Files: `.claude/rules/rental-logic.md` line 91-108, `CLAUDE.md` line 116-140
- Impact: Bond holds will expire before item return, making damage charges impossible. Business cannot capture $100 bond if item returned damaged after day 7.
- Fix approach: Switch to saved-card pattern before Phase 3 (Payments). Save payment method with `setup_future_usage: 'off_session'`, create new PaymentIntent for damage charge only if needed after return. Documented in `.planning/research/PITFALLS.md` lines 90-149.

**No Environment Configuration:**
- Issue: Zero environment files exist, no API keys configured
- Files: No `.env.local`, `.env.example` template exists in `env/` directory but not referenced
- Impact: Cannot run development build with real services. Supabase URLs, Stripe keys, API credentials all missing.
- Fix approach: Create `.env.local` from `env/.env.example` template during Phase 1 setup. Never commit real keys (already in .gitignore).

**Firebase Debug Log Committed:**
- Issue: Firebase debug log contains user email and auth attempts, should not be in repository
- Files: `firebase-debug.log` at project root (committed, exposes hafsahnuzhat1303@gmail.com)
- Impact: Minor security concern, PII leakage. Indicates Firebase tooling used but no Firebase configuration in codebase (potential abandoned approach).
- Fix approach: Delete file, ensure .gitignore catches future `*-debug.log` files (already in .gitignore line 42-45, but file committed before gitignore added).

## Known Bugs

**Race Condition Double Bookings (Critical, Unimplemented):**
- Symptoms: Two users can book same product for overlapping dates if availability check and booking creation are separate operations
- Files: No booking logic exists yet, will affect future `src/app/api/bookings/route.ts`
- Trigger: Concurrent requests to checkout for same product+date. Both pass availability SELECT query, both create bookings, inventory double-allocated.
- Workaround: None (feature doesn't exist yet)
- Fix: Implement PostgreSQL `create_booking_atomic()` function with `FOR UPDATE` row lock before availability check. Documented in `.planning/research/PITFALLS.md` lines 15-86. Must be implemented from day one, not retrofitted.

**Timezone Bugs in Date Calculation (High Risk, Unimplemented):**
- Symptoms: Rental date calculations cross DST boundaries (AEST ↔ AEDT), causing off-by-one-day errors for events near April/October transitions
- Files: No date utility exists yet, will affect `src/lib/utils/dates.ts` (to be created)
- Trigger: Event date on first Sunday of April or October. Server (Vercel US region) calculates `rental_start = event_date - 3 days` with timestamp arithmetic instead of date arithmetic. DST shift causes wrong dates.
- Workaround: None (feature doesn't exist yet)
- Fix: Use DATE type (not TIMESTAMPTZ) in database. Use date-fns with plain date arithmetic on ISO date strings `YYYY-MM-DD`. Never pass Date objects between client/server for rental logic. Documented in `.planning/research/PITFALLS.md` lines 264-327.

**Form State Loss on Navigation (App Router Pattern):**
- Symptoms: User fills checkout form, navigates back to product page, returns to checkout. All form data lost.
- Files: `src/app/checkout/page.tsx` (225 lines) - client component with local state only
- Trigger: Browser back/forward during checkout flow. React Server Components unmount on route change, destroying local state.
- Current mitigation: None
- Fix: Single-page checkout with step state (no route changes during form). Persist critical data (product ID, event date) in URL search params. SessionStorage fallback for accidental navigation. Documented in `.planning/research/PITFALLS.md` lines 387-436.

## Security Considerations

**Client-Side Price Manipulation (Critical, Unimplemented):**
- Risk: Future checkout API could trust client-provided prices instead of fetching from database
- Files: Will affect `src/app/api/checkout/route.ts` (not yet created)
- Current mitigation: None (no payment flow exists)
- Recommendations: ALWAYS fetch rental_price from Supabase products table in server action. Never trust FormData or request body for prices. Document in `.claude/rules/backend.md` lines 145-188 already addresses this.

**No Row Level Security Policies:**
- Risk: Supabase tables will be created without RLS, allowing users to read/modify any booking data
- Files: No Supabase migrations exist yet (`supabase/migrations/` directory empty)
- Current mitigation: None
- Recommendations: Define RLS policies in first migration: `products` (public read), `bookings` (user reads own via auth.uid()), `inventory_blocks` (public read for calendar), `profiles` (user reads own). Never use service role key in client code.

**Missing Postcode Validation:**
- Risk: Invalid Australian postcodes (0000, 10000) or remote area postcodes accepted, causing shipping failures
- Files: `src/components/checkout/shipping-form.tsx` (226 lines) likely has basic regex only
- Current mitigation: Form validation exists but strength unknown (no Zod schemas imported)
- Recommendations: Implement range-based validation with VALID_POSTCODE_RANGES (200-299 ACT, 1000-2999 NSW, etc). Reject invalid postcodes at form level. Consider surcharge notice for remote areas (NT 800-999). Pattern documented in `.planning/research/PITFALLS.md` lines 587-642.

**API Keys in Repository Risk:**
- Risk: Developers may commit real API keys to `.env.local` or hardcode in source
- Files: `.gitignore` correctly excludes `.env*.local` but developers can override
- Current mitigation: .gitignore configured, CLAUDE.md section 10 (API Key Protection) warns against key exposure
- Recommendations: Use environment variable validation at build time (fail if NEXT_PUBLIC_SUPABASE_URL undefined). Pre-commit hooks to scan for key patterns (`sk_live_`, `pk_live_`). Never log env vars in server-side code.

## Performance Bottlenecks

**No Image Optimization on Free Tier:**
- Problem: Supabase Storage free tier has no server-side image transformations. Full-resolution uploads (2-5MB each) will be served directly.
- Files: `src/lib/mock-data/products.ts` currently uses Unsplash URLs (externally optimized). Real product images will be uploaded to Supabase Storage.
- Cause: Supabase Image Transformations require Pro plan ($25/month). Free tier serves exact uploaded file.
- Improvement path: Pre-optimize images before upload. Generate 3 variants (thumb: 400px/200KB, medium: 800px/500KB, full: 1200px/800KB) as WebP. 30 products × 5 images × 3 variants = 450 files at ~300KB avg = 135MB total (within 1GB limit). Documented in `.planning/research/PITFALLS.md` lines 199-254.

**Vercel Cold Starts on Low-Traffic Checkout:**
- Problem: Checkout API route not invoked in 30+ minutes experiences 3-5 second cold start + Stripe API latency (2-3s). Total 5-8 seconds for first checkout attempt.
- Files: Will affect `src/app/api/checkout/route.ts` (not yet created)
- Cause: Vercel Hobby tier serverless functions cold start after inactivity. Expected for niche rental platform with low initial traffic.
- Improvement path: UI mitigation (disable button on submit, show loading state). Stripe idempotency keys prevent double-charge on retry. Move non-critical work (emails, shipping labels) to webhooks (separate function invocation). Documented in `.planning/research/PITFALLS.md` lines 816-856.

**Mock Product Data Load:**
- Problem: 289-line products.ts file with 30+ mock products imported on every page load
- Files: `src/lib/mock-data/products.ts` (289 lines hardcoded product objects)
- Cause: No database, using static imports. Bundle includes all product data even on pages that show 6 products.
- Improvement path: Replace with Supabase queries that fetch only needed data. Example: product grid loads `select id,name,category,rental_price,images[0]` (not full product objects). Product detail page loads single product by ID.

## Fragile Areas

**Cart Context Synchronization:**
- Files: `src/contexts/cart-context.tsx` (227 lines)
- Why fragile: Cart uses localStorage for persistence but complex reducer state with derived rental timeline calculations. Adding/removing items recalculates dates with date-fns but no validation against real availability.
- Safe modification: Always use provided `addItem`/`removeItem` actions. Never mutate `state.items` directly. Timeline calculations use `formatRentalTimeline` from availability.ts (mock implementation).
- Test coverage: No tests exist (entire project has zero test files)

**Product Filters State Management:**
- Files: `src/components/product/product-filters.tsx` (256 lines)
- Why fragile: Large client component with complex filter state (category, size, price range, occasion, availability date). Multiple useEffect hooks synchronize URL params with local state. Easy to introduce infinite re-render loops.
- Safe modification: Avoid adding new useEffect hooks. Use debouncing for search inputs (not currently implemented). When replacing mock data with Supabase queries, move filtering to server-side WHERE clauses, not client-side array operations.
- Test coverage: None

**Checkout Form Multi-Step State:**
- Files: `src/app/checkout/page.tsx` (225 lines), `src/components/checkout/shipping-form.tsx` (226 lines), `src/components/checkout/payment-form.tsx` (223 lines)
- Why fragile: Multi-step checkout with react-hook-form per step. No shared form state between steps. Likely requires refactor to single-page checkout to prevent state loss (see Known Bugs).
- Safe modification: Test navigation during checkout. Validate form data persists between steps. When integrating Stripe, use client-side confirmation (Elements) not server-side redirect flow.
- Test coverage: None

**Date Selection and Availability Calendar:**
- Files: `src/components/booking/availability-calendar.tsx` (152 lines), `src/components/booking/date-selector.tsx`
- Why fragile: Calendar component calculates blocked dates from mock data. Real implementation requires querying `inventory_blocks` table for date ranges, then blocking all dates in range PLUS cleaning buffer. Off-by-one errors likely when integrating real data.
- Safe modification: When replacing mock `getBlockedDates()`, ensure query includes cleaning_end date, not just rental_end. Use DATE type comparisons, not timestamp math. Add visual distinction for "event date" vs "blocked dates" in calendar UI.
- Test coverage: None

## Scaling Limits

**Supabase Database Size (500MB Free Tier):**
- Current capacity: 0 MB used (no database exists)
- Limit: 500MB on free tier, database enters read-only mode on exceed
- Scaling path: With proper patterns (no base64 images, product images in Storage not DB), 500MB supports 1000+ bookings + 30 products + user profiles. Unlikely to hit limit in first 6 months. Monitor at 400MB, upgrade to Pro ($25/month) if needed.

**Supabase Storage (1GB Free Tier):**
- Current capacity: 0 GB used (no storage bucket created)
- Limit: 1GB total file storage
- Scaling path: Pre-optimized WebP images (30 products × 5 images × 3 variants = 450 files at 300KB avg = 135MB). Leaves 865MB headroom for additional products. Can reach 100+ products before hitting limit. Documented in `.planning/research/PITFALLS.md` lines 547-584.

**Supabase Auto-Pause (7 Days Inactivity):**
- Current capacity: N/A (not deployed)
- Limit: Free tier pauses after 7 days with no database queries. Site returns 500 errors. Manual restore required.
- Scaling path: CRITICAL - Implement GitHub Actions ping job (every 3 days) before launch. Queries `products` table to keep database active. Alternative: upgrade to Pro ($25/month) before launch (Pro projects never pause). Documented in `.planning/research/PITFALLS.md` lines 153-196.

**Vercel Function Timeout (10 Seconds Hobby Tier):**
- Current capacity: No serverless functions exist
- Limit: 10-second hard timeout on API routes. Cannot be extended on free tier.
- Scaling path: Design checkout API route to complete in <7 seconds (leaving 3s buffer for cold start). Move non-critical operations (emails, shipping labels) to Stripe webhooks (separate function invocation with own 10s timeout). If unavoidable, upgrade to Vercel Pro ($20/month, 60s timeout).

## Dependencies at Risk

**Missing Core Dependencies:**
- Risk: Project cannot build or run with real services
- Impact: All backend features blocked
- Migration plan: Install per roadmap phases. Phase 1: `@supabase/supabase-js`, `@supabase/ssr`. Phase 3: `stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js`. Optionally Phase 4: `shippo` (Node.js SDK) or Australia Post eParcel API SDK.

**Deprecated package.json Warnings:**
- Risk: package-lock.json shows deprecated packages: `@eslint/config-array`, `@eslint/object-schema`, eslint 8.x ("This version is no longer supported")
- Impact: Security vulnerabilities in linting tools (dev-only, not production risk)
- Migration plan: Upgrade to eslint 9.x when Next.js 15 stable (current Next.js 14.2.35 uses eslint-config-next with eslint 8 peer dependency). Non-urgent, no production impact.

**date-fns v3 Edge Cases:**
- Risk: DST boundary calculations with date-fns documented as problematic in GitHub issues
- Impact: Off-by-one-day rental dates for April/October events
- Migration plan: Use DATE type in database (not timestamps) to avoid timezone conversion entirely. Pass dates as `YYYY-MM-DD` strings. Use date-fns for formatting only, not for date arithmetic with timezones. Documented in `.planning/research/PITFALLS.md` lines 264-327.

## Missing Critical Features

**No Backend Exists:**
- Problem: Zero server-side functionality for core rental operations
- Blocks: Accepting real bookings, storing user data, processing payments, sending confirmation emails, generating shipping labels, admin order management
- Priority: HIGH - All Phase 1-4 work is implementing missing backend

**No Authentication System:**
- Problem: No user registration, login, session management, or password reset
- Blocks: User accounts, booking history, saved addresses, repeat customer flows
- Priority: HIGH - Phase 1 deliverable (Supabase Auth integration)

**No Admin Interface:**
- Problem: No way to manage inventory, view bookings, update order status, process returns, handle damage claims
- Blocks: Day-to-day operations after launch
- Priority: MEDIUM - v1 decision: use Supabase dashboard directly for admin tasks (documented in STATE.md line 45). Custom admin panel deferred to v2.

**No Email Notifications:**
- Problem: No confirmation emails, shipping notifications, return reminders, or late-return warnings
- Blocks: Professional user experience, reduces customer service inquiries
- Priority: HIGH - Phase 4 deliverable (Resend integration via webhooks)

**No Real Product Data:**
- Problem: Mock Unsplash images, fake product descriptions, dummy availability
- Blocks: Launch with real catalog
- Priority: HIGH - Blocked on product photography session (external dependency, documented in STATE.md line 54)

## Test Coverage Gaps

**Zero Test Files in Entire Codebase:**
- What's not tested: All components, all business logic, all utility functions
- Files: No `*.test.ts`, `*.test.tsx`, or `*.spec.ts` files exist. No test runner configured (no jest.config or vitest.config).
- Risk: Rental date calculations could be wrong. Availability logic could have race conditions. Checkout flow could double-charge. Bond calculations could fail. All undetected until production.
- Priority: HIGH - Critical for rental logic (date calculations, availability checks, bond handling). Unit tests for `create_booking_atomic()` SQL function, rental date utils, Stripe payment flow. Integration tests for checkout end-to-end.

**No Rental Logic Validation:**
- What's not tested: 7-day rental period, 3-day delivery buffer, 3-day cleaning buffer, date overlap detection, bond amount calculations
- Files: `.claude/rules/rental-logic.md` defines immutable business rules but no tests verify implementation
- Risk: Off-by-one errors in date math cause customer receiving item late or not having enough time to return. Overlapping bookings accepted. Wrong bond amount charged.
- Priority: CRITICAL - Must be implemented with booking engine (Phase 2). Test matrix documented in `.planning/research/PITFALLS.md` includes edge cases (DST boundaries, same-day bookings, cleaning buffer conflicts).

**No Payment Flow Testing:**
- What's not tested: Stripe PaymentIntent creation, webhook handling, bond hold/capture, idempotency, error scenarios
- Files: Will affect `src/app/api/checkout/route.ts`, `src/app/api/webhooks/stripe/route.ts` (not yet created)
- Risk: Silent payment failures. Double-charging on retry. Bond never released. Webhook signature validation bypass.
- Priority: HIGH - Phase 3 deliverable. Use Stripe test mode, test with Stripe CLI webhook forwarding. Documented test cases in `.planning/research/PITFALLS.md` lines 816-856.

**No E2E Checkout Flow Testing:**
- What's not tested: Browse → Select product → Choose date → Add to cart → Checkout → Enter shipping → Pay → Confirmation
- Files: Entire flow spans 15+ components and 0 have tests
- Risk: Broken user journey undetected. Form validation bypassed. Cart state corrupted. Checkout never completes.
- Priority: MEDIUM - Add Playwright E2E tests after backend integration complete (Phase 4+). Manual testing sufficient for MVP.

**No Availability Calendar Testing:**
- What's not tested: Date blocking logic, DST transitions, overlapping bookings, calendar UI date selection
- Files: `src/components/booking/availability-calendar.tsx` (152 lines), `src/lib/mock-data/availability.ts` (167 lines)
- Risk: Users can select blocked dates. Calendar shows available when product actually booked. Off-by-one-day errors on DST boundaries.
- Priority: HIGH - Critical for double-booking prevention. Test with Supabase `inventory_blocks` query, verify blocked dates include cleaning buffer, test April/October DST boundaries.

---

*Concerns audit: 2026-01-27*
