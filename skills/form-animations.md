# Skill: Form Animations & Micro-Interactions

**Category:** UI/UX Components
**Created:** January 19, 2026
**Source:** Clean Up Bros quote form redesign

---

## Overview

A collection of React components and hooks for creating engaging, conversion-focused form experiences with smooth animations and visual feedback.

---

## Components Available

### 1. SubmitConfetti
Confetti particle explosion on successful form submission.

```tsx
import { SubmitConfetti } from '../components/FormEffects';

<SubmitConfetti active={showSuccess} />
```

**Props:**
- `active: boolean` - Triggers the confetti when true

---

### 2. FieldCheckmark
Animated checkmark that appears when a field is validated.

```tsx
import { FieldCheckmark } from '../components/FormEffects';

<FieldCheckmark show={isFieldValid} className="ml-2" />
```

**Props:**
- `show: boolean` - Shows/hides the checkmark
- `className?: string` - Additional classes

---

### 3. PriceCounter
Animated number counter with sparkle effect for price displays.

```tsx
import { PriceCounter } from '../components/FormEffects';

<PriceCounter
  value={350}
  prefix="$"
  suffix=" AUD"
  duration={1000}
/>
```

**Props:**
- `value: number` - Target number to count to
- `prefix?: string` - Text before number (default: '$')
- `suffix?: string` - Text after number
- `duration?: number` - Animation duration in ms (default: 1000)

---

### 4. LoadingButton
Button with loading spinner and success states.

```tsx
import { LoadingButton } from '../components/FormEffects';

<LoadingButton
  loading={isSubmitting}
  loadingText="Sending..."
  showSuccess={showSuccess}
  successText="Sent!"
  className="btn-primary"
>
  Submit Quote
</LoadingButton>
```

**Props:**
- `loading: boolean` - Shows spinner when true
- `loadingText?: string` - Text during loading
- `showSuccess?: boolean` - Shows success state
- `successText?: string` - Text during success
- `type?: 'button' | 'submit'`

---

### 5. ProgressBar
Multi-step form progress indicator with step numbers.

```tsx
import { ProgressBar } from '../components/FormEffects';

<ProgressBar
  currentStep={2}
  totalSteps={4}
  estimatedTime="~2 min left"
/>
```

**Props:**
- `currentStep: number` - Current step (1-indexed)
- `totalSteps: number` - Total number of steps
- `estimatedTime?: string` - Time estimate text

---

### 6. AutoSaveToast
Toast notification for auto-save confirmation.

```tsx
import { AutoSaveToast } from '../components/FormEffects';

<AutoSaveToast show={isSaved} />
```

---

### 7. SelectionCard
Card button with bounce animation and checkmark for selections.

```tsx
import { SelectionCard } from '../components/FormEffects';

<SelectionCard
  selected={selectedOption === 'deep-clean'}
  onClick={() => setSelectedOption('deep-clean')}
>
  <h3>Deep Clean</h3>
  <p>Full property deep cleaning</p>
</SelectionCard>
```

---

### 8. NumberStepper
Animated number input with +/- buttons.

```tsx
import { NumberStepper } from '../components/FormEffects';

<NumberStepper
  value={bedrooms}
  onChange={setBedrooms}
  min={1}
  max={10}
  label="Bedrooms"
/>
```

---

## Hooks Available

### useCountAnimation
Animated counter with easing.

```tsx
import { useCountAnimation } from '../components/FormEffects';

const { currentValue, isAnimating, startAnimation } = useCountAnimation(
  targetValue,  // number to count to
  duration,     // ms (default: 1000)
  startOnMount  // auto-start (default: true)
);
```

---

### useAutoSave
Auto-save form data to localStorage.

```tsx
import { useAutoSave } from '../components/FormEffects';

const { isSaved, loadSaved, clearSaved } = useAutoSave(
  'quote-form-residential',  // storage key
  formData,                   // data to save
  1000                        // debounce delay ms
);

// On mount, restore saved data
useEffect(() => {
  const saved = loadSaved();
  if (saved) setFormData(saved);
}, []);

// Show save indicator
<AutoSaveToast show={isSaved} />
```

---

## LivePriceEstimate Component

Enhanced price display with animations and mandatory disclaimer.

```tsx
import { LivePriceEstimate } from '../components/LivePriceEstimate';

<LivePriceEstimate
  estimate={calculatedPrice}
  lowEstimate={280}
  highEstimate={350}
  isLoading={isCalculating}
  error={priceError}
  confidence="high"  // 'high' | 'medium' | 'low'
  frequency="One-time"
  perUnit="per clean"
  showRange={true}
  onGetExactQuote={() => submitForm()}
/>
```

**Features:**
- Animated counter on price change
- Sparkle effects
- Confidence indicator (green/yellow/orange)
- Mandatory orange disclaimer box
- Loading shimmer
- Error state handling

---

## CSS Keyframes Used

```css
/* Confetti fall */
@keyframes confetti-fall {
  0% { transform: translateY(-100vh) rotate(0deg) scale(1); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg) scale(0); opacity: 0; }
}

/* Checkmark draw */
@keyframes checkmark-draw {
  0% { stroke-dashoffset: 24; }
  100% { stroke-dashoffset: 0; }
}

/* Price sparkle */
@keyframes sparkle-float {
  0% { opacity: 0; transform: translateY(0) scale(0); }
  50% { opacity: 1; transform: translateY(-10px) scale(1); }
  100% { opacity: 0; transform: translateY(-20px) scale(0); }
}

/* Shimmer loading */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## Integration Example

Full quote form with all effects:

```tsx
import React, { useState, useMemo } from 'react';
import {
  ProgressBar,
  LoadingButton,
  SubmitConfetti,
  AutoSaveToast,
  useAutoSave
} from '../components/FormEffects';
import { LivePriceEstimate } from '../components/LivePriceEstimate';

const QuoteForm = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { isSaved, loadSaved, clearSaved } = useAutoSave('quote-form', data);

  const estimate = useMemo(() => calculatePrice(data), [data]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await submitToAPI(data);
    setIsSubmitting(false);
    setShowSuccess(true);
    clearSaved();
  };

  return (
    <div>
      <ProgressBar currentStep={step} totalSteps={4} />

      {/* Form steps... */}

      <LivePriceEstimate
        estimate={estimate}
        isLoading={false}
        error={null}
        confidence="high"
      />

      <LoadingButton
        loading={isSubmitting}
        showSuccess={showSuccess}
        onClick={handleSubmit}
        className="w-full py-4 bg-[#0066CC] text-white rounded-xl"
      >
        Get My Quote
      </LoadingButton>

      <AutoSaveToast show={isSaved} />
      <SubmitConfetti active={showSuccess} />
    </div>
  );
};
```

---

## File Locations

- **FormEffects:** `src/components/FormEffects.tsx`
- **LivePriceEstimate:** `src/components/LivePriceEstimate.tsx`

---

## Design Principles

1. **Immediate feedback** - Every action gets visual response
2. **Smooth animations** - All transitions use ease-out curves
3. **Non-intrusive** - Animations are subtle, not distracting
4. **Accessible** - Works without animations for reduced-motion
5. **Mobile-first** - Touch-friendly targets (48px minimum)

---

*Skill created from Clean Up Bros UI/UX redesign project*
