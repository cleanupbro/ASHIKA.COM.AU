# Coding Conventions

**Analysis Date:** 2026-01-24

## Naming Patterns

**Files:**
- Components: kebab-case (e.g., `product-card.tsx`, `shipping-form.tsx`)
- Utilities: kebab-case (e.g., `utils.ts`)
- Contexts: kebab-case with `-context` suffix (e.g., `cart-context.tsx`)
- Types: `index.ts` for shared types (e.g., `src/types/index.ts`)
- Pages: directory-based routing with `page.tsx` (e.g., `src/app/shop/page.tsx`)

**Functions:**
- camelCase for all function names
- Event handlers: prefix with `handle` (e.g., `handleSubmit`, `handleChange`, `handleBackToShipping`)
- Custom hooks: prefix with `use` (not currently used but documented in CLAUDE.md)
- Computed values: no prefix, plain camelCase (e.g., `itemCount`, `subtotal`, `bondTotal`)

**Variables:**
- camelCase for local variables and state
- State objects: camelCase (e.g., `formData`, `shippingData`, `errors`)
- Constants: UPPER_SNAKE_CASE (e.g., `RENTAL_CONFIG`, `CART_STORAGE_KEY`, `AUSTRALIAN_STATES`)
- Boolean variables: prefix with `is` or `has` (e.g., `isLoading`, `isOpen`, `hasError`)

**Types:**
- Interfaces: PascalCase (e.g., `ProductCardProps`, `CartItem`, `ShippingData`)
- Type unions: PascalCase (e.g., `ProductCategory`, `BookingStatus`, `BondStatus`)
- Generic type parameters: single uppercase letter or PascalCase (e.g., `T`, `TProps`)

## Code Style

**Formatting:**
- ESLint: `next/core-web-vitals` and `next/typescript`
- No explicit prettier config; Next.js defaults apply
- 2-space indentation (standard TypeScript/JavaScript)
- Single quotes in strings (not enforced via config, but observed in codebase)

**Linting:**
- Run via: `npm run lint` (Next.js ESLint)
- Type checking via: `npm run type-check` (TypeScript compiler)
- ESLint rule: `@typescript-eslint/no-unused-vars` enforced (seen as `// eslint-disable-next-line` comments when unavoidable)

**Semicolons:**
- Always included (not optional)
- Automatic with Next.js tooling

## Import Organization

**Order:**
1. React and Next.js core imports (from 'react', 'next/...')
2. Third-party library imports (date-fns, zod, lucide-react, clsx, tailwind-merge)
3. Local imports (from '@/...')

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- Used consistently throughout codebase
- Standard format: `import { Component } from '@/components/...'`

**Examples:**
```typescript
// ✅ Correct order
import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Truck } from 'lucide-react';
import { Input, Select, Button } from '@/components/ui';
import { Container } from '@/components/layout';
```

## Error Handling

**Patterns:**
- Try-catch blocks in contexts and error-prone operations
- Contextual error logging: `console.error('Failed to persist cart:', error)`
- Custom error messages for context initialization failures
- Error context validation: `if (!context) throw new Error('...')`

**Examples from codebase:**
```typescript
// Cart hydration with fallback
try {
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  if (stored) {
    const items = JSON.parse(stored) as CartItem[];
    const validItems = items.filter(
      (item) => new Date(item.eventDate) > new Date()
    );
    dispatch({ type: 'HYDRATE', payload: validItems });
  }
} catch (error) {
  console.error('Failed to hydrate cart:', error);
}

// Context hook validation
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
```

## Logging

**Framework:** Native `console.error()` and `console.log()` (no dedicated logging library)

**Patterns:**
- Use `console.error()` for failures and exceptions
- Include context in error messages (e.g., 'Failed to hydrate cart:')
- Log error objects directly for stack traces
- Application-level errors logged in error boundary (`src/app/error.tsx`)

**Examples:**
```typescript
console.error('Application error:', error);
console.error('Failed to persist cart:', error);
```

## Comments

**When to Comment:**
- File-level documentation: header comment with ASHIKA branding (seen in `src/types/index.ts`)
- Complex logic: explain "why" not "what"
- Section breaks: comment dividers for logical grouping (e.g., `// ----- Product Categories -----`)
- TODO for incomplete features (rare; one found in `product-reviews.tsx`)

**JSDoc/TSDoc:**
- Not required but present in utility functions
- Used for documenting exported utility functions
- Example: `cn()` utility has JSDoc comment explaining purpose

**Examples from codebase:**
```typescript
// ==========================================
// ASHIKA — Shared Type Definitions
// ==========================================

// ----- Product Categories -----
export type ProductCategory = '...';

/**
 * Utility function for conditionally joining Tailwind classes.
 * Combines clsx for conditional classes with tailwind-merge for conflict resolution.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// TODO: In production, fetch reviews from Supabase filtered by props.productId
```

## Function Design

**Size:**
- Most functions under 50 lines
- Larger components (pages) can exceed this; split into subcomponents when possible
- Examples: `CartProvider` (79 lines), `CheckoutPage` (225 lines in app file)

**Parameters:**
- Use object destructuring for multiple props (all components follow this)
- Explicit type annotations for all parameters
- Default values provided in function signature when appropriate

**Return Values:**
- Explicit return types annotated (TypeScript strict mode)
- React components return JSX.Element (inferred)
- Functions return typed values (Product, CartItem, boolean, etc.)

**Examples:**
```typescript
// ✅ Standard component pattern
interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div>...</div>
  );
}

// ✅ Function with default parameters
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    // ...
  }
);

// ✅ Form handler with explicit typing
const handleSubmit = (data: ShippingData) => {
  setShippingData(data);
  setStep('payment');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
```

## Module Design

**Exports:**
- Named exports only for components (no default exports)
- Single export per component file (one component per file)
- Barrel files used for grouping (e.g., `src/components/ui/index.ts`, `src/contexts/index.ts`)

**Barrel Files:**
```typescript
// src/components/ui/index.ts
export { Button, type ButtonProps } from './button';
export { Input, Textarea, Select, type InputProps } from './input';
export { Badge, type BadgeProps } from './badge';
```

**Type Exports:**
- Types exported alongside implementations
- Interface definitions placed above implementations in files
- Props interfaces named with `Props` suffix (e.g., `ProductCardProps`, `ShippingFormProps`)

**Circular Dependency Avoidance:**
- Types in `src/types/index.ts` (single source of truth)
- Contexts import from types, not vice versa
- Components import from both types and components

## React Patterns

**Hooks:**
- `useState` for local component state
- `useReducer` for complex state (cart management)
- `useContext` for accessing providers
- `useEffect` for side effects (localStorage sync, error logging)
- `forwardRef` for wrapping HTML elements (UI components)

**Context:**
- Defined as interface extending base state
- Provider component wraps children with context value
- Custom hook enforces provider requirement with error check
- Example: `CartProvider` provides `useCart()` hook

**Component Composition:**
- Functional components only
- Props interfaces for all components
- Extract business logic to contexts/utilities
- UI components accept standard HTML attributes and extend them

## TypeScript Patterns

**Strict Mode:** Enabled (tsconfig.json: `"strict": true`)

**Type Inference:**
- Used where types are obvious (simple assignments)
- Explicit annotations for function parameters and returns
- `as const` for immutable constants (RENTAL_CONFIG)

**Generic Types:**
- Used in React components (forwardRef)
- Used in utility functions (cn function with ClassValue)
- Not overused; minimal generics in codebase

**Discriminated Unions:**
- Used for cart actions (discriminated by `type` field)
- Example: CartAction type with `type` as discriminator

**Examples:**
```typescript
// ✅ Strict typing
interface CartItem {
  id: string;
  product: Product;
  size: string;
  eventDate: string;
  rentalTimeline: {
    shipBy: string;
    eventDate: string;
    returnBy: string;
  };
  addedAt: string;
}

// ✅ Discriminated union
type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; size: string; eventDate: Date } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'CLEAR_CART' };

// ✅ as const for immutable config
export const RENTAL_CONFIG = {
  RENTAL_PERIOD_DAYS: 7,
  DELIVERY_BUFFER_DAYS: 3,
  // ...
} as const;
```

## Tailwind CSS Patterns

**Brand Colors:**
- Primary: teal (teal-600 for default, teal-700 for hover)
- Secondary: gold (gold-600 for default, gold-700 for hover)
- Accent: cream (FEF3C7)
- Configured in `tailwind.config.ts`

**Responsive Design:**
- Mobile-first approach
- Breakpoints: `md:` (768px), `lg:` (1024px)
- Example: `text-2xl md:text-3xl` for scaling typography

**Common Patterns:**
```typescript
// ✅ Base styling with responsive
<div className="p-4 md:p-6 lg:p-8">

// ✅ Interactive states
<button className="bg-teal-600 hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 disabled:opacity-50">

// ✅ Utility function for conditional classes
const buttonClasses = cn(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all',
  variants[variant],
  sizes[size],
  className
);
```

**Class Utility:**
- `cn()` from `@/lib/utils` combines clsx and tailwind-merge
- Used throughout for conditional class merging
- Prevents Tailwind class conflicts

## Next.js Specific

**App Router:**
- All routes use directory-based routing (`src/app/`)
- Page components exported as `default` or `export default` (no named exports for pages)
- Metadata exported from page files (see `src/app/layout.tsx`, privacy/page.tsx)

**Server vs Client:**
- `'use client'` directive at top for interactive components
- Server components default (pages, layouts)
- Contexts are client components (marked with `'use client'`)

**Image Optimization:**
- `next/image` used for Product images
- `Image` component with proper `fill`, `sizes`, and responsive props
- Example: `sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"`

**Link Navigation:**
- `next/link` for internal navigation
- Lazy loaded slugs using `[id]` dynamic routes
- Examples: `/shop/[id]/page.tsx`, `/checkout/success/page.tsx`

## Code Organization

**Single Responsibility:**
- Each component/function has one clear purpose
- UI components separate from business logic
- Contexts handle state management, not components

**File Colocations:**
- Related components grouped in feature directories
  - `src/components/product/` - Product-related components
  - `src/components/checkout/` - Checkout flow components
  - `src/components/cart/` - Cart components
  - `src/components/ui/` - Base UI components

**Library Dependencies:**
- React Hook Form (not used yet, listed in package.json)
- lucide-react for icons
- date-fns for date manipulation
- zod for validation (configured in CLAUDE.md, not yet used in frontend)
- clsx + tailwind-merge for conditional styling

---

*Convention analysis: 2026-01-24*
