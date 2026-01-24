# Project Research Summary

**Project:** ASHIKA - Indian Wear Hire Australia
**Domain:** Niche ethnic wear rental marketplace (sarees, lehengas, salwar kameez)
**Researched:** 2026-01-24
**Overall Confidence:** HIGH

---

## Executive Summary

ASHIKA is an Indian ethnic wear rental marketplace targeting the Australian diaspora market. The research reveals this is a **well-trodden domain** with established patterns from competitors (GlamCorner, Rent the Runway, AllBorrow, Saris and Things), but with **critical technical constraints** specific to the free-tier stack (Next.js 14 + Supabase + Stripe + Vercel).

**The Recommended Approach:** Build the complete rental transaction flow end-to-end before adding breadth. The stack is confirmed viable (everything needed exists on free tiers), but requires **immediate architectural decisions** around bond handling. The current CLAUDE.md assumes a Stripe pre-authorization pattern for the $100 bond, but research shows this will fail: Stripe authorization windows (5-7 days) are shorter than the rental cycle (10 days: 3 pre-event + event + 3 return + 3 cleaning). **Critical decision needed before Phase 3 (Payments):** Switch to saved-card-with-later-charge pattern instead of pre-auth holds.

**Key Risks:** (1) Race condition double-bookings if availability checks aren't atomic at database level, (2) Stripe bond authorization expiring before item return, (3) Supabase free tier pausing after 7 days of inactivity. All three have proven mitigations that must be implemented from day one, not retrofitted.

The MVP can launch with 10-30 products on entirely free infrastructure, provided image optimization is done manually (Supabase free tier excludes image transformations). The existing front-end is production-ready UI; the gap is entirely backend (auth, database, payments, webhooks).

---

## Key Findings

### Recommended Stack

**Stack is locked per CLAUDE.md directives.** Research validates all choices and identifies integration patterns and gaps.

**Core technologies:**
- **Next.js 14.2.35 (App Router)** — Latest security-patched version. Server Components for catalog, Client Components for interactive booking. No upgrade needed.
- **Supabase (PostgreSQL + Auth + Storage)** — Free tier sufficient: 500MB DB, 1GB storage, 50K MAU. Requires three-client architecture (@supabase/ssr): browser, server, admin. **Critical: Must enable btree_gist extension for overlap prevention.**
- **Stripe (direct, not pre-auth for bond)** — Two-PaymentIntent approach: rental fee (captured), bond (saved card + charge later). **IMPORTANT: Pre-auth pattern in CLAUDE.md needs revision.** Authorization windows (5-7 days) expire before return window (10 days).
- **Supabase Storage + next/image** — No server-side image transformations on free tier. Must pre-optimize (WebP, 3 sizes) before upload. 1GB storage = ~400-500 optimized images (sufficient for 30 products x 5 images x 3 variants).
- **date-fns v3** — Already installed. Sufficient for rental date math. Use DATE type in DB (not TIMESTAMP) to avoid DST bugs.
- **Australia Post API or Shippo fallback** — Direct API requires parcel contract + OAuth. Shippo is simpler (Node.js SDK) but adds middleman. Start with AusPost if contract exists, fallback to Shippo.

**Missing packages (to install):**
- `@supabase/supabase-js` (^2.80.0), `@supabase/ssr` (^0.8.0) — Phase 1
- `stripe` (^20.2.0), `@stripe/stripe-js` (^8.6.1), `@stripe/react-stripe-js` — Phase 3

**Version pinning:** Next.js 14.2.35 is latest patched 14.x (CVE fixes applied). Supabase @supabase/ssr replaces deprecated auth-helpers-nextjs.

---

### Expected Features

Research surveyed 8 competitors (GlamCorner, RTR, HURR, AllBorrow, Saris and Things, Borrow the Bazaar, Leasing Looks, Glamourental).

**Must have (table stakes):**
- Catalog with filters (category, size, price, occasion, availability by date) — users expect this from any rental platform
- Availability calendar (Airbnb-style: show blocked dates, allow event date selection) — fundamental to rental flow
- Size guide with measurements (bust/waist/hip/length) — critical for ethnic wear where "Medium" varies wildly
- Booking flow: event date → size → cart → shipping → payment → confirmation email
- Professional product photos (5-8 per item) — industry standard, reduces returns by 51%
- Stripe checkout with bond explanation — $100 bond is unusual, needs clear UX to prevent abandonment
- Free shipping both ways — all competitors offer this (ASHIKA already has SHIPPING_COST_AUD: 0)
- Order status tracking — users need to see: Confirmed > Shipped > Delivered > Return Due
- Return instructions (pre-paid label) — reduces anxiety, included in confirmation email

**Should have (differentiators for ethnic wear niche):**
- Draping/styling guides per product — #1 anxiety for sarees. AllBorrow doesn't offer this (gap in market).
- "What's included" visual checklist — saree + blouse + petticoat + pins. Reduces "is it just the fabric?" confusion.
- Blouse size selector (separate from outfit size) — saree is Free Size, blouse needs bust measurement. Saris and Things sends backup blouse.
- Occasion-based collections (Wedding Guest, Diwali, Eid) — ethnic events have dress codes diaspora may not know.
- Availability notifications ("Notify me when available") — 10-30 product catalog means frequent unavailability. Captures demand.
- Cultural event guide content ("What to wear to an Indian wedding as a non-Indian guest") — drives organic SEO traffic.

**Defer to v2+:**
- User reviews/ratings — requires order volume for meaningful reviews. Use curated testimonials initially.
- Peer-to-peer marketplace — massive complexity. You own 10-30 items, you control quality.
- Subscription/membership model — requires 100+ items minimum. RTR/GlamCorner only offer this at scale.
- Virtual try-on / AR — no ethnic wear platform has this. Sarees drape unpredictably, AR would be inaccurate.
- AI recommendations — requires data volume you won't have at launch. Manual curation sufficient for 10-30 products.

---

### Architecture Approach

The existing codebase is a **complete front-end shell** with mock data. All UI components (product cards, filters, calendar, checkout forms) are production-ready. **The gap is entirely backend:** database, auth, real availability checking, Stripe payments, webhooks.

**Major components:**

1. **Database (Supabase PostgreSQL)** — 5 core tables: `products`, `product_sizes`, `bookings`, `inventory_blocks`, `profiles`. Key pattern: PostgreSQL `create_booking_atomic()` function with `FOR UPDATE` locking prevents race condition double-bookings. RLS policies: products (public read), bookings (user owns), inventory_blocks (public read for calendar).

2. **Availability Engine** — `inventory_blocks` table with date ranges. Query: "Does `block_start <= cleaning_end AND block_end >= rental_start` for this product?" If yes, unavailable. **Critical: Must be atomic with booking creation.** Two users can both pass availability check and both book if these are separate operations.

3. **Payment Flow (Stripe)** — **Two-PaymentIntent approach needs revision:**
   - **Rental fee:** Standard PaymentIntent, captured immediately.
   - **Bond ($100):** Originally planned as pre-auth hold (`capture_method: 'manual'`), but 7-day auth window expires before 10-day rental cycle completes. **Switch to:** Save payment method with `setup_future_usage: 'off_session'`, create NEW PaymentIntent for damage charge only if needed after return.

4. **Image Serving** — Supabase Storage (public bucket) + `next/image`. Pre-optimize 3 variants (thumb: 400px, medium: 800px, full: 1200px) as WebP before upload. No server-side transformations on free tier.

5. **Auth** — Supabase Auth via `@supabase/ssr`. Three clients: browser (client components), server (server components/API routes), admin (webhooks, bypasses RLS). Middleware refreshes auth tokens to prevent silent logout.

6. **Server vs Client Split** — Default to Server Components. Only add `'use client'` for: browser APIs (localStorage), event handlers, React hooks, animations. Cart system uses client context + localStorage (no server persistence until checkout).

**Server-side availability check pattern (atomic):**
```sql
CREATE OR REPLACE FUNCTION create_booking_atomic(...) RETURNS UUID AS $$
  -- Lock product row
  PERFORM id FROM products WHERE id = p_product_id FOR UPDATE;
  -- Check availability within same transaction
  -- If available, insert booking + inventory_block atomically
$$;
```

**Data flow (complete booking lifecycle):**
1. User browses (Server Component fetches from Supabase)
2. User selects product + event date
3. Client calls `GET /api/products/[id]/availability?month=2026-02` (queries inventory_blocks)
4. User adds to cart (localStorage, CartContext)
5. User proceeds to checkout (single-page flow, no navigation = no state loss)
6. Client calls `POST /api/checkout` → Server: check availability, create booking via RPC, create Stripe PaymentIntents, return client secrets
7. Client confirms payment with Stripe.js
8. Stripe webhook: `payment_intent.succeeded` → Update booking status to 'confirmed'
9. Admin ships item, updates status, adds tracking
10. Customer returns item → Admin inspects → Release/capture bond via saved payment method

---

### Critical Pitfalls

**Top 5 from research (all have proven mitigations):**

1. **Race Condition Double Bookings** — Two users select same item for same date, both pass availability check, both book. **Prevention:** Use PostgreSQL function with `FOR UPDATE` lock that combines check + insert in single atomic transaction. Call via `supabase.rpc('create_booking_atomic', {...})`. **Phase:** Must solve in database/booking phase (Phase 3). Do NOT build checkout without this.

2. **Stripe Pre-Auth Expiry** — $100 bond hold expires after 5-7 days (card-network-specific), but rental cycle is 10 days (3 pre + event + 3 return + 3 cleaning). Hold vanishes before item returned, cannot capture for damage. **Prevention:** Switch from `capture_method: 'manual'` to saved-card pattern: charge rental fee immediately, save payment method with `setup_future_usage: 'off_session'`, create NEW PaymentIntent for bond ONLY if item damaged after return. **Phase:** Payment integration (Phase 3). **CRITICAL: CLAUDE.md bond logic needs revision.**

3. **Supabase Free Tier Pause** — Project pauses after 7 days of inactivity (no DB queries). Site returns errors, users see broken pages. **Prevention:** (a) GitHub Actions workflow pings Supabase every 3 days (`cron: '0 0 */3 * *'`), OR (b) upgrade to Pro ($25/month) before launch. **Phase:** Infrastructure setup (immediate). **Detection:** Set up UptimeRobot or similar uptime monitor.

4. **No Image Transformations on Free Tier** — Supabase image transformations (resize, WebP conversion) require Pro plan. Serving full-res images (2-5MB each) on product grid = 50-150MB page load, 8+ second LCP, users bounce. **Prevention:** Pre-optimize before upload. Generate 3 WebP variants per image (thumb: 400px/75% quality, medium: 800px/80%, full: 1200px/85%). Use `next/image` with explicit sizes. **Phase:** Image upload/management (Phase 2). **Storage budget:** 30 products x 5 images x 3 variants x 300KB avg = ~135MB (well within 1GB limit).

5. **Timezone Bugs with Australian Dates** — Event date calculation crosses DST boundary (AEST ↔ AEDT), rental_start/rental_end off by a day. Particularly dangerous for early-April and early-October events. **Prevention:** Use DATE type (not TIMESTAMP) in database. Use date-fns with plain date arithmetic (no timezone conversion). Pass dates as `YYYY-MM-DD` strings between client/server, never Date objects. **Phase:** Date utility setup (very early, Phase 1).

**Additional high-severity pitfalls:**
- Vercel Free Tier 10-second timeout on checkout — minimize critical path, move email/label generation to webhooks
- Form state loss on navigation (App Router behavior) — use single-page checkout flow, no route changes mid-checkout
- Bond payment creates two user charges (confusing UX) — clear pre-checkout copy explaining rental fee vs bond hold

---

## Implications for Roadmap

Based on combined research, the build order is dictated by **dependency chains** and **critical path to revenue**.

### Suggested Phase Structure

**Phase 1: Database Foundation + Auth**
**Rationale:** Everything depends on data. Auth required before bookings (need user_id). Must establish atomic availability checks early to prevent architectural rework.
**Delivers:** Real product catalog, user login/signup, profile management
**Addresses (from FEATURES.md):** Product catalog, category browsing, filters, search
**Avoids (from PITFALLS.md):** Timezone bugs (set up DATE types + date-fns utils), status enum drift (use DB constraints)
**Stack elements:** Supabase project setup, three-client architecture (@supabase/ssr), middleware for token refresh
**Estimated scope:** 5 tables (products, product_sizes, profiles, shipping_addresses, product_images metadata), RLS policies, seed data migration from mock-data

**Phase 2: Availability System + Booking Logic**
**Rationale:** Core rental mechanic. Must be correct before payments (can't charge for bookings that double-book).
**Delivers:** Real-time availability calendar, booking creation (without payment), inventory blocking
**Addresses:** Availability calendar, date picker, event date selection, booking flow
**Avoids:** Race condition double bookings (atomic RPC function with FOR UPDATE), date calculation errors
**Critical:** `create_booking_atomic()` PostgreSQL function, `check_availability()` function, `inventory_blocks` table with overlap prevention
**Frontend work:** Connect AvailabilityCalendar component to `GET /api/products/[id]/availability` API route
**Estimated scope:** 2 tables (bookings, inventory_blocks), 2 DB functions, 2 API routes

**Phase 3: Stripe Payment Integration**
**Rationale:** Enables revenue. Depends on booking system (payments confirm bookings). Most complex integration.
**Delivers:** Complete checkout flow with real payments, order confirmation emails, bond handling
**Addresses:** Stripe checkout, bond explanation UX, order confirmation, payment status
**Avoids:** Pre-auth expiry (use saved-card pattern), price manipulation (server-side price lookup), double charges (idempotency keys)
**Critical decision point:** **Revise bond logic in CLAUDE.md.** Switch from `capture_method: 'manual'` pre-auth to saved payment method + later charge.
**Stack elements:** Install stripe + @stripe/stripe-js, implement webhook handler, Stripe Elements UI
**Estimated scope:** 3 API routes (/api/checkout, /api/webhooks/stripe, /api/bookings/[id]/bond), payment form integration, email notifications

**Phase 4: Admin Panel + Fulfillment**
**Rationale:** Operational necessity. Admins need to update booking status, generate shipping labels, capture/release bonds.
**Delivers:** Admin dashboard (booking management, status updates, bond actions, product CRUD)
**Addresses:** Order status tracking (admin-side), shipping label generation, bond release/capture UI
**Uses:** Supabase RLS (is_admin() function), Stripe bond capture API, Australia Post/Shippo integration
**Estimated scope:** /admin/* routes with auth protection, booking status PATCH endpoint, bond capture/release actions, shipping label generation

**Phase 5: Polish + Launch Prep**
**Rationale:** User-facing improvements for launch. Operational hardening.
**Delivers:** Draping guides, occasion collections, email notifications (shipped, return reminders), error handling, monitoring
**Addresses:** Draping/styling guides (differentiator), occasion-based collections, return date reminders, cultural event guide content
**Avoids:** Silent logout (auth state listener), image domain errors (next.config.js), cold start UX issues (loading states)
**Estimated scope:** Content pages, scheduled notifications (return reminders), uptime monitoring, GitHub Actions ping for Supabase

---

### Phase Ordering Rationale

**Why database first:** All subsequent phases query/write to Supabase. Schema must be correct from the start (altering schemas with live data is risky).

**Why auth before booking:** Bookings require `user_id` foreign key. Cannot create bookings without auth users.

**Why booking before Stripe:** Stripe confirms a booking that already exists in pending state. The booking_id is passed to Stripe as metadata. If bookings don't exist, there's nothing to confirm.

**Why Stripe before admin:** Admin actions (bond capture/release) call Stripe APIs. Admin panel operates on payment state that Stripe manages.

**Why admin before polish:** Cannot test end-to-end flow (book → pay → ship → return → bond release) without admin tools. Polish assumes the core loop works.

**Critical path grouping:** Phases 1-3 are the **revenue path** (browse → book → pay). Phases 4-5 are **operational enablement** (fulfill → support → iterate). If timeline is tight, ship Phases 1-3 first, handle fulfillment manually, add admin panel post-launch.

**Dependency visualization:**
```
Phase 1 (Database + Auth)
  └─> Phase 2 (Booking Logic)
        └─> Phase 3 (Payments)
              └─> Phase 4 (Admin Panel)
                    └─> Phase 5 (Polish)
```

**Parallel opportunities:** Within Phase 1, database schema work and auth setup can happen in parallel. Within Phase 3, Stripe Elements UI and webhook handler can be built in parallel. Within Phase 5, content work (guides, collections) can be done by non-technical team member while developer handles monitoring/errors.

---

### Research Flags

**Phases likely needing `/gsd:research-phase` during planning:**

- **Phase 3 (Payments):** Stripe webhook event handling, saved payment method pattern (replacing pre-auth), extended authorization eligibility. **Reason:** Bond logic pivot from CLAUDE.md assumptions requires deeper Stripe API research.
- **Phase 4 (Admin Panel):** Australia Post API authentication flow (OAuth client credentials), label creation endpoint specifics, Shippo fallback integration. **Reason:** Shipping API requires account registration to verify exact endpoints and product codes. Research was HIGH confidence on patterns but LOW on specifics.

**Phases with standard patterns (skip research-phase):**

- **Phase 1 (Database + Auth):** Supabase RLS patterns, three-client architecture, auth middleware. All patterns documented in official Supabase Next.js guide. **Confidence: HIGH.**
- **Phase 2 (Booking Logic):** PostgreSQL atomic transactions with FOR UPDATE, availability overlap queries. Standard booking system pattern, well-documented. **Confidence: HIGH.**
- **Phase 5 (Polish):** Email notifications (Supabase Edge Functions or Resend), content pages, monitoring setup. All standard Next.js + Vercel patterns. **Confidence: HIGH.**

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | **HIGH** | All components verified with official docs (Stripe, Supabase, Next.js, Vercel). Version compatibility confirmed via npm. Three-client Supabase pattern is 2025 standard. |
| Features | **MEDIUM-HIGH** | Based on 8 competitor platforms and industry analysis. Ethnic wear specific features (draping guides, blouse sizing) verified with AllBorrow, Saris and Things. Table stakes features universal across fashion rental. |
| Architecture | **HIGH** | Server/Client split, RLS policies, atomic booking pattern all verified with official docs. Database schema matches existing Product/Booking types. Build order based on proven dependency chains. |
| Pitfalls | **HIGH** | Top 5 critical pitfalls sourced from official docs (Stripe auth windows, Supabase pause behavior, Vercel timeouts all documented). Race condition pattern verified with PostgreSQL locking docs. Timezone bugs confirmed via date-fns GitHub issues. |

**Overall confidence:** **HIGH**

The stack, architecture patterns, and critical pitfalls are all verified with primary sources (official documentation). Features are verified with competitor analysis (8 platforms surveyed). The one area requiring deeper research during implementation is the **Stripe bond pattern change** (from pre-auth to saved-card), which is a well-documented Stripe feature but wasn't in the original CLAUDE.md assumptions.

---

### Gaps to Address

**Critical decision needed before Phase 3:**

1. **Bond handling pattern** — CLAUDE.md currently specifies `capture_method: 'manual'` for bond pre-authorization. Research reveals this won't work (auth expires before return window ends). **Action required:** Update CLAUDE.md rental-logic.md and backend.md to reflect saved-card pattern instead. This is a **backward-incompatible change** to the business rules documented in CLAUDE.md.

**Validation needed during implementation:**

2. **Australia Post API access** — Research confirmed API exists and OAuth flow, but exact product codes (e.g., 'T28S' for Parcel Post Small) and endpoint specifics require account registration. **Action:** Verify during Phase 4 if AusPost parcel contract exists. If onboarding delayed, use Shippo as interim solution (has Node.js SDK, simpler auth).

3. **Extended authorization eligibility** — Stripe extended authorization (30-day holds) requires IC+ pricing, which is not available to all merchants. **Action:** During Phase 3, test if ASHIKA's Stripe account qualifies for extended auth. If not, saved-card pattern is mandatory (not optional).

4. **Supabase free tier graduation plan** — 500MB DB, 1GB storage, no image transformations. **Action:** Monitor usage during beta/soft launch. Budget for Pro upgrade ($25/month) if DB exceeds 400MB or if manual image optimization becomes bottleneck for new product uploads.

**Content/operational gaps (non-technical):**

5. **Professional product photography** — Research confirms 5-8 photos per product is industry standard. Current mockups use Unsplash. **Action:** Before Phase 2 (real catalog launch), budget for professional photography of 10-30 items. Estimate: $50-100 per outfit x 30 items = $1,500-3,000.

6. **Draping guide content** — Identified as key differentiator (AllBorrow doesn't offer). **Action:** Source or create draping tutorials (video/images) for each saree product. Can start with curated YouTube links, upgrade to own content later.

7. **Legal/compliance** — Rental agreements, damage assessment criteria, cleaning standards. **Action:** Draft rental terms during Phase 3 (before payments go live). Consider garment insurance for damage beyond bond coverage.

---

## Sources

### Primary Sources (HIGH confidence)

**Stripe:**
- [Place a hold on a payment method](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method) — Authorization windows (5-7 days)
- [Extended authorizations](https://docs.stripe.com/payments/extended-authorization) — 30-day holds (IC+ pricing required)
- [Capture a PaymentIntent](https://stripe.com/docs/api/payment_intents/capture) — Manual capture API
- [Handle payment events with webhooks](https://docs.stripe.com/webhooks/handling-payment-events) — Webhook event types

**Supabase:**
- [Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs) — Three-client pattern
- [Creating a Client for SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client) — @supabase/ssr usage
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) — RLS policies
- [Storage Image Transformations](https://supabase.com/docs/guides/storage/serving/image-transformations) — Pro-only on free tier
- [Pricing](https://supabase.com/pricing) — Free tier limits (500MB DB, 1GB storage, 7-day pause)

**Next.js:**
- [Security Update Dec 2025](https://nextjs.org/blog/security-update-2025-12-11) — CVE fixes in 14.2.35
- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — App Router patterns

**Vercel:**
- [Functions Limitations](https://vercel.com/docs/functions/limitations) — 10-second timeout on Hobby tier

**PostgreSQL:**
- [Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html) — FOR UPDATE row locks

---

### Secondary Sources (MEDIUM confidence)

**Competitor Analysis:**
- GlamCorner, Rent the Runway, HURR Collective, AllBorrow, Saris and Things, Borrow the Bazaar — Feature comparison, UX patterns
- Industry analysis: FatBit (2026 fashion rental guide), Yo-Rent (rental industry trends), Circular Fashion News (Q1/Q2 2025 report)

**UX Patterns:**
- Baymard Institute (date picker design), Smashing Magazine (date/time picker best practices)
- Fabricoz, Fashneo, Andaaz Fashion — Indian clothing size guides

**Technical Patterns:**
- MakerKit (API routes vs Server Actions), DEV.to (Supabase calendar availability, transactions in Supabase)
- Stackademic (Stripe + Next.js 14 integration)

---

### Tertiary Sources (LOW confidence, needs validation)

**Shipping:**
- Australia Post Developer Portal (API exists, OAuth confirmed) — Exact endpoints require account
- Shippo documentation (Australia Post carrier support) — Requires testing

**Community Reports:**
- GitHub discussions: Supabase data loss after pause restore (anecdotal), SERIALIZABLE isolation (edge case)
- HackerNoon: Race conditions in booking systems (pattern confirmed elsewhere)

---

## Critical Decision Summary for Orchestrator

**Before proceeding to roadmap creation, the following MUST be addressed:**

1. **Update CLAUDE.md bond logic** — Current directives specify pre-auth pattern that won't work. Needs revision to saved-card pattern. **Files to update:** `/CLAUDE.md` (rental logic section), `/.claude/rules/rental-logic.md`, `/.claude/rules/backend.md`.

2. **Confirm bond pattern with stakeholder** — Changing from "hold $100, release if OK" to "save card, charge if damaged" is a **UX change** that affects messaging. Stakeholder (Shamal/Hafsah) should approve this before implementation.

3. **Infrastructure setup decision** — GitHub Actions ping (free, 5 min to set up) vs Supabase Pro upgrade ($25/month, immediate). Recommendation: Start with ping, budget for Pro before public launch.

4. **Photography budget** — Phase 1 deliverable (real catalog) requires real photos. Estimate cost and timeline for professional product photography of initial 10-30 items.

Once these decisions are made, roadmap creation can proceed with high confidence. All technical patterns are proven, all pitfalls have mitigations, and the phase structure has clear dependency rationale.

---

*Research completed: 2026-01-24*
*Ready for roadmap: YES (pending bond pattern decision)*
*Recommended next step: Update CLAUDE.md rental logic, then proceed to `/gsd:roadmap`*
