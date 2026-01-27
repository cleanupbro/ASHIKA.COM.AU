# Architecture

**Analysis Date:** 2026-01-27

## Pattern Overview

**Overall:** Next.js App Router with Component-Based Architecture

**Key Characteristics:**
- Server-first rendering with selective client components
- Centralized state management using React Context + useReducer
- Domain-driven component organization
- Type-safe development with TypeScript strict mode
- Mock data layer preparing for future backend integration

## Layers

**Presentation Layer:**
- Purpose: UI rendering and user interaction handling
- Location: `src/components/`, `src/app/`
- Contains: React Server Components (default), Client Components (marked with 'use client'), page routes
- Depends on: Contexts, types, lib utilities
- Used by: Next.js App Router for rendering

**State Management Layer:**
- Purpose: Global application state (cart, user session)
- Location: `src/contexts/`
- Contains: React Context providers, reducers, custom hooks
- Depends on: Types, utilities
- Used by: Client components requiring shared state

**Data Layer:**
- Purpose: Data access and business logic
- Location: `src/lib/mock-data/`, `src/types/`
- Contains: Product catalog, availability calculations, type definitions, business rules
- Depends on: Type definitions from `src/types/`
- Used by: Components and pages for data retrieval

**Utilities Layer:**
- Purpose: Shared helper functions and configurations
- Location: `src/lib/utils.ts`
- Contains: Class name utilities (clsx, tailwind-merge), formatting functions
- Depends on: Third-party libraries
- Used by: All layers for common operations

## Data Flow

**Product Browsing Flow:**

1. User navigates to `/shop` → Server Component renders `src/app/shop/page.tsx`
2. Page imports `ShopContent` client component with filters and product grid
3. `ShopContent` loads products from `src/lib/mock-data/products.ts`
4. Filtering/sorting happens client-side using helper functions
5. Product cards display with availability from `src/lib/mock-data/availability.ts`

**Checkout Flow:**

1. User adds product to cart → `CartContext` in `src/contexts/cart-context.tsx` handles action
2. Cart state persists to localStorage with rental timeline calculations
3. User proceeds to `/checkout` → Multi-step form (shipping → payment)
4. Form data collected via `react-hook-form` with `zod` validation
5. On submit → Order stored in sessionStorage → Redirect to `/checkout/success`
6. Cart cleared after successful order

**State Management:**
- Cart state: React Context + useReducer with localStorage persistence
- Form state: react-hook-form with controlled inputs
- Server state: Currently mock data (prepared for future Supabase integration)

## Key Abstractions

**Product:**
- Purpose: Represents rental inventory items
- Examples: `src/types/index.ts` (Product interface), `src/lib/mock-data/products.ts` (data)
- Pattern: Typed interfaces with strict category unions

**CartItem:**
- Purpose: Product with rental context (size, event date, timeline)
- Examples: `src/contexts/cart-context.tsx` (CartItem interface)
- Pattern: Enriched product with calculated rental dates

**Rental Timeline:**
- Purpose: Calculate shipping, event, and return dates based on RENTAL_CONFIG
- Examples: `src/lib/mock-data/availability.ts` (formatRentalTimeline function)
- Pattern: Pure functions with date-fns for date calculations

**Component Modules:**
- Purpose: Domain-specific UI component grouping
- Examples: `src/components/product/`, `src/components/checkout/`, `src/components/booking/`
- Pattern: Barrel exports via `index.ts` for clean imports

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every page request
- Responsibilities: HTML shell, global providers (CartProvider), persistent layout (Header, Footer), metadata configuration

**Home Page:**
- Location: `src/app/page.tsx`
- Triggers: Root route `/`
- Responsibilities: Landing page composition using home components (Hero, CategoriesGrid, FeaturedProducts, etc.)

**Shop Page:**
- Location: `src/app/shop/page.tsx` → `src/app/shop/shop-content.tsx`
- Triggers: `/shop` route with optional query params (category, search)
- Responsibilities: Product listing, filtering, sorting with Server/Client component split

**Product Detail Page:**
- Location: `src/app/shop/[id]/page.tsx`
- Triggers: `/shop/[productId]` dynamic route
- Responsibilities: Single product view, add to cart, static generation for all products

**Checkout Page:**
- Location: `src/app/checkout/page.tsx`
- Triggers: `/checkout` route
- Responsibilities: Multi-step checkout flow, form validation, order submission

## Error Handling

**Strategy:** Graceful degradation with user-friendly error boundaries

**Patterns:**
- Global error boundary: `src/app/error.tsx` catches component errors with retry option
- 404 handling: `src/app/not-found.tsx` for missing routes/products
- Form validation: Zod schemas with react-hook-form for client-side validation
- Cart hydration: Try-catch with fallback to empty cart on localStorage errors
- Availability checks: Validation before cart operations prevent invalid state

## Cross-Cutting Concerns

**Logging:** Console.error with context objects in try-catch blocks (e.g., cart operations)

**Validation:** Zod schemas in components, future API route validation prepared

**Authentication:** Placeholder for Supabase Auth (not yet implemented)

**Styling:** Tailwind CSS utility classes, responsive design with mobile-first breakpoints

**Performance:** Server Components by default, dynamic imports for client components, Next.js image optimization

**Accessibility:** Semantic HTML, lucide-react icons, keyboard navigation support

---

*Architecture analysis: 2026-01-27*
