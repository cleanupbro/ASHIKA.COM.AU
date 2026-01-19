# Execution Plan
## ASHIKA — Indian Wear Hire Australia
**Document Version:** 1.0  
**Status:** Ready for Execution  
**Last Updated:** 2026-01-19  

---

## Overview

This document provides the week-by-week execution plan for building ASHIKA. Each week has clear objectives, deliverables, and validation criteria.

**Philosophy:** Ship fast, iterate faster. Claude builds, human validates.

---

## Phase 1: MVP (Weeks 1-12)

### Week 1-2: Foundation

**Objective:** Set up development environment and core infrastructure.

#### Tasks

| Task | Deliverable | Owner | Status |
|------|-------------|-------|--------|
| Initialize Next.js 14 project with TypeScript | `/src/app/` structure | Claude | ⬜ |
| Configure Tailwind with ASHIKA colors | `tailwind.config.ts` | Claude | ⬜ |
| Set up Supabase project | Database URL in `.env.local` | Human | ⬜ |
| Create database schema | Migration files | Claude | ⬜ |
| Configure authentication | Auth callback route | Claude | ⬜ |
| Create base UI components | Button, Card, Input, Modal | Claude | ⬜ |
| Set up project structure | Folders per workspace spec | Claude | ⬜ |

#### Validation Criteria

- [ ] `npm run dev` starts without errors
- [ ] Can sign up / sign in with email
- [ ] Database tables exist in Supabase
- [ ] Tailwind colors match brand (Teal #0D9488, Gold #D97706)

#### Commands to Run

```bash
# Human runs these
npx create-next-app@latest ashika --typescript --tailwind --eslint --app
cd ashika
npm install @supabase/supabase-js @supabase/ssr
npm install date-fns zod react-hook-form @hookform/resolvers lucide-react

# Initialize Supabase
supabase init
supabase link --project-ref YOUR_PROJECT_REF
```

---

### Week 3-4: Catalog & Filters

**Objective:** Build the product browsing experience.

#### Tasks

| Task | Deliverable | Status |
|------|-------------|--------|
| Product list page | `/app/shop/page.tsx` | ⬜ |
| Product grid component | `ProductGrid.tsx` | ⬜ |
| Product card component | `ProductCard.tsx` | ⬜ |
| Filter sidebar | `ProductFilters.tsx` | ⬜ |
| Filter state management | URL params + hooks | ⬜ |
| Product detail page | `/app/shop/[slug]/page.tsx` | ⬜ |
| Image gallery | `ImageGallery.tsx` | ⬜ |
| Size chart modal | `SizeChart.tsx` | ⬜ |
| Seed test products | 20 products in database | ⬜ |

#### Filters to Implement

```typescript
interface ProductFilters {
  category: 'saree' | 'lehenga' | 'salwar_kameez' | 'sherwani' | 'kurta' | 'kids' | 'accessories';
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'free_size';
  blouse_included: boolean;
  price_range: '<50' | '50-100' | '100-150' | '150-200' | '>200';
  available_date?: string; // ISO date
}
```

#### Validation Criteria

- [ ] Can browse all products in grid
- [ ] Filters update URL and results
- [ ] Product detail shows all information
- [ ] Images load from Supabase Storage
- [ ] Mobile responsive (375px width)

---

### Week 5-6: Rental Logic & Calendar

**Objective:** Implement the core booking and availability system.

#### Tasks

| Task | Deliverable | Status |
|------|-------------|--------|
| Availability checking function | `lib/rental/availability.ts` | ⬜ |
| Date calculation utilities | `lib/rental/dates.ts` | ⬜ |
| Availability calendar component | `AvailabilityCalendar.tsx` | ⬜ |
| Date selection UI | Integrated in product detail | ⬜ |
| Booking creation API | `/api/bookings/route.ts` | ⬜ |
| Inventory block creation | On booking confirm | ⬜ |
| Booking confirmation page | `/app/checkout/success/page.tsx` | ⬜ |

#### Critical Logic (Reference rental-logic SKILL.md)

```typescript
// Availability check must consider:
// 1. Existing bookings
// 2. Cleaning buffer (3 days after return)
// 3. Delivery buffer (3 days before event)

// Date flow:
// rental_start = event_date - 3 (delivery buffer)
// rental_end = event_date + 4 (return time)
// cleaning_end = rental_end + 3 (cleaning buffer)
```

#### Validation Criteria

- [ ] Cannot book same item for overlapping dates
- [ ] Cannot book within cleaning buffer of existing booking
- [ ] Calendar shows unavailable dates correctly
- [ ] Booking creates inventory_block record
- [ ] Past dates are not selectable

---

### Week 7-8: Checkout & Payments

**Objective:** Complete the purchase flow with Stripe.

#### Tasks

| Task | Deliverable | Status |
|------|-------------|--------|
| Stripe account setup | API keys in `.env.local` | ⬜ |
| Checkout page | `/app/checkout/page.tsx` | ⬜ |
| Address form with postcode validation | `AddressForm.tsx` | ⬜ |
| Stripe payment integration | `CheckoutForm.tsx` | ⬜ |
| Bond pre-authorization | `lib/stripe/bonds.ts` | ⬜ |
| Payment webhook handler | `/api/webhooks/stripe/route.ts` | ⬜ |
| Order summary display | `OrderSummary.tsx` | ⬜ |
| Confirmation email (basic) | Supabase Edge Function | ⬜ |

#### Postcode Validation

```typescript
// Australian postcodes: 0200-9999
const POSTCODE_REGEX = /^(0[289]|[1-9]\d)\d{2}$/;

function validatePostcode(postcode: string): boolean {
  return POSTCODE_REGEX.test(postcode);
}

// State mapping
const POSTCODE_STATES: Record<string, string> = {
  '0': 'NT',
  '1': 'NSW',
  '2': 'NSW/ACT',
  '3': 'VIC',
  '4': 'QLD',
  '5': 'SA',
  '6': 'WA',
  '7': 'TAS',
};
```

#### Validation Criteria

- [ ] Can complete full checkout flow
- [ ] Rental fee captured, bond pre-authorized
- [ ] Invalid postcodes rejected
- [ ] Order appears in database
- [ ] User receives confirmation email

---

### Week 9-10: Shipping & Admin

**Objective:** Shipping integration and basic admin functionality.

#### Tasks

| Task | Deliverable | Status |
|------|-------------|--------|
| Australia Post API integration | `lib/shipping/auspost.ts` | ⬜ |
| Shipping label generation | Admin action | ⬜ |
| Return label generation | Include in package | ⬜ |
| Admin dashboard layout | `/app/admin/layout.tsx` | ⬜ |
| Orders list view | `/app/admin/orders/page.tsx` | ⬜ |
| Order detail view | `/app/admin/orders/[id]/page.tsx` | ⬜ |
| Update order status | Admin action | ⬜ |
| Inventory management | `/app/admin/products/page.tsx` | ⬜ |
| Add/edit product | Product form | ⬜ |
| Process returns | Return workflow | ⬜ |

#### Admin Order Actions

```typescript
type OrderAction = 
  | 'mark_shipped'      // Generate tracking, update status
  | 'mark_delivered'    // Customer has item
  | 'mark_returned'     // Item received back
  | 'inspect_ok'        // Release bond
  | 'inspect_damage'    // Capture partial bond
  | 'cancel_order';     // Cancel and refund
```

#### Validation Criteria

- [ ] Can generate shipping labels
- [ ] Can update order status through workflow
- [ ] Can add new products with images
- [ ] Can process returns with bond release
- [ ] Admin protected by role check

---

### Week 11-12: Polish & Launch

**Objective:** Complete MVP and deploy to production.

#### Tasks

| Task | Deliverable | Status |
|------|-------------|--------|
| Homepage design | `/app/page.tsx` | ⬜ |
| About page | `/app/about/page.tsx` | ⬜ |
| FAQ page | `/app/faq/page.tsx` | ⬜ |
| Contact page | `/app/contact/page.tsx` | ⬜ |
| Terms of service | `/app/terms/page.tsx` | ⬜ |
| Privacy policy | `/app/privacy/page.tsx` | ⬜ |
| SEO meta tags | All pages | ⬜ |
| Performance optimization | Lighthouse audit | ⬜ |
| Error handling | Error boundaries | ⬜ |
| Loading states | Skeletons | ⬜ |
| Mobile testing | All breakpoints | ⬜ |
| Production deployment | Vercel | ⬜ |
| Domain configuration | ashika.com.au | ⬜ |
| SSL certificate | Automatic via Vercel | ⬜ |

#### Launch Checklist

- [ ] All pages render without errors
- [ ] Full rental flow works end-to-end
- [ ] Stripe is in live mode with real keys
- [ ] Webhooks configured for production URL
- [ ] Database has real products
- [ ] Domain points to Vercel
- [ ] Analytics configured (if any)

---

## Phase 2: AI & Community (Weeks 13-28)

### Weeks 13-16: Research & Prototyping

| Task | Deliverable |
|------|-------------|
| Research AI try-on solutions | Comparison document |
| Prototype with MediaPipe | Browser pose detection demo |
| Test Camweara/GlamAR SDKs | Integration feasibility |
| Design "Sell to Us" flow | User journey map |

### Weeks 17-22: AI Try-On Implementation

| Task | Deliverable |
|------|-------------|
| Try-on modal UI | `TryOnModal.tsx` |
| Photo upload flow | Upload to temp storage |
| Pose detection integration | MediaPipe in browser |
| Garment overlay | SDK or custom |
| Privacy compliance | Auto-delete uploads |

### Weeks 23-28: Community Features

| Task | Deliverable |
|------|-------------|
| "Sell to Us" form | Submission page |
| Admin review workflow | Approval queue |
| Zendesk/Tawk integration | Live chat widget |
| Knowledge base expansion | More FAQ content |

---

## Phase 3: Scale (Ongoing)

### Quarterly Releases

| Quarter | Focus |
|---------|-------|
| Q1 | Loyalty program, referral system |
| Q2 | Blog/content hub, SEO optimization |
| Q3 | Influencer partnerships, social features |
| Q4 | Analytics dashboard, performance optimization |

---

## Dependency Summary

```
Week 1-2 (Foundation) → Required for everything
    ↓
Week 3-4 (Catalog) → Requires database
    ↓
Week 5-6 (Rental Logic) → Requires catalog
    ↓
Week 7-8 (Payments) → Requires rental logic
    ↓
Week 9-10 (Shipping/Admin) → Requires payments
    ↓
Week 11-12 (Polish/Launch) → Requires all above
```

---

## How to Use This Plan

1. **At start of each week:** Review tasks for that week
2. **During development:** Reference relevant SKILL.md files
3. **On task completion:** Mark status, update `.shared-memory/progress.json`
4. **On blockers:** Document in `.shared-memory/context.md`
5. **On week end:** Commit all changes, update progress

---

## Success Metrics (Phase 1)

| Metric | Target |
|--------|--------|
| Launch date | Week 12 |
| Products listed | 100+ |
| Page load time | < 3s |
| Lighthouse score | > 80 |
| Mobile responsive | 100% |
| Zero double-bookings | 100% |
| First 50 rentals | Week 16 |

---

*This plan is living documentation. Update as needed, but track all changes.*
