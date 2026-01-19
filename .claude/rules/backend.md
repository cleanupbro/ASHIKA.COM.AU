# Backend Rules — ASHIKA
> Rules for API routes and server-side code

---

## API Route Structure

```typescript
// app/api/[resource]/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = Schema.parse(body);

    // Business logic here

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('[API Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Validation Rules

1. **Zod for all inputs** — Validate request bodies
2. **Type inference** — Use z.infer for types
3. **Custom error messages** — User-friendly validation errors

```typescript
const BookingSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  event_date: z.string().datetime('Invalid date format'),
  user_id: z.string().uuid('Invalid user ID'),
});

type BookingInput = z.infer<typeof BookingSchema>;
```

---

## Error Handling

1. **Try-catch all routes** — Never let errors bubble uncaught
2. **Structured error responses** — Consistent error format
3. **Log with context** — Include relevant IDs and data

```typescript
// ✅ Correct
console.error('[BookingService]', {
  action: 'createBooking',
  product_id: data.product_id,
  error: error.message,
});

// ❌ Wrong
console.log(error);
```

---

## HTTP Status Codes

| Code | Use For |
|------|---------|
| 200 | Successful GET/PUT |
| 201 | Successful POST (created) |
| 204 | Successful DELETE |
| 400 | Validation error |
| 401 | Not authenticated |
| 403 | Not authorized |
| 404 | Resource not found |
| 409 | Conflict (e.g., double booking) |
| 500 | Server error |

---

## Authentication

1. **Check auth in routes** — Verify session before processing
2. **Use Supabase Auth** — Don't roll your own
3. **RLS for data access** — Database-level security

```typescript
const supabase = createServerClient();
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

---

## Environment Variables

1. **Never hardcode secrets** — Use process.env
2. **Validate on startup** — Check required vars exist
3. **Type-safe access** — Use typed env helper

```typescript
// ❌ Wrong
const key = 'sk_live_xxx';

// ✅ Correct
const key = process.env.STRIPE_SECRET_KEY;
if (!key) throw new Error('STRIPE_SECRET_KEY not configured');
```

---

*Applied automatically for backend tasks*
