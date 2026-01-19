# Rental Logic Rules — ASHIKA
> Immutable business rules for rental operations

---

## Core Constants

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

**These values are IMMUTABLE. Never change without explicit approval.**

---

## Date Calculations

```typescript
// Given: event_date
rental_start = event_date - 3 days    // Item ships 3 days before
rental_end = event_date + 3 days      // Customer returns within 3 days after
cleaning_end = rental_end + 3 days    // Cleaning/inspection buffer

// Example: Event on Jan 15
// rental_start = Jan 12 (shipping)
// rental_end = Jan 18 (return deadline)
// cleaning_end = Jan 21 (available again)
```

---

## Availability Check

```typescript
function isProductAvailable(productId: string, eventDate: Date): boolean {
  const rentalStart = subDays(eventDate, 3);
  const cleaningEnd = addDays(eventDate, 6); // 3 + 3

  // Block exists if ANY overlap
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

---

## Booking Rules

1. **No past dates** — Event date must be future
2. **Max 6 months out** — Don't book too far ahead
3. **No overlapping blocks** — One booking per item per period
4. **Block on confirm** — Create inventory_block immediately

---

## Bond Handling

```typescript
// On successful return
await stripe.paymentIntents.cancel(bond_payment_intent_id);
booking.bond_status = 'released';

// On damage
await stripe.paymentIntents.capture(bond_payment_intent_id, {
  amount_to_capture: damage_amount * 100
});
booking.bond_status = damage_amount >= 100 ? 'full_capture' : 'partial_capture';
```

---

## Status Flow

```
PENDING → CONFIRMED → SHIPPED → DELIVERED → RETURNED → COMPLETED
                                    ↓
                              INSPECTING → COMPLETED (bond released)
                                    ↓
                              DAMAGED (bond captured)
```

---

## Edge Cases

| Scenario | Rule |
|----------|------|
| Same item, overlapping dates | REJECT |
| Same item, adjacent dates (within cleaning) | REJECT |
| Same item, after cleaning buffer | ALLOW |
| Different items, same dates | ALLOW |
| Past dates | REJECT |
| >6 months out | REJECT |

---

*These rules are ABSOLUTE. Never deviate without explicit approval.*
