# Testing Patterns

**Analysis Date:** 2026-01-27

## Test Framework

**Runner:**
- None currently configured
- No test files found in codebase
- No test framework dependencies in `package.json`

**Assertion Library:**
- Not applicable (no tests)

**Run Commands:**
```bash
# Not available - testing not yet implemented
```

**Recommendation:**
Based on stack (Next.js 14, TypeScript, React 18), suggested setup:
- Jest + React Testing Library (most common)
- Vitest (faster, modern alternative)
- Playwright (E2E testing)

## Test File Organization

**Location:**
- Not applicable (no tests exist)

**Naming:**
- No convention established

**Structure:**
```
# Recommended structure based on project layout:
src/
├── components/
│   ├── product/
│   │   ├── product-card.tsx
│   │   └── product-card.test.tsx    # Co-located pattern
│   └── cart/
│       ├── cart-drawer.tsx
│       └── cart-drawer.test.tsx
├── lib/
│   ├── utils.ts
│   └── utils.test.ts
└── __tests__/                       # Alternative: centralized tests
    ├── components/
    └── integration/
```

## Test Structure

**Suite Organization:**
- No established pattern

**Recommended Pattern (based on project conventions):**
```typescript
import { render, screen } from '@testing-library/react';
import { ProductCard } from './product-card';
import { mockProduct } from '@/lib/mock-data/products';

describe('ProductCard', () => {
  it('renders product name and price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.rental_price}`)).toBeInTheDocument();
  });

  it('displays tier badge', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(mockProduct.tier)).toBeInTheDocument();
  });
});
```

**Patterns to Follow:**
- Descriptive test names using natural language
- Arrange-Act-Assert pattern
- One assertion per test (or related assertions)

## Mocking

**Framework:**
- Not applicable (no tests)

**Recommended Patterns:**
```typescript
// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock cart context
jest.mock('@/contexts/cart-context', () => ({
  useCart: () => ({
    state: { items: [], isOpen: false },
    addItem: jest.fn(),
    removeItem: jest.fn(),
    itemCount: 0,
    subtotal: 0,
  }),
}));
```

**What to Mock:**
- Next.js routing (`useRouter`, `useSearchParams`)
- React Context (`CartProvider`)
- localStorage (window.localStorage)
- External APIs (when implemented: Stripe, Supabase, AusPost)
- date-fns functions for consistent date testing

**What NOT to Mock:**
- Pure utility functions (`cn()` from `@/lib/utils`)
- Type definitions
- Constants (`RENTAL_CONFIG`)
- Simple React components (test real implementation)

## Fixtures and Factories

**Test Data:**
- Mock data already exists in `src/lib/mock-data/products.ts`
- Mock data in `src/lib/mock-data/availability.ts`

**Existing Mock Patterns:**
```typescript
// Use existing mock factory
import { products, getProductById } from '@/lib/mock-data/products';

// Example fixture
const mockProduct: Product = products[0];

// Create custom test data
const testProduct = createProduct(
  '999',
  'Test Product',
  'saree',
  100,
  500,
  0,
  { featured: true }
);
```

**Location:**
- `src/lib/mock-data/` - Mock data for development and testing
- Reuse existing mock factories for consistent test data

**Pattern to Adopt:**
```typescript
// src/lib/test-utils/fixtures.ts (to be created)
export const mockCartItem = (overrides?: Partial<CartItem>): CartItem => ({
  id: '1-S-2026-02-01',
  product: products[0],
  size: 'S',
  eventDate: '2026-02-01',
  rentalTimeline: {
    shipBy: '2026-01-29',
    eventDate: '2026-02-01',
    returnBy: '2026-02-04',
  },
  addedAt: '2026-01-27',
  ...overrides,
});
```

## Coverage

**Requirements:**
- None currently enforced

**View Coverage:**
```bash
# Not configured yet
# Recommended: npm run test:coverage
```

**Recommended Targets:**
- 80% line coverage for utilities
- 70% coverage for components
- 90% coverage for business logic (rental calculations, availability checks)
- Focus on critical paths over 100% coverage

## Test Types

**Unit Tests:**
- Not implemented

**Scope and Approach:**
- Component rendering and props
- Utility functions (`cn()`, validation functions)
- Date calculations (`formatRentalTimeline`, availability checks)
- Cart reducer logic

**Example Priority:**
```typescript
// HIGH PRIORITY - Business logic
- Rental date calculations (RENTAL_CONFIG)
- Availability checking logic
- Postcode validation (validatePostcode)
- Cart reducer actions

// MEDIUM PRIORITY - Component logic
- Button variants and loading states
- Form validation (ShippingForm)
- Cart item calculations (subtotal, bondTotal)

// LOW PRIORITY - Presentational
- Static components (Hero, Footer)
- Simple wrappers (Container)
```

**Integration Tests:**
- Not implemented

**Scope and Approach:**
- User workflows (add to cart → checkout)
- Context providers with components
- Form submission flows
- Multi-component interactions

**E2E Tests:**
- Framework: Not used

**Recommendation:**
- Playwright for critical user journeys
- Test paths:
  1. Browse → Product Detail → Add to Cart → Checkout
  2. Cart management (add, remove, persist)
  3. Form validation (shipping details, postcode)
  4. Mobile navigation

## Common Patterns

**Async Testing:**
```typescript
// Pattern for future API integration
it('loads products from API', async () => {
  const { findByText } = render(<ProductGrid />);
  expect(await findByText('Royal Blue Banarasi')).toBeInTheDocument();
});

// localStorage async behavior
it('persists cart to localStorage', async () => {
  const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
  act(() => {
    result.current.addItem(mockProduct, 'M', new Date('2026-02-01'));
  });
  await waitFor(() => {
    expect(localStorage.getItem('ashika_cart')).toBeTruthy();
  });
});
```

**Error Testing:**
```typescript
// Test error boundaries
it('displays error UI when component throws', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});

// Test validation errors
it('shows error when postcode is invalid', () => {
  render(<ShippingForm onSubmit={jest.fn()} />);
  const postcodeInput = screen.getByLabelText(/postcode/i);
  fireEvent.change(postcodeInput, { target: { value: '123' } });
  fireEvent.blur(postcodeInput);
  expect(screen.getByText(/valid Australian postcode/i)).toBeInTheDocument();
});
```

**Context Testing:**
```typescript
// Test cart context provider
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '@/contexts/cart-context';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

it('adds item to cart', () => {
  const { result } = renderHook(() => useCart(), { wrapper });

  act(() => {
    result.current.addItem(mockProduct, 'M', new Date('2026-02-01'));
  });

  expect(result.current.itemCount).toBe(1);
  expect(result.current.subtotal).toBe(mockProduct.rental_price);
});
```

**Date Testing:**
```typescript
// Mock current date for consistent tests
beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-01-27'));
});

afterAll(() => {
  jest.useRealTimers();
});

it('calculates rental timeline correctly', () => {
  const eventDate = new Date('2026-02-15');
  const timeline = formatRentalTimeline(eventDate);

  expect(timeline.shipBy).toEqual(new Date('2026-02-12'));
  expect(timeline.returnBy).toEqual(new Date('2026-02-18'));
});
```

## Testing Priorities

**Phase 1 - Critical Business Logic:**
1. RENTAL_CONFIG calculations (ship dates, return dates, cleaning buffer)
2. Availability checking algorithm
3. Cart reducer (add, remove, persist, hydrate)
4. Postcode validation

**Phase 2 - User Interactions:**
1. ShippingForm validation
2. Cart drawer (open/close, item display)
3. Product filtering and sorting
4. Mobile navigation

**Phase 3 - Integration:**
1. Add to cart → view cart → checkout flow
2. Context providers with components
3. localStorage persistence

**Phase 4 - E2E:**
1. Complete rental booking flow
2. Form validation edge cases
3. Responsive design testing

## Test Setup Recommendations

**Install Dependencies:**
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event @testing-library/react-hooks
npm install -D jest-environment-jsdom
npm install -D @types/jest
```

**Jest Config (`jest.config.js`):**
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

**Jest Setup (`jest.setup.js`):**
```javascript
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;
```

---

*Testing analysis: 2026-01-27*
