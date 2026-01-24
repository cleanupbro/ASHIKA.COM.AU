# Requirements: ASHIKA

**Defined:** 2026-01-24
**Core Value:** Women can rent beautiful Indian ethnic wear for events without the cost of buying, with zero friction — the experience must feel as premium and trustworthy as renting a designer dress from GlamCorner.

## v1 Requirements

### Authentication

- [ ] **AUTH-01**: User can create account with email and password
- [ ] **AUTH-02**: User can log in and stay logged in across sessions
- [ ] **AUTH-03**: User can log out from any page
- [ ] **AUTH-04**: User can reset password via email link

### Catalog & Filters

- [ ] **CATL-01**: Product grid with GlamCorner-style layout (4 cols desktop, responsive)
- [ ] **CATL-02**: Category filter (Saree, Salwar Kameez, Lehenga, Sherwani/Kurtas, Kids, Accessories)
- [ ] **CATL-03**: Size filter (S, M, L, XL)
- [ ] **CATL-04**: Price range filter (<$50, 50-100, 100-150, 150-200, >200)
- [ ] **CATL-05**: Date availability filter (show only items available for a date)
- [ ] **CATL-06**: Blouse included toggle filter
- [ ] **CATL-07**: Sort options (Newest, Price low-high, Price high-low)

### Product Detail

- [ ] **PROD-01**: Image gallery (5-8 photos, multiple angles)
- [ ] **PROD-02**: Product info display (name, category, size, rental price, condition rating)
- [ ] **PROD-03**: Date picker for event date selection
- [ ] **PROD-04**: Real-time availability check on date selection
- [ ] **PROD-05**: "What's in the box" section (all included items listed)
- [ ] **PROD-06**: Size guide with measurements (bust/waist for blouses/lehengas)
- [ ] **PROD-07**: Draping/styling guide (how to wear the garment)
- [ ] **PROD-08**: Condition rating display (Excellent/Very Good/Good)
- [ ] **PROD-09**: Customer reviews section with ratings

### Booking & Availability

- [ ] **BOOK-01**: Availability checking with inventory blocking (no overlapping dates including 3-day cleaning buffer)
- [ ] **BOOK-02**: Atomic booking creation (race-condition-safe with PostgreSQL FOR UPDATE locks)
- [ ] **BOOK-03**: Booking status tracking (Pending → Confirmed → Shipped → Delivered → Returned → Completed)
- [ ] **BOOK-04**: User can view their booking history

### Payments (Stripe)

- [ ] **PAY-01**: Stripe checkout for rental fee (immediate capture via PaymentIntent)
- [ ] **PAY-02**: Save payment method for bond via SetupIntent (charge only on damage)
- [ ] **PAY-03**: Transparent pricing display (rental fee + bond terms shown upfront)
- [ ] **PAY-04**: Admin can trigger bond charge on damage (up to $100)
- [ ] **PAY-05**: Postcode validation before payment (Australian postcodes 0200-9999)

### Shipping & Returns

- [ ] **SHIP-01**: AusPost API integration for outbound shipping label generation
- [ ] **SHIP-02**: In-person pickup option at checkout
- [ ] **SHIP-03**: Tracking updates via email after shipping
- [ ] **SHIP-04**: Pre-paid return satchel label generation

### Content Pages

- [ ] **PAGE-01**: Home page (hero banner + featured products)
- [ ] **PAGE-02**: How It Works page (Browse → Rent → Wear → Return)
- [ ] **PAGE-03**: FAQ page (rentals, shipping, bonds, sizing)
- [ ] **PAGE-04**: About / Contact page
- [ ] **PAGE-05**: Terms & Conditions page (damage policy, bond terms, rental agreement)

### Design & UX

- [ ] **DSGN-01**: GlamCorner aesthetic (black/white/gold palette, minimal luxury)
- [ ] **DSGN-02**: Mobile-first responsive design (mobile, tablet, desktop breakpoints)
- [ ] **DSGN-03**: Sticky navigation header with search, account, cart
- [ ] **DSGN-04**: Product images optimized (WebP format, pre-generated thumbnail/medium/full sizes)

## v2 Requirements

### AI & Technology

- **AI-01**: Virtual Try-On (upload photo, see outfit overlay using MediaPipe/Stable Diffusion)
- **AI-02**: AI-powered size recommendations based on body measurements

### Community

- **COMM-01**: "Sell to Us" portal (Tally forms for users to submit garments)
- **COMM-02**: Referral program (invite friends, earn credit)
- **COMM-03**: Notify me when available (waitlist for booked items)

### Growth

- **GROW-01**: Wishlist / Favorites functionality
- **GROW-02**: Blog / SEO content hub
- **GROW-03**: Loyalty program (repeat renter discounts)
- **GROW-04**: Occasion-based collections (Wedding, Diwali, Eid)

### Operations

- **OPS-01**: Custom admin panel (product management, booking dashboard)
- **OPS-02**: Live chat support (Zendesk/Tawk.to integration)
- **OPS-03**: OAuth social login (Google)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Mobile app | Web-first, responsive is sufficient |
| Subscription/membership model | 10-30 items, single rental model only |
| P2P marketplace (user-to-user) | Single vendor model for v1, control quality |
| Real-time chat between users | Not a social platform |
| Video content hosting | Link to YouTube/external for draping guides |
| Multi-currency | AUD only, Australian market |
| International shipping | Australia-only for v1 |
| Shopify/platform migration | Custom Next.js build confirmed |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| CATL-01 | Phase 2 | Pending |
| CATL-02 | Phase 2 | Pending |
| CATL-03 | Phase 2 | Pending |
| CATL-04 | Phase 2 | Pending |
| CATL-05 | Phase 2 | Pending |
| CATL-06 | Phase 2 | Pending |
| CATL-07 | Phase 2 | Pending |
| PROD-01 | Phase 2 | Pending |
| PROD-02 | Phase 2 | Pending |
| PROD-03 | Phase 3 | Pending |
| PROD-04 | Phase 3 | Pending |
| PROD-05 | Phase 2 | Pending |
| PROD-06 | Phase 2 | Pending |
| PROD-07 | Phase 2 | Pending |
| PROD-08 | Phase 2 | Pending |
| PROD-09 | Phase 2 | Pending |
| BOOK-01 | Phase 3 | Pending |
| BOOK-02 | Phase 3 | Pending |
| BOOK-03 | Phase 3 | Pending |
| BOOK-04 | Phase 3 | Pending |
| PAY-01 | Phase 4 | Pending |
| PAY-02 | Phase 4 | Pending |
| PAY-03 | Phase 4 | Pending |
| PAY-04 | Phase 4 | Pending |
| PAY-05 | Phase 4 | Pending |
| SHIP-01 | Phase 5 | Pending |
| SHIP-02 | Phase 5 | Pending |
| SHIP-03 | Phase 5 | Pending |
| SHIP-04 | Phase 5 | Pending |
| PAGE-01 | Phase 6 | Pending |
| PAGE-02 | Phase 6 | Pending |
| PAGE-03 | Phase 6 | Pending |
| PAGE-04 | Phase 6 | Pending |
| PAGE-05 | Phase 6 | Pending |
| DSGN-01 | Phase 1 | Pending |
| DSGN-02 | Phase 2 | Pending |
| DSGN-03 | Phase 1 | Pending |
| DSGN-04 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 42 total
- Mapped to phases: 42
- Unmapped: 0

---
*Requirements defined: 2026-01-24*
*Last updated: 2026-01-24 after roadmap creation*
