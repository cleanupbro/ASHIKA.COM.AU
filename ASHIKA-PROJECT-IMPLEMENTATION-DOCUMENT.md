# ASHIKA — Project Implementation Document (PID)
## Indian Wear Hire Australia
**Domain:** ashika.com.au  
**Document Version:** 1.0  
**Status:** Planning Complete — Ready for Execution  
**Last Updated:** 2026-01-19  

---

## PART 1: EXECUTIVE SUMMARY

### 1.1 What We Are Building

A rental-only marketplace for Indian ethnic wear in Australia. Users browse a catalog, select items for specific dates, pay a rental fee plus refundable bond, receive the item before their event, wear it, and return it via pre-paid satchel.

### 1.2 Core Differentiators

1. **Shein-style UX** — Fast, filter-heavy, impulse-friendly catalog
2. **AllBorrow-style trust** — Community warmth, transparent policies
3. **AI Virtual Try-On** (Phase 2) — Solve fit uncertainty for saris

### 1.3 Build Philosophy

**We are broke. Claude builds.**

- No paid services until absolutely necessary
- Use free tiers aggressively (Stripe test mode, Vercel free, Supabase free)
- Claude Code generates 80%+ of implementation
- Human reviews, tests, deploys
- Ship fast, iterate faster

---

## PART 2: BUSINESS LOGIC (NON-NEGOTIABLE)

These rules are **immutable**. Every LLM, every developer, every line of code must respect these:

### 2.1 Rental Logic Rules

```
RENTAL_PERIOD = 7 days (includes delivery + return time)
DELIVERY_BUFFER = 2-3 days before event (ship early)
CLEANING_BUFFER = 3 days after return (auto-block item)
BOND_AMOUNT = $100 AUD (refundable, pre-authorized)
SHIPPING_COST = $0 (free both ways, Australia-wide)
```

### 2.2 Availability Calculation

```
Item is UNAVAILABLE if:
  - Current date falls within: [rental_start - 3] to [rental_end + 3]
  - Item is marked "in_cleaning" or "damaged"
  - Item is marked "reserved" by another order

Item becomes AVAILABLE again:
  - 3 days after return_received_date
  - After admin marks inspection_complete = true
```

### 2.3 Checkout Rules

```
1. User selects item + event_date
2. System calculates: rental_start = event_date - 3 days
3. System calculates: rental_end = event_date + 4 days
4. System blocks item for: rental_start to rental_end + 3 (cleaning)
5. Checkout shows: rental_fee + $100 bond
6. Stripe pre-authorizes bond (not captured)
7. Postcode validation required before payment
8. Order confirmed → shipping label generated
```

### 2.4 Bond Logic

```
ON_ORDER_COMPLETE:
  - Release bond pre-auth (Stripe)
  
ON_DAMAGE_DETECTED:
  - Capture partial/full bond
  - Document damage with photos
  - Notify customer
  
ON_LATE_RETURN (>3 days):
  - Capture $50 from bond
  - Send reminder email at day 1, 3
```

---

## PART 3: TECHNICAL ARCHITECTURE

### 3.1 Stack Decision (Final)

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | Next.js 14 (App Router) | SSR for SEO, React ecosystem, Vercel free tier |
| **Styling** | Tailwind CSS | Fast, consistent, Claude knows it well |
| **Backend** | Next.js API Routes (Phase 1) | Monolith for speed; split later if needed |
| **Database** | Supabase (PostgreSQL) | Free tier generous, real-time, auth built-in |
| **Auth** | Supabase Auth | Free, social logins, secure |
| **Payments** | Stripe | Pre-auth for bonds, Australian support |
| **Shipping** | Australia Post API | Native AU, label generation |
| **Hosting** | Vercel | Free tier, Next.js optimized |
| **Images** | Supabase Storage / Cloudinary Free | CDN, transformations |

### 3.2 Phase 2 Additions (AI)

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Pose Detection** | MediaPipe (browser) | Free, client-side, no GPU costs |
| **Try-On Overlay** | Replicate API (pay-per-use) or open-source VTON | Defer decision until Phase 2 |
| **Image Processing** | Sharp (Node.js) | Free, fast |

### 3.3 Database Schema (Core Tables)

```sql
-- Core tables for Phase 1

users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  phone TEXT,
  address JSONB,
  created_at TIMESTAMP
)

products (
  id UUID PRIMARY KEY,
  name TEXT,
  description TEXT,
  category ENUM('saree', 'lehenga', 'salwar_kameez', 'sherwani', 'kids', 'accessories'),
  size ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL', 'free_size'),
  blouse_included BOOLEAN DEFAULT false,
  rental_price DECIMAL(10,2),
  images TEXT[],
  status ENUM('available', 'rented', 'cleaning', 'damaged', 'retired'),
  created_at TIMESTAMP
)

bookings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  event_date DATE,
  rental_start DATE,
  rental_end DATE,
  cleaning_end DATE,
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'returned', 'completed', 'disputed'),
  rental_fee DECIMAL(10,2),
  bond_amount DECIMAL(10,2) DEFAULT 100.00,
  bond_status ENUM('held', 'released', 'partial_capture', 'full_capture'),
  stripe_payment_intent TEXT,
  shipping_label_url TEXT,
  return_label_url TEXT,
  created_at TIMESTAMP
)

inventory_blocks (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  booking_id UUID REFERENCES bookings(id),
  block_start DATE,
  block_end DATE,
  reason ENUM('rental', 'cleaning', 'maintenance'),
  UNIQUE(product_id, block_start, block_end)
)
```

---

## PART 4: WORKSPACE STRUCTURE

### 4.1 Directory Map

```
ashika/
├── .claude/                    # Claude Code memory
│   ├── CLAUDE.md              # Master directives for Claude
│   ├── CLAUDE.local.md        # Local overrides (gitignored)
│   └── rules/                 # Path-specific rules
│       ├── frontend.md
│       ├── backend.md
│       ├── database.md
│       └── rental-logic.md
│
├── .gemini/                    # Gemini memory (mirror structure)
│   ├── GEMINI.md              # Master directives for Gemini
│   └── rules/                 # Same rules, Gemini format
│
├── .shared-memory/             # Synchronized state (both LLMs read)
│   ├── decisions.json         # Architectural decisions log
│   ├── progress.json          # What's done, what's next
│   └── context.md             # Current working context
│
├── skills/                     # Agent skills (Claude Code format)
│   ├── rental-logic/
│   │   └── SKILL.md
│   ├── supabase-setup/
│   │   └── SKILL.md
│   ├── stripe-integration/
│   │   └── SKILL.md
│   ├── shipping-integration/
│   │   └── SKILL.md
│   └── nextjs-patterns/
│       └── SKILL.md
│
├── env/                        # Environment configuration
│   ├── .env.example           # Template for client
│   ├── .env.local             # Local dev (gitignored)
│   └── .env.testing           # Claude's test keys (gitignored)
│
├── 00-docs/                    # Documentation
│   ├── PRD/
│   ├── architecture/
│   ├── decisions/
│   └── roadmap/
│
├── src/                        # Application code
│   ├── app/                   # Next.js App Router
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   └── types/
│
├── supabase/                   # Database migrations
│   └── migrations/
│
└── scripts/                    # Utility scripts
    ├── sync-memory.sh         # Sync Claude ↔ Gemini memory
    └── backup-progress.sh
```

### 4.2 Memory Synchronization Strategy

```
┌─────────────────┐         ┌─────────────────┐
│   Claude Code   │         │     Gemini      │
│   .claude/      │         │    .gemini/     │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │    ┌─────────────────┐    │
         └───►│ .shared-memory/ │◄───┘
              │                 │
              │ - decisions.json│
              │ - progress.json │
              │ - context.md    │
              └─────────────────┘

SYNC RULES:
1. When Claude completes a task → update .shared-memory/progress.json
2. When Gemini starts → read .shared-memory/progress.json
3. Architectural decisions → append to decisions.json
4. Current context → overwrite context.md
5. Git auto-commit on every sync
```

---

## PART 5: API KEY PROTECTION STRATEGY

### 5.1 Key Hierarchy

```
PROTECTED (Never touched by any LLM):
├── ~/master-keys/              # Your personal master keys
│   └── DO_NOT_TOUCH.txt       # Warning file

PROJECT-SPECIFIC:
├── ashika/env/.env.local      # Active development keys
├── ashika/env/.env.testing    # Claude's temporary test keys
└── ashika/env/.env.example    # Template (no real keys)
```

### 5.2 .env.example Template

```bash
# ASHIKA Environment Configuration
# Copy this to .env.local and fill in your values

# === SUPABASE ===
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# === STRIPE ===
STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# === AUSTRALIA POST ===
AUSPOST_API_KEY=your_auspost_key
AUSPOST_ACCOUNT_NUMBER=your_account

# === OPTIONAL: AI (Phase 2) ===
# REPLICATE_API_TOKEN=your_token
# OPENAI_API_KEY=your_key

# === LLM KEYS (For development tools only) ===
# These are for Claude Code / Gemini workspace tools
# ANTHROPIC_API_KEY=sk-ant-xxxxx
# GOOGLE_AI_API_KEY=xxxxx
```

### 5.3 Protection Rules (Enforced in CLAUDE.md)

```
RULE: NEVER read, write, or reference any path containing:
  - ~/master-keys/
  - ~/.anthropic/
  - ~/.config/google-cloud/
  - Any path the user designates as "protected"

RULE: API keys in env files:
  - May READ from .env.local for runtime configuration
  - May WRITE to .env.testing for test setup
  - NEVER log, print, or include keys in committed files
  - NEVER copy keys between environments

RULE: If uncertain about key safety:
  - STOP and ask the user
  - Do not proceed with assumption
```

---

## PART 6: DETAILED WORKSPACE DIRECTIVES

### 6.1 CLAUDE.md (Full Content)

See: `/ashika/.claude/CLAUDE.md`

This file contains:
- Project context (ASHIKA business rules)
- Non-negotiable constraints
- Coding standards
- Path-specific rules references
- API key protection rules
- Memory sync procedures

### 6.2 GEMINI.md (Full Content)

See: `/ashika/.gemini/GEMINI.md`

Mirror of CLAUDE.md adapted for Gemini's instruction format.

### 6.3 Path-Specific Rules

Each rule file in `.claude/rules/` and `.gemini/rules/` contains:
- YAML frontmatter with `paths:` glob patterns
- Domain-specific instructions
- Examples of correct/incorrect patterns

---

## PART 7: SKILL DEFINITIONS

### 7.1 Skill: rental-logic

**Purpose:** Implement all booking, availability, and calendar logic  
**Trigger:** When working on bookings, availability, or calendar features

### 7.2 Skill: supabase-setup

**Purpose:** Database schema, migrations, RLS policies  
**Trigger:** When setting up or modifying database

### 7.3 Skill: stripe-integration

**Purpose:** Payment processing, bond pre-auth, webhooks  
**Trigger:** When working on payments or checkout

### 7.4 Skill: shipping-integration

**Purpose:** Australia Post API, label generation, tracking  
**Trigger:** When working on shipping features

### 7.5 Skill: nextjs-patterns

**Purpose:** Consistent Next.js patterns, components, routing  
**Trigger:** When creating new pages or components

---

## PART 8: EXECUTION PLAN

### Phase 1: MVP (8-12 Weeks)

**Week 1-2: Foundation**
- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Supabase project and database schema
- [ ] Configure Tailwind with ASHIKA color palette
- [ ] Create base components (Button, Card, Input, Modal)
- [ ] Set up authentication flow

**Week 3-4: Catalog**
- [ ] Product listing page with grid layout
- [ ] Filter system (type, size, blouse, price)
- [ ] Product detail page
- [ ] Image gallery component
- [ ] Size chart modal

**Week 5-6: Rental Logic**
- [ ] Availability calendar component
- [ ] Date selection flow
- [ ] Booking creation API
- [ ] Inventory blocking logic
- [ ] Conflict detection

**Week 7-8: Checkout & Payments**
- [ ] Checkout page
- [ ] Stripe integration (payment + bond pre-auth)
- [ ] Postcode validation
- [ ] Order confirmation flow
- [ ] Email notifications

**Week 9-10: Shipping & Admin**
- [ ] Australia Post integration
- [ ] Label generation
- [ ] Admin dashboard (basic)
- [ ] Order management
- [ ] Inventory CRUD

**Week 11-12: Polish & Launch**
- [ ] Static pages (Home, About, FAQ)
- [ ] SEO optimization
- [ ] Performance audit
- [ ] Bug fixes
- [ ] Production deployment

### Phase 2: AI & Community (12-16 Weeks Post-MVP)

- [ ] AI Virtual Try-On research and prototype
- [ ] "Sell to Us" portal
- [ ] Live chat integration
- [ ] Knowledge base expansion

### Phase 3: Scale (Ongoing)

- [ ] Loyalty program
- [ ] Influencer features
- [ ] Blog/content hub
- [ ] Analytics dashboard

---

## PART 9: DEPENDENCY GRAPH

```
┌─────────────────────────────────────────────────────────────┐
│                      PHASE 1 DEPENDENCIES                    │
└─────────────────────────────────────────────────────────────┘

[Supabase Setup] ──────────────────────────────────────────────┐
       │                                                        │
       ▼                                                        │
[Auth System] ─────────────────────────────────────────────┐   │
       │                                                    │   │
       ▼                                                    │   │
[User Accounts] ◄──────────────────────────────────────────┘   │
       │                                                        │
       │    [Product Schema] ◄──────────────────────────────────┘
       │           │
       │           ▼
       │    [Catalog UI] ──────► [Filter System]
       │           │
       │           ▼
       │    [Product Detail] ──► [Size Charts]
       │           │
       │           ▼
       └──► [Booking System] ◄── [Availability Logic]
                   │
                   ▼
            [Checkout Flow]
                   │
       ┌───────────┼───────────┐
       │           │           │
       ▼           ▼           ▼
[Stripe Setup] [Postcode]  [Booking API]
       │        Validation      │
       │           │           │
       └───────────┼───────────┘
                   │
                   ▼
            [Order Creation]
                   │
                   ▼
            [Shipping Integration]
                   │
                   ▼
            [Admin Dashboard]

PARALLELIZABLE:
- Catalog UI ║ Auth System (after Supabase)
- Stripe Setup ║ AusPost Setup (after schema)
- Static Pages ║ Admin Dashboard (anytime)
```

---

## PART 10: VALIDATION CRITERIA

### 10.1 How We Know Phase 1 is Done

| Test | Pass Criteria |
|------|---------------|
| **Double-booking prevention** | Cannot book same item for overlapping dates |
| **Bond pre-auth** | Stripe shows $100 hold, not charge |
| **Cleaning buffer** | Item unavailable for 3 days post-return |
| **Postcode validation** | Invalid postcodes rejected at checkout |
| **Shipping labels** | AusPost generates valid labels |
| **Mobile responsive** | All pages work on 375px width |
| **Page speed** | Lighthouse score > 80 |
| **E2E flow** | Complete rental flow in < 5 minutes |

### 10.2 Acceptance Test Script

```
1. Browse catalog → filter by "saree" + "M" size
2. Select item → view details
3. Check availability for date 2 weeks out
4. Add to cart → proceed to checkout
5. Enter valid Sydney postcode (2000)
6. Complete Stripe payment (test card)
7. Verify: Order confirmation email received
8. Verify: Item now shows unavailable for those dates
9. Admin: Mark order as shipped
10. Admin: Mark order as returned
11. Verify: Item available again (after 3 days)
12. Verify: Bond released in Stripe
```

---

## PART 11: RISK REGISTER

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Calendar logic bugs | Medium | Critical | Unit tests for every edge case |
| Stripe webhook failures | Low | High | Idempotent handlers, retry logic |
| AusPost API downtime | Low | Medium | Fallback to manual label creation |
| Supabase free tier limits | Medium | Medium | Monitor usage, upgrade when needed |
| AI Try-On complexity | High | Medium | Defer to Phase 2, use SDKs |

---

## PART 12: ASSUMPTIONS

| Assumption | If Wrong... |
|------------|-------------|
| Supabase free tier sufficient for MVP | Upgrade to Pro ($25/month) |
| Vercel free tier sufficient | Upgrade to Pro ($20/month) |
| AusPost API available for integration | Use Sendle as fallback |
| 100 items sufficient for launch | Source more via "Sell to Us" |
| Australian customers only | No currency conversion needed |

---

## PART 13: QUESTIONS FOR CLIENT

Before execution begins, confirm:

1. **Domain:** Is ashika.com.au already registered?
2. **Supabase:** Create project now or wait for development?
3. **Stripe:** Australian Stripe account ready?
4. **AusPost:** API credentials available?
5. **Inventory:** Photos and details for initial 100 items?
6. **Legal:** Terms of service and privacy policy drafted?

---

*This document is the single source of truth for ASHIKA development. All LLMs (Claude, Gemini) and all developers must reference this document.*

**Next Step:** Generate detailed CLAUDE.md, GEMINI.md, and SKILL.md files.
