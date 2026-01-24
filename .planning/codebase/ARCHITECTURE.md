# Architecture

**Analysis Date:** 2026-01-24

## Pattern Overview

**Overall:** Next.js 14 App Router with React Context state management and server-side rendering where possible

**Key Characteristics:**
- Client-side cart management with localStorage persistence
- Mock data layer with availability calculation logic
- Component-driven UI with Tailwind CSS styling
- Type-safe data flow using TypeScript and Zod validation
- Rental-centric business logic embedded in utilities and contexts

## Layers

**Presentation Layer (Components):**
- Purpose: Render UI and handle user interactions
- Location: `src/components/`
- Contains: React functional components with TypeScript interfaces
- Depends on: Contexts (cart), utilities (date/availability), types
- Used by: Page routes in `src/app/`

**Page/Route Layer:**
- Purpose: Define application routes and handle server-side logic
- Location: `src/app/`
- Contains: Next.js 14 App Router pages, layouts, and metadata
- Depends on: Components, contexts, mock data, utilities
- Used by: Browser navigation

**State Management Layer:**
- Purpose: Manage client-side cart state across the application
- Location: `src/contexts/cart-context.tsx`
- Contains: CartContext provider with useReducer pattern
- Depends on: React hooks, localStorage API, types
- Used by: Checkout pages, layout, cart components

**Business Logic Layer:**
- Purpose: Core rental logic and availability calculations
- Location: `src/lib/mock-data/availability.ts`
- Contains: Functions for date calculations, blocking periods, availability checks
- Depends on: date-fns, RENTAL_CONFIG from types
- Used by: Calendar components, availability checks, rental timeline formatting

**Data Layer:**
- Purpose: Mock product data for development/testing
- Location: `src/lib/mock-data/products.ts`
- Contains: Static product definitions and helper functions
- Depends on: Types
- Used by: Shop pages, product detail pages, filtering logic

**Type System:**
- Purpose: Single source of truth for type definitions
- Location: `src/types/index.ts`
- Contains: Product, CartItem, Booking, InventoryBlock, and rental configuration
- Depends on: TypeScript
- Used by: All other layers

**Utility Layer:**
- Purpose: Reusable functions for styling and common operations
- Location: `src/lib/utils.ts`
- Contains: Tailwind class merging utility (`cn`)
- Depends on: clsx, tailwind-merge
- Used by: Components for dynamic class application

## Data Flow

**Product Browsing Flow:**

1. User navigates to `/shop`
2. `src/app/shop/page.tsx` (with Suspense boundary)
3. Loads `ShopContent` component
4. `ProductFilters` component manages filter state (client-side)
5. `ProductGrid` renders `ProductCard` components
6. Cards fetch product data from `src/lib/mock-data/products.ts`
7. Availability check uses `getBlockedDates()` for visual feedback

**Booking/Cart Flow:**

1. User selects product and event date on product detail page
2. `ProductInfo` component shows `AvailabilityCalendar`
3. `AvailabilityCalendar` uses `getBlockedDates()` to disable unavailable dates
4. User clicks "Add to Cart"
5. Dispatches `ADD_ITEM` to `CartContext` reducer
6. Reducer calls `formatRentalTimeline()` to calculate ship/return dates
7. New item appended to cart state
8. Cart state persisted to localStorage
9. `CartDrawer` appears and updates item count in header

**Checkout Flow:**

1. User navigates to `/checkout`
2. Page checks cart emptiness and redirects if needed
3. Multi-step form: Shipping → Payment
4. `ShippingForm` validates address
5. `OrderReview` shows cart items with subtotal and bond total
6. `PaymentForm` (mock payment processing)
7. On success: Order stored in sessionStorage, cart cleared, redirects to `/checkout/success`

**State Management:**

- **Cart State:** Stored in React Context + localStorage
- **Filter State:** Local component state in `ShopContent`
- **Form State:** Local component state in checkout steps
- **Availability Data:** Mock blocks in memory, recalculated on mount
- **Page Metadata:** Managed by Next.js metadata API per route

## Key Abstractions

**RENTAL_CONFIG:**
- Purpose: Centralized, immutable rental business rules
- Examples: `src/types/index.ts` (lines 130-138)
- Pattern: Constants exported as TypeScript const object with `as const` assertion
- Used by: Availability calculations, timeline formatting, cart calculations

**AvailabilityCalendar Component:**
- Purpose: Date picker with availability visualization
- Examples: `src/components/booking/availability-calendar.tsx`
- Pattern: Controlled component with useMemo for performance optimization
- Encapsulates: Calendar grid rendering, date blocking logic, month navigation

**CartContext + useCart Hook:**
- Purpose: Global cart state management without Redux
- Examples: `src/contexts/cart-context.tsx`
- Pattern: useReducer for complex state, localStorage for persistence, custom hook for access
- Encapsulates: Add/remove items, open/close cart, calculations (itemCount, subtotal, bondTotal)

**Availability Functions:**
- Purpose: Rental availability and date blocking calculations
- Examples: `isProductAvailable()`, `getBlockedDates()`, `calculateBlockingPeriod()`
- Pattern: Pure functions with date-fns operations
- Encapsulates: 5-day minimum booking window, 6-month max, blocking period logic

**Product Card:**
- Purpose: Reusable product display component
- Examples: `src/components/product/product-card.tsx`
- Pattern: Presentation component with hover interactions
- Encapsulates: Image, pricing, tier badge, size availability badges

## Entry Points

**Home Page:**
- Location: `src/app/page.tsx`
- Triggers: Navigation to `/` or domain root
- Responsibilities: Renders hero, trust badges, category grid, featured products, testimonials

**Shop Page:**
- Location: `src/app/shop/page.tsx`
- Triggers: Navigation to `/shop`
- Responsibilities: Product listing with filters, sorting, and search

**Product Detail Page:**
- Location: `src/app/shop/[id]/page.tsx`
- Triggers: Navigation to `/shop/[productId]`
- Responsibilities: Full product information, availability calendar, add to cart

**Checkout Page:**
- Location: `src/app/checkout/page.tsx`
- Triggers: Navigation to `/checkout`
- Responsibilities: Multi-step checkout form (shipping, payment), order summary

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every page render
- Responsibilities: Wraps all pages with CartProvider, Header, Footer, CartDrawer

## Error Handling

**Strategy:** Try-catch at component boundaries with graceful fallbacks

**Patterns:**
- Cart hydration: Try-catch in localStorage read with console.error fallback
- Form submissions: Validation before dispatch, state reset on error
- Data fetching: Error states not yet fully implemented (mock data only)
- Invalid routes: Next.js built-in 404 page (`src/app/not-found.tsx`)

**User-Facing Error Messages:**
- Empty cart on checkout redirects to shop
- Invalid product ID shows 404
- Calendar blocks unavailable dates visually
- Validation errors shown inline on forms

## Cross-Cutting Concerns

**Logging:** Console.error for development debugging, limited to failures (localStorage hydration, availability checks)

**Validation:**
- Zod schemas imported from `@/lib/utils/validation.ts` (referenced but not yet extensive)
- React Hook Form for checkout forms
- Inline validation in filter components

**Authentication:** Not yet implemented (future phase with Supabase Auth)

**Styling:** Tailwind CSS with custom color palette
- Brand colors: teal-600 (primary), gold/amber (accent)
- Responsive: Mobile-first with `md:` and `lg:` breakpoints
- Dark-friendly base colors with white components

**Date Handling:** date-fns for all date operations (no moment.js)

---

*Architecture analysis: 2026-01-24*
