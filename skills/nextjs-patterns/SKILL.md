# Next.js Patterns Skill — App Router Best Practices
> ASHIKA frontend architecture patterns

---

## SKILL METADATA
- **Domain**: Frontend Architecture
- **Trigger**: "nextjs", "app router", "server components", "route"
- **Priority**: 🟢 Low
- **Stack**: Next.js 14, TypeScript, Tailwind

---

## APP ROUTER STRUCTURE

### Route Organization
```
src/app/
├── (marketing)/           # Marketing pages group
│   ├── page.tsx          # Homepage
│   ├── about/page.tsx
│   ├── faq/page.tsx
│   └── contact/page.tsx
├── (shop)/                # Shop pages group
│   ├── shop/page.tsx     # Product listing
│   ├── shop/[id]/page.tsx # Product detail
│   └── cart/page.tsx
├── (checkout)/            # Checkout flow
│   ├── checkout/page.tsx
│   └── checkout/success/page.tsx
├── (account)/             # User account
│   ├── account/page.tsx
│   ├── account/bookings/page.tsx
│   └── account/settings/page.tsx
├── (admin)/               # Admin area
│   ├── admin/page.tsx
│   ├── admin/products/page.tsx
│   └── admin/orders/page.tsx
├── api/                   # API routes
│   ├── products/route.ts
│   ├── bookings/route.ts
│   └── webhooks/
│       ├── stripe/route.ts
│       └── auspost/route.ts
├── layout.tsx             # Root layout
├── loading.tsx            # Global loading
├── error.tsx              # Global error
└── not-found.tsx          # 404 page
```

---

## SERVER VS CLIENT COMPONENTS

### Server Components (Default)
Use for:
- Data fetching
- Access to backend resources
- Static content
- Large dependencies

```typescript
// app/shop/page.tsx — Server Component
import { getProducts } from '@/lib/supabase/queries';
import { ProductGrid } from '@/components/product/product-grid';

export default async function ShopPage() {
  const products = await getProducts();
  return <ProductGrid products={products} />;
}
```

### Client Components
Use for:
- Interactivity (onClick, onChange)
- Browser APIs
- React hooks (useState, useEffect)
- Third-party client libraries

```typescript
// components/product/product-filters.tsx
'use client';

import { useState } from 'react';

export function ProductFilters({ onFilter }: ProductFiltersProps) {
  const [category, setCategory] = useState<string>('all');
  // ... interactive filtering logic
}
```

---

## DATA FETCHING PATTERNS

### Server-Side (Recommended)
```typescript
// lib/supabase/queries.ts
import { createServerClient } from '@/lib/supabase/server';

export async function getProducts() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'available');

  if (error) throw error;
  return data;
}
```

### Client-Side (When needed)
```typescript
// hooks/use-availability.ts
'use client';

import { useEffect, useState } from 'react';
import { checkAvailability } from '@/lib/api';

export function useAvailability(productId: string, date: Date | null) {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) return;
    setLoading(true);
    checkAvailability(productId, date)
      .then(setAvailable)
      .finally(() => setLoading(false));
  }, [productId, date]);

  return { available, loading };
}
```

---

## API ROUTE PATTERNS

### Standard API Route
```typescript
// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  const supabase = createServerClient();
  let query = supabase.from('products').select('*');

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
```

### Dynamic Route
```typescript
// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const product = await getProductById(params.id);

  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ data: product });
}
```

---

## LOADING & ERROR STATES

### Loading UI
```typescript
// app/shop/loading.tsx
export default function ShopLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 aspect-[3/4] rounded-lg" />
          <div className="h-4 bg-gray-200 rounded mt-2" />
          <div className="h-4 bg-gray-200 rounded mt-1 w-2/3" />
        </div>
      ))}
    </div>
  );
}
```

### Error Boundary
```typescript
// app/shop/error.tsx
'use client';

export default function ShopError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold text-red-600">
        Something went wrong
      </h2>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-teal-600 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
```

---

## METADATA & SEO

### Static Metadata
```typescript
// app/shop/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Indian Wear | ASHIKA',
  description: 'Rent beautiful sarees, lehengas, and sherwanis for your special occasions.',
  openGraph: {
    title: 'Shop Indian Wear | ASHIKA',
    description: 'Premium Indian ethnic wear for hire in Australia',
    images: ['/og-shop.jpg'],
  },
};
```

### Dynamic Metadata
```typescript
// app/shop/[id]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductById(params.id);

  return {
    title: `${product.name} | ASHIKA`,
    description: product.description,
    openGraph: {
      images: [product.images[0]],
    },
  };
}
```

---

## CACHING STRATEGIES

### Revalidation
```typescript
// Revalidate every hour
export const revalidate = 3600;

// Or on-demand revalidation
import { revalidatePath } from 'next/cache';

export async function updateProduct(id: string, data: ProductUpdate) {
  await db.products.update(id, data);
  revalidatePath('/shop');
  revalidatePath(`/shop/${id}`);
}
```

---

## ASHIKA-SPECIFIC PATTERNS

### Layout with Auth
```typescript
// app/(account)/layout.tsx
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/auth';

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <AccountSidebar />
      <main>{children}</main>
    </div>
  );
}
```

### Product Detail with Availability
```typescript
// app/shop/[id]/page.tsx
import { Suspense } from 'react';
import { ProductImages } from '@/components/product/product-images';
import { ProductInfo } from '@/components/product/product-info';
import { AvailabilityCalendar } from '@/components/booking/availability-calendar';

export default async function ProductPage({ params }: Props) {
  const product = await getProductById(params.id);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <ProductImages images={product.images} />
      <div>
        <ProductInfo product={product} />
        <Suspense fallback={<CalendarSkeleton />}>
          <AvailabilityCalendar productId={product.id} />
        </Suspense>
      </div>
    </div>
  );
}
```

---

## VERIFICATION CHECKLIST

- [ ] Route groups organized logically
- [ ] Server components used by default
- [ ] Client components only where needed
- [ ] API routes follow REST conventions
- [ ] Loading states for all async pages
- [ ] Error boundaries catch failures gracefully
- [ ] Metadata configured for SEO
- [ ] Auth protection on private routes

---

*Last updated: 2026-01-20*
