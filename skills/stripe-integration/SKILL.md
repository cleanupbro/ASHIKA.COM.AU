---
name: stripe-integration
description: Payment processing, bond pre-authorization, and webhook handling for ASHIKA
version: 1.0
triggers:
  - payment
  - stripe
  - checkout
  - bond
  - refund
  - webhook
---

# Stripe Integration Skill

## Purpose

Handle all payment processing including rental fees and refundable bond pre-authorization.

## Key Concepts

1. **Rental Fee**: Captured immediately on checkout
2. **Bond ($100)**: Pre-authorized (held), captured only on damage, released on successful return

---

## Setup

### Install Dependencies

```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
```

### Environment Variables

```bash
# .env.local
STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# For production
# STRIPE_PUBLIC_KEY=pk_live_xxxxx
# STRIPE_SECRET_KEY=sk_live_xxxxx
```

### Client Setup

```typescript
// lib/stripe/client.ts
import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
  }
  return stripePromise;
}
```

### Server Setup

```typescript
// lib/stripe/server.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});
```

---

## Payment Flow

### Step 1: Create Payment Intent (Server)

```typescript
// lib/stripe/payments.ts
import { stripe } from './server';

export interface CreatePaymentInput {
  amount: number; // in AUD dollars
  customerId?: string;
  metadata?: Record<string, string>;
}

export async function createPaymentIntent(input: CreatePaymentInput) {
  const { amount, customerId, metadata } = input;
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'aud',
    customer: customerId,
    metadata: {
      ...metadata,
      type: 'rental_fee',
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });
  
  return paymentIntent;
}
```

### Step 2: Create Bond Pre-Authorization

```typescript
// lib/stripe/bonds.ts
import { stripe } from './server';
import { RENTAL_CONFIG } from '@/lib/constants/rental';

export async function createBondPreAuth(input: {
  customerId?: string;
  metadata?: Record<string, string>;
}) {
  const { customerId, metadata } = input;
  
  // Create a PaymentIntent with capture_method: 'manual'
  // This authorizes the amount but doesn't capture it
  const bondIntent = await stripe.paymentIntents.create({
    amount: RENTAL_CONFIG.BOND_AMOUNT_AUD * 100, // $100 in cents
    currency: 'aud',
    customer: customerId,
    capture_method: 'manual', // KEY: This makes it a pre-auth
    metadata: {
      ...metadata,
      type: 'bond',
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });
  
  return bondIntent;
}

export async function releaseBond(paymentIntentId: string) {
  // Cancel the pre-auth to release the hold
  await stripe.paymentIntents.cancel(paymentIntentId);
  return { success: true, action: 'released' };
}

export async function captureBond(
  paymentIntentId: string, 
  amountToCapture: number // in dollars
) {
  // Capture partial or full amount
  const captured = await stripe.paymentIntents.capture(paymentIntentId, {
    amount_to_capture: Math.round(amountToCapture * 100),
  });
  
  return { 
    success: true, 
    action: 'captured',
    amount: amountToCapture,
    captured,
  };
}
```

---

## Checkout API Route

```typescript
// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/server';
import { z } from 'zod';

const CheckoutSchema = z.object({
  productId: z.string().uuid(),
  eventDate: z.string().datetime(),
  shippingAddress: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postcode: z.string().regex(/^\d{4}$/, 'Invalid Australian postcode'),
  }),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Validate input
    const body = await request.json();
    const validated = CheckoutSchema.parse(body);
    
    // Get product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', validated.productId)
      .single();
    
    if (productError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Check availability (imported from rental-logic skill)
    const { checkAvailability } = await import('@/lib/rental/availability');
    const availability = await checkAvailability(validated.productId, validated.eventDate);
    
    if (!availability.available) {
      return NextResponse.json({ 
        error: 'Product not available for selected dates',
        details: availability.reason 
      }, { status: 409 });
    }
    
    // Get or create Stripe customer
    let customerId = user.user_metadata?.stripe_customer_id;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      
      // Save to user metadata
      await supabase.auth.updateUser({
        data: { stripe_customer_id: customerId },
      });
    }
    
    // Create payment intent for rental fee
    const rentalPaymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(product.rental_price * 100),
      currency: 'aud',
      customer: customerId,
      metadata: {
        product_id: validated.productId,
        event_date: validated.eventDate,
        type: 'rental_fee',
      },
      automatic_payment_methods: { enabled: true },
    });
    
    // Create bond pre-auth
    const bondPaymentIntent = await stripe.paymentIntents.create({
      amount: 10000, // $100 in cents
      currency: 'aud',
      customer: customerId,
      capture_method: 'manual',
      metadata: {
        product_id: validated.productId,
        event_date: validated.eventDate,
        type: 'bond',
      },
      automatic_payment_methods: { enabled: true },
    });
    
    return NextResponse.json({
      rental: {
        clientSecret: rentalPaymentIntent.client_secret,
        amount: product.rental_price,
      },
      bond: {
        clientSecret: bondPaymentIntent.client_secret,
        amount: 100,
      },
      product: {
        id: product.id,
        name: product.name,
        rental_price: product.rental_price,
      },
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid request', 
        details: error.errors 
      }, { status: 400 });
    }
    
    console.error('[Checkout] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

## Checkout Component

```typescript
// components/booking/checkout-form.tsx
'use client';

import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe/client';

interface CheckoutFormProps {
  rentalClientSecret: string;
  bondClientSecret: string;
  onSuccess: () => void;
}

function CheckoutFormInner({ rentalClientSecret, bondClientSecret, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    // Step 1: Confirm rental payment
    const { error: rentalError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: 'if_required',
    });

    if (rentalError) {
      setError(rentalError.message ?? 'Payment failed');
      setIsProcessing(false);
      return;
    }

    // Step 2: Confirm bond pre-auth
    // Note: In production, you'd handle this server-side after rental success
    // This is simplified for demonstration

    onSuccess();
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-3 bg-teal-600 text-white rounded-lg 
                   hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : 'Complete Rental'}
      </button>
      
      <p className="text-xs text-gray-500 text-center">
        A $100 refundable bond will be held on your card and released after return.
      </p>
    </form>
  );
}

export function CheckoutForm(props: CheckoutFormProps) {
  return (
    <Elements 
      stripe={getStripe()} 
      options={{ clientSecret: props.rentalClientSecret }}
    >
      <CheckoutFormInner {...props} />
    </Elements>
  );
}
```

---

## Webhook Handler

```typescript
// app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/admin';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('[Webhook] Signature verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createClient();

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { product_id, event_date, type } = paymentIntent.metadata;
      
      if (type === 'rental_fee') {
        // Update booking status
        await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('stripe_payment_intent_id', paymentIntent.id);
          
        console.log(`[Webhook] Rental payment confirmed: ${paymentIntent.id}`);
      } else if (type === 'bond') {
        // Update bond status
        await supabase
          .from('bookings')
          .update({ bond_status: 'held' })
          .eq('stripe_bond_intent_id', paymentIntent.id);
          
        console.log(`[Webhook] Bond authorized: ${paymentIntent.id}`);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.error(`[Webhook] Payment failed: ${paymentIntent.id}`);
      
      // Update booking status
      await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('stripe_payment_intent_id', paymentIntent.id);
      break;
    }

    case 'payment_intent.canceled': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      if (paymentIntent.metadata.type === 'bond') {
        // Bond was released
        await supabase
          .from('bookings')
          .update({ bond_status: 'released' })
          .eq('stripe_bond_intent_id', paymentIntent.id);
          
        console.log(`[Webhook] Bond released: ${paymentIntent.id}`);
      }
      break;
    }

    default:
      console.log(`[Webhook] Unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
```

---

## Testing

### Test Cards

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Decline |
| 4000 0000 0000 9995 | Insufficient funds |
| 4000 0025 0000 3155 | Requires authentication |

### Webhook Testing (Local)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook signing secret to .env.local
```

---

## Security Notes

1. **Never expose** `STRIPE_SECRET_KEY` to client
2. **Always validate** webhook signatures
3. **Use idempotency keys** for payment creation
4. **Log all payment events** for audit trail
5. **Handle failures gracefully** - users should be able to retry

---

*This skill handles real money. Test thoroughly in Stripe test mode before going live.*
