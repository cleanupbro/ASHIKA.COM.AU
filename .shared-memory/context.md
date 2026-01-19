# ASHIKA Session Context
> Current state and context for LLM continuity

---

## Project Summary

**ASHIKA** is a rental marketplace for Indian ethnic wear in Australia.

- **Domain**: ashika.com.au
- **Target Market**: Indian diaspora in Australia
- **Business Model**: 7-day rentals with free shipping, $100 refundable bond
- **MVP Categories**: Sarees, Lehengas, Salwar Kameez, Sherwanis

---

## Current Build Stage

### Stage 1: Project Foundation ← CURRENT
- [x] Git repository initialized
- [x] Workspace restructured with skills
- [x] Vercel deployment connected
- [ ] Next.js 14 project initialized
- [ ] Tailwind configured with ASHIKA colors
- [ ] Base UI components created
- [ ] Header/footer layout

### Stage 2: Static Pages & Catalog UI (Next)
- Homepage with hero
- Shop page with product grid
- Product detail page
- Static pages (About, FAQ, Contact)

---

## Technical Context

### Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + ASHIKA brand colors
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Stripe (payment + bond pre-auth)
- **Shipping**: Australia Post API
- **Hosting**: Vercel

### Brand Colors
| Name | Hex | Usage |
|------|-----|-------|
| Teal | #0D9488 | Primary CTA, links |
| Emerald | #059669 | Secondary accents |
| Gold | #D97706 | Highlights, badges |
| Cream | #FEF3C7 | Light backgrounds |

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

---

## Key Business Rules

### Rental Config
```
RENTAL_PERIOD_DAYS: 7
DELIVERY_BUFFER_DAYS: 3
CLEANING_BUFFER_DAYS: 3
BOND_AMOUNT_AUD: 100
SHIPPING_COST_AUD: 0 (free both ways)
LATE_RETURN_FEE_AUD: 50 (after 3 days grace)
```

### Date Calculation
```
Event Date: User selected
Rental Start: Event - 3 days
Rental End: Event + 3 days
Cleaning End: Rental End + 3 days
```

---

## Files to Read for Context

1. **Master Directives**: `CLAUDE.md` (root)
2. **Implementation Plan**: `00-docs/ASHIKA-PROJECT-IMPLEMENTATION-DOCUMENT.md`
3. **Execution Roadmap**: `00-docs/roadmap/execution-plan.md`
4. **Rental Logic**: `skills/rental-logic/SKILL.md`
5. **Design System**: `skills/ui-design-apple.md`

---

## API Keys Status

| Service | Status | Needed For |
|---------|--------|------------|
| Supabase | ⏳ Pending | Database, Auth |
| Stripe | ⏳ Pending | Payments |
| Australia Post | ⏳ Pending | Shipping |

**Note**: Build UI with mock data first. API integration in Stage 6.

---

## Session Notes

### 2026-01-20
- Workspace restructuring completed
- Skills integrated from Dev Workspace
- Ready to begin Next.js initialization
- User requested front-end build plan with phases/subphases

---

*This file is auto-updated. Last sync: 2026-01-20*
