# Architecture Patterns: ASHIKA Fashion Rental System

**Domain:** Indian Wear Hire Marketplace (Rental-Only)
**Researched:** 2026-01-24
**Stack:** Next.js 14 (App Router) + Supabase + Stripe + Vercel
**Overall Confidence:** HIGH (verified with official docs)

---

## Current State Assessment

The existing codebase is a **front-end shell** with:
- Complete UI components (product cards, filters, calendar, checkout forms)
- Mock data layer (`src/lib/mock-data/`) simulating products and availability
- Cart context with localStorage persistence
- Checkout flow UI with simulated payment (no real Stripe integration)
- No Supabase connection, no API routes, no auth, no real backend

**The gap:** Everything below the component layer needs to be built: database, auth, real availability checking, Stripe payments, webhooks, admin panel.

---

## Database Schema (Supabase PostgreSQL)

### Table: `profiles`

Extends Supabase Auth users with app-specific data.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Table: `products`

Core product catalog. Matches existing `Product` type in `src/types/index.ts`.

```sql
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('saree', 'lehenga', 'salwar_kameez', 'sherwani')),
  subcategory TEXT,
  occasion TEXT[] DEFAULT '{}',
  color TEXT NOT NULL,
  colors TEXT[] DEFAULT '{}',
  rental_price DECIMAL(10,2) NOT NULL CHECK (rental_price > 0),
  retail_price DECIMAL(10,2) NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('lite', 'premium')),
  description TEXT,
  fabric TEXT,
  work TEXT,
  blouse_included BOOLEAN DEFAULT false,
  accessories_included TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  thumbnail TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance', 'retired')),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_products_slug ON products(slug);
```

### Table: `product_sizes`

Normalized size/inventory tracking per product.

```sql
CREATE TABLE public.product_sizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  measurements JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(product_id, size)
);

CREATE INDEX idx_product_sizes_product ON product_sizes(product_id);
```

### Table: `bookings`

Central booking record. Matches existing `Booking` type.

```sql
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  product_id UUID NOT NULL REFERENCES products(id),
  product_size_id UUID NOT NULL REFERENCES product_sizes(id),
  size TEXT NOT NULL,

  -- Dates (all computed from event_date)
  event_date DATE NOT NULL,
  rental_start DATE NOT NULL,   -- event_date - 3 days
  rental_end DATE NOT NULL,     -- event_date + 4 days
  cleaning_end DATE NOT NULL,   -- rental_end + 3 days

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered',
                      'returned', 'inspecting', 'completed', 'damaged', 'cancelled')),

  -- Payment
  rental_fee DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id TEXT,         -- For rental fee (captured)
  bond_payment_intent_id TEXT,           -- For bond (held, not captured)
  bond_status TEXT DEFAULT 'pending'
    CHECK (bond_status IN ('pending', 'held', 'released', 'partial_capture', 'full_capture')),
  bond_capture_reason TEXT,
  bond_capture_amount DECIMAL(10,2),

  -- Shipping
  shipping_address JSONB NOT NULL,
  tracking_outbound TEXT,
  tracking_return TEXT,
  delivery_notes TEXT,

  -- Timestamps
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  returned_at TIMESTAMPTZ,
  inspected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_product ON bookings(product_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_event_date ON bookings(event_date);
CREATE INDEX idx_bookings_dates ON bookings(rental_start, cleaning_end);
```

### Table: `inventory_blocks`

The availability engine. Prevents double-booking by blocking date ranges.

```sql
CREATE TABLE public.inventory_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_size_id UUID NOT NULL REFERENCES product_sizes(id),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  block_start DATE NOT NULL,
  block_end DATE NOT NULL,
  reason TEXT NOT NULL DEFAULT 'rental'
    CHECK (reason IN ('rental', 'maintenance', 'reserved')),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure block_start <= block_end
  CONSTRAINT chk_block_dates CHECK (block_start <= block_end)
);

CREATE INDEX idx_inventory_blocks_product ON inventory_blocks(product_id);
CREATE INDEX idx_inventory_blocks_size ON inventory_blocks(product_size_id);
CREATE INDEX idx_inventory_blocks_dates ON inventory_blocks(block_start, block_end);
CREATE INDEX idx_inventory_blocks_overlap ON inventory_blocks(product_id, product_size_id, block_start, block_end);
```

### Table: `shipping_addresses`

Saved addresses for repeat customers.

```sql
CREATE TABLE public.shipping_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  suburb TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT')),
  postcode TEXT NOT NULL CHECK (postcode ~ '^\d{4}$'),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shipping_addresses_user ON shipping_addresses(user_id);
```

### Database Function: Availability Check

Move the availability check to the database for atomicity and race condition prevention.

```sql
CREATE OR REPLACE FUNCTION public.check_availability(
  p_product_id UUID,
  p_product_size_id UUID,
  p_event_date DATE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_rental_start DATE;
  v_cleaning_end DATE;
  v_conflict_count INTEGER;
BEGIN
  -- Calculate blocking period
  v_rental_start := p_event_date - INTERVAL '3 days';
  v_cleaning_end := p_event_date + INTERVAL '7 days';
  -- 7 days = 4 days (event + return buffer) + 3 days (cleaning)

  -- Check for overlapping blocks
  SELECT COUNT(*) INTO v_conflict_count
  FROM inventory_blocks
  WHERE product_id = p_product_id
    AND product_size_id = p_product_size_id
    AND block_start <= v_cleaning_end
    AND block_end >= v_rental_start;

  RETURN v_conflict_count = 0;
END;
$$;
```

### Database Function: Create Booking (Atomic)

Atomic booking creation to prevent race conditions.

```sql
CREATE OR REPLACE FUNCTION public.create_booking_atomic(
  p_user_id UUID,
  p_product_id UUID,
  p_product_size_id UUID,
  p_size TEXT,
  p_event_date DATE,
  p_rental_fee DECIMAL,
  p_shipping_address JSONB,
  p_delivery_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_booking_id UUID;
  v_rental_start DATE;
  v_rental_end DATE;
  v_cleaning_end DATE;
  v_is_available BOOLEAN;
BEGIN
  -- Calculate dates
  v_rental_start := p_event_date - INTERVAL '3 days';
  v_rental_end := p_event_date + INTERVAL '4 days';
  v_cleaning_end := v_rental_end + INTERVAL '3 days';

  -- Lock and check availability (prevents race conditions)
  PERFORM 1
  FROM inventory_blocks
  WHERE product_id = p_product_id
    AND product_size_id = p_product_size_id
    AND block_start <= v_cleaning_end
    AND block_end >= v_rental_start
  FOR UPDATE;

  v_is_available := check_availability(p_product_id, p_product_size_id, p_event_date);

  IF NOT v_is_available THEN
    RAISE EXCEPTION 'Product not available for selected dates'
      USING ERRCODE = 'P0001';
  END IF;

  -- Create booking
  INSERT INTO bookings (
    user_id, product_id, product_size_id, size,
    event_date, rental_start, rental_end, cleaning_end,
    rental_fee, shipping_address, delivery_notes, status
  ) VALUES (
    p_user_id, p_product_id, p_product_size_id, p_size,
    p_event_date, v_rental_start, v_rental_end, v_cleaning_end,
    p_rental_fee, p_shipping_address, p_delivery_notes, 'pending'
  )
  RETURNING id INTO v_booking_id;

  -- Create inventory block
  INSERT INTO inventory_blocks (
    product_id, product_size_id, booking_id,
    block_start, block_end, reason
  ) VALUES (
    p_product_id, p_product_size_id, v_booking_id,
    v_rental_start, v_cleaning_end, 'rental'
  );

  RETURN v_booking_id;
END;
$$;
```

---

## Row Level Security (RLS) Policies

### Admin Helper Function

```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$;
```

### Products Table (Public Read, Admin Write)

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Anyone can read available products
CREATE POLICY "Public can view available products"
  ON products FOR SELECT
  USING (status != 'retired');

-- Only admins can insert/update/delete
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

### Bookings Table (User Owns, Admin All)

```sql
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY "Users view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_admin());

-- Users can create bookings for themselves
CREATE POLICY "Users create own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Only admins can update bookings (status changes)
CREATE POLICY "Admins update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (is_admin());

-- No one can delete bookings (soft delete via status = 'cancelled')
```

### Inventory Blocks (System-Managed)

```sql
ALTER TABLE inventory_blocks ENABLE ROW LEVEL SECURITY;

-- Public can read (needed for availability calendar)
CREATE POLICY "Public can read inventory blocks"
  ON inventory_blocks FOR SELECT
  USING (true);

-- Only created through database functions (service role)
-- No direct INSERT/UPDATE/DELETE policies for users
CREATE POLICY "Admins manage inventory blocks"
  ON inventory_blocks FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

### Profiles (User Owns, Admin All)

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

---

## Stripe Integration Architecture

### Two-PaymentIntent Strategy

ASHIKA uses two separate Stripe PaymentIntents per checkout:

1. **Rental Fee PaymentIntent** -- `capture_method: 'automatic'`
   - Charges immediately on confirmation
   - Amount: rental_price of each item

2. **Bond PaymentIntent** -- `capture_method: 'manual'`
   - Pre-authorizes $100 per item (held, not captured)
   - Released after successful return/inspection
   - Captured (partially or fully) if item is damaged

**Why two PaymentIntents:** Stripe only allows one capture per manual-capture PaymentIntent. Separating rental fee (immediate) from bond (hold) gives clean lifecycle management.

### Payment Flow

```
Client                    API Route                  Stripe              Database
  |                         |                         |                    |
  |-- POST /api/checkout -->|                         |                    |
  |                         |-- Create rental PI ---->|                    |
  |                         |<-- client_secret -------|                    |
  |                         |-- Create bond PI ------>|                    |
  |                         |   (capture_method:      |                    |
  |                         |    manual)              |                    |
  |                         |<-- client_secret -------|                    |
  |                         |                         |                    |
  |                         |-- create_booking_atomic()----->|             |
  |                         |<-- booking_id ---------|<-----|             |
  |                         |                         |                    |
  |<-- { clientSecrets } ---|                         |                    |
  |                         |                         |                    |
  |-- confirmCardPayment -->|                         |                    |
  |   (rental PI)           |                         |                    |
  |-- confirmCardPayment -->|                         |                    |
  |   (bond PI)             |                         |                    |
  |                         |                         |                    |
  |                         |<-- webhook: ------------|                    |
  |                         |   payment_intent.       |                    |
  |                         |   succeeded (rental)    |                    |
  |                         |                         |                    |
  |                         |-- UPDATE booking ------>|----->|             |
  |                         |   status='confirmed'    |                    |
  |                         |   bond_status='held'    |                    |
```

### Stripe Webhook Events to Handle

| Event | Action |
|-------|--------|
| `payment_intent.succeeded` | Confirm booking, update status |
| `payment_intent.payment_failed` | Mark booking failed, release inventory block |
| `payment_intent.canceled` | Release inventory block (bond released) |
| `payment_intent.amount_capturable_updated` | Bond authorized, update bond_status to 'held' |

### Authorization Window

Per Stripe official docs:
- **Visa/Mastercard/Amex/Discover:** 7-day hold for online payments
- **Extended authorization:** Up to 30 days (requires IC+ pricing, request with `request_extended_authorization: 'if_available'`)

For ASHIKA: The rental period is 7 days + 3-day cleaning = 10 days total. **Standard 7-day auth is NOT enough.** Options:
1. Request extended authorization (recommended)
2. Save payment method and create a new charge if needed (fallback)

**Recommendation:** Use `request_extended_authorization: 'if_available'` on the bond PaymentIntent. If extended auth is not available for the card, save the payment method as fallback.

### Webhook Route Implementation

```typescript
// src/app/api/webhooks/stripe/route.ts
import Stripe from 'stripe';
import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
// Use service role for webhook processing (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body, sig, process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return Response.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent;
      const bookingId = pi.metadata.booking_id;
      const paymentType = pi.metadata.payment_type; // 'rental' or 'bond'

      if (paymentType === 'rental') {
        await supabase
          .from('bookings')
          .update({
            status: 'confirmed',
            stripe_payment_intent_id: pi.id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', bookingId);
      }
      break;
    }

    case 'payment_intent.amount_capturable_updated': {
      const pi = event.data.object as Stripe.PaymentIntent;
      const bookingId = pi.metadata.booking_id;

      if (pi.metadata.payment_type === 'bond') {
        await supabase
          .from('bookings')
          .update({
            bond_status: 'held',
            bond_payment_intent_id: pi.id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', bookingId);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent;
      const bookingId = pi.metadata.booking_id;

      // Cancel booking and release inventory
      await supabase
        .from('bookings')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      await supabase
        .from('inventory_blocks')
        .delete()
        .eq('booking_id', bookingId);
      break;
    }
  }

  return Response.json({ received: true });
}
```

---

## Component Architecture: Server vs Client Split

### Principle

Default to Server Components. Only add `'use client'` when the component needs:
- Browser APIs (localStorage, window)
- Event handlers (onClick, onChange)
- React hooks (useState, useEffect, useContext)
- Animations/transitions with JS

### Server Components (No `'use client'`)

| Component/Page | Why Server |
|----------------|-----------|
| `app/page.tsx` (Home) | Static content, fetch featured products server-side |
| `app/shop/page.tsx` (Shop listing) | Fetch products server-side, pass to client filter component |
| `app/shop/[id]/page.tsx` (Product detail) | Fetch product data server-side, SSR for SEO |
| `app/about/page.tsx` | Static content |
| `app/faq/page.tsx` | Static content |
| `app/privacy/page.tsx`, `app/terms/page.tsx` | Static content |
| `components/layout/footer.tsx` | Static, no interactivity |

### Client Components (`'use client'`)

| Component | Why Client |
|-----------|-----------|
| `components/layout/header.tsx` | Mobile nav toggle, cart button state |
| `components/layout/mobile-nav.tsx` | Toggle visibility |
| `components/product/product-filters.tsx` | Filter state, URL manipulation |
| `components/product/sort-dropdown.tsx` | Dropdown state |
| `components/booking/availability-calendar.tsx` | Date selection, month navigation |
| `components/booking/date-selector.tsx` | Date picker interaction |
| `components/cart/cart-drawer.tsx` | Open/close state, animations |
| `components/cart/cart-button.tsx` | Cart count badge, click handler |
| `components/checkout/shipping-form.tsx` | Form state, validation |
| `components/checkout/payment-form.tsx` | Stripe Elements, form state |
| `app/checkout/page.tsx` | Multi-step form state |
| `contexts/cart-context.tsx` | Global state, localStorage |

### Hybrid Pattern: Server Layout with Client Islands

```
app/shop/[id]/page.tsx (SERVER)
  |-- Fetches product data from Supabase
  |-- Renders product images, description (static)
  |-- Renders ProductInfo (SERVER - static product details)
  |
  |-- <AvailabilityCalendar /> (CLIENT)
  |     |-- Interactive date selection
  |     |-- Calls API to check availability
  |
  |-- <AddToCartButton /> (CLIENT)
  |     |-- Uses cart context
  |     |-- Click handler
  |
  |-- <RelatedProducts /> (SERVER)
        |-- Fetches related products server-side
```

---

## API Route Structure

### Routes Needed

```
src/app/api/
  |-- products/
  |     |-- route.ts              GET: List products (with filters)
  |     |-- [id]/
  |           |-- route.ts        GET: Single product
  |           |-- availability/
  |                 |-- route.ts  GET: Check availability for date
  |
  |-- bookings/
  |     |-- route.ts              POST: Create booking
  |     |-- [id]/
  |           |-- route.ts        GET: Booking details
  |           |-- cancel/
  |                 |-- route.ts  POST: Cancel booking
  |
  |-- checkout/
  |     |-- route.ts              POST: Create payment intents
  |     |-- confirm/
  |           |-- route.ts        POST: Confirm after payment
  |
  |-- webhooks/
  |     |-- stripe/
  |           |-- route.ts        POST: Stripe webhook handler
  |
  |-- admin/
        |-- bookings/
        |     |-- route.ts        GET: All bookings (admin)
        |     |-- [id]/
        |           |-- status/
        |                 |-- route.ts  PATCH: Update status
        |           |-- bond/
        |                 |-- route.ts  POST: Capture/release bond
        |
        |-- products/
              |-- route.ts        POST: Create product
              |-- [id]/
                    |-- route.ts  PUT: Update, DELETE: Remove
```

### When to Use API Routes vs Server Actions

| Operation | Approach | Reason |
|-----------|----------|--------|
| Fetch product list | Server Component (direct Supabase query) | No client interaction needed |
| Check availability | API Route (GET) | Called dynamically from calendar component |
| Create booking | API Route (POST) | Complex multi-step with Stripe integration |
| Update profile | Server Action | Simple form mutation |
| Stripe webhooks | API Route (POST) | External service calling in |
| Admin status update | API Route (PATCH) | Needs fine-grained error handling |
| Add to cart | Client-only (context) | No server persistence needed for cart |

---

## Supabase Storage: Image Organization

### Bucket Structure

```
product-images/           (PUBLIC bucket)
  |-- {product_id}/
  |     |-- main.webp             Primary/thumbnail image
  |     |-- gallery-1.webp        Additional angles
  |     |-- gallery-2.webp
  |     |-- gallery-3.webp
  |     |-- gallery-4.webp
  |
user-avatars/             (PUBLIC bucket)
  |-- {user_id}/
        |-- avatar.webp

admin-uploads/            (PRIVATE bucket)
  |-- returns/
  |     |-- {booking_id}/
  |           |-- inspection-1.webp   Return condition photos
  |           |-- inspection-2.webp
  |
  |-- shipping-labels/
        |-- {booking_id}/
              |-- outbound.pdf
              |-- return.pdf
```

### Bucket Configuration

| Bucket | Access | Max File Size | Allowed Types |
|--------|--------|--------------|---------------|
| `product-images` | Public | 5MB | image/webp, image/jpeg, image/png |
| `user-avatars` | Public | 2MB | image/webp, image/jpeg, image/png |
| `admin-uploads` | Private | 10MB | image/*, application/pdf |

### Image URL Pattern

Public bucket images are accessible at:
```
https://{project_ref}.supabase.co/storage/v1/object/public/product-images/{product_id}/main.webp
```

Store only the path (`{product_id}/main.webp`) in the database. Construct full URL at query time using the Supabase client.

### Image Optimization

Use Supabase's built-in image transformation for responsive images:
```
/storage/v1/render/image/public/product-images/{path}?width=400&height=600&resize=cover
```

This avoids storing multiple sizes and leverages CDN-cached transformations.

---

## Data Flow: Complete Booking Lifecycle

### Phase 1: Browse and Select

```
1. User visits /shop
2. Server Component fetches products from Supabase (with filters)
3. User selects product, navigates to /shop/[id]
4. Server Component fetches product details + sizes
5. Client AvailabilityCalendar calls GET /api/products/[id]/availability?month=2026-02
6. API route queries inventory_blocks table for that product/month
7. Calendar renders available/blocked dates
8. User selects event date + size
9. Client adds to cart (localStorage via CartContext)
```

### Phase 2: Checkout

```
1. User navigates to /checkout
2. Client renders ShippingForm (from cart context data)
3. User fills shipping details, submits
4. Client renders PaymentForm
5. User clicks "Pay"
6. Client calls POST /api/checkout with:
   - cart items (product_id, size, event_date)
   - shipping address
7. API Route:
   a. Validates all items still available (calls check_availability for each)
   b. Creates booking records (calls create_booking_atomic for each)
   c. Creates Stripe PaymentIntent for rental fee (automatic capture)
   d. Creates Stripe PaymentIntent for bond (manual capture)
   e. Returns { clientSecrets, bookingIds }
8. Client uses Stripe.js to confirm both PaymentIntents
9. On success, redirects to /checkout/success
```

### Phase 3: Fulfillment (Admin)

```
1. Stripe webhook: payment_intent.succeeded
2. Webhook handler updates booking status to 'confirmed'
3. Admin views confirmed bookings in admin panel
4. Admin generates AusPost shipping label
5. Admin ships item, updates status to 'shipped', adds tracking
6. (Optional) Email notification to customer with tracking
7. Customer receives item, status to 'delivered'
```

### Phase 4: Return and Inspection

```
1. Customer returns item (pre-paid return label)
2. Admin receives return, updates status to 'returned' then 'inspecting'
3. Admin inspects item:
   a. OK: Release bond (cancel bond PaymentIntent)
   b. Damaged: Capture bond (full or partial)
4. Update booking status to 'completed' or 'damaged'
5. Inventory block naturally expires (block_end has passed)
6. Product available for next rental
```

---

## Supabase Client Architecture

### Three Client Types

```typescript
// 1. Browser Client (for client components)
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// 2. Server Client (for server components, API routes, server actions)
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

// 3. Admin/Service Client (for webhooks, background jobs)
// src/lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!  // Bypasses RLS
  );
}
```

### Package: `@supabase/ssr`

The `@supabase/ssr` package (replaces the older `@supabase/auth-helpers-nextjs`) is the recommended way to use Supabase with Next.js App Router. It handles cookie-based auth sessions correctly for both server and client components.

---

## Build Order (Dependencies)

This is the recommended implementation sequence based on what depends on what:

```
Phase 1: Database Foundation
  |-- Supabase project setup
  |-- Create tables (products, product_sizes, profiles)
  |-- Create RLS policies for products (public read)
  |-- Seed product data (migrate from mock-data)
  |-- Set up Supabase Storage buckets
  |-- Upload product images
  |
  v
Phase 2: Auth + Supabase Client
  |-- Install @supabase/ssr
  |-- Create browser/server/admin clients
  |-- Create auth middleware (src/middleware.ts)
  |-- Build login/signup pages
  |-- Create profile trigger + RLS
  |-- Connect product pages to real Supabase data
  |     (replace mock-data imports)
  |
  v
Phase 3: Booking System
  |-- Create bookings + inventory_blocks tables
  |-- Create check_availability function
  |-- Create create_booking_atomic function
  |-- Build GET /api/products/[id]/availability route
  |-- Connect AvailabilityCalendar to real API
  |-- Build POST /api/bookings route
  |-- Build booking RLS policies
  |
  v
Phase 4: Stripe Payments
  |-- Install stripe + @stripe/stripe-js
  |-- Build POST /api/checkout route
  |     (creates rental + bond PaymentIntents)
  |-- Replace PaymentForm with Stripe Elements
  |-- Build Stripe webhook route
  |-- Handle payment_intent.succeeded
  |-- Handle payment_intent.payment_failed
  |-- Handle bond authorization events
  |-- Test end-to-end checkout flow
  |
  v
Phase 5: Admin Panel
  |-- Build /admin layout (admin-only access)
  |-- Booking management (list, status updates)
  |-- Bond capture/release UI
  |-- Product management (CRUD)
  |-- Shipping label generation (AusPost API)
  |
  v
Phase 6: Polish + Production
  |-- Email notifications (booking confirmed, shipped, etc.)
  |-- Error handling + user feedback
  |-- Rate limiting on API routes
  |-- Monitoring + logging
  |-- Production Stripe keys + webhook
```

### Why This Order

1. **Database first** because everything else reads/writes to it.
2. **Auth before booking** because bookings require a `user_id`.
3. **Booking before Stripe** because Stripe confirms a booking that already exists.
4. **Stripe before admin** because admin actions (bond capture) use Stripe APIs.
5. **Admin last** because it operates on data created by user flows.

---

## Anti-Patterns to Avoid

### 1. Client-Side Availability Checks Only

**What:** Checking availability in JavaScript on the client, then trusting the result.
**Why bad:** Race conditions. Two users could both see "available" and both book.
**Instead:** Always validate availability server-side in a database transaction (the `create_booking_atomic` function with `FOR UPDATE` locking).

### 2. Storing Full Stripe Keys in Client Code

**What:** Using `STRIPE_SECRET_KEY` in client components.
**Why bad:** Exposes secret key to the browser.
**Instead:** Only `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` goes to client. All secret-key operations happen in API routes.

### 3. Single PaymentIntent for Rental + Bond

**What:** Combining rental fee and bond into one payment.
**Why bad:** You cannot partially capture automatic payments; manual capture only allows one capture.
**Instead:** Use two separate PaymentIntents (rental: automatic, bond: manual).

### 4. Trusting Client-Submitted Prices

**What:** Client sends `rental_fee: 50` and server uses it.
**Why bad:** Users can manipulate the amount.
**Instead:** Server always looks up the product price from the database. Client-submitted price is for display only.

### 5. No Webhook Handler

**What:** Relying solely on client-side redirect after payment.
**Why bad:** Network issues, browser closure, or payment delays mean the booking never gets confirmed.
**Instead:** Always use Stripe webhooks as the source of truth for payment status.

### 6. Bypassing RLS with Service Role in Client Code

**What:** Using `SUPABASE_SERVICE_ROLE_KEY` in browser-accessible code.
**Why bad:** Gives unrestricted database access to anyone who inspects the page.
**Instead:** Service role key only in API routes, server actions, and webhooks. Client code uses anon key with RLS.

---

## Environment Variables

```bash
# .env.local (never committed)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Server-only, never NEXT_PUBLIC_

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...  # Server-only
STRIPE_WEBHOOK_SECRET=whsec_...  # Server-only

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Rule:** Only `NEXT_PUBLIC_*` variables are exposed to the browser. Everything else stays server-side.

---

## Scalability Considerations

| Concern | At Launch (100 users) | At Scale (10K users) |
|---------|----------------------|---------------------|
| Availability checks | Direct DB query | Add Redis cache for hot products |
| Image serving | Supabase CDN | Supabase CDN (already edge-cached) |
| Webhook processing | Synchronous in route | Add job queue (Inngest/QStash) |
| Search | PostgreSQL LIKE/ILIKE | Add pg_trgm or external search |
| Admin notifications | Email only | Slack/webhook integration |

At ASHIKA's scale (niche Australian market, inventory <200 items), direct Supabase queries with proper indexes will handle the load comfortably. No need to over-engineer.

---

## Sources

- [Stripe: Place a hold on a payment method](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method) -- HIGH confidence
- [Stripe: Extended authorizations](https://docs.stripe.com/payments/extended-authorization) -- HIGH confidence
- [Stripe: Capture a PaymentIntent](https://docs.stripe.com/api/payment_intents/capture) -- HIGH confidence
- [Stripe: Handle payment events with webhooks](https://docs.stripe.com/webhooks/handling-payment-events) -- HIGH confidence
- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) -- HIGH confidence
- [Supabase: Storage Buckets Fundamentals](https://supabase.com/docs/guides/storage/buckets/fundamentals) -- HIGH confidence
- [Supabase: Database Overview](https://supabase.com/docs/guides/database/overview) -- HIGH confidence
- [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) -- HIGH confidence
- [MakerKit: API Routes vs Server Actions](https://makerkit.dev/docs/next-supabase/how-to/api/api-routes-vs-server-actions) -- MEDIUM confidence
- [DEV: Managing Calendar Availability in Supabase](https://dev.to/ivaaan/managing-calendar-availability-in-supabase-307d) -- MEDIUM confidence
- [Stackademic: Stripe Payment Elements with Next.js 14](https://blog.stackademic.com/integrating-stripe-payment-elements-with-next-js-14-app-router-webhooks-typescript-4d6eb7710c40) -- MEDIUM confidence
