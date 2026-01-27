# Technology Stack

**Analysis Date:** 2026-01-27

## Languages

**Primary:**
- TypeScript 5.x - All application code (src/)
- JavaScript (JSX/TSX) - React components via Next.js

**Secondary:**
- SQL - Database migrations (`supabase/migrations/`)

## Runtime

**Environment:**
- Node.js >=16.0.0 (v25.2.0 detected on development machine)

**Package Manager:**
- npm (package-lock.json version 3)
- Lockfile: Present (`package-lock.json`)

## Frameworks

**Core:**
- Next.js 14.2.35 - Full-stack React framework with App Router
- React 18.x - UI library
- React DOM 18.x - React rendering

**Testing:**
- Not configured (no test framework detected)

**Build/Dev:**
- PostCSS 8.x - CSS processing
- Tailwind CSS 3.4.1 - Utility-first CSS framework
- ESLint 8.x - Code linting with Next.js config
- TypeScript Compiler 5.x - Type checking

## Key Dependencies

**Critical:**
- `next` 14.2.35 - Framework foundation
- `react` ^18 - UI rendering
- `typescript` ^5 - Type safety

**Infrastructure:**
- `date-fns` ^3 - Date manipulation for rental calculations
- `zod` ^3 - Schema validation
- `react-hook-form` ^7 - Form state management
- `@hookform/resolvers` ^3 - Zod integration for forms

**UI/Styling:**
- `tailwindcss` ^3.4.1 - Styling system
- `lucide-react` latest - Icon library
- `clsx` ^2 - Conditional class names
- `tailwind-merge` ^2 - Tailwind class merging utility

## Configuration

**Environment:**
- Environment variables via `.env.local` (not committed)
- Template: `env/.env.example`
- Mock data mode available via `USE_MOCK_DATA=true`

**Build:**
- `next.config.mjs` - Next.js configuration (image optimization)
- `tsconfig.json` - TypeScript settings (strict mode enabled)
- `tailwind.config.ts` - Brand colors (teal, gold), custom fonts
- `.eslintrc.json` - ESLint rules (Next.js + TypeScript)
- `postcss.config.mjs` - PostCSS with Tailwind plugin

## Platform Requirements

**Development:**
- Node.js 18+ (recommended)
- npm or yarn
- API keys for Supabase, Stripe, Australia Post (see `env/.env.example`)

**Production:**
- Vercel (configured via `vercel.json`)
- Framework: Next.js
- Build command: `next build`
- Output: `.next/`

---

*Stack analysis: 2026-01-27*
