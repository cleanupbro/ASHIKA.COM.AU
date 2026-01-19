# Consolidated Understanding
## ASHIKA — Indian Wear Hire Australia
**Document Version:** 1.0  
**Status:** Planning Complete — Ready for Execution  
**Last Updated:** 2026-01-19  

---

## 1. Core Product Goal

**Primary Objective:**  
Build Australia's premier rental-only marketplace for Indian ethnic wear, combining:
- "Shein-style" simplicity (fast navigation, extensive filters, impulse-friendly)
- "AllBorrow-style" community trust, warmth, and modernity
- Integrated AI Virtual Try-On to solve fit uncertainty (Phase 2)

**Business Identity:**
- **Name:** ASHIKA
- **Subheading:** Indian Wear Hire Australia
- **Domain:** ashika.com.au
- **Slogan Options:** "Wear the culture. Return the stress." / "Rent. Celebrate. Return."

**Visual Identity:**
- Palette: Deep Teal/Emerald Green (Luxury) + Gold/Cream (Canvas)
- Typography: Headings: Playfair Display/Montserrat; Body: Inter/Poppins/Lato
- Logo: Minimalist icon (folded drape, lotus, or paisley) + wordmark

---

## 2. Non-Negotiable Constraints

These constraints are **immutable** and override all other considerations:

### 2.1 Business Logic Constraints

| Constraint | Value | Rationale |
|------------|-------|-----------|
| **Rental Model** | Rent-only at launch (no buying) | Focus, inventory control |
| **Rental Period** | Standard 1-week window | Includes delivery + return time |
| **Delivery Buffer** | Ship 2–3 days before event | Customer receives early |
| **Cleaning Buffer** | 3-day auto-block after return | Quality control |
| **Bond Amount** | $100 AUD refundable | Damage protection |
| **Shipping Cost** | Free Australia-wide (both ways) | Competitive advantage |

### 2.2 Technical Constraints

| Constraint | Specification | Source |
|------------|--------------|--------|
| **Frontend Stack** | Next.js / React.js | PRD Section 4.2 |
| **Backend Stack** | Node.js (Express) or Python (Django) | PRD Section 4.2 |
| **Database** | PostgreSQL | PRD Section 4.2 |
| **Payments** | Stripe or Square (must support pre-auth for bonds) | PRD Section 4.3 |
| **Shipping Integration** | Australia Post / Sendle / Shippit API | PRD Section 4.3 |

### 2.3 Operational Constraints

| Constraint | Requirement |
|------------|-------------|
| **Initial Inventory** | 100–150 items |
| **Geographic Focus** | Australia-wide, SEO focus: Sydney, Melbourne, Brisbane |
| **Target Market** | Women 18–45, South Asian diaspora attending cultural events |
| **Support SLA** | 24-hour response time |

---

## 3. Key Risks

### 3.1 High-Impact Risks

| Risk ID | Risk | Likelihood | Impact | Mitigation |
|---------|------|------------|--------|------------|
| R1 | **Calendar blocking logic errors** cause double-bookings | Medium | Critical | Comprehensive unit tests; database-level constraints |
| R2 | **Bond logic fails** (incorrect charges/refunds) | Medium | Critical | Pre-auth testing with Stripe test mode; audit trail |
| R3 | **AI Try-On accuracy insufficient** for sari draping | High | High | Use proven SDKs (Camweara/GlamAR); defer to Phase 2 |
| R4 | **Inventory supply chain** delays from India | Medium | Medium | Start with "Sell to Us" acquisitions; local sourcing |
| R5 | **Payment gateway compliance** (PCI-DSS) | Low | Critical | Use Stripe hosted checkout (PCI scope reduction) |

### 3.2 Medium-Impact Risks

| Risk ID | Risk | Likelihood | Impact | Mitigation |
|---------|------|------------|--------|------------|
| R6 | **Shipping delays** affect rental dates | Medium | Medium | 2-3 day buffer; real-time tracking |
| R7 | **Returns processing** creates inventory gaps | Medium | Medium | 3-day cleaning buffer; inspection workflow |
| R8 | **SEO competition** in Australian market | Medium | Medium | Content strategy; local keywords |

---

## 4. What Success Looks Like for Phase 1

### 4.1 Quantitative Success Criteria

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Live site deployed** | Week 8 | Deployment verification |
| **First 50 completed rentals** | Week 12 | Order database count |
| **Zero double-bookings** | 100% | Automated test suite |
| **Bond logic accuracy** | 100% | Financial reconciliation |
| **Page load time** | < 3 seconds | Lighthouse audit |
| **Mobile responsiveness** | 100% pages | Cross-device testing |

### 4.2 Qualitative Success Criteria

| Criterion | Validation Method |
|-----------|-------------------|
| **Rental flow is intuitive** | User testing (10+ users complete flow unassisted) |
| **Calendar accurately blocks items** | QA test suite (all edge cases pass) |
| **Checkout correctly adds bond** | Payment reconciliation audit |
| **Shipping labels generate correctly** | AusPost API integration tests |
| **Admin can manage inventory** | Admin user acceptance testing |

### 4.3 Phase 1 Definition of Done

Phase 1 is **COMPLETE** when:
1. ✅ Public-facing storefront is live at ashika.com.au
2. ✅ Catalog displays all 100-150 initial items with high-res images
3. ✅ Filters work: Type, Size, Blouse Included, Availability Date, Price Range
4. ✅ Rental calendar correctly blocks: rental period + delivery buffer + cleaning buffer
5. ✅ Checkout processes: rental fee + $100 bond via Stripe pre-auth
6. ✅ Postcode validation gates checkout
7. ✅ AusPost integration generates shipping labels + return satchels
8. ✅ Admin dashboard allows: inventory CRUD, order management, return processing
9. ✅ Basic pages exist: Home, Shop, Product Detail, Checkout, FAQ, About
10. ✅ Zero critical bugs in production for 72 hours post-launch

---

## 5. Scope Boundaries

### 5.1 Explicitly IN Scope (Phase 1 MVP)

- Product catalog with Shein-style grid layout
- Advanced filtering (Type, Size, Blouse, Date, Price)
- Rental calendar with availability logic
- Bond system ($100 pre-auth)
- Stripe payment integration
- Australia Post shipping integration
- Postcode validation
- Admin dashboard (basic)
- Static pages (Home, Shop, FAQ, About)
- User accounts (email/social login)
- Order confirmation emails

### 5.2 Explicitly OUT OF Scope (Deferred)

| Feature | Deferred To | Reason |
|---------|-------------|--------|
| AI Virtual Try-On | Phase 2 | Complexity; validate core rental first |
| AR Live Try-On | Phase 2 | Requires AI foundation |
| "Sell to Us" Portal | Phase 2 | Community feature; not core MVP |
| Live Chat (Zendesk) | Phase 2 | Support SLA via email acceptable for MVP |
| Loyalty Program | Phase 3 | Growth feature |
| Influencer Closets | Phase 3 | Marketing feature |
| Blog/Content Hub | Phase 3 | SEO optimization |
| Mobile App | Phase 3+ | Web-first approach |
| Buy option | Post-validation | Rent-only focus |

---

## 6. Stakeholder Alignment

### 6.1 Who This Plan Serves

| Role | What They Need From This Plan |
|------|------------------------------|
| **Backend Engineer** | Clear API contracts, database schema, rental logic rules |
| **Frontend Engineer** | Component specs, UI/UX requirements, integration points |
| **Product Owner** | Scope boundaries, success metrics, timeline |
| **Future You (3 months later)** | Decision rationale, assumption register, dependency graph |

### 6.2 Decision Authority

| Decision Type | Authority |
|---------------|-----------|
| Technical architecture | This document + reconciliation-log.md |
| Feature scope | PRD V1 + this document |
| Timeline | execution-plan.md |
| Risk acceptance | risk-assumptions.md |

---

## 7. Document Cross-References

| Document | Purpose | Location |
|----------|---------|----------|
| **Decision Reconciliation Log** | Records conflicting LLM opinions and final decisions | `/00-docs/decisions/reconciliation-log.md` |
| **Execution Plan** | Phase-by-phase build sequence | `/00-docs/roadmap/execution-plan.md` |
| **Dependency Graph** | What blocks what | `/00-docs/architecture/dependency-graph.md` |
| **Risk & Assumptions Register** | Known unknowns and mitigations | `/00-docs/architecture/risk-assumptions.md` |
| **PRD V1** | Original requirements | `/00-docs/PRD/PRD-v1.md` |

---

## 8. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-19 | Claude (Synthesis) | Initial consolidated understanding from all LLM inputs |

---

*This document represents the reconciled truth derived from PRD V1, multiple LLM analyses (Grok, Gemini, DeepSeek, Claude), and the 60-Day Development Roadmap. All conflicts have been resolved per the reconciliation log.*
