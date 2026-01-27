# Coding Conventions

**Analysis Date:** 2026-01-27

## Naming Patterns

**Files:**
- Components: `kebab-case.tsx` (`product-card.tsx`, `cart-drawer.tsx`, `shipping-form.tsx`)
- Hooks: `use-*.ts` prefix (not yet implemented but documented in CLAUDE.md)
- Utils: `kebab-case.ts` (`utils.ts`)
- Types: `index.ts` for type definitions
- Pages: Next.js App Router conventions (`page.tsx`, `layout.tsx`, `error.tsx`, `not-found.tsx`)

**Functions:**
- camelCase for all functions (`createProduct`, `getProductById`, `formatRentalTimeline`)
- Hooks follow React convention: `use` prefix (`useCart`, `useContext`)
- Helper/utility functions: descriptive camelCase (`validatePostcode`, `handleChange`)

**Variables:**
- camelCase for regular variables (`formData`, `isScrolled`, `itemCount`)
- SCREAMING_SNAKE_CASE for constants (`RENTAL_CONFIG`, `AUSTRALIAN_STATES`, `STOCK_IMAGES`, `CART_STORAGE_KEY`)
- PascalCase for React components/types (`Product`, `CartItem`, `ShippingData`)

**Types:**
- PascalCase for interfaces (`Product`, `CartItem`, `ShippingAddress`)
- Union types for enums: `ProductCategory`, `BookingStatus`, `BondStatus`
- Props interfaces: ComponentName + `Props` suffix (`ProductCardProps`, `ButtonProps`, `ShippingFormProps`)

## Code Style

**Formatting:**
- Tool: None detected (no Prettier config)
- Manual consistency observed: 2-space indentation, single quotes for strings
- Line length: ~80-100 characters (not enforced)

**Linting:**
- Tool: ESLint
- Config: `.eslintrc.json` extends `["next/core-web-vitals", "next/typescript"]`
- Run: `npm run lint`
- Type check: `npm run type-check` (runs `tsc --noEmit`)

**TypeScript:**
- Strict mode: enabled (`tsconfig.json` has `"strict": true`)
- All components have explicit prop types
- No `any` types observed in codebase
- Type inference preferred over explicit types for simple cases
- `as const` used for immutable config objects (`RENTAL_CONFIG`)

## Import Organization

**Order:**
1. External dependencies (React, Next.js, third-party)
2. Internal components (from `@/components`)
3. Internal utilities/hooks (from `@/lib`, `@/hooks`)
4. Types (from `@/types`)
5. Relative imports

**Example from `cart-drawer.tsx`:**
```typescript
import { useEffect } from 'react';                    // React
import Link from 'next/link';                         // Next.js
import { X, ShoppingBag, ArrowRight } from 'lucide-react';  // Third-party
import { useCart } from '@/contexts/cart-context';    // Context
import { CartItem } from './cart-item';               // Local component
import { Button } from '@/components/ui';             // UI component
import { RENTAL_CONFIG } from '@/types';              // Types
import { cn } from '@/lib/utils';                     // Utils
```

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- All absolute imports use `@/` prefix
- Relative imports only for same-directory files (`./cart-item`)

## Error Handling

**Patterns:**
- Try-catch blocks for localStorage operations with fallback
- Console.error for logging (not production-ready logging system)
- User-facing errors shown via form validation
- Error boundaries via Next.js `error.tsx` convention

**Example from `cart-context.tsx`:**
```typescript
try {
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  if (stored) {
    const items = JSON.parse(stored) as CartItem[];
    dispatch({ type: 'HYDRATE', payload: validItems });
  }
} catch (error) {
  console.error('Failed to hydrate cart:', error);
}
```

**Validation:**
- Inline validation in forms (shipping form validates postcode: 200-9999, 4 digits)
- Regex for email validation: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Zod mentioned in dependencies but not yet implemented in codebase

## Logging

**Framework:** Console API (browser native)

**Patterns:**
- `console.error` for errors with context
- Format: `'[Component/Context]', { key: value }` or `'Description:', error`
- Examples:
  - `console.error('Application error:', error);` in `error.tsx`
  - `console.error('Failed to hydrate cart:', error);` in `cart-context.tsx`
  - `console.error('Failed to persist cart:', error);` in `cart-context.tsx`

**When to Log:**
- localStorage failures (hydration/persistence)
- Application-level errors (error boundaries)
- No debug/info logging observed

## Comments

**When to Comment:**
- Section headers in files (`// Cart Item interface`, `// Cart Actions`)
- Complex business logic (not yet observed in simple components)
- JSDoc for component props (not yet implemented)

**Style:**
- Inline comments: `// Description`
- Section dividers: Multi-line comments with headers in types file

**JSDoc/TSDoc:**
- Used sparingly
- Found in `utils.ts`:
```typescript
/**
 * Utility function for conditionally joining Tailwind classes.
 * Combines clsx for conditional classes with tailwind-merge for conflict resolution.
 */
```

## Function Design

**Size:**
- Small, focused functions preferred
- Component functions: 20-100 lines
- Utility functions: 5-20 lines
- Form handlers inline in components

**Parameters:**
- Explicit interface types for props
- Destructuring used in component signatures
- Optional parameters marked with `?`

**Example:**
```typescript
interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Implementation
}
```

**Return Values:**
- React components return JSX
- Utility functions return explicit types
- Array methods (filter, map) return inferred types
- Async functions not yet implemented (no API calls)

## Module Design

**Exports:**
- Named exports only for components (per CLAUDE.md rules)
- `export function ComponentName` pattern
- `export const` for constants and utilities
- `export interface` for types
- `export type` for union types

**Barrel Files:**
- Used extensively via `index.ts` files
- Located in component subdirectories:
  - `src/components/ui/index.ts`
  - `src/components/product/index.ts`
  - `src/components/booking/index.ts`
  - `src/components/cart/index.ts`
  - `src/components/checkout/index.ts`
  - `src/components/home/index.ts`
  - `src/components/layout/index.ts`
  - `src/contexts/index.ts`
  - `src/types/index.ts`

**Pattern:**
```typescript
// Import from barrel
import { Button, Input, Card } from '@/components/ui';
import { Hero, Newsletter } from '@/components/home';
```

## React Patterns

**Component Types:**
- Function components exclusively
- `forwardRef` used for UI primitives (`Button`, `Skeleton`)
- `'use client'` directive for client components (cart, forms, interactive elements)
- Server components by default (pages, static content)

**State Management:**
- `useState` for local component state
- `useReducer` for complex state (cart context)
- React Context for global state (`CartProvider`)
- No external state management (Redux, Zustand)

**Hooks:**
- `useEffect` for side effects (scroll listeners, localStorage sync)
- `useContext` wrapped in custom hooks (`useCart`)
- Custom hook pattern: throw error if used outside provider

**Example:**
```typescript
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
```

## Styling Patterns

**Tailwind:**
- Utility-first approach
- `cn()` helper for conditional classes (uses `clsx` + `tailwind-merge`)
- Brand colors via custom theme (teal, gold, cream palettes)
- Responsive: mobile-first with `md:` and `lg:` breakpoints

**Common Patterns:**
```typescript
// Button variant pattern
const variants = {
  primary: 'bg-teal-600 text-white hover:bg-teal-700',
  secondary: 'bg-gold-600 text-white hover:bg-gold-700',
  ghost: 'bg-transparent text-teal-700 hover:bg-teal-50',
};

// Conditional classes
className={cn(
  'fixed top-0 left-0 right-0 z-50 transition-all',
  isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
)}
```

**Spacing:**
- Consistent scale: `p-4`, `md:p-6`, `lg:p-8`
- Gap utilities: `gap-2`, `gap-4`, `gap-8`
- No arbitrary values observed

## Configuration Constants

**Immutable Business Rules:**
- Defined in `src/types/index.ts` as `RENTAL_CONFIG`
- Exported with `as const` for type safety
- Never modified, only referenced

**Pattern:**
```typescript
export const RENTAL_CONFIG = {
  RENTAL_PERIOD_DAYS: 7,
  DELIVERY_BUFFER_DAYS: 3,
  CLEANING_BUFFER_DAYS: 3,
  BOND_AMOUNT_AUD: 100,
  SHIPPING_COST_AUD: 0,
  LATE_RETURN_FEE_AUD: 50,
  LATE_RETURN_GRACE_DAYS: 3,
} as const;
```

---

*Convention analysis: 2026-01-27*
