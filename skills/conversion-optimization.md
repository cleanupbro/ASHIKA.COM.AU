# Skill: Conversion Optimization for Landing Pages

**Created:** January 19, 2026
**Category:** Frontend / UX / Marketing
**Framework:** React + TypeScript + Tailwind CSS

---

## Overview

A comprehensive conversion optimization system for service-based business landing pages. Implements aggressive sales psychology elements to maximize lead generation.

---

## Components Created

### 1. QuickQuoteModal
**Purpose:** Reduce friction by capturing leads with minimal fields

**Key Features:**
- 3-field form: Service Type, Property Size, Phone
- Animated entrance (scale + fade)
- Trust indicators at bottom
- Pre-fills next form with entered data

**Usage:**
```tsx
import { QuickQuoteModal } from '../components/QuickQuoteModal';

const [showModal, setShowModal] = useState(false);

<QuickQuoteModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSubmit={(data) => handleSubmit(data)}
  navigateTo={navigateTo}
/>
```

---

### 2. StickyMobileCTA
**Purpose:** Always-visible call-to-action for mobile users

**Key Features:**
- Fixed bottom position with safe-area padding for iOS
- Appears after 300px scroll
- Two buttons: Primary CTA (70%) + Phone (30%)
- Backdrop blur for modern look

**Usage:**
```tsx
import { StickyMobileCTA } from '../components/StickyMobileCTA';

<StickyMobileCTA onQuoteClick={() => setShowModal(true)} />
```

---

### 3. ExitIntentPopup
**Purpose:** Recover abandoning visitors with discount offer

**Key Features:**
- Desktop: Triggers when mouse moves toward browser chrome
- Mobile: Triggers on visibility change (tab switch/back)
- Once per session (sessionStorage)
- 5-second delay before enabling
- Email capture with discount code

**Usage:**
```tsx
import { ExitIntentPopup, useExitIntent } from '../components/ExitIntentPopup';

const { showExitPopup, closeExitPopup } = useExitIntent();

{showExitPopup && (
  <ExitIntentPopup
    onClose={closeExitPopup}
    onSubmit={(email) => saveEmail(email)}
  />
)}
```

---

### 4. RecentBookingToast
**Purpose:** Social proof through recent activity notifications

**Key Features:**
- Rotates through booking data every 45 seconds
- 15-second delay before first toast
- Auto-dismiss after 5 seconds
- Dismissible by user
- Uses real suburbs and service types

**Usage:**
```tsx
import { RecentBookingToast } from '../components/RecentBookingToast';

<RecentBookingToast />
```

---

## Conversion Psychology Techniques

| Technique | Implementation | Psychology |
|-----------|----------------|------------|
| **FOMO** | "Only X slots left this week" counter | Fear of missing out drives action |
| **Social Proof** | Recent booking toasts | "Others are doing it" validation |
| **Exit Recovery** | Discount popup on leave | Last-chance offer saves abandoning users |
| **Friction Reduction** | Quick quote modal | Fewer fields = more completions |
| **Always Visible** | Sticky mobile CTA | Never miss conversion opportunity |
| **Price Anchoring** | Crossed-out original prices | Makes current price feel like deal |
| **Authority Signals** | Trust strip badges | Credibility through credentials |
| **Urgency Colors** | Red/orange for urgent elements | Draws attention to time-sensitive offers |

---

## CSS Animations

```css
/* CTA Pulse - runs 3 times on page load */
@keyframes cta-pulse {
  0%, 100% { box-shadow: 0 0 40px rgba(0,102,204,0.5); }
  50% { box-shadow: 0 0 60px rgba(0,102,204,0.8); }
}
.animate-cta-pulse {
  animation: cta-pulse 2s ease-in-out 3;
}

/* Urgency pulse for badges */
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
.animate-pulse-subtle {
  animation: pulse-subtle 2s ease-in-out infinite;
}

/* Modal entrance */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-scaleIn {
  animation: scaleIn 0.3s ease-out forwards;
}
```

---

## Color Palette for Conversions

| Color | Hex | Use Case |
|-------|-----|----------|
| CTA Blue | `#0066CC` | Primary action buttons |
| Success Green | `#30D158` | Available, success, trust |
| Urgency Red | `#FF453A` | Limited time, warnings |
| Warning Orange | `#FF9500` | Popular badges, discounts |
| Gold | `#FFD60A` | Ratings, premium |

---

## Integration Checklist

1. [ ] Add components to `src/components/`
2. [ ] Import components in landing page
3. [ ] Add state for modal visibility
4. [ ] Use `useExitIntent` hook
5. [ ] Position sticky CTA (mobile only)
6. [ ] Add CSS keyframes
7. [ ] Test on multiple screen sizes
8. [ ] Verify session storage for exit intent

---

## A/B Testing Ideas

| Test | Variant A | Variant B |
|------|-----------|-----------|
| CTA Text | "Get Instant Quote" | "Get My Free Quote Now" |
| Urgency | Static number | Dynamic counter |
| Exit Intent | 10% off | Free extra service |
| Social Proof | Names + suburbs | Names + service type |

---

## Files Reference

```
src/components/
├── QuickQuoteModal.tsx      # Quick quote popup
├── StickyMobileCTA.tsx      # Mobile sticky bar
├── ExitIntentPopup.tsx      # Exit intent + hook
└── RecentBookingToast.tsx   # Social proof toasts
```

---

## Related Skills

- `skills/ui-design-apple.md` - Apple-style design system
- `skills/frontend-animations.md` - Animation patterns (if exists)

---

*Skill created: Jan 19, 2026*
*Tested on: Clean Up Bros website*
*Build: Passed*
