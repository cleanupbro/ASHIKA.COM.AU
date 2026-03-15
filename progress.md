# Progress

> Last updated: 2026-03-15

## Status

`IN PROGRESS`

## Done

| # | Task | Date |
|---|------|------|
| 1 | Created and linked a new Vercel project for this repository (`ashika`) | 2026-03-15 |
| 2 | Deployed the current storefront successfully to Vercel production | 2026-03-15 |
| 3 | Cleaned up broken footer/navigation links and removed dead `/account` entry points | 2026-03-15 |
| 4 | Centralized shared site metadata and contact constants for layout, legal, and contact pages | 2026-03-15 |
| 5 | Verified the app builds cleanly with Next.js production output | 2026-03-15 |
| 6 | Paused Claw-School Supabase, restored ASHIKA Supabase (Sydney ap-southeast-2) | 2026-03-15 |
| 7 | Applied full DB schema: products, bookings, inventory_blocks + 6 enums, 2 functions, RLS policies, EXCLUDE constraint | 2026-03-15 |
| 8 | Seeded 18 placeholder products (6 sarees, 4 lehengas, 4 sherwanis, 4 salwar kameez) | 2026-03-15 |
| 9 | Design system rebranded: maroon (#881337) → black/white/gold GlamCorner aesthetic (121 refs, 15 files) | 2026-03-15 |
| 10 | Configured .env.local with Supabase URL + anon key, next.config.mjs with dynamic Supabase storage hostname | 2026-03-15 |
| 11 | Created Supabase product queries (getProducts, getProductById, getFeaturedProducts, getProductsByCategory, getAllProductIds) | 2026-03-15 |
| 12 | Wired frontend to real Supabase data — replaced mock imports in shop, product detail, featured, related products | 2026-03-15 |
| 13 | Dual-CLI code review (Codex + Gemini): 16 issues found and fixed (type mismatches, invalid tokens, stale colors, missing animations, dead UI) | 2026-03-15 |
| 14 | Added HowItWorks section to homepage (was built but never rendered) | 2026-03-15 |
| 15 | Fixed hero search bar — made interactive (navigates to /shop), replaced hardcoded dates with placeholder text | 2026-03-15 |
| 16 | Fixed footer: newsletter type=submit, added "Powered by claudeking.org" + sam@claudeking.org | 2026-03-15 |
| 17 | Built auth system: login, signup, password reset pages + auth context + middleware for session refresh | 2026-03-15 |
| 18 | Rebuilt Vercel project as `ashika-com-au`, added ashika.com.au + www.ashika.com.au domains | 2026-03-15 |

## In Progress

| # | Task | Started | Notes |
|---|------|---------|-------|
| 1 | Photograph real garments + AI-enhance for catalog | 2026-03-15 | Sam has physical garments, see .planning/PHOTOGRAPHY-PLAN.md |

## Blocked

| # | Task | Blocked By | Since |
|---|------|------------|-------|
| 1 | Configure DNS at Webcentral for ashika.com.au | Domain "awaiting activation" at Webcentral registrar | 2026-03-15 |

## Next Up

| # | Task | Priority |
|---|------|----------|
| 1 | DNS: Add 4 records at Webcentral once domain activates (A, 2x TXT verification, CNAME www) | HIGH |
| 2 | Photograph garments + AI-enhance + upload to Supabase Storage | HIGH |
| 3 | Phase 3: Booking system — availability API, atomic booking creation, status tracking | HIGH |
| 4 | Phase 4: Stripe checkout — PaymentIntent for rental + SetupIntent for bond | HIGH |
| 5 | Phase 5: Manual shipping for launch (admin marks shipped + tracking) | MEDIUM |
| 6 | Phase 6: Content pages (About, FAQ, Contact, Privacy, Terms — real content) | MEDIUM |
| 7 | Add login/account button to header + protect checkout route | MEDIUM |

## DNS Records (add when domain activates)

| Type | Name | Value |
|------|------|-------|
| A | @ | 216.198.79.1 |
| TXT | _vercel | vc-domain-verify=ashika.com.au,14e0eeaa8df57b75bdca |
| CNAME | www | cb2d9cb2352d5456.vercel-dns-017.com. |
| TXT | _vercel.www | vc-domain-verify=www.ashika.com.au,31e538f52464dce807c0 |

## Session Log

| Date | Agent | What Was Done |
|------|-------|---------------|
| 2026-03-15 | Codex | Created a new Vercel project, linked the repo, deployed production, cleaned up broken navigation/footer paths, added shared site constants, and documented the remaining domain-ownership blocker. |
| 2026-03-15 | Koda (Claude Opus 4.6) | Full Phase 0 + Phase 1 build: Supabase infra (pause/restore/schema/seed), design rebrand (black/white/gold), frontend wired to real DB, dual-CLI review (16 fixes), auth system (login/signup/reset/middleware), HowItWorks on homepage, hero search bar interactive, footer updated with claudeking.org branding. DNS blocked by registrar activation. |
