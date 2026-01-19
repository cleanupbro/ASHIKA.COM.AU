---
name: rental-logic
description: Implement all booking, availability, calendar blocking, and bond management logic for ASHIKA rental platform
version: 1.0
triggers:
  - booking
  - availability
  - calendar
  - rental
  - bond
  - inventory block
---

# Rental Logic Skill

## Purpose

This skill governs all business logic related to renting items on ASHIKA. It is the **most critical** part of the system. Errors here directly impact revenue and customer trust.

## When to Use This Skill

Activate this skill when working on:
- Availability checking
- Booking creation
- Calendar blocking
- Bond management
- Return processing
- Late fee calculation

---

## Core Constants

```typescript
// lib/constants/rental.ts

export const RENTAL_CONFIG = {
  // Timing
  RENTAL_PERIOD_DAYS: 7,
  DELIVERY_BUFFER_DAYS: 3,
  CLEANING_BUFFER_DAYS: 3,
  MAX_ADVANCE_BOOKING_DAYS: 180,
  
  // Financials
  BOND_AMOUNT_AUD: 100,
  LATE_FEE_AUD: 50,
  LATE_GRACE_DAYS: 3,
  
  // Shipping
  SHIPPING_COST_AUD: 0,
} as const;

export type RentalConfig = typeof RENTAL_CONFIG;
```

---

## Database Schema

### Tables Required

```sql
-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('saree', 'lehenga', 'salwar_kameez', 'sherwani', 'kurta', 'kids', 'accessories')),
  size TEXT CHECK (size IN ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'free_size')),
  blouse_included BOOLEAN DEFAULT false,
  rental_price DECIMAL(10,2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'rented', 'cleaning', 'damaged', 'retired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  
  -- Dates
  event_date DATE NOT NULL,
  rental_start DATE NOT NULL,
  rental_end DATE NOT NULL,
  cleaning_end DATE NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'shipped', 'delivered', 
    'returned', 'inspecting', 'completed', 'disputed', 'cancelled'
  )),
  
  -- Financials
  rental_fee DECIMAL(10,2) NOT NULL,
  bond_amount DECIMAL(10,2) DEFAULT 100.00,
  bond_status TEXT DEFAULT 'pending' CHECK (bond_status IN (
    'pending', 'held', 'released', 'partial_capture', 'full_capture'
  )),
  bond_capture_reason TEXT,
  
  -- Stripe
  stripe_payment_intent_id TEXT,
  stripe_bond_intent_id TEXT,
  
  -- Shipping
  shipping_label_url TEXT,
  return_label_url TEXT,
  tracking_number TEXT,
  return_tracking_number TEXT,
  
  -- Timestamps
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  returned_at TIMESTAMPTZ,
  inspected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory blocks (prevents double booking)
CREATE TABLE inventory_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) NOT NULL,
  booking_id UUID REFERENCES bookings(id),
  block_start DATE NOT NULL,
  block_end DATE NOT NULL,
  reason TEXT DEFAULT 'rental' CHECK (reason IN ('rental', 'cleaning', 'maintenance', 'reserved')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent overlapping blocks for same product
  CONSTRAINT no_overlapping_blocks EXCLUDE USING gist (
    product_id WITH =,
    daterange(block_start, block_end, '[]') WITH &&
  )
);

-- Index for fast availability queries
CREATE INDEX idx_inventory_blocks_product_dates 
ON inventory_blocks(product_id, block_start, block_end);
```

---

## Core Functions

### 1. Check Availability

```typescript
// lib/rental/availability.ts

import { supabase } from '@/lib/supabase/client';
import { addDays, subDays, isAfter, isBefore, parseISO } from 'date-fns';
import { RENTAL_CONFIG } from '@/lib/constants/rental';

interface AvailabilityResult {
  available: boolean;
  reason?: string;
  conflicting_dates?: { start: string; end: string };
}

export async function checkAvailability(
  productId: string,
  eventDate: Date | string
): Promise<AvailabilityResult> {
  const event = typeof eventDate === 'string' ? parseISO(eventDate) : eventDate;
  
  // Validate date is in future
  if (isBefore(event, new Date())) {
    return { available: false, reason: 'Event date must be in the future' };
  }
  
  // Validate date is not too far out
  const maxDate = addDays(new Date(), RENTAL_CONFIG.MAX_ADVANCE_BOOKING_DAYS);
  if (isAfter(event, maxDate)) {
    return { 
      available: false, 
      reason: `Bookings can only be made up to ${RENTAL_CONFIG.MAX_ADVANCE_BOOKING_DAYS} days in advance` 
    };
  }
  
  // Calculate the full blocking period we need
  const rentalStart = subDays(event, RENTAL_CONFIG.DELIVERY_BUFFER_DAYS);
  const rentalEnd = addDays(event, 4); // event + return time
  const cleaningEnd = addDays(rentalEnd, RENTAL_CONFIG.CLEANING_BUFFER_DAYS);
  
  // Check for conflicting blocks
  const { data: conflicts, error } = await supabase
    .from('inventory_blocks')
    .select('block_start, block_end')
    .eq('product_id', productId)
    .or(`block_start.lte.${cleaningEnd.toISOString()},block_end.gte.${rentalStart.toISOString()}`);
  
  if (error) {
    console.error('[Availability] Query error:', error);
    throw new Error('Failed to check availability');
  }
  
  // Filter for actual overlaps (the OR query is broad, we need precise overlap check)
  const actualConflicts = conflicts?.filter(block => {
    const blockStart = parseISO(block.block_start);
    const blockEnd = parseISO(block.block_end);
    
    // Overlap exists if: blockStart <= cleaningEnd AND blockEnd >= rentalStart
    return (
      (isBefore(blockStart, cleaningEnd) || blockStart.getTime() === cleaningEnd.getTime()) &&
      (isAfter(blockEnd, rentalStart) || blockEnd.getTime() === rentalStart.getTime())
    );
  });
  
  if (actualConflicts && actualConflicts.length > 0) {
    return {
      available: false,
      reason: 'Item is not available for these dates',
      conflicting_dates: {
        start: actualConflicts[0].block_start,
        end: actualConflicts[0].block_end
      }
    };
  }
  
  return { available: true };
}
```

### 2. Calculate Booking Dates

```typescript
// lib/rental/dates.ts

import { addDays, subDays, format } from 'date-fns';
import { RENTAL_CONFIG } from '@/lib/constants/rental';

export interface BookingDates {
  event_date: Date;
  rental_start: Date;      // When we ship
  rental_end: Date;        // When customer should return
  cleaning_end: Date;      // When item is available again
  expected_delivery: Date; // When customer should receive
}

export function calculateBookingDates(eventDate: Date): BookingDates {
  const rental_start = subDays(eventDate, RENTAL_CONFIG.DELIVERY_BUFFER_DAYS);
  const rental_end = addDays(eventDate, RENTAL_CONFIG.RENTAL_PERIOD_DAYS - RENTAL_CONFIG.DELIVERY_BUFFER_DAYS);
  const cleaning_end = addDays(rental_end, RENTAL_CONFIG.CLEANING_BUFFER_DAYS);
  const expected_delivery = subDays(eventDate, 1); // Day before event
  
  return {
    event_date: eventDate,
    rental_start,
    rental_end,
    cleaning_end,
    expected_delivery,
  };
}

export function formatBookingDatesForDisplay(dates: BookingDates) {
  return {
    event_date: format(dates.event_date, 'EEEE, d MMMM yyyy'),
    ship_by: format(dates.rental_start, 'd MMM'),
    return_by: format(dates.rental_end, 'd MMM'),
    available_again: format(dates.cleaning_end, 'd MMM'),
  };
}
```

### 3. Create Booking

```typescript
// lib/rental/booking.ts

import { supabase } from '@/lib/supabase/server';
import { checkAvailability } from './availability';
import { calculateBookingDates } from './dates';
import { RENTAL_CONFIG } from '@/lib/constants/rental';
import { createPaymentIntent, createBondPreAuth } from '@/lib/stripe/payments';

export interface CreateBookingInput {
  user_id: string;
  product_id: string;
  event_date: string;
  rental_fee: number;
}

export interface BookingResult {
  success: boolean;
  booking?: any;
  payment_client_secret?: string;
  error?: string;
}

export async function createBooking(input: CreateBookingInput): Promise<BookingResult> {
  const { user_id, product_id, event_date, rental_fee } = input;
  const eventDate = new Date(event_date);
  
  // Step 1: Verify availability (with lock)
  const availability = await checkAvailability(product_id, eventDate);
  if (!availability.available) {
    return { success: false, error: availability.reason };
  }
  
  // Step 2: Calculate all dates
  const dates = calculateBookingDates(eventDate);
  
  // Step 3: Create Stripe payment intent
  const paymentIntent = await createPaymentIntent({
    amount: rental_fee,
    metadata: { product_id, event_date }
  });
  
  // Step 4: Create bond pre-authorization
  const bondIntent = await createBondPreAuth({
    amount: RENTAL_CONFIG.BOND_AMOUNT_AUD,
    metadata: { product_id, event_date, type: 'bond' }
  });
  
  // Step 5: Create booking record
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      user_id,
      product_id,
      event_date: dates.event_date.toISOString(),
      rental_start: dates.rental_start.toISOString(),
      rental_end: dates.rental_end.toISOString(),
      cleaning_end: dates.cleaning_end.toISOString(),
      rental_fee,
      bond_amount: RENTAL_CONFIG.BOND_AMOUNT_AUD,
      stripe_payment_intent_id: paymentIntent.id,
      stripe_bond_intent_id: bondIntent.id,
      status: 'pending',
      bond_status: 'pending',
    })
    .select()
    .single();
  
  if (bookingError) {
    console.error('[Booking] Insert error:', bookingError);
    // TODO: Cancel Stripe intents
    return { success: false, error: 'Failed to create booking' };
  }
  
  // Step 6: Create inventory block
  const { error: blockError } = await supabase
    .from('inventory_blocks')
    .insert({
      product_id,
      booking_id: booking.id,
      block_start: dates.rental_start.toISOString(),
      block_end: dates.cleaning_end.toISOString(),
      reason: 'rental',
    });
  
  if (blockError) {
    console.error('[Booking] Block error:', blockError);
    // Rollback booking
    await supabase.from('bookings').delete().eq('id', booking.id);
    return { success: false, error: 'Failed to reserve dates' };
  }
  
  return {
    success: true,
    booking,
    payment_client_secret: paymentIntent.client_secret,
  };
}
```

### 4. Process Return

```typescript
// lib/rental/returns.ts

import { supabase } from '@/lib/supabase/server';
import { releaseBond, captureBond } from '@/lib/stripe/bonds';
import { differenceInDays } from 'date-fns';
import { RENTAL_CONFIG } from '@/lib/constants/rental';

export interface ProcessReturnInput {
  booking_id: string;
  condition: 'excellent' | 'good' | 'damaged' | 'missing_items';
  damage_notes?: string;
  damage_photos?: string[];
}

export async function processReturn(input: ProcessReturnInput) {
  const { booking_id, condition, damage_notes, damage_photos } = input;
  
  // Get booking
  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', booking_id)
    .single();
  
  if (error || !booking) {
    throw new Error('Booking not found');
  }
  
  const now = new Date();
  const returnDue = new Date(booking.rental_end);
  const daysLate = differenceInDays(now, returnDue);
  
  // Determine bond action
  let bondAction: 'release' | 'partial' | 'full' = 'release';
  let captureAmount = 0;
  let captureReason = '';
  
  // Check for late return
  if (daysLate > RENTAL_CONFIG.LATE_GRACE_DAYS) {
    captureAmount += RENTAL_CONFIG.LATE_FEE_AUD;
    captureReason += `Late return (${daysLate} days). `;
    bondAction = 'partial';
  }
  
  // Check for damage
  if (condition === 'damaged') {
    captureAmount += 50; // Partial for damage
    captureReason += 'Item returned with damage. ';
    bondAction = 'partial';
  } else if (condition === 'missing_items') {
    captureAmount = RENTAL_CONFIG.BOND_AMOUNT_AUD; // Full capture
    captureReason += 'Missing items. ';
    bondAction = 'full';
  }
  
  // Cap at bond amount
  captureAmount = Math.min(captureAmount, RENTAL_CONFIG.BOND_AMOUNT_AUD);
  
  // Execute bond action
  if (bondAction === 'release') {
    await releaseBond(booking.stripe_bond_intent_id);
  } else {
    await captureBond(booking.stripe_bond_intent_id, captureAmount);
  }
  
  // Update booking
  await supabase
    .from('bookings')
    .update({
      status: 'completed',
      bond_status: bondAction === 'release' ? 'released' : 
                   bondAction === 'full' ? 'full_capture' : 'partial_capture',
      bond_capture_reason: captureReason || null,
      returned_at: now.toISOString(),
      inspected_at: now.toISOString(),
    })
    .eq('id', booking_id);
  
  return {
    success: true,
    bond_action: bondAction,
    capture_amount: captureAmount,
    capture_reason: captureReason,
  };
}
```

---

## Edge Cases to Handle

### Double-Booking Prevention

The database uses an exclusion constraint, but also check in application code:

```typescript
// Always check availability right before creating the block
const availability = await checkAvailability(productId, eventDate);
if (!availability.available) {
  throw new Error('CONFLICT: Item was just booked');
}
```

### Same-Day Returns

If returned on the same day as rental_end, no late fee:

```typescript
const daysLate = Math.max(0, differenceInDays(returnDate, rentalEnd));
```

### Cancelled Bookings

When a booking is cancelled:

```typescript
async function cancelBooking(bookingId: string) {
  // Release the inventory block
  await supabase
    .from('inventory_blocks')
    .delete()
    .eq('booking_id', bookingId);
  
  // Cancel Stripe intents
  await cancelPaymentIntent(booking.stripe_payment_intent_id);
  await cancelPaymentIntent(booking.stripe_bond_intent_id);
  
  // Update status
  await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId);
}
```

### Timezone Handling

All dates should be treated as **Australian Eastern Time** for business logic:

```typescript
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Australia/Sydney';

function toAustralianDate(date: Date): Date {
  return utcToZonedTime(date, TIMEZONE);
}
```

---

## Testing Checklist

Before marking any rental logic complete:

- [ ] Same product, overlapping dates → Fails with clear error
- [ ] Same product, adjacent dates (within cleaning buffer) → Fails
- [ ] Same product, dates after cleaning buffer → Succeeds
- [ ] Different products, same dates → Both succeed
- [ ] Past date → Fails
- [ ] Date > 180 days out → Fails
- [ ] Cancelled booking → Inventory block removed
- [ ] Return on time, good condition → Bond released
- [ ] Return late (< 3 days) → Bond released
- [ ] Return late (> 3 days) → $50 captured
- [ ] Return damaged → Partial capture
- [ ] Missing items → Full capture

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/products/[id]/availability` | GET | Check dates available |
| `/api/bookings` | POST | Create new booking |
| `/api/bookings/[id]` | GET | Get booking details |
| `/api/bookings/[id]/cancel` | POST | Cancel booking |
| `/api/admin/returns` | POST | Process return (admin) |

---

*This skill is the foundation of ASHIKA's business. Test thoroughly. When in doubt, block the date rather than allow a potential double-booking.*
