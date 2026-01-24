# Domain Pitfalls

**Domain:** Fashion rental marketplace (Indian ethnic wear hire, Australia)
**Researched:** 2026-01-24
**Overall Confidence:** HIGH (verified against official Stripe, Supabase, and Vercel documentation)

---

## Critical Pitfalls

Mistakes that cause rewrites, data corruption, or business-breaking issues.

---

### Pitfall 1: Race Condition Double Bookings (No Database-Level Locking)

**What goes wrong:** Two users select the same saree for the same event date. Both pass the availability check (a SELECT query), both proceed to payment, both succeed. Two bookings exist for one physical item. One customer receives nothing.

**Why it happens:** The availability check and the booking creation are separate operations with no atomicity guarantee. Between checking availability and inserting the booking, another request can complete the same flow.

**Consequences:**
- Customer receives confirmation but item is already shipped to someone else
- Manual intervention required (refunds, apologies, reputation damage)
- Cannot be fixed retroactively -- requires architectural change

**Prevention:**

Use a PostgreSQL function (RPC) that combines the check and insert in a single transaction with row-level locking:

```sql
CREATE OR REPLACE FUNCTION create_booking(
  p_product_id UUID,
  p_event_date DATE,
  p_user_id UUID
) RETURNS UUID AS $$
DECLARE
  v_rental_start DATE;
  v_cleaning_end DATE;
  v_conflict_count INT;
  v_booking_id UUID;
BEGIN
  v_rental_start := p_event_date - INTERVAL '3 days';
  v_cleaning_end := p_event_date + INTERVAL '6 days';

  -- Lock the product row to prevent concurrent bookings
  PERFORM id FROM products WHERE id = p_product_id FOR UPDATE;

  -- Check for conflicts within the same transaction
  SELECT COUNT(*) INTO v_conflict_count
  FROM inventory_blocks
  WHERE product_id = p_product_id
    AND block_start <= v_cleaning_end
    AND block_end >= v_rental_start;

  IF v_conflict_count > 0 THEN
    RAISE EXCEPTION 'Product not available for selected dates';
  END IF;

  -- Create the booking and block atomically
  INSERT INTO bookings (product_id, user_id, event_date, status)
  VALUES (p_product_id, p_user_id, p_event_date, 'confirmed')
  RETURNING id INTO v_booking_id;

  INSERT INTO inventory_blocks (product_id, booking_id, block_start, block_end)
  VALUES (p_product_id, v_booking_id, v_rental_start, v_cleaning_end);

  RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql;
```

Call via Supabase RPC:

```typescript
const { data, error } = await supabase.rpc('create_booking', {
  p_product_id: productId,
  p_event_date: eventDate,
  p_user_id: userId,
});
```

**Detection:** Test by sending two concurrent booking requests for the same product/date. If both succeed, you have this bug.

**Phase:** Must be solved in the database/booking phase. Do NOT build checkout without this.

**Confidence:** HIGH -- standard database concurrency pattern, verified with PostgreSQL docs and Supabase transaction documentation.

---

### Pitfall 2: Stripe Pre-Authorization Expiry (Bond Disappears Before Return)

**What goes wrong:** You place a $100 bond hold on the customer's card using `capture_method: 'manual'`. The customer has a 7-day rental window. But for Visa cards, the authorization expires after only 5 days (online, merchant-initiated). The hold vanishes, and you cannot capture the bond if the item comes back damaged.

**Why it happens:** Stripe authorization windows are card-network-specific and shorter than most developers expect:

| Card Network | Online Hold Duration |
|-------------|---------------------|
| Visa | 5 days (merchant-initiated) / 7 days (customer-initiated) |
| Mastercard | 7 days |
| Amex | 7 days |
| Discover | 7 days |

Your 7-day rental window (3 days delivery + event day + 3 days return) means the authorization may expire BEFORE the item is even returned, especially for Visa.

**Consequences:**
- Cannot charge for damages after hold expires
- Business eats the cost of damaged items
- Attempting to capture expired auth causes Stripe error

**Prevention:**

**Option A (Recommended): Two-step payment flow**

1. Charge the rental fee immediately (normal PaymentIntent, captured)
2. After successful payment, use `setup_future_usage: 'off_session'` to save the payment method
3. When item is returned, if damaged, create a NEW PaymentIntent against the saved payment method

```typescript
// Step 1: Charge rental fee and save payment method
const paymentIntent = await stripe.paymentIntents.create({
  amount: rentalFeeInCents,
  currency: 'aud',
  customer: stripeCustomerId,
  payment_method: paymentMethodId,
  confirm: true,
  setup_future_usage: 'off_session', // Saves card for later
});

// Step 2: If damage detected (days later)
const bondCharge = await stripe.paymentIntents.create({
  amount: damageAmountInCents, // Up to $100
  currency: 'aud',
  customer: stripeCustomerId,
  payment_method: savedPaymentMethodId,
  confirm: true,
  off_session: true,
  description: 'ASHIKA bond - damage charge',
});
```

**Option B: Extended Authorization (requires IC+ pricing)**

Extended authorization can hold funds for up to 30 days, but requires Stripe IC+ pricing (not available on standard pricing). Only viable if you upgrade from Stripe's blended pricing.

**Detection:** Check `charge.payment_method_details.card.capture_before` timestamp on any manual-capture PaymentIntent. If it is before your expected return date, you have this problem.

**Phase:** Must be solved in the payment integration phase. The CLAUDE.md bond logic using pre-auth needs revision.

**Confidence:** HIGH -- verified directly from Stripe official documentation at docs.stripe.com/payments/place-a-hold-on-a-payment-method.

---

### Pitfall 3: Supabase Free Tier Pause Kills Production

**What goes wrong:** Your Supabase project goes inactive for 7 days (no database queries). Supabase pauses the project. Your website's database calls return errors. Users see a broken site. You don't notice for hours because there's no monitoring.

**Why it happens:** Supabase free tier pauses projects after 1 week of inactivity. "Inactivity" means no database queries -- static page views don't count. If your small catalog (10-30 items) has low traffic, this WILL happen.

**Consequences:**
- Site returns 500 errors on all data-dependent pages
- Users cannot browse catalog, make bookings, or log in
- Restoring takes time (manual dashboard action required)
- Reported cases of data loss on restore (table data missing)
- After 90 days paused, project cannot be auto-restored

**Prevention:**

1. **GitHub Actions ping** (immediate fix):

```yaml
# .github/workflows/keep-supabase-alive.yml
name: Keep Supabase Active
on:
  schedule:
    - cron: '0 0 */3 * *'  # Every 3 days
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Supabase
        run: |
          curl -s "${{ secrets.SUPABASE_URL }}/rest/v1/products?select=id&limit=1" \
            -H "apikey: ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}"
```

2. **Upgrade to Pro ($25/month) before going live** -- Pro projects are never paused. Given that this is a business taking real payments, the $25/month is justified.

3. **Regular backups** -- Even on Pro, export critical data periodically.

**Detection:** Set up a simple uptime monitor (UptimeRobot free tier, or similar) that hits a Supabase-backed endpoint every 5 minutes.

**Phase:** Infrastructure setup phase. The GitHub Actions ping is a day-one task. Pro upgrade decision before launch.

**Confidence:** HIGH -- verified from Supabase pricing page and multiple user reports of pausing behavior.

---

### Pitfall 4: No Image Transformations on Free Tier (Slow Product Pages)

**What goes wrong:** You upload high-resolution product photos (2-5MB each) to Supabase Storage. On the product grid, you display 12-30 of these at once. Each loads the full-resolution image. First Contentful Paint takes 8+ seconds. Users bounce.

**Why it happens:** Supabase Image Transformations (dynamic resize, WebP conversion) are Pro plan only ($25/month). On the free tier, you serve exactly the file you uploaded -- no on-the-fly resizing.

**Consequences:**
- Product grid loads 50-150MB of images on initial page load
- LCP exceeds Google's 4-second threshold (hurts SEO)
- Mobile users on cellular data have terrible experience
- Core Web Vitals fail (affects search ranking)

**Prevention:**

Since image transformations require Pro, handle optimization at upload time:

```typescript
// Upload pre-optimized variants
async function uploadProductImage(file: File, productId: string) {
  const variants = [
    { suffix: 'thumb', width: 400, quality: 75 },   // Grid cards
    { suffix: 'medium', width: 800, quality: 80 },  // Product detail
    { suffix: 'full', width: 1200, quality: 85 },   // Zoom/lightbox
  ];

  for (const variant of variants) {
    const optimized = await resizeImage(file, variant.width, variant.quality);
    const path = `products/${productId}/${variant.suffix}.webp`;
    await supabase.storage.from('product-images').upload(path, optimized, {
      contentType: 'image/webp',
      cacheControl: '31536000', // 1 year cache
    });
  }
}
```

Use `next/image` with explicit sizes (no Supabase loader needed on free tier):

```typescript
<Image
  src={`${SUPABASE_URL}/storage/v1/object/public/product-images/${productId}/thumb.webp`}
  alt={product.name}
  width={400}
  height={500}
  loading="lazy"
  sizes="(max-width: 768px) 50vw, 25vw"
/>
```

**Alternative:** Use a free image CDN like Cloudinary (free tier: 25K transformations/month) as an intermediary, with Supabase as origin storage.

**Detection:** Run Lighthouse on product grid page. LCP > 4s = problem. Total image payload > 5MB = problem.

**Phase:** Image upload/management phase. Must be solved before catalog goes live.

**Confidence:** HIGH -- verified from Supabase docs that transformations are Pro-only, pricing page confirms.

---

## High-Severity Pitfalls

Mistakes that cause significant delays, poor UX, or technical debt.

---

### Pitfall 5: Timezone Bugs with Australian Dates (DST Boundaries)

**What goes wrong:** A user in Sydney selects January 15 as their event date. Your server (Vercel, likely US region) stores this as a UTC timestamp. When you calculate `rental_start = event_date - 3 days`, the subtraction crosses a DST boundary, and the dates are off by one hour, which can shift the actual DATE (e.g., 11pm Jan 12 becomes Jan 11 23:00 UTC).

**Why it happens:** Australia has complex timezone rules:
- AEST = UTC+10 (April-October)
- AEDT = UTC+11 (October-April)
- Queensland does NOT observe DST (always AEST)
- DST transitions: first Sunday in April (spring back), first Sunday in October (spring forward)

JavaScript Date objects are local-timezone-dependent. Vercel runs in US timezones by default.

**Consequences:**
- Bookings off by a day for events near DST transitions
- Inventory blocks calculated incorrectly
- Customer receives item on wrong day
- Particularly dangerous for early-April and early-October events

**Prevention:**

1. **Store dates as DATE type (not TIMESTAMP)** in the database. Event dates are calendar dates, not moments in time:

```sql
-- Use DATE, not TIMESTAMPTZ
event_date DATE NOT NULL,
rental_start DATE NOT NULL,
rental_end DATE NOT NULL,
cleaning_end DATE NOT NULL
```

2. **Use date-fns with plain date arithmetic** (no timezone conversion needed for date-only operations):

```typescript
import { addDays, subDays, format } from 'date-fns';

// Work with ISO date strings, never timestamps
function calculateRentalDates(eventDateStr: string) {
  // Parse as local date parts, not as UTC moment
  const [year, month, day] = eventDateStr.split('-').map(Number);
  const eventDate = new Date(year, month - 1, day);

  return {
    rentalStart: format(subDays(eventDate, 3), 'yyyy-MM-dd'),
    rentalEnd: format(addDays(eventDate, 3), 'yyyy-MM-dd'),
    cleaningEnd: format(addDays(eventDate, 6), 'yyyy-MM-dd'),
  };
}
```

3. **Always pass dates as `YYYY-MM-DD` strings** between client and server. Never pass Date objects or timestamps for rental logic.

4. **Display dates in Australian format** for UX:

```typescript
// Display: "15 January 2026"
format(parseISO(dateStr), 'd MMMM yyyy');
```

**Detection:** Write a unit test with an event date on the first Sunday of April (DST transition). If `rental_start` calculates differently on your local machine vs. Vercel, you have this bug.

**Phase:** Date utility setup phase (very early). All rental logic depends on this being correct.

**Confidence:** HIGH -- DST behavior is well-documented; date-fns GitHub issues confirm the timezone bugs when mixing timestamps with date arithmetic.

---

### Pitfall 6: Vercel Free Tier 10-Second Timeout on Checkout

**What goes wrong:** Your checkout API route creates a Stripe PaymentIntent, saves the payment method, creates the booking, inserts the inventory block, and sends a confirmation email. Under load (or cold start), this chain takes > 10 seconds. Vercel kills the function. The user sees an error, but the payment may have already been captured.

**Why it happens:** Vercel Hobby (free) tier has a hard 10-second timeout on serverless functions. Cold starts add 1-3 seconds. Stripe API calls add 1-2 seconds each. Database queries add 0.5-1 second each. A complex checkout flow can easily exceed 10 seconds.

**Consequences:**
- Payment captured but booking not created (orphaned charge)
- User retries, gets charged twice
- Partial state: payment exists but no inventory block
- No way to extend timeout on free tier

**Prevention:**

1. **Minimize the critical path** -- only do the essential operation in the API route:

```typescript
// POST /api/checkout
export async function POST(request: Request) {
  // 1. Validate input (fast, <50ms)
  const validated = CheckoutSchema.parse(await request.json());

  // 2. Check availability via RPC (fast, <200ms with lock)
  const { data: bookingId, error } = await supabase.rpc('create_booking', {...});
  if (error) return NextResponse.json({ error: error.message }, { status: 409 });

  // 3. Create Stripe PaymentIntent (1-2s)
  const paymentIntent = await stripe.paymentIntents.create({...});

  // 4. Update booking with payment ID (fast, <100ms)
  await supabase.from('bookings').update({
    stripe_payment_intent_id: paymentIntent.id
  }).eq('id', bookingId);

  // 5. Return immediately -- handle email async
  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
```

2. **Move non-critical work to webhooks** -- confirmation emails, shipping label generation happen via Stripe webhook (separate function invocation, separate timeout):

```typescript
// POST /api/webhooks/stripe
// Handles: payment_intent.succeeded
// Sends: confirmation email, generates shipping label
```

3. **Use client-side Stripe confirmation** -- let the browser handle 3D Secure and payment confirmation, then your webhook handles the rest.

**Detection:** Time your checkout API route in development. If it exceeds 7 seconds (leaving 3s buffer for cold starts), refactor.

**Phase:** Checkout implementation phase. Design the flow to respect the timeout from the start.

**Confidence:** HIGH -- verified from Vercel docs (10s Hobby limit) and Vercel Functions Limitations page.

---

### Pitfall 7: Next.js App Router Form State Loss on Navigation

**What goes wrong:** User fills out the checkout form (address, postcode, date selection). They click "back" to review the product, then click "forward" to return to checkout. All form state is gone. They abandon the checkout.

**Why it happens:** Next.js App Router uses React Server Components by default. Navigation between routes unmounts and remounts components, destroying local state. Unlike the Pages Router, there is no persistent layout state between route segments unless explicitly designed.

**Consequences:**
- High checkout abandonment rate
- Users frustrated by lost form data
- Especially painful on multi-step checkout flows

**Prevention:**

1. **Single-page checkout** -- avoid navigation during checkout. Use steps within one page:

```typescript
// app/checkout/page.tsx (client component)
'use client';

export function CheckoutPage() {
  const [step, setStep] = useState<'dates' | 'address' | 'payment'>('dates');
  const form = useForm<CheckoutFormData>({...});

  return (
    <form>
      {step === 'dates' && <DateStep form={form} onNext={() => setStep('address')} />}
      {step === 'address' && <AddressStep form={form} onNext={() => setStep('payment')} />}
      {step === 'payment' && <PaymentStep form={form} />}
    </form>
  );
}
```

2. **URL search params for critical state** -- persist event date and product ID in the URL:

```typescript
// /checkout?product=abc&date=2026-02-15
const searchParams = useSearchParams();
const productId = searchParams.get('product');
const eventDate = searchParams.get('date');
```

3. **SessionStorage fallback** for form data that should survive accidental navigation.

**Detection:** Test the checkout flow by navigating away mid-form and returning. If data is lost, fix it.

**Phase:** Checkout UI implementation phase.

**Confidence:** HIGH -- well-documented App Router behavior; React Server Components unmount on navigation by design.

---

### Pitfall 8: Bond Payment Creates Two User Charges (Confusing UX)

**What goes wrong:** Using the two-PaymentIntent approach for rental + bond, the customer sees TWO charges on their bank statement: one for the rental fee and one for the $100 bond hold. They panic, thinking they were overcharged. Support tickets flood in.

**Why it happens:** Stripe creates separate line items for separate PaymentIntents. Even if the bond is only an authorization (not captured), many banks show it as a pending charge. Customers don't understand the difference between "pending" and "captured."

**Consequences:**
- Customer support overhead
- Chargebacks from confused customers
- Lost trust, negative reviews
- Particularly bad for first-time users unfamiliar with rental bonds

**Prevention:**

1. **Clear pre-checkout communication:**

```typescript
const ORDER_SUMMARY = {
  rental_fee: '$85.00 (charged now)',
  bond: '$100.00 (hold only - released when item returned)',
  total_charged: '$85.00',
  note: 'The $100 bond is a temporary hold on your card. It will not be charged unless the item is returned damaged.',
};
```

2. **Stripe statement descriptor** -- make it recognizable:

```typescript
const paymentIntent = await stripe.paymentIntents.create({
  statement_descriptor: 'ASHIKA RENTAL',
  statement_descriptor_suffix: 'BOND HOLD',
  // ...
});
```

3. **Post-checkout email** explicitly explaining both line items on their statement.

4. **Consider the saved-card approach** (Pitfall 2 prevention Option A) -- if you save the card and only charge bond IF damaged, the customer never sees a bond hold at all. This eliminates the confusion entirely.

**Detection:** Test the full checkout and check what appears on a test card statement.

**Phase:** Payment integration phase, plus UX/copy phase.

**Confidence:** MEDIUM -- based on common rental platform patterns and Stripe community discussions. The exact UX impact varies by bank.

---

## Moderate Pitfalls

Mistakes that cause delays, technical debt, or degraded performance.

---

### Pitfall 9: Supabase 500MB Database Size on Free Tier

**What goes wrong:** You store product images as base64 in the database, or you log every page view, or your inventory_blocks table grows without cleanup. You hit 500MB. Database enters read-only mode. No new bookings possible.

**Why it happens:** 500MB sounds like a lot, but:
- Each high-res image as base64 = 3-7MB
- Storing 30 products with 5 images each as base64 = 450-1050MB
- Even without images, verbose logging fills storage fast

**Consequences:**
- Database enters read-only mode (no inserts, no updates)
- Bookings fail silently or with cryptic errors
- Must delete data or upgrade immediately
- No graceful degradation

**Prevention:**

1. **Never store images in the database** -- use Supabase Storage (1GB free, separate from DB):

```typescript
// Store image URL reference, not the image itself
interface Product {
  id: string;
  name: string;
  images: string[]; // URLs to Supabase Storage, NOT base64
}
```

2. **Clean up old inventory blocks** -- blocks from completed rentals can be archived:

```sql
-- Monthly cleanup: archive blocks older than 6 months
DELETE FROM inventory_blocks
WHERE block_end < NOW() - INTERVAL '6 months'
  AND booking_id IN (
    SELECT id FROM bookings WHERE status = 'completed'
  );
```

3. **Monitor database size** -- check in Supabase dashboard weekly, or query:

```sql
SELECT pg_size_pretty(pg_database_size(current_database()));
```

4. **For 10-30 products with proper storage patterns, 500MB is more than sufficient.** The risk is primarily from anti-patterns (base64 images, excessive logging).

**Detection:** Check database size in Supabase dashboard. Alert at 400MB.

**Phase:** Database schema design phase (early). Ensure correct storage patterns from day one.

**Confidence:** HIGH -- Supabase pricing page confirms 500MB limit and read-only behavior.

---

### Pitfall 10: Supabase Storage 1GB Limit for Product Images

**What goes wrong:** You upload high-resolution photos (5MB each) for 30 products with 8 angles each. That's 30 x 8 x 5MB = 1.2GB. You hit the 1GB storage limit. Image uploads fail. New products cannot be added.

**Why it happens:** Free tier includes 1GB file storage total. Product photography for ethnic wear (detailed embroidery, multiple angles) tends toward large file sizes.

**Consequences:**
- Cannot add new products or update images
- Must delete existing images or upgrade
- If you pre-optimize (Pitfall 4 prevention), you have 3 variants per image = 3x storage usage

**Prevention:**

1. **Aggressive compression at upload** -- target 200KB per thumbnail, 500KB per medium, 800KB per full:

```typescript
// Target sizes for 30 products x 5 images x 3 variants = 450 files
// Thumb: 200KB x 150 = 30MB
// Medium: 500KB x 150 = 75MB
// Full: 800KB x 150 = 120MB
// Total: ~225MB (well within 1GB)
```

2. **Limit images per product** -- 4-5 images max per product is sufficient for ethnic wear.

3. **WebP format only** -- 25-34% smaller than JPEG at same quality.

4. **Budget calculation:**
   - 30 products x 5 images x 3 variants = 450 files
   - Average 300KB per file = 135MB total
   - Leaves 865MB headroom

**Detection:** Monitor storage usage in Supabase dashboard.

**Phase:** Image upload implementation phase.

**Confidence:** HIGH -- 1GB limit confirmed from Supabase pricing.

---

### Pitfall 11: Missing Australian Postcode Validation Edge Cases

**What goes wrong:** You validate postcodes with a simple regex `\d{4}`. A user enters "0000" (invalid) or "9999" (valid but remote). You accept it, generate a shipping label, and AusPost rejects it or charges exorbitant remote-area fees.

**Why it happens:** Australian postcodes are 4 digits but not all 4-digit numbers are valid postcodes. Additionally, some valid postcodes are in remote areas where AusPost charges significantly more or doesn't deliver.

**Consequences:**
- Failed shipments (invalid postcode)
- Unexpected shipping costs (remote areas, free shipping promise broken)
- Items sent to wrong location

**Prevention:**

```typescript
import { z } from 'zod';

// Australian postcode ranges by state
const VALID_POSTCODE_RANGES = [
  { min: 200, max: 299, state: 'ACT' },
  { min: 1000, max: 2599, state: 'NSW' },
  { min: 2619, max: 2899, state: 'NSW' },
  { min: 2921, max: 2999, state: 'NSW' },
  { min: 2600, max: 2618, state: 'ACT' },
  { min: 2900, max: 2920, state: 'ACT' },
  { min: 3000, max: 3999, state: 'VIC' },
  { min: 4000, max: 4999, state: 'QLD' },
  { min: 5000, max: 5799, state: 'SA' },
  { min: 5800, max: 5999, state: 'SA' },
  { min: 6000, max: 6797, state: 'WA' },
  { min: 6800, max: 6999, state: 'WA' },
  { min: 7000, max: 7799, state: 'TAS' },
  { min: 7800, max: 7999, state: 'TAS' },
  { min: 800, max: 899, state: 'NT' },
  { min: 900, max: 999, state: 'NT' },
];

const PostcodeSchema = z.string()
  .regex(/^\d{4}$/, 'Must be 4 digits')
  .refine((val) => {
    const num = parseInt(val);
    return VALID_POSTCODE_RANGES.some(
      range => num >= range.min && num <= range.max
    );
  }, 'Invalid Australian postcode');

// Optional: restrict to serviceable areas
const SERVICEABLE_STATES = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'ACT', 'TAS'];
// Consider excluding NT or adding surcharge notice for remote postcodes
```

**Detection:** Test with edge-case postcodes: 0000, 0100, 0200, 9999, 6798, 0800.

**Phase:** Checkout form validation phase.

**Confidence:** HIGH -- Australian postcode structure is well-documented by Australia Post.

---

### Pitfall 12: Server Actions Exposing Prices to Client Manipulation

**What goes wrong:** You calculate the rental price on the client side and pass it to the server action or API route. A malicious user modifies the request to set `rental_price: 0`. Your server trusts the client-provided price.

**Why it happens:** Next.js App Router makes it easy to pass form data directly to server actions. Developers forget that client data is untrusted. The price should always come from the database, never from the form.

**Consequences:**
- Items rented for $0
- Revenue loss
- Potential exploitation at scale

**Prevention:**

```typescript
// Server Action or API Route
async function processCheckout(formData: FormData) {
  const productId = formData.get('product_id') as string;

  // ALWAYS fetch price from database, never trust client
  const { data: product } = await supabase
    .from('products')
    .select('rental_price')
    .eq('id', productId)
    .single();

  if (!product) throw new Error('Product not found');

  // Use database price, not anything from the form
  const amount = Math.round(product.rental_price * 100); // cents

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'aud',
    // ...
  });
}
```

**Detection:** Attempt to modify the checkout request payload with a different price. If the server uses it, you have this vulnerability.

**Phase:** Payment integration phase. First principle of checkout: never trust client prices.

**Confidence:** HIGH -- explicitly called out in Next.js + Stripe integration guides.

---

## Minor Pitfalls

Mistakes that cause annoyance but are fixable without major refactoring.

---

### Pitfall 13: Supabase Auth Session Not Refreshing (Silent Logout)

**What goes wrong:** User spends 20 minutes browsing products, adds to cart, goes to checkout, and is suddenly logged out. The Supabase auth session expired and wasn't refreshed.

**Why it happens:** Supabase access tokens expire after 1 hour by default. If the client-side auth listener isn't properly set up, the session isn't auto-refreshed.

**Prevention:**

Ensure the auth state listener is set up in your root layout:

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// components/auth/auth-provider.tsx
'use client';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Session auto-refreshes via the listener
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}
```

**Phase:** Auth setup phase.

**Confidence:** HIGH -- documented Supabase auth behavior.

---

### Pitfall 14: next/image Without Proper Supabase Domain Configuration

**What goes wrong:** You use `<Image src={supabaseStorageUrl} />` and get a runtime error: "Invalid src prop... hostname is not configured under images in next.config.js."

**Why it happens:** Next.js Image component requires external domains to be explicitly allowed for security.

**Prevention:**

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;
```

**Phase:** Project setup phase (day one configuration).

**Confidence:** HIGH -- standard Next.js configuration requirement.

---

### Pitfall 15: Booking Status Enum Drift

**What goes wrong:** You use string literals for booking status in the application code but don't enforce them in the database. Over time, typos creep in ("comfirmed", "shiped"), and queries for specific statuses miss records.

**Prevention:**

```sql
-- Database enum constraint
CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'returned',
  'inspecting',
  'completed',
  'damaged',
  'cancelled'
);

ALTER TABLE bookings
  ALTER COLUMN status TYPE booking_status
  USING status::booking_status;
```

Plus TypeScript mirroring:

```typescript
const BOOKING_STATUSES = [
  'pending', 'confirmed', 'shipped', 'delivered',
  'returned', 'inspecting', 'completed', 'damaged', 'cancelled'
] as const;

type BookingStatus = typeof BOOKING_STATUSES[number];
```

**Phase:** Database schema phase.

**Confidence:** HIGH -- standard practice.

---

### Pitfall 16: Vercel Cold Starts on Low-Traffic Checkout

**What goes wrong:** Your site gets low traffic (expected for a niche Australian rental). The checkout function hasn't been called in 30+ minutes. User clicks "Pay Now", experiences a 3-5 second cold start BEFORE the Stripe API call. Total wait exceeds 7-8 seconds. User thinks it's broken and clicks again, potentially double-charging.

**Prevention:**

1. **Disable the submit button immediately on click** and show a loading state:

```typescript
const [isSubmitting, setIsSubmitting] = useState(false);

async function handleSubmit() {
  setIsSubmitting(true);
  try {
    await processPayment();
  } finally {
    setIsSubmitting(false);
  }
}

<button disabled={isSubmitting}>
  {isSubmitting ? 'Processing...' : 'Pay Now'}
</button>
```

2. **Idempotency key** on the Stripe PaymentIntent to prevent double charges:

```typescript
const paymentIntent = await stripe.paymentIntents.create({
  idempotencyKey: `booking_${bookingId}_${Date.now()}`,
  // ...
});
```

3. **Stripe client-side confirmation** reduces server-side work (confirmation happens in browser, webhook handles the rest).

**Phase:** Checkout UI and payment integration phase.

**Confidence:** MEDIUM -- cold start times vary; the mitigation patterns are well-established.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Severity | Mitigation |
|-------------|---------------|----------|------------|
| Database schema | Race conditions (#1), Status drift (#15) | Critical | Use RPC with FOR UPDATE locks, DB enums |
| Payment integration | Auth expiry (#2), Price manipulation (#12), Double charge (#16) | Critical | Save card + charge later pattern, server-side prices, idempotency |
| Image management | No transformations (#4), Storage limits (#10) | High | Pre-optimize at upload, WebP, size budgets |
| Infrastructure | Supabase pause (#3), Vercel timeout (#6) | Critical | GitHub Actions ping, minimize API route work |
| Checkout UI | Form state loss (#7), Bond confusion (#8) | High | Single-page checkout, clear copy |
| Date handling | Timezone bugs (#5) | High | DATE type, no timestamps for rental logic |
| Auth setup | Session expiry (#13) | Medium | Auth state listener in root layout |
| Deployment config | Image domains (#14) | Low | next.config.js remotePatterns |
| Postcode validation | Invalid/remote postcodes (#11) | Medium | Range-based validation, state mapping |

---

## Free Tier Constraints Summary

| Service | Limit | Impact | When to Upgrade |
|---------|-------|--------|-----------------|
| Supabase DB | 500MB | Read-only mode on exceed | At 400MB or before launch |
| Supabase Storage | 1GB | Upload failures on exceed | At 800MB |
| Supabase Transforms | Not available | Must pre-optimize images | Consider Pro at launch ($25/mo) |
| Supabase Pause | 7 days inactive | Site goes down | Use ping job or upgrade to Pro |
| Supabase Realtime | 200 concurrent | Not relevant for 10-30 products | N/A for MVP |
| Vercel Functions | 10s timeout | Checkout failures | Optimize or upgrade to Pro ($20/mo) |
| Vercel Bandwidth | 100GB/month | Unlikely to hit for small catalog | N/A for MVP |
| Stripe | No free tier limit | Per-transaction fees only | N/A |

---

## Stripe Authorization Timing Reference

| Card Network | Online Hold | Extended (IC+ only) | Notes |
|-------------|-------------|---------------------|-------|
| Visa | 5-7 days | ~30 days | 5 days merchant-initiated |
| Mastercard | 7 days | ~30 days | -- |
| Amex | 7 days | ~30 days | -- |
| Discover | 7 days | ~30 days | -- |

**Critical for ASHIKA:** 7-day rental window + 3-day return buffer = 10+ days. Standard auth WILL expire before item return. Must use saved-card approach, NOT pre-auth hold.

---

## Sources

### Official Documentation (HIGH confidence)
- [Stripe: Place a hold on a payment method](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method)
- [Stripe: Extended authorizations](https://docs.stripe.com/payments/extended-authorization)
- [Stripe: Multicapture](https://docs.stripe.com/payments/multicapture)
- [Supabase: Pricing](https://supabase.com/pricing)
- [Supabase: Image Transformations](https://supabase.com/docs/guides/storage/serving/image-transformations)
- [Supabase: Manage Image Transformation usage](https://supabase.com/docs/guides/platform/manage-your-usage/storage-image-transformations)
- [Vercel: Functions Limitations](https://vercel.com/docs/functions/limitations)
- [Vercel: Limits](https://vercel.com/docs/limits)
- [Next.js: Forms Guide](https://nextjs.org/docs/pages/guides/forms)
- [PostgreSQL: Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html)

### Verified Community Sources (MEDIUM confidence)
- [HackerNoon: Race conditions in booking systems](https://hackernoon.com/how-to-solve-race-conditions-in-a-booking-system)
- [DEV.to: Transactions in Supabase](https://dev.to/damasosanoja/data-integrity-first-mastering-transactions-in-supabase-sql-for-reliable-applications-2dbb)
- [DEV.to: Prevent Supabase pausing with GitHub Actions](https://dev.to/jps27cse/how-to-prevent-your-supabase-project-database-from-being-paused-using-github-actions-3hel)
- [GitHub: date-fns DST issues](https://github.com/date-fns/date-fns/issues/1788)
- [GitHub: Supabase SERIALIZABLE isolation](https://github.com/orgs/supabase/discussions/30334)
- [Supabase Discussion: Data loss after pause restore](https://github.com/orgs/supabase/discussions/39271)

### Community/Blog Sources (LOW confidence -- patterns validated but specifics may vary)
- [Shopify: Ecommerce checkout mistakes](https://www.shopify.com/blog/ecommerce-mistakes)
- [Sharetribe: Build rental website like Rent the Runway](https://www.sharetribe.com/create/how-to-build-website-like-rent-the-runway/)
- [Medium: Online clothing rental UX study](https://tan-chrisdoris.medium.com/online-clothing-rental-f0d2bd6e77ee)
