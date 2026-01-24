# Technology Stack

**Project:** ASHIKA - Indian Wear Hire Australia
**Researched:** 2026-01-24
**Mode:** Ecosystem (Stack dimension)
**Overall Confidence:** HIGH

---

## Recommended Stack

The stack is locked per project directives. This document verifies versions, documents integration patterns, and identifies gaps between what's installed and what's needed for production.

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Next.js | 14.2.35 | Full-stack framework | App Router for SSR/SSG, API routes for backend. **CRITICAL: Must upgrade from 14.2.35 (current) to address CVE-2025-66478 (RCE), CVE-2025-55184 (DoS), CVE-2025-55183 (source exposure).** | HIGH |
| TypeScript | ^5 | Type safety | Already installed. Strict types prevent rental logic bugs. | HIGH |
| React | ^18 | UI library | Already installed. Server Components for catalog, Client Components for interactive booking. | HIGH |

**Security Note:** The project currently has `next@14.2.35` which IS the latest patched 14.x version. Confirmed via Next.js security advisory (Dec 11, 2025). No further action needed unless migrating to 15.x.

### Database & Backend

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| @supabase/supabase-js | ^2.80.0 | Database client | Isomorphic JS client for Supabase. Supports typed queries, realtime, storage. **NOT YET INSTALLED.** | HIGH |
| @supabase/ssr | ^0.8.0 | Server-side auth | Cookie-based auth for Next.js App Router. Replaces deprecated @supabase/auth-helpers-nextjs. **NOT YET INSTALLED.** | HIGH |
| Supabase (PostgreSQL) | Latest | Database + Auth + Storage | Free tier: 500MB DB, 1GB storage, 50K MAU. Sufficient for 10-30 products at launch. | HIGH |

### Payments

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| stripe | ^20.2.0 | Server-side Stripe SDK | Latest version, API `2025-12-15.clover`. Supports `capture_method: 'manual'` for bond pre-auth. **NOT YET INSTALLED.** | HIGH |
| @stripe/stripe-js | ^8.6.1 | Client-side Stripe.js | Loads Stripe.js for Payment Element. **NOT YET INSTALLED.** | HIGH |
| @stripe/react-stripe-js | latest | React components | Elements provider and PaymentElement wrapper. **NOT YET INSTALLED.** | MEDIUM |

### Styling & UI

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Tailwind CSS | ^3.4.1 | Utility-first CSS | Already installed. Brand colors configured in tailwind.config.ts. | HIGH |
| lucide-react | latest | Icons | Already installed. Consistent icon set. | HIGH |
| clsx + tailwind-merge | ^2 | Class composition | Already installed. cn() utility for conditional classes. | HIGH |

### Supporting Libraries (Already Installed)

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| date-fns | ^3 | Date manipulation | Installed. Note: v4.1.0 exists with timezone support, but v3 is sufficient for AU-only timezone. |
| zod | ^3 | Schema validation | Installed. Used for booking form validation, API input validation. |
| react-hook-form | ^7 | Form state management | Installed. Pairs with zod via @hookform/resolvers. |
| @hookform/resolvers | ^3 | Zod + RHF bridge | Installed. |

### Libraries to Add

| Library | Version | Purpose | When to Add |
|---------|---------|---------|-------------|
| @supabase/supabase-js | ^2.80.0 | Database client | Phase 1: Database setup |
| @supabase/ssr | ^0.8.0 | SSR auth | Phase 1: Auth setup |
| stripe | ^20.2.0 | Server payments | Phase 3: Payments |
| @stripe/stripe-js | ^8.6.1 | Client payments | Phase 3: Payments |
| @stripe/react-stripe-js | ^2.10.0 | React Stripe Elements | Phase 3: Payments |

---

## Supabase Integration Patterns

### Three-Client Architecture (CRITICAL)

The `@supabase/ssr` package requires THREE separate Supabase clients. This is the 2025 standard pattern, replacing the deprecated auth-helpers approach.

```typescript
// lib/supabase/client.ts — Browser Client
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

```typescript
// lib/supabase/server.ts — Server Client (Server Components, Route Handlers, Server Actions)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component — ignore
          }
        },
      },
    }
  );
}
```

```typescript
// middleware.ts — Session Refresh
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Call getUser() to refresh token
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
```

**Why middleware is essential:** Server Components cannot write cookies. The middleware refreshes expired auth tokens and passes them to both server components and the browser. Without this, auth sessions silently expire.

### Database Schema Pattern for Rental/Booking

```sql
-- Core tables for rental marketplace

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('saree', 'lehenga', 'salwar-kameez', 'anarkali', 'sharara', 'gharara')),
  rental_price DECIMAL(10,2) NOT NULL,
  bond_amount DECIMAL(10,2) NOT NULL DEFAULT 100.00,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  fabric TEXT,
  blouse_included BOOLEAN DEFAULT false,
  images TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'unavailable', 'maintenance')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  product_id UUID NOT NULL REFERENCES products(id),
  event_date DATE NOT NULL,
  rental_start DATE NOT NULL,  -- event_date - 3 days
  rental_end DATE NOT NULL,    -- event_date + 3 days
  cleaning_end DATE NOT NULL,  -- rental_end + 3 days
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'shipped', 'delivered',
    'returned', 'inspecting', 'completed', 'damaged', 'cancelled'
  )),
  -- Payment
  rental_payment_intent_id TEXT,
  bond_payment_intent_id TEXT,
  bond_status TEXT DEFAULT 'held' CHECK (bond_status IN ('held', 'released', 'partial_capture', 'full_capture')),
  bond_capture_reason TEXT,
  -- Shipping
  shipping_address JSONB NOT NULL,
  outbound_tracking TEXT,
  return_tracking TEXT,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  returned_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  -- Constraints
  CONSTRAINT valid_dates CHECK (rental_start < rental_end AND rental_end < cleaning_end),
  CONSTRAINT future_event CHECK (event_date > CURRENT_DATE)
);

-- Inventory blocks (prevents double-booking)
CREATE TABLE inventory_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  booking_id UUID REFERENCES bookings(id),
  block_start DATE NOT NULL,
  block_end DATE NOT NULL,
  block_type TEXT NOT NULL DEFAULT 'booking' CHECK (block_type IN ('booking', 'maintenance', 'cleaning')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Exclusion constraint to prevent overlapping blocks for same product
  CONSTRAINT no_overlap EXCLUDE USING gist (
    product_id WITH =,
    daterange(block_start, block_end, '[]') WITH &&
  )
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_product ON bookings(product_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_inventory_blocks_product ON inventory_blocks(product_id);
CREATE INDEX idx_inventory_blocks_dates ON inventory_blocks(block_start, block_end);
```

**Key pattern: PostgreSQL EXCLUDE constraint.** This is the gold standard for preventing overlapping date ranges at the database level. It uses a GiST index on `daterange()` to atomically reject any INSERT that would overlap an existing block for the same product. This is far more reliable than application-level checks alone.

**Requirement:** The `btree_gist` extension must be enabled in Supabase:
```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;
```

### Row Level Security (RLS) Policies

```sql
-- Products: Public read, admin write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly viewable"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify products"
  ON products FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Bookings: Users see own, admin sees all
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all bookings"
  ON bookings FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Inventory blocks: Public read for availability checking
ALTER TABLE inventory_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can check availability"
  ON inventory_blocks FOR SELECT
  USING (true);

CREATE POLICY "System creates blocks"
  ON inventory_blocks FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.uid() IS NOT NULL);
```

### Trigger for Automatic Date Calculation

```sql
-- Auto-calculate rental dates from event_date
CREATE OR REPLACE FUNCTION calculate_rental_dates()
RETURNS TRIGGER AS $$
BEGIN
  NEW.rental_start := NEW.event_date - INTERVAL '3 days';
  NEW.rental_end := NEW.event_date + INTERVAL '3 days';
  NEW.cleaning_end := NEW.rental_end + INTERVAL '3 days';
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_rental_dates
  BEFORE INSERT OR UPDATE OF event_date ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION calculate_rental_dates();
```

---

## Stripe Pre-Authorization Pattern (Bond Hold)

### How It Works for ASHIKA

The $100 bond uses Stripe's `capture_method: 'manual'` to place a hold without charging. The rental fee is a separate, immediately captured payment.

```typescript
// Two-payment approach for rental + bond

// 1. Rental Payment (immediate capture)
const rentalPayment = await stripe.paymentIntents.create({
  amount: rentalPrice * 100, // cents
  currency: 'aud',
  customer: stripeCustomerId,
  payment_method: paymentMethodId,
  confirm: true,
  metadata: {
    booking_id: bookingId,
    type: 'rental',
  },
});

// 2. Bond Hold (manual capture - NOT charged until damage)
const bondHold = await stripe.paymentIntents.create({
  amount: 10000, // $100 in cents
  currency: 'aud',
  customer: stripeCustomerId,
  payment_method: paymentMethodId,
  capture_method: 'manual', // <-- KEY: holds funds without charging
  confirm: true,
  metadata: {
    booking_id: bookingId,
    type: 'bond',
  },
});
```

### Authorization Window

| Card Network | Hold Duration | Notes |
|-------------|--------------|-------|
| Visa (customer-initiated) | 7 days | Standard window |
| Mastercard | 7 days | Standard window |
| Amex | 7 days | Standard window |

**CRITICAL CONSTRAINT:** The 7-day authorization window matches the rental period exactly. For the 7-day rental cycle (3 days pre-event + event day + 3 days post-event), the bond hold will expire RIGHT at the return deadline. This means:

- You MUST capture or release the bond BEFORE it expires (within 7 days)
- For late returns (grace period + 3 days), the hold may expire before you can capture
- **Mitigation:** Use Stripe's extended authorization (up to 30 days) if eligible, OR create a new charge for late returns instead of capturing the expired hold

### Bond Release (Successful Return)

```typescript
async function releaseBond(bookingId: string) {
  const booking = await getBooking(bookingId);
  // Cancel the PaymentIntent to release the hold
  await stripe.paymentIntents.cancel(booking.bond_payment_intent_id);
  await updateBooking(bookingId, { bond_status: 'released' });
}
```

### Bond Capture (Damage Detected)

```typescript
async function captureBond(bookingId: string, amount: number, reason: string) {
  const booking = await getBooking(bookingId);
  // Capture full or partial amount
  await stripe.paymentIntents.capture(booking.bond_payment_intent_id, {
    amount_to_capture: amount * 100, // cents
  });
  await updateBooking(bookingId, {
    bond_status: amount >= 100 ? 'full_capture' : 'partial_capture',
    bond_capture_reason: reason,
  });
}
```

### Webhook Handling

```typescript
// app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      // Rental payment confirmed - create booking + inventory block
      break;
    case 'payment_intent.amount_capturable_updated':
      // Bond hold confirmed - update booking status
      break;
    case 'payment_intent.canceled':
      // Bond released or payment cancelled
      break;
    case 'payment_intent.payment_failed':
      // Handle failure - notify user
      break;
  }

  return NextResponse.json({ received: true });
}
```

---

## Australia Post API Integration

### Authentication Flow

Australia Post uses OAuth 2.0 Client Credentials grant. You need a parcel contract to access the Shipping & Tracking API.

**Prerequisites:**
1. MyPost Business account
2. Active parcel contract with Australia Post
3. Developer Portal registration (approval within 24 hours)
4. Client credentials (client_id, client_secret) provided in PDF

### Token Exchange

```typescript
// lib/auspost/auth.ts
interface AusPostToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getAusPostToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const response = await fetch('https://digitalapi.auspost.com.au/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.AUSPOST_CLIENT_ID!,
      client_secret: process.env.AUSPOST_CLIENT_SECRET!,
    }),
  });

  const data: AusPostToken = await response.json();

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000, // 60s buffer
  };

  return data.access_token;
}
```

### Label Creation Flow

```typescript
// lib/auspost/shipping.ts
export async function createShipment(booking: Booking) {
  const token = await getAusPostToken();

  // 1. Create shipment
  const shipment = await fetch('https://digitalapi.auspost.com.au/shipping/v1/shipments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      shipments: [{
        shipment_reference: booking.id,
        from: {
          name: 'ASHIKA',
          lines: ['Business Address Line 1'],
          suburb: 'SUBURB',
          state: 'NSW',
          postcode: '2000',
          country: 'AU',
        },
        to: {
          name: booking.shipping_address.name,
          lines: [booking.shipping_address.line1],
          suburb: booking.shipping_address.suburb,
          state: booking.shipping_address.state,
          postcode: booking.shipping_address.postcode,
          country: 'AU',
        },
        items: [{
          item_reference: `${booking.id}-1`,
          product_id: 'T28S', // Australia Post product code (e.g., Parcel Post Small)
          length: 40,
          width: 30,
          height: 10,
          weight: 2.0,
          authority_to_leave: false,
        }],
      }],
    }),
  });

  // 2. Get labels (PDF)
  const labels = await fetch(
    `https://digitalapi.auspost.com.au/shipping/v1/labels?shipment_ids=${shipmentId}`,
    {
      headers: { 'Authorization': `Bearer ${token}` },
    }
  );

  return { shipment, labels };
}
```

### Alternative: Shippo (Simpler, Has Node.js SDK)

If Australia Post's direct API proves too complex (requires contract, no Node.js SDK), Shippo provides a unified shipping API with first-class Node.js support:

```bash
npm install shippo
```

```typescript
import Shippo from 'shippo';

const shippo = new Shippo({ apiKeyHeader: process.env.SHIPPO_API_KEY });

// Create shipment with rates
const shipment = await shippo.shipments.create({
  addressFrom: { /* sender */ },
  addressTo: { /* recipient */ },
  parcels: [{ length: '40', width: '30', height: '10', weight: '2', massUnit: 'kg', distanceUnit: 'cm' }],
});

// Purchase label
const transaction = await shippo.transactions.create({
  rate: shipment.rates[0].objectId,
  labelFileType: 'PDF',
});
```

**Recommendation:** Start with direct Australia Post API if you already have a parcel contract. Fall back to Shippo if onboarding delays occur. Both support Australian domestic shipping.

---

## Image Strategy

### Free Tier Constraint

Supabase Image Transformations are **NOT available on the free tier**. This means no server-side resize/crop/WebP conversion via Supabase.

### Recommended Approach: Pre-optimize Before Upload

Since free tier prohibits image transformations, pre-optimize images before uploading:

1. **On upload (admin):** Resize to standard dimensions client-side before upload
2. **Store multiple sizes:** Upload 3 variants per image (thumbnail: 400px, medium: 800px, full: 1200px)
3. **Use WebP format:** Convert to WebP before upload for smaller file sizes
4. **Next.js Image component:** Use `next/image` with `remotePatterns` for Supabase Storage URLs

```typescript
// next.config.mjs
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
```

```typescript
// Usage in components
import Image from 'next/image';

export function ProductImage({ src, alt }: { src: string; alt: string }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const imageUrl = `${supabaseUrl}/storage/v1/object/public/products/${src}`;

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={800}
      height={1000}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-cover rounded-lg"
    />
  );
}
```

### Storage Bucket Structure

```
products/
  ├── {product-id}/
  │   ├── main-400.webp      (thumbnail for grid)
  │   ├── main-800.webp      (product card)
  │   ├── main-1200.webp     (product detail hero)
  │   ├── detail-1-800.webp  (gallery image 1)
  │   ├── detail-2-800.webp  (gallery image 2)
  │   └── detail-3-800.webp  (gallery image 3)
```

### Client-Side Compression (for Admin Upload)

```typescript
// Use browser-native canvas API for resize before upload
async function resizeImage(file: File, maxWidth: number): Promise<Blob> {
  const img = await createImageBitmap(file);
  const scale = maxWidth / img.width;
  const canvas = new OffscreenCanvas(maxWidth, img.height * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.convertToBlob({ type: 'image/webp', quality: 0.85 });
}
```

---

## Environment Variables Required

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Server-only, for admin operations

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Australia Post
AUSPOST_CLIENT_ID=your-client-id
AUSPOST_CLIENT_SECRET=your-client-secret

# App
NEXT_PUBLIC_APP_URL=https://ashika.com.au
```

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not Alternative |
|----------|-------------|-------------|---------------------|
| Database | Supabase (PostgreSQL) | PlanetScale, Neon | Supabase bundles auth + storage + realtime. Single vendor simplifies free tier. |
| Auth | Supabase Auth | Clerk, NextAuth | Supabase Auth is free with 50K MAU and integrates with RLS policies natively. Clerk adds cost. |
| Payments | Stripe (direct) | PayPal, Square | Stripe has best pre-auth/capture flow, TypeScript SDK, and AU support. |
| Shipping | Australia Post API (direct) | Shippo, EasyPost | Direct = no middleman cost. Shippo as fallback if onboarding delays. |
| Image CDN | Supabase Storage + next/image | Cloudinary, Imgix | Cloudinary free tier is generous BUT adds another vendor. Supabase Storage + manual optimization keeps stack simple. |
| Date library | date-fns v3 | Luxon, Day.js, Temporal | Already installed. Tree-shakable, immutable. v3 covers all rental date math needs. |
| Form management | react-hook-form + zod | Formik | Already installed. RHF is lighter, zod provides runtime validation + TypeScript inference. |
| State management | React Context + useState | Zustand, Jotai | 10-30 products, single-user sessions. No global state complexity needed at this scale. |
| CSS | Tailwind CSS | CSS Modules, Styled Components | Already installed. Utility-first matches component-based architecture. |
| Icons | lucide-react | Heroicons, Phosphor | Already installed. Tree-shakable, consistent design. |

---

## What NOT to Use

| Package | Why Avoid | Use Instead |
|---------|-----------|-------------|
| @supabase/auth-helpers-nextjs | DEPRECATED. Replaced by @supabase/ssr | @supabase/ssr ^0.8.0 |
| moment | 300KB+ bundle, mutable API | date-fns (tree-shakable) |
| axios | Unnecessary abstraction over fetch | Native fetch (built into Next.js with caching) |
| prisma | Adds ORM layer over Supabase. Bypasses RLS. | @supabase/supabase-js client with typed queries |
| lodash | Most utilities available natively in ES2020+ | Native Array/Object methods |
| styled-components | Conflicts with server components, adds runtime | Tailwind CSS |
| redux / zustand | Over-engineering for 10-30 product catalog | React Context + useState |
| next-auth / auth.js | Adds complexity when Supabase Auth handles everything | Supabase Auth via @supabase/ssr |
| sharp (for runtime resize) | Only works in Node.js runtime, not Edge. Image transforms should be pre-upload. | Pre-upload optimization + next/image |

---

## Installation Commands

```bash
# Phase 1: Database & Auth
npm install @supabase/supabase-js @supabase/ssr

# Phase 3: Payments
npm install stripe @stripe/stripe-js @stripe/react-stripe-js

# Dev tooling (if not already present)
npm install -D supabase  # Supabase CLI for migrations, type generation
```

### Supabase CLI Setup

```bash
# Initialize Supabase project (links to remote)
npx supabase init
npx supabase login
npx supabase link --project-ref your-project-ref

# Generate TypeScript types from database schema
npx supabase gen types typescript --linked > src/lib/supabase/types.ts

# Run migrations
npx supabase db push
```

---

## Supabase Realtime (Future Enhancement)

For showing live availability updates (e.g., "someone else is viewing this item"):

```typescript
// Subscribe to availability changes
const channel = supabase
  .channel('inventory-changes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'inventory_blocks',
    },
    (payload) => {
      // Refresh availability calendar when new block created
      invalidateAvailability(payload.new.product_id);
    }
  )
  .subscribe();
```

**Recommendation:** Defer Realtime to post-MVP. With 10-30 products and low concurrency, polling or page refresh is sufficient initially.

---

## Version Pinning Summary

| Package | Pin To | Reason |
|---------|--------|--------|
| next | 14.2.35 | Latest security-patched 14.x |
| @supabase/supabase-js | ^2.80.0 | Latest v2 (v3 not yet released) |
| @supabase/ssr | ^0.8.0 | Latest with cookie encode fix |
| stripe | ^20.2.0 | Latest with 2025-12-15 API |
| @stripe/stripe-js | ^8.6.1 | Latest v8 |
| date-fns | ^3 | Stable, sufficient for AU timezone |
| zod | ^3 | Stable, widely used |
| react-hook-form | ^7 | Stable v7 |

---

## Sources

### HIGH Confidence (Official Documentation)
- [Stripe: Place a Hold on Payment Method](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method)
- [Stripe: Extended Authorizations](https://docs.stripe.com/payments/extended-authorization)
- [Stripe: Capture a PaymentIntent](https://stripe.com/docs/api/payment_intents/capture)
- [Supabase: Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase: Creating a Client for SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase: Storage Image Transformations](https://supabase.com/docs/guides/storage/serving/image-transformations)
- [Supabase: Database Functions](https://supabase.com/docs/guides/database/functions)
- [Supabase: Postgres Triggers](https://supabase.com/docs/guides/database/postgres/triggers)
- [Next.js Security Update Dec 2025](https://nextjs.org/blog/security-update-2025-12-11)
- [Australia Post Developer Portal](https://developers.auspost.com.au/apis)
- [Australia Post Shipping API Docs](https://auspost.com.au/lodgement/api/documentation/)

### MEDIUM Confidence (npm + Verified Multiple Sources)
- [@supabase/supabase-js npm](https://www.npmjs.com/package/@supabase/supabase-js) - v2.80.0
- [@supabase/ssr npm](https://www.npmjs.com/package/@supabase/ssr) - v0.8.0
- [stripe npm](https://www.npmjs.com/package/stripe) - v20.2.0
- [@stripe/stripe-js npm](https://www.npmjs.com/package/@stripe/stripe-js) - v8.6.1
- [Supabase Pricing](https://supabase.com/pricing) - Free tier limits
- [Supabase Realtime Presence](https://supabase.com/docs/guides/realtime/presence)

### LOW Confidence (Needs Validation)
- Australia Post API exact endpoints and product codes (requires account registration to verify)
- Shippo Australia Post carrier support specifics (requires testing)
- Stripe extended authorization eligibility for AU merchants (merchant-specific)
