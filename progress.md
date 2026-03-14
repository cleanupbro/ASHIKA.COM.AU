# Progress

> Last updated: 2026-03-15

## Status

`IN PROGRESS`

## Done

| # | Task | Date |
|---|------|------|
| 1 | Created and linked a new Vercel project for this repository (`ashika`) | 2026-03-15 |
| 2 | Deployed the current storefront successfully to Vercel production | 2026-03-15 |
| 3 | Cleaned up broken footer/navigation links and removed dead `/account` entry points | 2026-03-15 |
| 4 | Centralized shared site metadata and contact constants for layout, legal, and contact pages | 2026-03-15 |
| 5 | Verified the app builds cleanly with Next.js production output | 2026-03-15 |

## In Progress

| # | Task | Started | Notes |
|---|------|---------|-------|
| 1 | Move storefront from mock-data MVP to launch-ready transactional flow | 2026-03-15 | Supabase/Stripe routes and persistence are still not implemented |
| 2 | Connect `ashika.com.au` and `www.ashika.com.au` to the new Vercel project | 2026-03-15 | Blocked by Vercel domain ownership outside the current team |

## Blocked

| # | Task | Blocked By | Since |
|---|------|------------|-------|
| 1 | Attach custom domain on Vercel | `ashika.com.au` is still owned by another Vercel account/team and returns `403 Not authorized to use ...` | 2026-03-15 |

## Next Up

| # | Task | Priority |
|---|------|----------|
| 1 | Free `ashika.com.au` and `www.ashika.com.au` from the old Vercel owner, then attach them to the new project | HIGH |
| 2 | Replace mock catalog/product reads with Supabase-backed data access | HIGH |
| 3 | Implement real checkout persistence, Stripe payment flow, and booking creation | HIGH |
| 4 | Add booking availability enforcement against inventory blocks | HIGH |

## Session Log

| Date | Agent | What Was Done |
|------|-------|---------------|
| 2026-03-15 | Codex | Created a new Vercel project, linked the repo, deployed production, cleaned up broken navigation/footer paths, added shared site constants, and documented the remaining domain-ownership blocker. |
