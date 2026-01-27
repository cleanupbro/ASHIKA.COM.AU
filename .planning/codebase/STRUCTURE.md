# Codebase Structure

**Analysis Date:** 2026-01-27

## Directory Layout

```
ashika.com.au/
├── src/                    # Application source code
│   ├── app/                # Next.js App Router pages
│   ├── components/         # React components by domain
│   ├── contexts/           # React Context providers
│   ├── lib/                # Utilities and data layer
│   └── types/              # TypeScript type definitions
├── supabase/               # Database migrations
├── skills/                 # AI agent skill definitions
├── .claude/                # Claude-specific project rules
├── .planning/              # GSD planning documents
├── .shared-memory/         # Session state tracking
├── 00-docs/                # Project documentation
└── [config files]          # Next.js, TypeScript, Tailwind configs
```

## Directory Purposes

**src/app/**
- Purpose: Next.js App Router file-based routing
- Contains: Pages, layouts, route handlers, metadata configuration
- Key files: `layout.tsx` (root layout), `page.tsx` (routes), `globals.css` (Tailwind imports)

**src/components/**
- Purpose: Reusable React components organized by domain
- Contains: UI primitives, feature-specific components, layout components
- Key files: `index.ts` barrel exports in each subdirectory

**src/components/ui/**
- Purpose: Base UI components (design system primitives)
- Contains: Button, Card, Input, Badge, Accordion, Skeleton
- Key files: `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/components/ui/index.ts`

**src/components/layout/**
- Purpose: Persistent layout components
- Contains: Header, Footer, Container wrapper
- Key files: `src/components/layout/header.tsx`, `src/components/layout/footer.tsx`, `src/components/layout/container.tsx`

**src/components/home/**
- Purpose: Landing page sections
- Contains: Hero, CategoriesGrid, FeaturedProducts, HowItWorks, Testimonials, Newsletter, TrustBadges
- Key files: `src/components/home/hero.tsx`, `src/components/home/categories-grid.tsx`, `src/components/home/index.ts`

**src/components/product/**
- Purpose: Product browsing and detail components
- Contains: ProductCard, ProductGrid, ProductFilters, ProductImages, ProductInfo, RelatedProducts
- Key files: `src/components/product/product-card.tsx`, `src/components/product/product-grid.tsx`, `src/components/product/index.ts`

**src/components/booking/**
- Purpose: Rental date selection components
- Contains: DateSelector, AvailabilityCalendar, RentalSummary
- Key files: `src/components/booking/date-selector.tsx`, `src/components/booking/availability-calendar.tsx`, `src/components/booking/index.ts`

**src/components/checkout/**
- Purpose: Checkout flow components
- Contains: ShippingForm, PaymentForm, OrderReview
- Key files: `src/components/checkout/shipping-form.tsx`, `src/components/checkout/payment-form.tsx`, `src/components/checkout/index.ts`

**src/components/cart/**
- Purpose: Shopping cart UI components
- Contains: CartDrawer (slide-out cart panel)
- Key files: `src/components/cart/cart-drawer.tsx`, `src/components/cart/index.ts`

**src/contexts/**
- Purpose: Global state management with React Context
- Contains: CartContext with reducer, localStorage persistence
- Key files: `src/contexts/cart-context.tsx`, `src/contexts/index.ts`

**src/lib/**
- Purpose: Utilities, helpers, and data access layer
- Contains: Mock data generators, utility functions
- Key files: `src/lib/utils.ts`, `src/lib/mock-data/products.ts`, `src/lib/mock-data/availability.ts`

**src/lib/mock-data/**
- Purpose: Development data layer (placeholder for Supabase)
- Contains: Product catalog, availability calculations
- Key files: `src/lib/mock-data/products.ts`, `src/lib/mock-data/availability.ts`

**src/types/**
- Purpose: Shared TypeScript type definitions
- Contains: Product types, Cart types, Booking types, rental configuration constants
- Key files: `src/types/index.ts`

**supabase/migrations/**
- Purpose: Database schema version control
- Contains: SQL migration files (not yet created)
- Key files: None yet (prepared for future backend)

**skills/**
- Purpose: AI agent skill definitions and workflows
- Contains: Rental logic, Stripe integration, Supabase setup, UI patterns
- Key files: `skills/rental-logic/SKILL.md`, `skills/stripe-integration/SKILL.md`, `skills/SKILLS_INDEX.md`

**.claude/rules/**
- Purpose: Claude-specific coding rules by domain
- Contains: Backend rules, frontend rules, database rules, rental logic rules
- Key files: `.claude/rules/rental-logic.md`, `.claude/rules/frontend.md`, `.claude/CLAUDE.md`

**.planning/**
- Purpose: GSD planning system documents
- Contains: Requirements, roadmap, project state, research
- Key files: `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/STATE.md`, `.planning/codebase/`

**.shared-memory/**
- Purpose: Cross-session memory for AI agents
- Contains: Progress tracking, architectural decisions, context
- Key files: `.shared-memory/progress.json`, `.shared-memory/decisions.json`, `.shared-memory/context.md`

**00-docs/**
- Purpose: Human-readable project documentation
- Contains: Architecture docs, decision logs, implementation plans
- Key files: `00-docs/ASHIKA-PROJECT-IMPLEMENTATION-DOCUMENT.md`, `00-docs/architecture/`

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root layout with providers and global structure
- `src/app/page.tsx`: Home page (landing page)
- `src/app/shop/page.tsx`: Product listing page
- `src/app/shop/[id]/page.tsx`: Dynamic product detail page
- `src/app/checkout/page.tsx`: Checkout flow

**Configuration:**
- `next.config.mjs`: Next.js configuration (image domains)
- `tsconfig.json`: TypeScript compiler options (strict mode, path aliases)
- `tailwind.config.ts`: Tailwind CSS theme (brand colors, fonts)
- `.eslintrc.json`: ESLint configuration (Next.js rules)
- `package.json`: Dependencies and scripts

**Core Logic:**
- `src/types/index.ts`: All TypeScript types and RENTAL_CONFIG constants
- `src/lib/mock-data/products.ts`: Product catalog and helper functions
- `src/lib/mock-data/availability.ts`: Rental timeline calculations
- `src/contexts/cart-context.tsx`: Cart state management with reducer

**Testing:**
- None yet (testing infrastructure not implemented)

## Naming Conventions

**Files:**
- Components: `kebab-case.tsx` (e.g., `product-card.tsx`, `availability-calendar.tsx`)
- Utilities: `kebab-case.ts` (e.g., `utils.ts`)
- Hooks: `use-*.ts` (e.g., `use-cart.ts` - via context)
- Pages: `page.tsx` (Next.js App Router convention)
- Types: `index.ts` or `types.ts`

**Directories:**
- `kebab-case` for all directories (e.g., `mock-data`, `cart-context`)
- Next.js dynamic routes: `[param]` (e.g., `shop/[id]/`)

**Components:**
- Named exports: `export function ProductCard() {}`
- PascalCase component names matching filename
- Barrel exports via `index.ts`: `export * from './product-card'`

**Types:**
- PascalCase interfaces: `Product`, `CartItem`, `BookingStatus`
- SCREAMING_SNAKE_CASE for constants: `RENTAL_CONFIG`, `STOCK_IMAGES`

## Where to Add New Code

**New Feature:**
- Primary code: Component in appropriate `src/components/[domain]/` directory
- Tests: Co-located `*.test.tsx` files (when testing is set up)
- Types: Add to `src/types/index.ts` if shared, or keep local if component-specific
- Page route: Add `page.tsx` in `src/app/[route]/`

**New Component/Module:**
- Implementation: `src/components/[domain]/[component-name].tsx`
- Export: Add to `src/components/[domain]/index.ts` barrel
- UI primitives: Add to `src/components/ui/` if reusable across domains
- Feature-specific: Add to appropriate domain folder (product, booking, checkout, etc.)

**Utilities:**
- Shared helpers: `src/lib/utils.ts` or new file in `src/lib/`
- Data access: `src/lib/mock-data/` (until Supabase integration)
- Future API routes: `src/app/api/[endpoint]/route.ts` (not yet implemented)

**New Page:**
- Route file: `src/app/[route]/page.tsx`
- Server Component by default
- Add 'use client' directive only if needed for interactivity
- Dynamic routes: `src/app/[route]/[param]/page.tsx`

**New Context:**
- Provider: `src/contexts/[name]-context.tsx`
- Export hook and provider from context file
- Register in `src/contexts/index.ts` barrel

**New Type:**
- Shared types: `src/types/index.ts`
- Local types: Within component file if not shared

**Database Migration:**
- Add SQL file: `supabase/migrations/[timestamp]_[description].sql`
- (Not yet active - preparing for Supabase)

## Special Directories

**.next/**
- Purpose: Next.js build output and cache
- Generated: Yes (on `npm run dev` or `npm run build`)
- Committed: No (in `.gitignore`)

**node_modules/**
- Purpose: Installed npm dependencies
- Generated: Yes (on `npm install`)
- Committed: No (in `.gitignore`)

**.planning/codebase/**
- Purpose: GSD system codebase analysis documents
- Generated: Yes (by `/gsd:map-codebase` command)
- Committed: Yes (planning state tracked)

**.planning/research/**
- Purpose: GSD research phase outputs
- Generated: Yes (by `/gsd:research` command)
- Committed: Yes

**.git/**
- Purpose: Git version control metadata
- Generated: Yes (by `git init`)
- Committed: No (Git internal directory)

**public/** (not present yet)
- Purpose: Static assets (images, fonts, favicon)
- Generated: No (manually created)
- Committed: Yes (when created)

---

*Structure analysis: 2026-01-27*
