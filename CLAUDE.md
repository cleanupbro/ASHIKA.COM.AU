# CLAUDE.md — ASHIKA Workspace Directives
## Indian Wear Hire Australia

---

## PROJECT IDENTITY

**Name:** ASHIKA  
**Tagline:** Indian Wear Hire Australia  
**Domain:** ashika.com.au  
**Slogan:** "Wear the culture. Return the stress."

**Visual Identity:**
- Primary: Deep Teal (#0D9488) / Emerald Green (#059669)
- Accent: Gold (#D97706) / Cream (#FEF3C7)
- Typography: Playfair Display (headings), Inter (body)
- Style: Minimalist luxury, clean, modern

---

## CORE MANDATE

You are building a rental-only marketplace for Indian ethnic wear in Australia. Your role is to implement features correctly, efficiently, and in alignment with the business rules defined below.

**Build Philosophy:**
- Ship working code, not perfect code
- Prefer simple solutions over clever ones
- Use free tiers until they break
- Ask before assuming

---

## NON-NEGOTIABLE BUSINESS RULES

These rules are **immutable**. Every function, every component, every database query must respect these:

### Rental Logic

```typescript
const RENTAL_CONFIG = {
  RENTAL_PERIOD_DAYS: 7,           // Total rental window
  DELIVERY_BUFFER_DAYS: 3,         // Ship before event
  CLEANING_BUFFER_DAYS: 3,         // Block after return
  BOND_AMOUNT_AUD: 100,            // Refundable security
  SHIPPING_COST_AUD: 0,            // Free both ways
  LATE_RETURN_FEE_AUD: 50,         // After 3 days late
  LATE_RETURN_GRACE_DAYS: 3,       // Before fee applies
} as const;
```

### Availability Calculation

When checking if a product is available for a date:

```typescript
function isProductAvailable(productId: string, eventDate: Date): boolean {
  // Calculate the full blocking period
  const rentalStart = subDays(eventDate, RENTAL_CONFIG.DELIVERY_BUFFER_DAYS);
  const rentalEnd = addDays(eventDate, 4); // Event + return buffer
  const cleaningEnd = addDays(rentalEnd, RENTAL_CONFIG.CLEANING_BUFFER_DAYS);
  
  // Check for ANY overlapping blocks
  const conflicts = await db.inventory_blocks.findMany({
    where: {
      product_id: productId,
      OR: [
        { block_start: { lte: cleaningEnd }, block_end: { gte: rentalStart } }
      ]
    }
  });
  
  return conflicts.length === 0;
}
```

### Checkout Flow

```
1. User selects product + event_date
2. System validates availability
3. System calculates rental_start, rental_end, cleaning_end
4. User enters shipping address with postcode
5. System validates postcode (Australian postcodes: 0200-9999)
6. User proceeds to payment
7. Stripe creates PaymentIntent with:
   - amount: rental_fee (captured)
   - setup for bond pre-auth: $100 (held, not captured)
8. On success: Create booking + inventory_block
9. Generate shipping labels (AusPost)
10. Send confirmation email
```

### Bond Logic

```typescript
// When order completes successfully (item returned, inspected OK)
async function releaseBond(bookingId: string) {
  const booking = await getBooking(bookingId);
  await stripe.paymentIntents.cancel(booking.bond_payment_intent_id);
  await updateBooking(bookingId, { bond_status: 'released' });
}

// When damage detected
async function captureBond(bookingId: string, amount: number, reason: string) {
  const booking = await getBooking(bookingId);
  await stripe.paymentIntents.capture(booking.bond_payment_intent_id, {
    amount_to_capture: amount * 100, // cents
  });
  await updateBooking(bookingId, { 
    bond_status: amount >= 100 ? 'full_capture' : 'partial_capture',
    bond_capture_reason: reason 
  });
}
```

---

## TECHNICAL STACK

### Confirmed Stack (Do Not Change)

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 14.x (App Router) |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| Database | Supabase (PostgreSQL) | Latest |
| Auth | Supabase Auth | Latest |
| Payments | Stripe | Latest SDK |
| Shipping | Australia Post API | Latest |
| Hosting | Vercel | Free tier |
| Images | Supabase Storage | Free tier |

### Package Preferences

```json
{
  "dependencies": {
    "next": "^14",
    "@supabase/supabase-js": "^2",
    "@stripe/stripe-js": "^2",
    "stripe": "^14",
    "date-fns": "^3",
    "zod": "^3",
    "react-hook-form": "^7",
    "@hookform/resolvers": "^3",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "typescript": "^5",
    "tailwindcss": "^3",
    "@types/node": "^20",
    "@types/react": "^18"
  }
}
```

### Forbidden Packages

Do NOT use without explicit approval:
- `moment` (use date-fns instead)
- `axios` (use native fetch)
- `lodash` (use native JS methods)
- `styled-components` (use Tailwind)
- `redux` (use React state + context)
- `prisma` (use Supabase client)

---

## CODING STANDARDS

### TypeScript

```typescript
// ✅ DO: Use strict types
interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  rental_price: number;
  blouse_included: boolean;
}

// ❌ DON'T: Use any
const product: any = fetchProduct();

// ✅ DO: Use Zod for validation
const BookingSchema = z.object({
  product_id: z.string().uuid(),
  event_date: z.string().datetime(),
  user_id: z.string().uuid(),
});

// ✅ DO: Handle errors explicitly
try {
  const booking = await createBooking(data);
  return { success: true, data: booking };
} catch (error) {
  console.error('Booking failed:', error);
  return { success: false, error: 'Booking creation failed' };
}
```

### React Components

```typescript
// ✅ DO: Use function components with explicit types
interface ProductCardProps {
  product: Product;
  onSelect: (id: string) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <div className="rounded-lg border p-4 hover:shadow-md transition-shadow">
      {/* ... */}
    </div>
  );
}

// ❌ DON'T: Use class components
// ❌ DON'T: Use default exports for components (use named exports)
// ❌ DON'T: Put business logic in components (extract to hooks/utils)
```

### File Naming

```
src/
├── app/
│   ├── page.tsx                    # Home page
│   ├── shop/
│   │   ├── page.tsx               # Shop listing
│   │   └── [id]/
│   │       └── page.tsx           # Product detail
│   └── checkout/
│       └── page.tsx               # Checkout
├── components/
│   ├── ui/                        # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── product/                   # Product-specific
│   │   ├── product-card.tsx
│   │   ├── product-grid.tsx
│   │   └── product-filters.tsx
│   └── booking/                   # Booking-specific
│       ├── availability-calendar.tsx
│       └── checkout-form.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   ├── server.ts              # Server client
│   │   └── types.ts               # Generated types
│   ├── stripe/
│   │   └── client.ts
│   └── utils/
│       ├── dates.ts               # Date helpers
│       └── validation.ts          # Zod schemas
├── hooks/
│   ├── use-products.ts
│   ├── use-booking.ts
│   └── use-availability.ts
└── types/
    └── index.ts                   # Shared types
```

### Tailwind Patterns

```typescript
// ✅ DO: Use consistent spacing and colors
<div className="p-4 md:p-6 lg:p-8">           // Responsive padding
<h1 className="text-2xl font-bold text-teal-900">  // Brand colors
<button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg">

// ✅ DO: Extract repeated patterns
const cardClasses = "rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow";

// ❌ DON'T: Use arbitrary values unless necessary
<div className="p-[13px]">  // Use p-3 or p-4 instead
```

---

## API PATTERNS

### Supabase Queries

```typescript
// ✅ DO: Use typed queries
const { data, error } = await supabase
  .from('products')
  .select('id, name, category, rental_price, images')
  .eq('status', 'available')
  .order('created_at', { ascending: false });

if (error) throw new Error(error.message);
return data as Product[];

// ✅ DO: Use RLS (Row Level Security) for authorization
// Policies defined in Supabase, not in code

// ❌ DON'T: Bypass RLS with service role in client code
```

### API Routes

```typescript
// src/app/api/bookings/route.ts

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { BookingSchema } from '@/lib/utils/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validated = BookingSchema.parse(body);
    
    // Check availability
    const isAvailable = await checkAvailability(
      validated.product_id, 
      validated.event_date
    );
    
    if (!isAvailable) {
      return NextResponse.json(
        { error: 'Product not available for selected dates' },
        { status: 409 }
      );
    }
    
    // Create booking
    const booking = await createBooking(validated);
    
    return NextResponse.json({ data: booking }, { status: 201 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## MEMORY SYNCHRONIZATION

### When You Complete a Task

After completing any significant task, update the shared memory:

```bash
# Update progress
echo "{ \"last_task\": \"Completed catalog filters\", \"next_task\": \"Product detail page\", \"timestamp\": \"$(date -Iseconds)\" }" > .shared-memory/progress.json

# Auto-commit
git add .
git commit -m "Task complete: Catalog filters"
```

### When Starting a Session

1. Read `.shared-memory/progress.json` for context
2. Read `.shared-memory/decisions.json` for architectural decisions
3. Check `git log -5` for recent changes

### Decision Logging

When making architectural decisions:

```json
// .shared-memory/decisions.json
{
  "decisions": [
    {
      "id": "001",
      "date": "2026-01-19",
      "topic": "State Management",
      "decision": "Use React Context + useReducer instead of Redux",
      "rationale": "Simpler, no extra dependencies, sufficient for our scale",
      "alternatives_considered": ["Redux", "Zustand", "Jotai"]
    }
  ]
}
```

---

## API KEY PROTECTION

### ABSOLUTE RULES (Never Violate)

```
🚫 NEVER read from:
   - ~/master-keys/
   - ~/.anthropic/
   - ~/.config/google-cloud/
   - Any path marked as "protected" by user

🚫 NEVER write keys to:
   - Any file that will be committed to git
   - Console output
   - Error messages
   - Log files

✅ MAY read from:
   - .env.local (for runtime config)
   - .env.testing (for test setup)

✅ MAY write to:
   - .env.testing (if instructed to set up test environment)
```

### If Uncertain

```
STOP.
ASK: "This operation involves [path/action]. Is this safe to proceed?"
WAIT for explicit user confirmation.
```

---

## SKILL REFERENCES

When working in specific domains, load the appropriate skill:

| Domain | Skill File |
|--------|-----------|
| Booking logic | `/skills/rental-logic/SKILL.md` |
| Database setup | `/skills/supabase-setup/SKILL.md` |
| Payment processing | `/skills/stripe-integration/SKILL.md` |
| Shipping features | `/skills/shipping-integration/SKILL.md` |
| UI components | `/skills/nextjs-patterns/SKILL.md` |

---

## ERROR HANDLING PATTERNS

### User-Facing Errors

```typescript
// Always provide helpful error messages
const ERROR_MESSAGES = {
  PRODUCT_UNAVAILABLE: 'This item is not available for your selected dates. Please try different dates.',
  INVALID_POSTCODE: 'Please enter a valid Australian postcode (e.g., 2000).',
  PAYMENT_FAILED: 'Payment could not be processed. Please check your card details and try again.',
  BOOKING_CONFLICT: 'Someone else just booked this item. Please select a different product.',
} as const;
```

### Internal Errors

```typescript
// Log with context for debugging
console.error('[BookingService] Failed to create booking', {
  product_id: data.product_id,
  event_date: data.event_date,
  error: error.message,
  stack: error.stack,
});
```

---

## TESTING EXPECTATIONS

### Before Marking Task Complete

1. **Manual test** the happy path
2. **Test edge cases** relevant to the feature
3. **Verify** no TypeScript errors (`npx tsc --noEmit`)
4. **Verify** no lint errors (`npm run lint`)
5. **Check** responsive design (mobile, tablet, desktop)

### Booking Logic Edge Cases

- Same item, overlapping dates → Should fail
- Same item, adjacent dates (within cleaning buffer) → Should fail
- Same item, dates after cleaning buffer → Should succeed
- Different items, same dates → Should succeed
- Past dates → Should fail
- Dates more than 6 months out → Should fail (configurable)

---

## COMMUNICATION STYLE

When explaining code or decisions:
- Be concise
- Use code examples
- Reference specific files/lines
- Explain the "why" not just the "what"

When encountering problems:
- State the problem clearly
- Show relevant error messages
- Propose solution options
- Ask for guidance if uncertain

---

## REVISION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-19 | Initial directives |

---

*This file is the source of truth for Claude Code working on ASHIKA. Follow these directives precisely.*
