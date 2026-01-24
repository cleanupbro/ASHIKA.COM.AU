# Roadmap: ASHIKA

## Overview

ASHIKA is a brownfield project: the existing Next.js 14 front-end has working cart logic and availability calculations, but uses rejected styling (teal/emerald) and mock data. The roadmap delivers a complete rental transaction flow end-to-end, starting with database + auth foundation, rebuilding the UI to match GlamCorner's black/white/gold aesthetic, then layering booking logic, Stripe payments, shipping integration, and content pages. The critical path to revenue runs through Phases 1-4; Phases 5-6 enable operations and polish for launch.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Database schema, auth system, and design tokens
- [ ] **Phase 2: Catalog Experience** - Product browsing with filters and product detail pages
- [ ] **Phase 3: Booking System** - Availability engine and atomic booking creation
- [ ] **Phase 4: Payments** - Stripe checkout with rental fee capture and saved-card bond
- [ ] **Phase 5: Shipping & Fulfillment** - AusPost integration, tracking, and return labels
- [ ] **Phase 6: Content & Launch Polish** - Static pages, responsive polish, and image optimization

## Phase Details

### Phase 1: Foundation
**Goal**: Users can create accounts and browse real product data from a Supabase database, with the new GlamCorner-inspired design system applied
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, DSGN-01, DSGN-03
**Success Criteria** (what must be TRUE):
  1. User can sign up with email/password and is redirected to the shop
  2. User can log in, remain logged in across browser sessions, and log out from any page
  3. User can reset a forgotten password via email link
  4. Product data loads from Supabase (not mock data) on the shop page
  5. The site uses the black/white/gold palette with sticky navigation header (GlamCorner aesthetic)
**Plans**: 4 plans

Plans:
- [ ] 01-01: Supabase project setup, database schema (products, product_sizes, profiles, inventory_blocks, bookings), RLS policies, seed data migration
- [ ] 01-02: Auth implementation (signup, login, logout, password reset, middleware token refresh)
- [ ] 01-03: Design system rebuild (Tailwind config with black/white/gold tokens, base UI components, sticky nav header)
- [ ] 01-04: Connect front-end to Supabase (replace mock data imports with real queries, product image storage setup)

### Phase 2: Catalog Experience
**Goal**: Users can browse, filter, and explore the full product catalog with a premium shopping experience
**Depends on**: Phase 1
**Requirements**: CATL-01, CATL-02, CATL-03, CATL-04, CATL-05, CATL-06, CATL-07, PROD-01, PROD-02, PROD-05, PROD-06, PROD-07, PROD-08, PROD-09, DSGN-02, DSGN-04
**Success Criteria** (what must be TRUE):
  1. User sees a responsive product grid (4 cols desktop, 2 cols mobile) with GlamCorner-quality layout
  2. User can filter products by category, size, price range, blouse included, and date availability
  3. User can sort products by newest, price low-to-high, and price high-to-low
  4. User can view a product detail page with image gallery, size guide, draping guide, condition rating, and "what's in the box" section
  5. Product images are optimized (WebP, pre-generated sizes) and load fast on mobile
**Plans**: 3 plans

Plans:
- [ ] 02-01: Product grid rebuild with GlamCorner layout, responsive breakpoints, and all filter/sort functionality
- [ ] 02-02: Product detail page (image gallery, product info, size guide, draping guide, condition rating, what's included, reviews section)
- [ ] 02-03: Image optimization pipeline (WebP variants, Supabase Storage upload, next/image integration)

### Phase 3: Booking System
**Goal**: Users can select an event date and create a booking with guaranteed availability (no double-bookings)
**Depends on**: Phase 1
**Requirements**: PROD-03, PROD-04, BOOK-01, BOOK-02, BOOK-03, BOOK-04
**Success Criteria** (what must be TRUE):
  1. User can select an event date on the product detail page and see real-time availability feedback
  2. Unavailable dates (including cleaning buffer periods) are visually blocked on the calendar
  3. Booking creation is atomic -- two users selecting the same item and date cannot both succeed
  4. User can view their booking history with status tracking (Pending through Completed)
**Plans**: 3 plans

Plans:
- [ ] 03-01: Availability API (GET /api/products/[id]/availability, queries inventory_blocks, returns blocked date ranges per month)
- [ ] 03-02: Atomic booking creation (create_booking_atomic PostgreSQL function with FOR UPDATE locks, POST /api/bookings endpoint)
- [ ] 03-03: Booking status tracking (status enum flow, user booking history page, status display UI)

### Phase 4: Payments
**Goal**: Users can complete checkout with Stripe, paying the rental fee and saving their card for the refundable bond
**Depends on**: Phase 3
**Requirements**: PAY-01, PAY-02, PAY-03, PAY-04, PAY-05
**Success Criteria** (what must be TRUE):
  1. User sees transparent pricing before payment (rental fee amount + bond terms explained)
  2. User's postcode is validated as a valid Australian postcode before payment proceeds
  3. Rental fee is captured immediately via Stripe PaymentIntent on successful checkout
  4. User's payment method is saved via SetupIntent for potential bond charge (no upfront hold)
  5. Admin can trigger a bond charge (up to $100) on damage via the saved payment method
**Plans**: 3 plans

Plans:
- [ ] 04-01: Checkout flow (single-page checkout UI, postcode validation, pricing display with bond explanation)
- [ ] 04-02: Stripe integration (PaymentIntent for rental fee, SetupIntent for bond card save, Stripe Elements UI, webhook handler for payment_intent.succeeded)
- [ ] 04-03: Bond management (admin bond capture endpoint, saved payment method charge logic, booking status update on payment confirmation)

### Phase 5: Shipping & Fulfillment
**Goal**: Orders are fulfilled with generated shipping labels and customers receive tracking updates
**Depends on**: Phase 4
**Requirements**: SHIP-01, SHIP-02, SHIP-03, SHIP-04
**Success Criteria** (what must be TRUE):
  1. Outbound shipping label is generated via AusPost API after order confirmation
  2. User can choose in-person pickup as an alternative to shipping at checkout
  3. User receives email updates when their order ships (with tracking number)
  4. Pre-paid return satchel label is generated and included with the order
**Plans**: 3 plans

Plans:
- [ ] 05-01: AusPost API integration (OAuth setup, outbound label generation, return satchel label generation)
- [ ] 05-02: Shipping options UI (in-person pickup toggle at checkout, shipping address form conditional display)
- [ ] 05-03: Tracking notifications (email on shipping status change, tracking number display in booking history)

### Phase 6: Content & Launch Polish
**Goal**: The site is complete with all content pages, fully responsive, and ready for public launch
**Depends on**: Phase 2 (for design system), Phase 4 (for T&Cs referencing payment terms)
**Requirements**: PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05
**Success Criteria** (what must be TRUE):
  1. Home page displays hero banner and featured products from the real catalog
  2. How It Works page clearly explains the Browse-Rent-Wear-Return flow
  3. FAQ page answers common questions about rentals, shipping, bonds, and sizing
  4. Terms and Conditions page covers damage policy, bond terms, and rental agreement
  5. About/Contact page provides business information and contact methods
**Plans**: 3 plans

Plans:
- [ ] 06-01: Home page rebuild (hero banner, featured products query, trust/value propositions)
- [ ] 06-02: Information pages (How It Works, FAQ, About/Contact)
- [ ] 06-03: Terms & Conditions page and final responsive/accessibility audit

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6
Note: Phases 2 and 3 can execute in parallel (both depend only on Phase 1).

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/4 | Not started | - |
| 2. Catalog Experience | 0/3 | Not started | - |
| 3. Booking System | 0/3 | Not started | - |
| 4. Payments | 0/3 | Not started | - |
| 5. Shipping & Fulfillment | 0/3 | Not started | - |
| 6. Content & Launch Polish | 0/3 | Not started | - |

---

## Coverage

| Requirement | Phase | Verified |
|-------------|-------|----------|
| AUTH-01 | 1 | Y |
| AUTH-02 | 1 | Y |
| AUTH-03 | 1 | Y |
| AUTH-04 | 1 | Y |
| CATL-01 | 2 | Y |
| CATL-02 | 2 | Y |
| CATL-03 | 2 | Y |
| CATL-04 | 2 | Y |
| CATL-05 | 2 | Y |
| CATL-06 | 2 | Y |
| CATL-07 | 2 | Y |
| PROD-01 | 2 | Y |
| PROD-02 | 2 | Y |
| PROD-03 | 3 | Y |
| PROD-04 | 3 | Y |
| PROD-05 | 2 | Y |
| PROD-06 | 2 | Y |
| PROD-07 | 2 | Y |
| PROD-08 | 2 | Y |
| PROD-09 | 2 | Y |
| BOOK-01 | 3 | Y |
| BOOK-02 | 3 | Y |
| BOOK-03 | 3 | Y |
| BOOK-04 | 3 | Y |
| PAY-01 | 4 | Y |
| PAY-02 | 4 | Y |
| PAY-03 | 4 | Y |
| PAY-04 | 4 | Y |
| PAY-05 | 4 | Y |
| SHIP-01 | 5 | Y |
| SHIP-02 | 5 | Y |
| SHIP-03 | 5 | Y |
| SHIP-04 | 5 | Y |
| PAGE-01 | 6 | Y |
| PAGE-02 | 6 | Y |
| PAGE-03 | 6 | Y |
| PAGE-04 | 6 | Y |
| PAGE-05 | 6 | Y |
| DSGN-01 | 1 | Y |
| DSGN-02 | 2 | Y |
| DSGN-03 | 1 | Y |
| DSGN-04 | 2 | Y |

**Total: 42/42 mapped. No orphans.**

---
*Roadmap created: 2026-01-24*
*Depth: Standard (6 phases, 19 plans, 42 requirements)*
