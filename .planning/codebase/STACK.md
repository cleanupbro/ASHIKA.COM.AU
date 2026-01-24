# Technology Stack

**Analysis Date:** 2026-01-24

## Languages

**Primary:**
- TypeScript 5.x - All source code, strict mode enabled
- JavaScript (ES2024) - Build and configuration files

**Secondary:**
- CSS - Via Tailwind CSS (no raw CSS)
- SQL - Supabase PostgreSQL queries (via client SDK)

## Runtime

**Environment:**
- Node.js (latest LTS) - Development and build
- Browser (modern ES2020+) - Client-side

**Package Manager:**
- npm 10.x - Package management
- Lockfile: `package-lock.json` (present, v3)

## Frameworks

**Core:**
- Next.js 14.2.35 - React framework with App Router
- React 18.x - UI component library
- React DOM 18.x - DOM rendering

**Styling:**
- Tailwind CSS 3.4.1 - Utility-first CSS framework
- PostCSS 8.x - CSS processing pipeline

**Forms & Data:**
- react-hook-form 7.x - Form state and validation
- @hookform/resolvers 3.x - Form validation adapters
- Zod 3.x - TypeScript-first schema validation

**Utilities:**
- date-fns 3.x - Date manipulation and formatting
- lucide-react - Icon library (React components)
- clsx 2.x - Conditional className utility
- tailwind-merge 2.x - Tailwind class conflict resolution

**Dev Tools:**
- ESLint 8.x - Code linting (Next.js config preset)
- TypeScript 5.x compiler (`tsc --noEmit` for type checking)

## Key Dependencies

**Critical:**
- `next` 14.2.35 - Framework, build pipeline, API routes, image optimization
- `@hookform/resolvers` 3.x - Bridges Zod validation with react-hook-form
- `date-fns` 3.x - Rental date calculations, timeline formatting

**UI & UX:**
- `lucide-react` - SVG icons (Check, ArrowLeft, CreditCard, MapPin, ShoppingBag, etc.)
- `clsx` + `tailwind-merge` - CSS class management without conflicts

**Infrastructure:**
- `react` 18.x & `react-dom` 18.x - React rendering engine
- `typescript` 5.x - Type checking and compilation

## Configuration

**Environment:**
- `.env.local` - Local development configuration (not committed)
- `env/.env.example` - Template for required environment variables
- `NEXT_PUBLIC_` prefix - Variables exposed to browser
- Private variables - Available only on server side

**Key Configuration Files:**
- `tsconfig.json` - TypeScript strict mode, path aliases (`@/*` → `./src/*`)
- `tailwind.config.ts` - Theme extensions (brand colors: teal, gold, cream)
- `postcss.config.mjs` - PostCSS plugins (Tailwind CSS integration)
- `next.config.mjs` - Image domain whitelisting (Unsplash, Pexels)
- `.eslintrc.json` - ESLint preset (`next/core-web-vitals`, `next/typescript`)

## Platform Requirements

**Development:**
- Node.js 18.17+ (for npm 10)
- macOS, Linux, or Windows with WSL2
- 2GB RAM minimum
- ~500MB disk space for node_modules

**Production:**
- Deployment: Vercel (configured in `vercel.json`)
- Build command: `next build`
- Output directory: `.next`
- Node.js runtime compatible

**Browser Support:**
- Modern browsers (ES2020+)
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile: iOS 12+, Android 8+

## Build & Deployment

**Dev Server:**
```bash
npm run dev        # Runs on http://localhost:3000
```

**Production Build:**
```bash
npm run build      # Creates .next optimized build
npm start          # Serves production build
```

**Quality Checks:**
```bash
npm run lint       # ESLint check
npm run type-check # TypeScript type checking
```

**Hosting:**
- Platform: Vercel (Next.js first-class support)
- Zero-config deployment from Git
- Automatic HTTPS, CDN, edge caching
- Free tier sufficient for current scale

---

*Stack analysis: 2026-01-24*
