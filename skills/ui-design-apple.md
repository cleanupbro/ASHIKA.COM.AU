# Apple iPhone 17 Pro Design System

Premium UI patterns derived from Apple's iPhone 17 Pro product page.

**Status:** Stable
**Created:** 2026-01-19
**Tags:** ui, design, apple, premium, dark-theme, iphone-17-pro

---

## Color Palette

### Primary Backgrounds
| Usage | Color | Hex |
|-------|-------|-----|
| Premium sections | Pure Black | `#000000` |
| Contrast sections | Light Gray | `#F5F5F7` |
| Card surfaces | Dark Gray | `#1C1C1E` |
| Elevated cards | Charcoal | `#2C2C2E` |

### Accent Colors
| Usage | Color | Hex |
|-------|-------|-----|
| iPhone 17 Pro signature | Copper/Orange | `#E5783C` |
| Interactive elements | Apple Blue | `#0066CC` |
| Links on light bg | Bright Blue | `#2997FF` |
| Success states | Apple Green | `#30D158` |
| Warning states | Apple Yellow | `#FFD60A` |
| Error states | Apple Red | `#FF453A` |

### Text Colors
| Usage | Color | Hex |
|-------|-------|-----|
| Primary on dark | White | `#FFFFFF` |
| Secondary on dark | Gray | `#86868B` |
| Tertiary on dark | Muted | `#6E6E73` |
| Primary on light | Black | `#1D1D1F` |
| Secondary on light | Dark Gray | `#424245` |

---

## Typography

### Font Family
```css
font-family: 'SF Pro Display', 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Type Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Hero headline | 56-80px | 600 | 1.05 |
| Section headline | 48px | 600 | 1.1 |
| Card title | 24-32px | 600 | 1.2 |
| Body large | 21px | 400 | 1.5 |
| Body regular | 17px | 400 | 1.47 |
| Caption | 14px | 400 | 1.4 |
| Label | 12px | 500 | 1.3 |

### Headline Patterns
- Use periods at end of headlines for impact: "Pro. Beyond."
- Metallic gradient text for "PRO" typography
- Split headlines across lines for emphasis

---

## Spacing System

### Base Unit: 8px
| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| 3xl | 64px |
| 4xl | 80px |
| 5xl | 120px |

### Section Padding
- Hero sections: 80-120px vertical
- Content sections: 64-80px vertical
- Cards: 24-32px padding
- Mobile: Scale down by ~40%

---

## Components

### 1. Floating Navigation Bar
```css
.floating-nav {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 8px 16px;
  display: flex;
  gap: 8px;
}

.nav-pill {
  padding: 8px 20px;
  border-radius: 18px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-pill.active {
  background: #FFFFFF;
  color: #000000;
}

.nav-pill:not(.active) {
  color: #FFFFFF;
}
```

### 2. Hero Section
- Full viewport height (100vh)
- Centered product image
- Large headline above
- "PRO" text with metallic gradient
- Two pill buttons: "Explore" (text), "Buy" (filled blue)

### 3. Feature Cards (2x3 or 3x3 Grid)
```css
.feature-card {
  background: #1C1C1E;
  border-radius: 20px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-card-title {
  font-size: 24px;
  font-weight: 600;
  color: #FFFFFF;
}

.feature-card-description {
  font-size: 17px;
  color: #86868B;
}
```

### 4. Stats Display
```jsx
<div className="stat">
  <span className="stat-number">8x</span>
  <span className="stat-label">Optical zoom</span>
</div>

// CSS
.stat-number {
  font-size: 64px;
  font-weight: 600;
  background: linear-gradient(180deg, #FFF 0%, #86868B 100%);
  -webkit-background-clip: text;
  color: transparent;
}
```

### 5. Expandable Feature List
- Pills/tags that expand on click
- Categories: "Colours", "Materials", "Technology"
- Uses smooth height animation
- Content reveals with fade-in

### 6. Photo Gallery Carousel
- Full-width images
- Horizontal scroll on mobile
- Tab/pill selector for lens types
- Subtle navigation arrows

### 7. Comparison Grid
- "Worth the upgrade?" section
- 6 cards in 2x3 grid
- Each card: icon + title + description
- Dark cards on dark background

### 8. Product Pairings (Accessories)
- Horizontal scroll of product cards
- Each card: product image + name + price
- Dark background, rounded corners

### 9. Values Section (Light Background)
- Light gray (#F5F5F7) background for contrast
- Icon cards with colored accents
- Stats with colored text (green, blue, etc.)

---

## Animations

### Page Load
- Fade up from bottom: 0.6s ease-out
- Stagger children by 0.1s

### Scroll Reveals
```css
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Hover States
- Cards: subtle scale(1.02) + shadow increase
- Buttons: brightness(1.1) + scale(1.02)
- Links: color transition 0.2s

### Button Interactions
- Ripple effect on click
- Scale down on press: scale(0.98)
- Scale up on hover: scale(1.02)

---

## Responsive Breakpoints

| Breakpoint | Width | Use |
|------------|-------|-----|
| Mobile | < 640px | Single column, stacked |
| Tablet | 640-1024px | 2-column grids |
| Desktop | 1024-1440px | Full layouts |
| Large | > 1440px | Max-width container |

### Mobile Adaptations
- Nav becomes hamburger menu
- Hero text scales to 40px
- Cards stack vertically
- Horizontal scroll for carousels
- Touch-optimized tap targets (44px min)

---

## Implementation Patterns

### React + Tailwind Example
```tsx
// Hero Section
<section className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
  <h1 className="text-5xl md:text-7xl font-semibold text-white text-center tracking-tight">
    iPhone 17 Pro
  </h1>
  <p className="text-2xl md:text-4xl bg-gradient-to-b from-[#E5783C] to-[#8B4513] bg-clip-text text-transparent font-semibold mt-2">
    Pro. Beyond.
  </p>
  <div className="flex gap-4 mt-8">
    <button className="px-6 py-3 text-[#2997FF] text-lg font-medium hover:underline">
      Explore
    </button>
    <button className="px-6 py-3 bg-[#0066CC] text-white rounded-full text-lg font-medium hover:bg-[#0077ED] transition-colors">
      Buy
    </button>
  </div>
  <img src="/iphone-hero.png" alt="iPhone 17 Pro" className="mt-12 max-w-md" />
</section>
```

### CSS Variables Setup
```css
:root {
  --apple-bg-primary: #000000;
  --apple-bg-secondary: #1C1C1E;
  --apple-bg-tertiary: #2C2C2E;
  --apple-bg-light: #F5F5F7;

  --apple-text-primary: #FFFFFF;
  --apple-text-secondary: #86868B;
  --apple-text-tertiary: #6E6E73;

  --apple-accent-blue: #0066CC;
  --apple-accent-blue-light: #2997FF;
  --apple-accent-orange: #E5783C;
  --apple-accent-green: #30D158;

  --apple-radius-sm: 8px;
  --apple-radius-md: 12px;
  --apple-radius-lg: 20px;
  --apple-radius-xl: 24px;
  --apple-radius-full: 9999px;
}
```

---

## Application to Clean Up Bros

### Brand Adaptation
| Apple Element | Clean Up Bros Adaptation |
|---------------|-------------------------|
| Orange/Copper accent | Keep brand blue `#0066CC` as primary |
| "Pro. Beyond." | "Clean. Beyond." |
| Product photos | Sparkling clean homes |
| Stats (8x zoom) | Stats (100% satisfaction, 500+ homes) |
| Feature cards | Service cards (Residential, Commercial, Airbnb) |

### Section Mapping
1. **Hero** - Full-screen black bg + sparkle effect + headline
2. **Get the highlights** - "Our Promise" section
3. **Feature grid** - Service types (3 cards)
4. **Stats section** - Trust indicators (rating, jobs, years)
5. **Gallery** - Before/after cleaning photos
6. **Comparison grid** - "Why Choose Us" benefits
7. **Pairings** - Related services / add-ons
8. **Values section** - About us / certifications

---

## Gotchas

1. **SF Pro font licensing** - Use system fonts as fallback
2. **Large images** - Compress to WebP, use lazy loading
3. **Animation performance** - Use `will-change` sparingly, prefer `transform`
4. **Dark mode contrast** - Ensure WCAG 4.5:1 ratio for text
5. **Mobile navigation** - Don't hide critical CTAs in hamburger menu

---

## Related

- Apple Human Interface Guidelines
- iPhone product pages (apple.com/au/iphone-17-pro)
- Tailwind CSS dark mode
- Framer Motion for React animations
