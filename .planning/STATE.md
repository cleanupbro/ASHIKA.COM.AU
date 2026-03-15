# STATE.md — ASHIKA Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-24)

**Core value:** Women can rent Indian ethnic wear for events with zero friction, GlamCorner-quality experience.
**Current focus:** Phase 1 - Foundation

## Current Position

Phase: 1 complete → Phase 2-4 next (Catalog + Booking + Payments)
Plan: Full 6-phase build plan. Phase 0 + Phase 1 complete.
Status: Phase 1 done. Waiting on DNS activation + product photography before Phase 2-4.
Last activity: 2026-03-15 — Phase 0 + Phase 1 fully built (Supabase, rebrand, auth, data wiring, dual review)

Progress: [████░░░░░░░░░░░░░░░░] 20%

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: -
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**
- Last 5 plans: -
- Trend: -

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Bond pattern: Saved-card approach (SetupIntent), not pre-auth hold. Stripe auth windows (5-7 days) expire before rental cycle (10 days).
- UI rebuild: Full redesign to black/white/gold GlamCorner aesthetic (client rejected teal/emerald).
- Admin: Use Supabase dashboard for v1 (no custom admin panel build).
- Stripe: Rochelle's account is ready with API keys. Using her live/test keys.
- Photos: Sam has the physical garments. Photographing them himself.
- Supabase region: ap-southeast-2 (Sydney) for AU latency.
- Shipping: Manual for launch (AusPost API is post-launch Phase 5B).
- AI images: Product shots = enhanced real photos. Model/lifestyle shots = AI-generated (GPT-4o, Gemini, Grok).

### Pending Todos

- [x] Pause Claw-School Supabase (ndlebzgojhoschaxados) — DONE
- [x] Restore ASHIKA Supabase project (Sydney ap-southeast-2) — DONE
- [x] Run migrations + seed data — DONE (18 products)
- [x] Design system rebrand (maroon → black/white/gold) — DONE
- [x] Auth system (login/signup/reset/middleware) — DONE
- [x] Wire frontend to real Supabase data — DONE
- [x] Dual-CLI code review (16 issues fixed) — DONE
- [ ] DNS: Add 4 records at Webcentral (blocked — domain awaiting activation)
- [ ] Photograph all garments (flat-lay + detail + hanger)
- [ ] AI-enhance photos + generate model shots
- [ ] Phase 3: Booking system (availability API, atomic booking)
- [ ] Phase 4: Stripe payments (rental + bond)
- [ ] Add login/account to header UI

### Blockers/Concerns

- Supabase free tier pauses after 7 days inactivity (need ping mechanism or Pro upgrade before launch)
- Domain ashika.com.au stuck on old Vercel account (403 — need to transfer)
- AusPost API access requires parcel contract verification (manual shipping for launch)

## Session Continuity

Last session: 2026-03-15
Stopped at: Phase 0 + Phase 1 complete. Auth built. DNS blocked by registrar. Next: photography + Phase 3-4.
Resume file: ~/.claude/plans/cryptic-wondering-hamming.md
Photography plan: .planning/PHOTOGRAPHY-PLAN.md
Supabase project: zlmkbhjojhkehayaqrue (Sydney, ACTIVE_HEALTHY)
Vercel project: ashika-com-au (shamals-projects-0f4386e4)
