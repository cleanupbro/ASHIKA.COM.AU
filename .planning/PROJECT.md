# ASHIKA — Indian Wear Hire Australia

## What This Is

A rental-only marketplace for Indian ethnic wear in Australia, targeting South Asian diaspora women (18-45) attending weddings, Diwali, Eid, and cultural events. The platform follows a GlamCorner-style luxury-minimal aesthetic (black/white/gold) with a full rental flow: browse → filter → select dates → checkout with Stripe (rental fee + $100 refundable bond) → free Express Post shipping both ways.

## Core Value

Women can rent beautiful Indian ethnic wear for events without the cost of buying, with zero friction — the experience must feel as premium and trustworthy as renting a designer dress from GlamCorner.

## Requirements

### Validated

- ✓ Next.js 14 App Router project structure — existing
- ✓ TypeScript strict mode with Zod validation — existing
- ✓ Rental date calculation logic (7-day window, 3-day buffers) — existing
- ✓ Cart context with localStorage persistence — existing
- ✓ Product data model (categories, sizes, pricing, images) — existing
- ✓ Availability checking logic — existing
- ✓ Component architecture (ui, product, booking, cart, checkout) — existing

### Active

- [ ] Fresh UI rebuild with GlamCorner aesthetic (black/white/gold, minimal luxury)
- [ ] Supabase database with products, bookings, inventory_blocks tables
- [ ] Supabase Auth (account required for checkout)
- [ ] Product catalog with advanced filters (Type, Size, Price, Blouse, Date)
- [ ] Product detail page with image gallery and date picker
- [ ] Stripe checkout (rental fee capture + $100 bond pre-auth)
- [ ] Inventory blocking system (prevent double bookings)
- [ ] AusPost shipping integration (label generation, tracking)
- [ ] Home page (hero + featured products)
- [ ] How It Works page (Browse → Rent → Wear → Return)
- [ ] FAQ page (rentals, shipping, bonds, sizing)
- [ ] About / Contact page
- [ ] Responsive design (mobile-first, GlamCorner-quality)
- [ ] Product image storage via Supabase Storage
- [ ] Email confirmations (booking confirmed, shipping updates)

### Out of Scope

- AI Virtual Try-On — Phase 2 feature, complex ML pipeline
- "Sell to Us" portal — Phase 2, will use Tally forms
- Live chat — Not needed for v1 with 10-30 products
- Custom admin panel — Supabase dashboard sufficient for v1
- OAuth/social login — Email/password sufficient
- Blog/content hub — SEO optimization deferred
- Loyalty program — Post-launch feature
- Mobile app — Web-first, mobile responsive is sufficient

## Context

**Existing codebase:** A Next.js 14 front-end with mock data, cart context, and availability logic. The UI uses teal/emerald colors which the client has rejected — she wants GlamCorner's black/white/gold minimal luxury aesthetic. The business logic layer (rental config, date calculations, availability checks) is solid and can be preserved.

**Client (Rochelle Anjaiya):** Has a Stripe account ready. Plans to source 10-30 items initially from India. Wants Tally forms for the "Sell to Us" feature later. Mentioned needing T&Cs page. Interested in AI try-on video content for marketing.

**Market:** No dedicated Indian ethnic wear rental platform exists in Australia. GlamCorner (designer dresses) and AllBorrow (general fashion) are the closest competitors in the rental space. Primary SEO keywords: "Rent saree Australia", "Indian clothing rental Sydney", "Lehenga on rent Australia".

**Design reference:** glamcorner.com.au — white backgrounds, black text, product grid (4 cols desktop), sidebar filters, sticky nav, high-quality product imagery, clean sans-serif typography.

**Shipping model:** Free both ways via Express Post. Pre-paid return satchel included in package. Option to collect in person also available.

## Constraints

- **Tech stack**: Next.js 14, TypeScript, Tailwind, Supabase, Stripe, Vercel — locked per CLAUDE.md
- **Budget**: Free tiers only (Vercel free, Supabase free, Stripe standard fees)
- **Inventory**: 10-30 items at launch — small catalog, must look curated not empty
- **Design**: Must match GlamCorner quality — black/white/gold, minimal, luxury feel
- **Business logic**: Rental constants are immutable (7-day window, 3-day buffers, $100 bond, free shipping)
- **Postcode validation**: Australian postcodes only (0200-9999)
- **Booking window**: No past dates, max 6 months out

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Fresh UI rebuild (not restyle) | Client rejected teal/emerald; GlamCorner aesthetic is fundamentally different layout | — Pending |
| Black/white/gold palette | Client directive — minimal luxury, matches GlamCorner reference | — Pending |
| Account required (no guest checkout) | Needed for order history, bond tracking, return management | — Pending |
| Supabase dashboard for admin | Fastest path for 10-30 products, no custom admin build needed | — Pending |
| Free shipping both ways | Business decision — removes friction, included in rental price | — Pending |
| Express Post + in-person pickup option | Client specified both delivery methods | — Pending |

---
*Last updated: 2026-01-24 after initialization*
