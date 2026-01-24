# Codebase Concerns

**Analysis Date:** 2026-01-24

## Tech Debt

**Mock Data in Production Path:**
- Issue: Entire rental availability and product catalog is hardcoded mock data. The system uses mock blocks, mock products, and mock reviews throughout the user journey.
- Files: `src/lib/mock-data/products.ts`, `src/lib/mock-data/availability.ts`, `src/components/product/product-reviews.tsx`
- Impact: Cannot serve real products or handle real bookings. Payment processing is simulated (2-second delay). No real inventory management possible.
- Fix approach: Implement Supabase integration layer (`src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`) to fetch products, availability blocks, and reviews from database. Create API routes for real booking creation.

**Missing Payment Integration:**
- Issue: Payment form collects card details but passes them to a mock handler that simply waits 2 seconds. No actual Stripe payment processing occurs.
- Files: `src/components/checkout/payment-form.tsx`, `src/app/checkout/page.tsx` (line 58-85)
- Impact: No transactions are processed. Bond pre-authorization is not implemented. No payment intent creation or capture logic.
- Fix approach: Implement Stripe PaymentIntent creation in `src/app/api/payments/route.ts`. Use `@stripe/stripe-js` and `stripe` SDK. Handle card tokenization securely without client-side card data handling.

**No Real Authentication:**
- Issue: No user authentication system is implemented. Cart is stored in localStorage using a hardcoded key, not tied to user accounts.
- Files: `src/contexts/cart-context.tsx` (uses `CART_STORAGE_KEY = 'ashika_cart'`)
- Impact: Users are not authenticated. Bookings are not tied to user IDs. Multiple users on same device share cart. No user dashboard or order history.
- Fix approach: Integrate Supabase Auth (`@supabase/supabase-js`). Add protected routes with auth checks. Store cart in user context instead of localStorage.

**Order Data Stored in SessionStorage:**
- Issue: Order confirmation data is stored in sessionStorage and cleared after reading. No server-side order persistence.
- Files: `src/app/checkout/page.tsx` (line 68-78), `src/app/checkout/success/page.tsx` (line 44-48)
- Impact: Order data is lost if user refreshes success page or closes tab. No order history or tracking possible. No audit trail for business operations.
- Fix approach: Store orders in Supabase `bookings` table immediately after payment succeeds. Use booking ID to fetch order on success page, not sessionStorage.

**Hardcoded Rental Logic with Date Calculation Concerns:**
- Issue: Date calculations for availability blocking are complex and embedded in multiple places with inconsistent period calculation.
- Files: `src/lib/mock-data/availability.ts` (line 38, 60-61), `src/contexts/cart-context.tsx` (line 75-78)
- Impact: Discrepancies between how blocking periods are calculated in different functions could lead to double bookings or availability display errors.
- Fix approach: Centralize availability calculation in a single utility module. Add comprehensive test coverage for edge cases (same day rental, adjacent bookings, cleaning buffer overlaps).

---

## Known Bugs

**Postcode Validation Range Issue:**
- Symptoms: Postcode validation allows 0200-9999, but valid Australian postcodes range 0200-9999 in populated areas. Postcode "0001" would be rejected but might be valid in some contexts.
- Files: `src/components/checkout/shipping-form.tsx` (line 50-53)
- Trigger: Enter postcode "0100" or "0150" during checkout
- Workaround: None currently. Users with some valid postcodes may be incorrectly rejected.

**Availability Overlap Detection Has Edge Case:**
- Symptoms: Calendar may show overlapping available/blocked dates at month boundaries when checking multiple overlapping interval conditions.
- Files: `src/lib/mock-data/availability.ts` (line 107-113) - Complex overlapping conditions using isWithinInterval multiple times
- Trigger: Book a product on the last day of month and check next month's calendar
- Workaround: None. Behavior is undefined for adjacent bookings that share boundaries.

**localStorage Hydration Race Condition:**
- Symptoms: Cart may not hydrate from localStorage if page is navigated away quickly after mount.
- Files: `src/contexts/cart-context.tsx` (line 146-160)
- Trigger: User lands on checkout page directly without visiting shop first
- Workaround: Cart may appear empty even if items were saved.

**Unfiltered Product Reviews:**
- Symptoms: Same mock reviews appear on every product detail page regardless of productId.
- Files: `src/components/product/product-reviews.tsx` (line 79-83) - productId prop is unused with eslint-disable
- Trigger: Navigate to any product detail page
- Workaround: None. Cannot distinguish reviews by product.

---

## Security Considerations

**Client-Side Card Data Collection (Future Risk):**
- Risk: PaymentForm collects and processes card data on client-side. This violates PCI-DSS compliance if data is ever sent to server or stored.
- Files: `src/components/checkout/payment-form.tsx` (line 29-34, 96)
- Current mitigation: Form data is only used in local state and submitted to mock handler (not sent to server).
- Recommendations: When integrating real Stripe, use Stripe Elements or Stripe.js tokenization. Never send raw card data to your server. Implement PaymentIntent on backend only.

**Environment Variables Not Validated:**
- Risk: No validation that required environment variables exist or are correctly formatted at startup.
- Files: `env/.env.example` shows template but no runtime validation in code
- Current mitigation: Application will fail with unclear error if env vars missing
- Recommendations: Add startup check in `src/app/layout.tsx` or create `lib/env.ts` that validates all required vars using Zod.

**SessionStorage Order Data Has No CSRF Protection:**
- Risk: Order data stored in sessionStorage can be read by any script on the page. No CSRF token validates the order creation request.
- Files: `src/app/checkout/page.tsx` (line 68-78)
- Current mitigation: Mock data only, no real transaction
- Recommendations: When implementing real payments, use Stripe's built-in CSRF protection. Store sensitive order data server-side only.

**No Rate Limiting on Potential API Routes:**
- Risk: Future API routes for booking creation could be hit repeatedly to create fake bookings.
- Files: No API routes currently exist (system is frontend-only mock)
- Current mitigation: No API routes means no attack surface yet
- Recommendations: When creating `src/app/api/bookings/route.ts`, implement rate limiting per IP/user and validate postcode and dates on server.

**Unsanitized Dynamic Content in FAQ/Terms:**
- Risk: Text content like FAQ answers and terms are hardcoded strings but could contain user-submitted content in future.
- Files: `src/app/faq/page.tsx`, `src/app/terms/page.tsx` contain HTML strings
- Current mitigation: All content is developer-controlled
- Recommendations: Use next/sanitize or DOMPurify if content ever comes from database or user input.

---

## Performance Bottlenecks

**Full Calendar Recalculation on Every Month Change:**
- Problem: `getBlockedDates()` iterates through every single day in the month and calls `isProductAvailable()` for each, which loops through all product blocks.
- Files: `src/components/booking/availability-calendar.tsx` (line 45-49 memoization), calls `getBlockedDates()` on every month change
- Cause: O(days * blocks) complexity. With 30 days and 50 blocks per product, 1500 function calls per month view.
- Improvement path: Cache blocked dates by month. Use a Set for O(1) lookup instead of array.some(). Consider server-side pre-computation of blocked dates.

**useEffect Dependencies in CartProvider May Cause Excessive Renders:**
- Problem: Cart persistence effect runs on every state.items change. If state object is recreated unnecessarily, this could cause excessive localStorage writes.
- Files: `src/contexts/cart-context.tsx` (line 163-169)
- Cause: No memoization of dispatch functions. Every dispatch creates new action object.
- Improvement path: Wrap dispatch callbacks in useCallback. Consider debouncing localStorage writes.

**Product List Doesn't Paginate:**
- Problem: Shop page loads all products into memory. With large inventory, this could cause memory issues in browser.
- Files: `src/lib/mock-data/products.ts` exports full array, `src/app/shop/shop-content.tsx` filters entire list
- Cause: No pagination or virtual scrolling implemented
- Improvement path: Implement cursor-based pagination on backend. Use React Query or SWR with intersection observer for infinite scroll.

**Image URLs Are Not Optimized:**
- Problem: Product images load directly from Unsplash URLs without Next.js Image optimization, which means no automatic resize, format conversion, or CDN caching.
- Files: `src/lib/mock-data/products.ts` (lines 6-43 load 1920x1280 and 1200x1600 images)
- Cause: Using direct URLs instead of next/image component with proper sizes
- Improvement path: Store images in Supabase Storage with CDN. Use next/image with proper width/height. Implement responsive srcset.

---

## Fragile Areas

**Availability Calculation Logic:**
- Files: `src/lib/mock-data/availability.ts` - Functions `calculateBlockingPeriod()`, `isProductAvailable()`, `getBlockedDates()`
- Why fragile: Multiple overlapping date range checks with complex boolean logic. Edge cases around date boundaries not well-tested. Mock data generation is separate from validation logic.
- Safe modification: Add comprehensive unit tests for every edge case. Create test fixture with specific date scenarios. Use property-based testing (fast-check) to generate random date ranges.
- Test coverage: Unknown. No test files found. Gaps likely in: same-day overlaps, cleaning buffer boundary conditions, minimum booking days validation.

**Cart Context Serialization/Deserialization:**
- Files: `src/contexts/cart-context.tsx` - Lines 148-156 parse localStorage JSON, line 165 serialize back
- Why fragile: JSON.parse can throw if corrupted data. Date fields are ISO strings but not validated as valid dates. CartItem schema not validated with Zod.
- Safe modification: Use Zod to validate cart data shape on hydration. Wrap JSON.parse in try-catch. Validate eventDate is future. Reset cart if validation fails.
- Test coverage: No tests for corrupted localStorage, invalid dates, or schema mismatches.

**PaymentForm and ShippingForm Validation:**
- Files: `src/components/checkout/payment-form.tsx` (line 70-97), `src/components/checkout/shipping-form.tsx` (line 50-92)
- Why fragile: Regex validation for email and postcode is simplistic. No integration with form library (react-hook-form imported but not used). Manual error state management.
- Safe modification: Use react-hook-form with Zod resolver. Create reusable validation schemas. Add server-side validation mirrors for when these become API routes.
- Test coverage: No tests for validation edge cases (email with +, postcode edge values).

**Availability Calendar Usability:**
- Files: `src/components/booking/availability-calendar.tsx` - Complex calendar rendering with many className conditionals
- Why fragile: Button click handlers (line 79-92) and date blocking logic (line 51-67) are tightly coupled. If date calculation changes, calendar display breaks silently.
- Safe modification: Extract calendar rendering to separate component. Write snapshot tests for blocked date display. Add visual regression testing.
- Test coverage: No tests for calendar rendering with various blocked date patterns.

---

## Scaling Limits

**Mock Data Cannot Scale to Real Inventory:**
- Current capacity: ~16 hardcoded products with random availability
- Limit: Cannot support >50-100 products without significant code changes. Each product requires manual definition in products.ts. Availability blocks are generated statically.
- Scaling path: Migrate to Supabase with proper indexing on (product_id, block_start, block_end). Use RLS policies to control access. Implement server-side availability check with database query optimization.

**localStorage Cart Cannot Scale to Multiple Devices:**
- Current capacity: Single device/browser only
- Limit: User loses cart on different device or browser. No cross-device synchronization.
- Scaling path: Move cart to user account in database. Implement cart sync API endpoint. Use optimistic updates with SWR or React Query.

**SessionStorage Order Data Cannot Scale to Order History:**
- Current capacity: Single successful order in sessionStorage
- Limit: No order history or tracking. Customers cannot access past bookings.
- Scaling path: Create `bookings` table in Supabase with proper indexes. Add order history page. Implement order tracking with status updates.

**Frontend-Only Architecture Cannot Scale to Business Operations:**
- Current capacity: Demo/prototype only
- Limit: No backend for inventory management, payment processing, shipping integration, damage assessment, or customer support ticketing.
- Scaling path: Build API layer with routes for bookings, payments, shipping, returns, damage claims. Implement admin dashboard. Add staff portal for inventory and returns.

---

## Dependencies at Risk

**lucide-react Uses latest Version:**
- Risk: `"lucide-react": "latest"` in package.json means unpredictable updates. Major versions could break icon names or import paths.
- Impact: Icons disappear or component imports fail after npm update
- Migration plan: Pin lucide-react to specific version (e.g., `^1.263.0`). Test icon names before deploy.

**No Stripe or Supabase Integration Yet:**
- Risk: When Stripe and Supabase are added as dependencies, they will introduce breaking changes and version conflicts.
- Impact: Needs careful version pinning and testing
- Migration plan: Start with `@supabase/supabase-js@^2.38.0` and `stripe@^14.0.0`. Set up pre-commit hooks to test integration.

**date-fns and zod Have No Version Pinning:**
- Risk: `"date-fns": "^3"` and `"zod": "^3"` allow minor version changes that could include breaking changes
- Impact: Unexpected date formatting or validation behavior changes
- Migration plan: After deploying, pin to specific minor version (e.g., `^3.3.1`). Add integration tests for date handling.

---

## Missing Critical Features

**No User Authentication System:**
- Problem: System has no login/signup. Customers cannot create accounts, view their bookings, or manage their profile.
- Blocks: Order history, customer support, damage claims, refund tracking, wishlist, saved sizes/preferences
- Workaround: None. Manual email/SMS communication needed for customer support.

**No Real Payment Processing:**
- Problem: Checkout flow is completely mocked. No actual Stripe payments processed.
- Blocks: Cannot accept real orders. No revenue collection. Bond pre-authorization not implemented.
- Workaround: None. Business cannot operate with current implementation.

**No Shipping Integration:**
- Problem: No Australia Post API integration. No labels generated. No tracking numbers provided to customers.
- Blocks: Cannot fulfill orders. No tracking updates to customers.
- Workaround: Manual label generation and shipping.

**No Admin Dashboard:**
- Problem: No inventory management interface. No ability to view bookings, process returns, assess damage, or manage staff.
- Blocks: Cannot operate business at scale. No data visibility.
- Workaround: Manual spreadsheet tracking.

**No Email Notifications:**
- Problem: No transactional emails for order confirmation, shipping updates, damage assessment, refunds.
- Blocks: Customers cannot track orders. No communication channel for issues.
- Workaround: Manual email contact needed for all customer communications.

---

## Test Coverage Gaps

**No Tests for Availability Calculation:**
- What's not tested: `isProductAvailable()`, `getBlockedDates()`, `calculateBlockingPeriod()` functions have zero test coverage
- Files: `src/lib/mock-data/availability.ts`
- Risk: Critical business logic for preventing double-bookings is untested. Edge cases at date boundaries unknown.
- Priority: **CRITICAL** - This is core rental logic that must be correct.

**No Tests for Cart Context:**
- What's not tested: Add/remove items, persistence to localStorage, hydration on mount, bond calculation
- Files: `src/contexts/cart-context.tsx`
- Risk: Cart bugs (duplicate items, lost items) reach production. localStorage corruption is not handled.
- Priority: **HIGH** - Cart is core user flow.

**No Tests for Form Validation:**
- What's not tested: Shipping form postcode validation, payment form card number formatting, email validation
- Files: `src/components/checkout/shipping-form.tsx`, `src/components/checkout/payment-form.tsx`
- Risk: Invalid data submitted to backend. Postcode edge cases not caught.
- Priority: **HIGH** - Data quality depends on client validation.

**No Tests for Page Components:**
- What's not tested: Shop page filtering, product detail page, checkout flow, success page
- Files: `src/app/shop/page.tsx`, `src/app/shop/[id]/page.tsx`, `src/app/checkout/page.tsx`
- Risk: UI regressions, broken links, missing data on page load
- Priority: **MEDIUM** - Integration tests would catch obvious breaks.

**No Tests for Calendar Component:**
- What's not tested: Month navigation, date selection, blocked date highlighting
- Files: `src/components/booking/availability-calendar.tsx`
- Risk: Users unable to select dates or unable to see blocked dates correctly
- Priority: **MEDIUM** - Visual bugs in calendar affect UX significantly.

**No E2E Tests:**
- What's not tested: Complete user journey from browsing to checkout to success page
- Files: All user-facing flows
- Risk: Major regressions go unnoticed until production
- Priority: **HIGH** - E2E tests would catch broken flows immediately.

---

*Concerns audit: 2026-01-24*
