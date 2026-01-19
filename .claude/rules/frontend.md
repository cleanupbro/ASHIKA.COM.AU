# Frontend Rules — ASHIKA
> Rules for React/Next.js development

---

## Component Rules

1. **Named exports only** — No default exports for components
2. **Function components** — No class components
3. **TypeScript interfaces** — Define props with explicit types
4. **No business logic in components** — Extract to hooks/utils

```typescript
// ✅ Correct
export function ProductCard({ product, onSelect }: ProductCardProps) {
  return <div>...</div>;
}

// ❌ Wrong
export default class ProductCard extends Component {}
```

---

## Styling Rules

1. **Tailwind only** — No inline styles, no CSS modules
2. **Brand colors** — Use ASHIKA palette from Tailwind config
3. **Responsive** — Mobile-first with md: and lg: breakpoints
4. **Dark theme base** — Apple-inspired dark backgrounds

```typescript
// ✅ Correct
<button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg">

// ❌ Wrong
<button style={{ backgroundColor: '#0D9488' }}>
```

---

## File Naming

- Components: `kebab-case.tsx` (e.g., `product-card.tsx`)
- Hooks: `use-*.ts` (e.g., `use-availability.ts`)
- Utils: `kebab-case.ts` (e.g., `date-utils.ts`)
- Types: `types.ts` or `index.d.ts`

---

## State Management

1. **Local state** — useState for component state
2. **Form state** — react-hook-form
3. **Server state** — SWR or React Query (if needed)
4. **Global state** — React Context + useReducer (no Redux)

---

## Performance Rules

1. **Lazy load** — Dynamic imports for heavy components
2. **Image optimization** — Use next/image
3. **Memoization** — useMemo/useCallback only when profiled
4. **Server components** — Default to server, client only when needed

---

## Accessibility

1. **Semantic HTML** — Use proper elements (button, nav, main)
2. **ARIA labels** — For interactive elements
3. **Keyboard navigation** — All interactions keyboard-accessible
4. **Color contrast** — Meet WCAG AA standards

---

*Applied automatically for frontend tasks*
