# Shipping Integration Skill — Australia Post API
> ASHIKA delivery and return shipping management

---

## SKILL METADATA
- **Domain**: Shipping & Logistics
- **Trigger**: "shipping", "auspost", "labels", "tracking"
- **Priority**: 🟢 Low
- **Dependencies**: Booking must exist first

---

## AUSTRALIA POST API OVERVIEW

### API Endpoints
```
Base URL: https://digitalapi.auspost.com.au
Auth: API-Key header
```

### Services Used
1. **Postage Assessment** — Calculate shipping costs
2. **Shipping Labels** — Generate prepaid labels
3. **Track Items** — Track shipment status

---

## RENTAL SHIPPING FLOW

### Outbound (To Customer)
```
1. Booking confirmed
2. Generate OUTBOUND shipping label
3. Pack item + prepaid return label
4. Schedule AusPost pickup
5. Update booking with tracking number
6. Send tracking email to customer
```

### Return (From Customer)
```
1. Customer uses prepaid return label
2. Track return shipment
3. Update booking status when received
4. Inspect item
5. Release bond OR capture for damage
```

---

## API INTEGRATION PATTERN

### Environment Variables
```env
AUSPOST_API_KEY=your_api_key
AUSPOST_ACCOUNT_NUMBER=your_account
AUSPOST_PASSWORD=your_password
```

### Generate Shipping Label
```typescript
// lib/shipping/auspost.ts
import { RENTAL_CONFIG } from '@/lib/constants';

interface ShippingDetails {
  booking_id: string;
  from: Address;
  to: Address;
  weight_kg: number;
  dimensions: { length: number; width: number; height: number };
}

export async function generateShippingLabel(details: ShippingDetails) {
  const response = await fetch('https://digitalapi.auspost.com.au/shipping/v1/labels', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.AUSPOST_API_KEY!,
    },
    body: JSON.stringify({
      sender: details.from,
      receiver: details.to,
      items: [{
        weight: details.weight_kg,
        length: details.dimensions.length,
        width: details.dimensions.width,
        height: details.dimensions.height,
        product_id: 'AUSPOST_PARCEL_EXPRESS',
      }],
    }),
  });

  if (!response.ok) {
    throw new Error(`AusPost API error: ${response.statusText}`);
  }

  return response.json();
}
```

---

## SHIPPING COSTS

| Service | Estimated Cost | Delivery Time |
|---------|---------------|---------------|
| Parcel Post | $10-15 | 2-6 days |
| Express Post | $15-25 | 1-2 days |

**ASHIKA Policy**: Free shipping both ways (built into rental price)

---

## TRACKING UPDATES

### Webhook for Status Updates
```typescript
// app/api/webhooks/auspost/route.ts
export async function POST(request: Request) {
  const payload = await request.json();

  const { tracking_id, status, timestamp } = payload;

  // Update booking status
  await supabase
    .from('bookings')
    .update({
      shipping_status: status,
      shipping_updated_at: timestamp
    })
    .eq('tracking_number', tracking_id);

  // Notify customer if delivered
  if (status === 'DELIVERED') {
    await sendDeliveryNotification(tracking_id);
  }

  return Response.json({ received: true });
}
```

---

## VERIFICATION CHECKLIST

Before shipping integration is complete:
- [ ] API key configured in environment
- [ ] Can generate outbound labels
- [ ] Can generate return labels
- [ ] Tracking updates work
- [ ] Customer receives tracking emails
- [ ] Return processing workflow tested

---

## PLACEHOLDER STATUS

⚠️ **This skill is a template** — Full implementation requires:
1. Australia Post API account
2. API key from AusPost developer portal
3. Testing with sandbox environment
4. Production credentials for go-live

---

*Last updated: 2026-01-20*
