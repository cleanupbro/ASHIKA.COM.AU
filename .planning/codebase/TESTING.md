# Testing Patterns

**Analysis Date:** 2026-01-24

## Test Framework Status

**Current State:** No automated test framework configured

**Build & Type Safety:**
- Build test: `npm run build` (validates Next.js compilation)
- Type checking: `npm run type-check` (runs TypeScript compiler with `--noEmit`)
- Linting: `npm run lint` (Next.js ESLint configuration)

**Run Commands:**
```bash
npm run build              # Builds Next.js application (must pass)
npm run type-check         # Validates TypeScript compilation
npm run lint               # Runs ESLint checks
npm run dev                # Starts development server for manual testing
```

## Test Planning

**Recommended Framework (Not Yet Implemented):**
- Framework: Vitest (lightweight, ESM-native, fast)
- Test Runner: Vitest
- Assertion Library: Vitest's built-in assertions (or Chai)
- Coverage Tool: Vitest coverage

**Next Steps for Testing Implementation:**
1. Install Vitest and testing utilities: `npm install -D vitest @testing-library/react @testing-library/jest-dom @vitest/ui`
2. Create `vitest.config.ts` configuration
3. Add test scripts to package.json: `"test": "vitest"`, `"test:ui": "vitest --ui"`
4. Begin with unit tests for utilities and contexts
5. Add component tests for critical UI elements

## Test File Organization

**Current Structure:**
- No test files present in codebase
- When tests are added, follow co-located pattern

**Recommended Location:**
- **Utilities:** `src/lib/utils.test.ts` (alongside `src/lib/utils.ts`)
- **Contexts:** `src/contexts/cart-context.test.tsx` (alongside `src/contexts/cart-context.tsx`)
- **Components:** `src/components/product/product-card.test.tsx` (alongside `src/components/product/product-card.tsx`)
- **Hooks:** `src/hooks/use-*.test.ts` (alongside hook files)

**Naming Convention:**
- Test files: `[filename].test.ts` or `[filename].test.tsx`
- Or: `[filename].spec.ts` or `[filename].spec.tsx`
- Prefer `.test.ts` for consistency

## Manual Testing Checklist

### Before Marking Any Feature Complete

1. **Build Validation**
   ```bash
   npm run build
   npm run type-check
   npm run lint
   ```
   All must pass with no errors.

2. **Development Server Test**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

3. **Happy Path Testing**
   - [ ] Navigate through feature as primary user
   - [ ] All interactions produce expected results
   - [ ] No console errors
   - [ ] No TypeScript errors

4. **Responsive Design (Critical)**
   - [ ] Mobile (375px): Single column, touch-friendly
   - [ ] Tablet (768px): Two columns where applicable
   - [ ] Desktop (1920px): Full layout
   - [ ] All images load correctly
   - [ ] All buttons/links clickable
   - [ ] Text readable at all sizes

5. **Edge Cases (Feature-Specific)**
   - See feature-specific test cases below

6. **Accessibility Baseline**
   - [ ] Keyboard navigation works
   - [ ] Color contrast sufficient
   - [ ] Form labels associated with inputs
   - [ ] Icons have alt text/aria-labels

## Feature-Specific Test Cases

### Cart Context (`src/contexts/cart-context.tsx`)

**Manual Test Cases:**
1. **Add Item to Cart**
   - [ ] Click "Add to Cart" with product + size + date
   - [ ] Cart opens automatically
   - [ ] Item appears in cart
   - [ ] Subtotal and bond total update
   - [ ] Item count badge updates

2. **Remove Item**
   - [ ] Click remove icon on cart item
   - [ ] Item disappears
   - [ ] Cart totals recalculate
   - [ ] Item count decreases

3. **Clear Cart**
   - [ ] Click "Clear Cart"
   - [ ] All items removed
   - [ ] Cart shows empty state
   - [ ] Page redirects or shows empty message

4. **Cart Persistence**
   - [ ] Add items to cart
   - [ ] Refresh page
   - [ ] Items still in cart
   - [ ] Expired items (past event date) filtered out

5. **localStorage Failure**
   - [ ] Disable localStorage in DevTools
   - [ ] Add item to cart
   - [ ] Check console for error handling
   - [ ] App doesn't crash (error caught and logged)

### Shipping Form (`src/components/checkout/shipping-form.tsx`)

**Manual Test Cases:**
1. **Required Field Validation**
   - [ ] Submit empty form
   - [ ] Error messages appear for: firstName, lastName, email, phone, address, suburb, state, postcode
   - [ ] Errors clear when user types

2. **Email Validation**
   - [ ] Enter invalid email (no @)
   - [ ] Error: "Please enter a valid email address"
   - [ ] Enter valid email
   - [ ] Error clears

3. **Postcode Validation**
   - [ ] Enter invalid postcode (letters, <4 digits, >9999, <200)
   - [ ] Error: "Please enter a valid Australian postcode"
   - [ ] Enter valid postcode (2000, 3141, 4000, etc.)
   - [ ] Error clears

4. **Form Submission**
   - [ ] Fill all fields correctly
   - [ ] Submit button clickable
   - [ ] Form data passed to onSubmit callback
   - [ ] Step changes to payment

5. **State Preservation**
   - [ ] Fill form partially
   - [ ] Navigate away and back
   - [ ] Data persists (if stored in parent state)

### Payment Form (`src/components/checkout/payment-form.tsx`)

**Manual Test Cases:**
1. **Card Number Formatting**
   - [ ] Type: "4111111111111111"
   - [ ] Displayed as: "4111 1111 1111 1111"
   - [ ] Only digits accepted
   - [ ] Max 16 digits enforced

2. **Expiry Date Formatting**
   - [ ] Type: "1225"
   - [ ] Displayed as: "12/25"
   - [ ] Slash added automatically after 2 digits
   - [ ] Only digits accepted

3. **CVC Formatting**
   - [ ] Type: "12345"
   - [ ] Displayed as: "1234" (truncated to 4)
   - [ ] Only digits accepted

4. **Payment Validation**
   - [ ] Card number < 13 digits: Error shown
   - [ ] Invalid expiry format: Error shown
   - [ ] Invalid CVC: Error shown
   - [ ] Missing cardholder name: Error shown

5. **Form Submission**
   - [ ] All fields valid
   - [ ] Submit button shows loading state
   - [ ] onSubmit callback fires
   - [ ] Loading state clears

### Product Card (`src/components/product/product-card.tsx`)

**Manual Test Cases:**
1. **Image Display**
   - [ ] Product thumbnail loads
   - [ ] Image ratio maintained (aspect-[3/4])
   - [ ] Hover effect: image scales smoothly

2. **Quick View Hover**
   - [ ] Hover over card
   - [ ] "Quick View" button appears with animation
   - [ ] Click navigates to product detail

3. **Price Display**
   - [ ] Rental price shown (teal, bold)
   - [ ] "/week" text visible
   - [ ] Retail price shown as strikethrough (lower value)

4. **Tier Badge**
   - [ ] Premium items show "premium" badge
   - [ ] Lite items show "lite" badge
   - [ ] Badge positioning correct

5. **Size Availability**
   - [ ] First 4 sizes displayed
   - [ ] Available sizes: teal background
   - [ ] Unavailable sizes: gray background
   - [ ] "+N more" text shown if > 4 sizes

### Checkout Page Flow

**Manual Test Cases:**
1. **Empty Cart Redirect**
   - [ ] Navigate to /checkout with empty cart
   - [ ] Redirect to /shop or show empty state
   - [ ] "Browse Collection" link visible and clickable

2. **Shipping Step**
   - [ ] All form fields render
   - [ ] Submit fills form data
   - [ ] Step changes to "payment"
   - [ ] Scroll to top on step change

3. **Payment Step**
   - [ ] "Back to Shipping" button works
   - [ ] Payment form renders
   - [ ] Submit with valid data shows loading
   - [ ] Simulated delay (2 seconds) before success

4. **Order Confirmation**
   - [ ] Redirects to /checkout/success
   - [ ] Order number generated (ASH-*)
   - [ ] Order data stored in sessionStorage
   - [ ] Cart cleared

5. **Order Summary**
   - [ ] Items listed with prices
   - [ ] Shipping data displayed
   - [ ] Subtotal calculated correctly
   - [ ] Bond total calculated (items × $100)

## Accessibility Testing

**Screen Reader (Manual):**
- [ ] Form labels read correctly
- [ ] Error messages announced
- [ ] Button purposes clear
- [ ] Navigation structure logical

**Keyboard Navigation (Manual):**
- [ ] Tab through all interactive elements
- [ ] Focus visible on all elements
- [ ] Enter/Space activate buttons
- [ ] Form submission via keyboard

**Color Contrast:**
- Use DevTools Lighthouse accessibility audit
- All text must meet WCAG AA standards (4.5:1 for normal text)
- Primary color (teal-600): sufficient contrast with white text

## Performance Testing

**Lighthouse (Manual):**
1. Open page in Chrome
2. DevTools → Lighthouse
3. Run audit (Performance, Accessibility, Best Practices, SEO)
4. Target scores:
   - Performance: > 80
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 90

**Bundle Size:**
- Monitor via: `npm run build` output
- Aim to keep main bundle under 200KB gzipped

## Automated Testing Examples (When Implemented)

### Cart Context Unit Test Pattern

```typescript
// src/contexts/cart-context.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CartProvider, useCart } from '@/contexts/cart-context';
import { Product } from '@/types';

describe('CartContext', () => {
  it('should add item to cart', () => {
    const TestComponent = () => {
      const { addItem, state } = useCart();
      return (
        <div>
          <button onClick={() => addItem(mockProduct, 'M', new Date())}>
            Add
          </button>
          <div>{state.items.length}</div>
        </div>
      );
    };

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByRole('button', { name: /Add/i });
    addButton.click();

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should remove item from cart', () => {
    // Test implementation
  });

  it('should persist to localStorage', () => {
    // Test localStorage sync
  });
});
```

### Form Validation Unit Test Pattern

```typescript
// src/components/checkout/shipping-form.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShippingForm } from '@/components/checkout/shipping-form';

describe('ShippingForm', () => {
  it('should validate required fields', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    render(<ShippingForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    expect(screen.getByText(/First name is required/)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should validate postcode format', async () => {
    const user = userEvent.setup();
    render(<ShippingForm onSubmit={vi.fn()} />);

    const postcodeInput = screen.getByDisplayValue(/postcode/i);
    await user.type(postcodeInput, '123');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    expect(
      screen.getByText(/Please enter a valid Australian postcode/)
    ).toBeInTheDocument();
  });
});
```

### Utility Function Test Pattern

```typescript
// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('should merge class names', () => {
    const result = cn('px-2', 'px-4'); // px-4 should win
    expect(result).toContain('px-4');
    expect(result).not.toContain('px-2');
  });

  it('should handle conditional classes', () => {
    const result = cn('base', true && 'active', false && 'disabled');
    expect(result).toContain('base');
    expect(result).toContain('active');
    expect(result).not.toContain('disabled');
  });
});
```

## Mocking Strategy

**What to Mock:**
- Supabase client calls (when API integration added)
- Stripe API calls (payment processing)
- Australia Post API (shipping labels)
- External API endpoints

**What NOT to Mock:**
- React hooks (useState, useContext, useReducer)
- Component renders
- User interactions (use userEvent instead of fireEvent)
- Browser APIs that are already stable (localStorage in tests can use in-memory alternative)

**Mocking Example:**
```typescript
import { vi } from 'vitest';

const mockSupabase = {
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockResolvedValue({
      data: [{ id: '1', name: 'Test Product' }],
      error: null,
    }),
  }),
};

vi.mock('@/lib/supabase/client', () => ({
  default: mockSupabase,
}));
```

## Test Coverage Goals (When Tests Implemented)

**Target Coverage:**
- Statements: 70%+
- Branches: 65%+
- Functions: 70%+
- Lines: 70%+

**Critical Paths (Priority):**
- Cart context reducer (100% coverage)
- Form validation (100% coverage)
- Availability calculation (100% coverage)
- Booking logic (100% coverage)
- Payment processing (100% coverage)

**View Coverage:**
```bash
npm run test:coverage
```

## Current Testing Reality

**What Works:**
- TypeScript compilation checks (strict mode enabled)
- ESLint rules enforcement
- Next.js build validation
- Manual testing via dev server

**What's Missing:**
- Unit tests for contexts
- Component integration tests
- Form validation tests
- API mock tests
- Visual regression tests
- End-to-end tests

**When to Implement:**
1. After core features are stable
2. Before adding payment integration (critical path)
3. Before shipping integration
4. Before going live

---

*Testing analysis: 2026-01-24*
