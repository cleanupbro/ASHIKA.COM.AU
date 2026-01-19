# ASHIKA — Indian Wear Hire Australia

> "Wear the culture. Return the stress."

A rental marketplace for premium Indian ethnic wear in Australia.

**Live Site:** [ashika.com.au](https://www.ashika.com.au)

---

## Overview

ASHIKA offers a curated selection of sarees, lehengas, salwar kameez, and sherwanis for rent. Perfect for weddings, festivals, and special occasions.

### Key Features

- **7-day rental period** — Includes delivery buffer and return time
- **Free shipping** — Both ways, Australia-wide
- **$100 refundable bond** — Returned after successful inspection
- **Availability calendar** — Real-time inventory checking

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Payments | Stripe |
| Shipping | Australia Post API |
| Hosting | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/cleanupbro/ASHIKA.COM.AU.git
   cd ASHIKA.COM.AU
   ```

2. **Run setup script:**
   ```bash
   ./scripts/setup-dev.sh
   ```

3. **Configure environment:**
   ```bash
   cp env/.env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   ```
   http://localhost:3000
   ```

---

## Project Structure

```
.
├── .claude/          # Claude Code directives
├── .gemini/          # Gemini directives (mirror)
├── .shared-memory/   # LLM state synchronization
├── 00-docs/          # Documentation
│   ├── PRD/
│   ├── architecture/
│   ├── decisions/
│   └── roadmap/
├── env/              # Environment templates
├── scripts/          # Setup and utility scripts
├── skills/           # LLM skill files
├── src/              # Source code (Next.js)
├── supabase/         # Database migrations
├── CLAUDE.md         # Main Claude directives
└── GEMINI.md         # Main Gemini directives
```

---

## Build Stages

### Stage 1: Foundation ← Current
- [x] Workspace setup
- [x] Git + Vercel connected
- [ ] Next.js initialization
- [ ] Tailwind + brand colors
- [ ] Base UI components

### Stage 2: Static Pages
- [ ] Homepage with hero
- [ ] Shop page with grid
- [ ] Product detail page
- [ ] Static pages (About, FAQ, Contact)

### Stage 3: Rental Logic
- [ ] Availability calendar
- [ ] Date selection flow
- [ ] Mock booking system

### Stage 4: Checkout
- [ ] Order summary
- [ ] Address form
- [ ] Mock payment UI

### Stage 5: Admin Dashboard
- [ ] Products CRUD
- [ ] Orders management
- [ ] Return processing

### Stage 6: API Integration
- [ ] Supabase connection
- [ ] Stripe payments
- [ ] Australia Post shipping

---

## Documentation

| Document | Purpose |
|----------|---------|
| `CLAUDE.md` | Master directives for Claude Code |
| `GEMINI.md` | Mirror directives for Gemini |
| `00-docs/ASHIKA-PROJECT-IMPLEMENTATION-DOCUMENT.md` | Full PRD |
| `00-docs/roadmap/execution-plan.md` | Week-by-week plan |
| `skills/SKILLS_INDEX.md` | Auto-invoke matrix |

---

## Brand

| Element | Value |
|---------|-------|
| Primary Color | Teal #0D9488 |
| Accent Color | Gold #D97706 |
| Cream | #FEF3C7 |
| Heading Font | Playfair Display |
| Body Font | Inter |

---

## License

Private. All rights reserved.

---

## Contact

**Clean Up Bros** (Parent Company)
Liverpool, NSW, Australia
Email: cleanupbros.au@gmail.com
