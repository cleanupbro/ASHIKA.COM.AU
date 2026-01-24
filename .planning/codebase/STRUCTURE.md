# Codebase Structure

**Analysis Date:** 2026-01-24

## Directory Layout

```
/Users/shamalkrishna/Desktop/ASHIKA.COM.AU/
├── src/                          # Application source code
│   ├── app/                      # Next.js 14 App Router
│   │   ├── page.tsx              # Home page
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── error.tsx             # Error boundary
│   │   ├── not-found.tsx         # 404 page
│   │   ├── globals.css           # Global Tailwind styles
│   │   ├── shop/
│   │   │   ├── page.tsx          # Shop listing page
│   │   │   ├── shop-content.tsx  # Shop content with filters
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Product detail page
│   │   ├── checkout/
│   │   │   ├── page.tsx          # Checkout page
│   │   │   └── success/
│   │   │       └── page.tsx      # Order confirmation
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── faq/
│   │   │   └── page.tsx
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   └── terms/
│   │       └── page.tsx
│   │
│   ├── components/               # React components by domain
│   │   ├── ui/                   # Reusable base UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── accordion.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── index.ts          # Barrel export
│   │   │
│   │   ├── layout/               # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── container.tsx     # Max-width wrapper
│   │   │   ├── mobile-nav.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── home/                 # Home page sections
│   │   │   ├── hero.tsx
│   │   │   ├── trust-badges.tsx
│   │   │   ├── categories-grid.tsx
│   │   │   ├── featured-products.tsx
│   │   │   ├── how-it-works.tsx
│   │   │   ├── testimonials.tsx
│   │   │   ├── newsletter.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── product/              # Product-related components
│   │   │   ├── product-card.tsx
│   │   │   ├── product-grid.tsx
│   │   │   ├── product-filters.tsx
│   │   │   ├── product-images.tsx
│   │   │   ├── product-info.tsx
│   │   │   ├── sort-dropdown.tsx
│   │   │   ├── active-filters.tsx
│   │   │   └── ...
│   │   │
│   │   ├── booking/              # Booking/rental components
│   │   │   ├── availability-calendar.tsx
│   │   │   ├── date-selector.tsx
│   │   │   ├── rental-summary.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── checkout/             # Checkout flow components
│   │   │   ├── shipping-form.tsx
│   │   │   ├── payment-form.tsx
│   │   │   ├── order-review.tsx
│   │   │   └── ...
│   │   │
│   │   └── cart/                 # Cart display components
│   │       ├── cart-drawer.tsx
│   │       └── cart-item.tsx
│   │
│   ├── contexts/                 # React Context state management
│   │   ├── cart-context.tsx      # Cart state + useCart hook
│   │   └── index.ts
│   │
│   ├── lib/                      # Utilities and helpers
│   │   ├── utils.ts              # Class merging utility (cn)
│   │   └── mock-data/
│   │       ├── products.ts       # Product definitions
│   │       ├── availability.ts   # Availability logic & date helpers
│   │       └── ...
│   │
│   ├── types/                    # Type definitions
│   │   └── index.ts              # All shared types and RENTAL_CONFIG
│   │
│   └── hooks/                    # Custom React hooks (future)
│       └── (Currently in contexts)
│
├── public/                       # Static assets
│
├── .claude/                      # AI assistant directives
│   └── rules/                    # Business & coding rules
│
├── .planning/                    # Planning documents
│   └── codebase/                 # Codebase analysis (this file)
│
├── skills/                       # Domain-specific skill guides
├── supabase/                     # Supabase migrations & config
├── 00-docs/                      # Business/design documentation
├── scripts/                      # Build and utility scripts
│
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.js                # Next.js config
├── tailwind.config.js            # Tailwind CSS config
└── postcss.config.js             # PostCSS config
```

## Directory Purposes

**src/app:**
- Purpose: Next.js 14 App Router routes and layouts
- Contains: Page files (page.tsx), layout wrappers, error boundaries, metadata definitions
- Key files: `page.tsx` (route handler), `layout.tsx` (layout wrapper)
- Pattern: One directory per route, nested directories for subroutes

**src/components:**
- Purpose: Reusable React components organized by domain
- Contains: Functional components with TypeScript interfaces
- Subfolders organize by feature (product, booking, layout, etc.)
- Pattern: Each component in its own file with barrel exports

**src/lib:**
- Purpose: Shared utilities, helpers, and data
- Contains: Pure functions, constants, mock data
- Key: `utils.ts` (cn function), `mock-data/` (products and availability)

**src/contexts:**
- Purpose: React Context providers for state management
- Contains: Context creation, reducer functions, hooks
- Currently: CartContext is the primary state management

**src/types:**
- Purpose: Single source of truth for TypeScript types
- Contains: Interfaces for Product, CartItem, Booking, and RENTAL_CONFIG constant
- Exported: Used across all application layers

**public:**
- Purpose: Static assets served at root
- Contains: Favicons, logos, static images (Next.js optimized images reference URLs, not files)

**supabase:**
- Purpose: Database schema and migrations
- Contains: SQL migration files
- Future: Will contain RLS policies, functions

**.claude & .planning:**
- Purpose: AI assistant directives and codebase documentation
- Not deployed: Excluded from production builds

## Key File Locations

**Entry Points:**
- `src/app/page.tsx`: Home page
- `src/app/shop/page.tsx`: Product listing
- `src/app/shop/[id]/page.tsx`: Product details
- `src/app/checkout/page.tsx`: Checkout flow
- `src/app/layout.tsx`: Root layout with providers

**Configuration:**
- `package.json`: Dependencies and scripts
- `tsconfig.json`: TypeScript settings with `@/*` alias
- `tailwind.config.js`: Color palette and Tailwind config
- `next.config.js`: Next.js build settings

**Core Logic:**
- `src/types/index.ts`: Type definitions + RENTAL_CONFIG
- `src/lib/mock-data/availability.ts`: Availability calculations
- `src/lib/mock-data/products.ts`: Product data
- `src/contexts/cart-context.tsx`: Cart state management

**Testing:**
- No test files currently present

## Naming Conventions

**Files:**
- Components: kebab-case (e.g., `product-card.tsx`, `availability-calendar.tsx`)
- Hooks: use-[name].ts (e.g., `use-cart.ts` - currently in context)
- Utilities: kebab-case.ts (e.g., `date-utils.ts`)
- Types: index.ts or types.ts
- Pages: page.tsx (Next.js convention)
- Layouts: layout.tsx (Next.js convention)

**Directories:**
- Feature-based organization: `components/[feature]/`
- Lowercase with hyphens: `shopping-cart`, `product-detail`
- Plural for collections: `components/`, `lib/`, `hooks/`

**TypeScript/JavaScript:**
- Interfaces: PascalCase (e.g., `ProductCardProps`, `CartState`)
- Types: PascalCase (e.g., `ProductCategory`, `BookingStatus`)
- Functions: camelCase (e.g., `isProductAvailable`, `formatRentalTimeline`)
- Constants: SCREAMING_SNAKE_CASE (e.g., `RENTAL_CONFIG`, `STOCK_IMAGES`)
- Variables: camelCase (e.g., `cartItems`, `eventDate`)

## Where to Add New Code

**New Feature:**
1. **Primary code:** `src/components/[feature]/`
   - Create components for that feature
   - Use barrel exports via `index.ts`
2. **Business logic:** `src/lib/[feature-logic].ts`
   - Pure functions for calculations
3. **Types:** Add to `src/types/index.ts`
4. **State (if needed):** Add to or extend `src/contexts/`

**Example (Add booking management):**
```
src/
├── components/booking-management/
│   ├── booking-list.tsx
│   ├── booking-detail.tsx
│   └── index.ts
├── lib/booking-helpers.ts
└── types/index.ts (add BookingManagement interface)
```

**New Component/Module:**
- Location: `src/components/[category]/[component-name].tsx`
- Export: Named export (no default exports)
- Props: Define interface ending in `Props`
- Pattern: Use existing components as reference

**Utilities:**
- Shared helpers: `src/lib/[domain].ts`
- Date utilities: `src/lib/mock-data/availability.ts` (already established)
- Class utilities: `src/lib/utils.ts` (current home for `cn`)

**New Page:**
1. Create directory: `src/app/[route-name]/`
2. Add file: `page.tsx` with default export
3. Add metadata: Define `Metadata` export
4. Optional: Create `layout.tsx` for sub-routes

## Special Directories

**src/lib/mock-data:**
- Purpose: Development data and mock implementations
- Generated: No, manually maintained
- Committed: Yes, part of repo
- Future: Will be replaced with real Supabase data via API routes

**supabase/migrations:**
- Purpose: Database schema version control
- Generated: No, hand-written SQL
- Committed: Yes, must be committed
- Current: Empty, ready for schema definition

**.planning/codebase:**
- Purpose: Codebase analysis documentation
- Generated: Yes, by GSD codebase mapper
- Committed: Yes, for team reference
- Use: Reference when planning implementation

**.claude/rules:**
- Purpose: Business rules and coding directives
- Generated: No, human-authored
- Committed: Yes
- Use: Guide all implementation decisions

## Import Path Patterns

**Alias Usage:**
- `@/components/` → `src/components/`
- `@/types` → `src/types/index.ts`
- `@/lib/` → `src/lib/`
- `@/contexts/` → `src/contexts/`

**Import Organization:**
1. External libraries (React, Next.js, third-party)
2. Internal utilities (@/lib, @/utils)
3. Types (@/types)
4. Components (@/components)
5. Contexts (@/contexts)

**Example:**
```typescript
import { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Product, RENTAL_CONFIG } from '@/types';
import { Button } from '@/components/ui';
import { useCart } from '@/contexts/cart-context';
```

---

*Structure analysis: 2026-01-24*
