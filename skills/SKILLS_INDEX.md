# Skills Registry — ASHIKA Auto-Invocation Rules
> Master index of all skills with trigger patterns

---

## AUTO-INVOKE MATRIX

| Skill File | Trigger Patterns | Priority |
|------------|------------------|----------|
| `continue.md` | "continue", "resume", "where were we" | 🔴 Critical |
| `done-for-day.md` | "done for the day", "end session", "save everything" | 🔴 Critical |
| `sync.md` | After ANY action, before closing | 🔴 Critical |
| `deploy.md` | "deploy", "push", "go live", "ship it" | 🔴 High |
| `bug-fix.md` | "error", "bug", "not working", "broken", "fix" | 🔴 High |
| `code-review.md` | Before ANY git commit (implicit) | 🔴 High |
| `database.md` | "table", "migration", "supabase", "schema" | 🟡 Medium |
| `new-feature.md` | "add", "create", "build", "implement" | 🟡 Medium |
| `ui-design-apple.md` | "apple design", "premium ui", "dark theme", "luxury" | 🟡 Medium |
| `conversion-optimization.md` | "conversion", "lead gen", "exit intent", "social proof" | 🟡 Medium |
| `form-animations.md` | "form animation", "confetti", "price counter", "loading button" | 🟡 Medium |
| `rental-logic/SKILL.md` | "rental", "booking", "availability", "bond" | 🟡 Medium |
| `stripe-integration/SKILL.md` | "payment", "stripe", "checkout" | 🟡 Medium |
| `supabase-setup/SKILL.md` | "database", "auth", "supabase" | 🟡 Medium |
| `shipping-integration/SKILL.md` | "shipping", "auspost", "labels" | 🟢 Low |
| `nextjs-patterns/SKILL.md` | "nextjs", "app router", "server components" | 🟢 Low |
| `vercel-deploy.md` | "vercel", "deploy to vercel" | 🟢 Low |
| `testing.md` | "test", "unit test", "integration test" | 🟢 Low |
| `docs.md` | "documentation", "readme", "jsdoc" | 🟢 Low |
| `github-release.md` | "release", "version", "changelog" | 🟢 Low |
| `backup.md` | "backup", "archive", "snapshot" | 🟢 Low |

---

## IMPLICIT TRIGGERS (Run automatically)

- **sync.md** — After EVERY change, before session end
- **code-review.md** — Before ANY git commit

---

## DESIGN SYSTEM INVOCATION

When building UI for ASHIKA, ALWAYS check:
1. `ui-design-apple.md` — For premium styling (dark theme, floating nav)
2. `form-animations.md` — For form interactions
3. `conversion-optimization.md` — For lead capture components

### ASHIKA Brand Override
While using Apple design patterns, apply ASHIKA brand colors:
- **Teal** `#0D9488` — Primary brand color (replaces Apple Blue for CTAs)
- **Gold** `#D97706` — Accent color (highlights, badges)
- **Cream** `#FEF3C7` — Light backgrounds
- **Pure Black** `#000000` — Dark backgrounds (keep from Apple)

---

## ASHIKA-SPECIFIC SKILLS

| Domain | Skill | When to Use |
|--------|-------|-------------|
| **Rental Logic** | `rental-logic/SKILL.md` | Any booking, availability, or date logic |
| **Database** | `supabase-setup/SKILL.md` | Schema changes, RLS policies, auth |
| **Payments** | `stripe-integration/SKILL.md` | Checkout, bond handling, refunds |
| **Shipping** | `shipping-integration/SKILL.md` | Australia Post integration |
| **UI Patterns** | `nextjs-patterns/SKILL.md` | App Router, SSR, API routes |

---

## SKILL LOADING PROTOCOL

When a trigger pattern is detected:

```
1. ANNOUNCE: "📋 Loading skill: [skill-name.md]"
2. READ: Load the skill file
3. CHECK: Run PRE-FLIGHT CHECKS from skill
4. EXECUTE: Follow the skill's STEPS
5. VERIFY: Run VERIFICATION from skill
6. SYNC: Update .shared-memory/progress.json
```

---

## UI DESIGN STACK (For ALL frontend work)

| Component Type | Use Skill |
|----------------|-----------|
| Layout, Navigation | `ui-design-apple.md` |
| Forms, Inputs | `form-animations.md` |
| CTAs, Modals, Toasts | `conversion-optimization.md` |
| Product Cards | `ui-design-apple.md` + ASHIKA colors |
| Calendar, Dates | `form-animations.md` |
| Checkout Flow | `conversion-optimization.md` + `stripe-integration/SKILL.md` |

---

## DESIGN TOKENS (From ui-design-apple.md + ASHIKA)

### Colors
```css
/* Apple Dark Theme Base */
--color-black: #000000;
--color-charcoal: #2C2C2E;
--color-gray-dark: #3A3A3C;

/* ASHIKA Brand (Override) */
--color-primary: #0D9488;    /* Teal - CTAs, links */
--color-accent: #D97706;     /* Gold - highlights */
--color-cream: #FEF3C7;      /* Light backgrounds */
--color-emerald: #059669;    /* Secondary teal */

/* Status */
--color-success: #30D158;
--color-warning: #FFD60A;
--color-error: #FF453A;
```

### Typography
```css
/* Headings */
font-family: 'Playfair Display', serif;
/* Hero: 56-80px, -0.02em tracking */
/* Section: 32-48px */

/* Body */
font-family: 'Inter', system-ui, sans-serif;
/* Body: 17-19px */
```

---

## SESSION LIFECYCLE SKILLS

| Event | Skill | Action |
|-------|-------|--------|
| Start Session | `continue.md` | Load context, show summary |
| After Any Change | `sync.md` | Update shared memory |
| Before Commit | `code-review.md` | Quality check |
| End Session | `done-for-day.md` | Save state, create backup |

---

## WORKFLOW SKILLS

| Task Type | Primary Skill | Supporting Skills |
|-----------|---------------|-------------------|
| Bug Fix | `bug-fix.md` | `testing.md` |
| New Feature | `new-feature.md` | `ui-design-apple.md`, `testing.md` |
| Deployment | `deploy.md` | `vercel-deploy.md` |
| Database Change | `database.md` | `supabase-setup/SKILL.md` |
| Release | `github-release.md` | `code-review.md` |

---

*Last updated: 2026-01-20*
