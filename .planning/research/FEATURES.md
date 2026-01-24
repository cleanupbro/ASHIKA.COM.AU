# Feature Landscape: Fashion Rental Marketplace (Indian Ethnic Wear)

**Domain:** Niche ethnic wear rental marketplace (Australia)
**Researched:** 2026-01-24
**Competitors Surveyed:** GlamCorner, Rent the Runway, HURR Collective, AllBorrow, Borrow the Bazaar, Saris and Things, Leasing Looks, Glamourental
**Confidence:** MEDIUM-HIGH (verified against multiple competitor platforms)

---

## Table Stakes

Features users expect from any fashion rental platform. Missing = users abandon or lose trust.

### Catalog & Discovery

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Category browsing | Every competitor has it; users think in garment types (saree, lehenga, etc.) | Low | Already exists in mock data. Map to: Saree, Lehenga, Salwar Kameez, Sherwani, Kids, Accessories |
| Filter by size | Core to rental -- users need to see what fits them | Low | Already have size types defined. Need real inventory backing it |
| Filter by price | Budget-conscious renters (common across GlamCorner, AllBorrow) | Low | Already have price range; connect to real data |
| Filter by occasion | Ethnic wear is event-driven (wedding, Diwali, Eid, engagement) | Low | Already in Product type as `occasion` field |
| Filter by availability (date) | Critical for rental -- AllBorrow's primary filter is "available for your dates" | Medium | Requires real-time availability check against inventory_blocks |
| Sort options (price, newest) | Standard e-commerce expectation | Low | Already built as sort-dropdown component |
| Product search | Users expect to find items by name/keyword | Low | Text search across name, description, fabric |
| High-quality product photos (5-8 per item) | Industry standard is 8 photos per product. Multiple angles are expected | Medium | Need professional photography. Current mock uses Unsplash |
| Mobile-responsive catalog | 70%+ of fashion browsing is mobile | Low | Already built with Tailwind responsive classes |

### Product Detail Page

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Multiple image gallery with zoom | 60% of customers prefer 360-degree/multi-angle views. Reduces returns by 51% | Low | product-images.tsx exists; needs real content |
| Size selection with availability indicator | Users must know if their size is available before proceeding | Low | ProductSize type exists with available count |
| Rental price display (prominent) | Core value proposition -- show savings vs retail price | Low | Already showing rental_price and retail_price |
| Event date picker / availability calendar | Fundamental to rental flow. Airbnb/GlamCorner pattern: show unavailable dates as grayed out | Medium | availability-calendar.tsx exists; needs real backend |
| Rental period explanation | Users must understand the 7-day window (3 days before, event, 3 days return) | Low | rental-info.tsx exists |
| Fabric & work description | Ethnic wear buyers care deeply about material (silk, georgette, chiffon) and craft (zardozi, sequin) | Low | Already in Product type as `fabric` and `work` fields |
| Blouse/accessories included indicator | Critical for sarees/lehengas -- users need to know what comes with the outfit | Low | `blouse_included` and `accessories_included` exist |
| Condition/cleanliness assurance | Trust signal -- users need to know items are professionally cleaned | Low | Static content badge/section |
| Add to cart with date + size | Core transactional action | Low | Cart system exists with CartItem type |

### Booking & Checkout

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Cart with multiple items | Users may rent outfit + accessories for same event | Low | cart-context.tsx exists |
| Shipping address form (AU postcodes) | Standard checkout requirement | Low | shipping-form.tsx exists |
| Australian postcode validation | Business rule: 0200-9999 range | Low | Already specified in CLAUDE.md |
| Order summary with date breakdown | Users need to see rental_start, event_date, rental_end clearly | Low | order-review.tsx exists |
| Secure payment (Stripe) | Industry standard for Australian e-commerce | High | Stripe integration needed. Bond pre-auth adds complexity |
| Bond explanation at checkout | $100 bond is unusual -- users need clear explanation or they abandon | Low | Copy/UX explaining refundable security deposit |
| Order confirmation email | Every e-commerce platform sends this | Medium | Requires email service (Supabase Edge Functions or Resend) |
| Guest checkout option | Reduces friction for first-time renters | Medium | Need to balance with auth requirements for order tracking |

### Trust & Safety

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Professional cleaning guarantee | GlamCorner, AllBorrow, RTR all emphasize hygiene. Non-negotiable for shared garments | Low | Static content/badge. Operational requirement |
| Insurance/damage policy clarity | RTR includes insurance; GlamCorner has clear damage terms. Users fear hidden charges | Low | FAQ/policy page content |
| Free shipping both ways | AllBorrow, GlamCorner offer this. ASHIKA already has SHIPPING_COST_AUD: 0 | Low | Already a business rule |
| Return instructions (pre-paid label) | Every competitor provides this. Reduces anxiety about the "how do I return it?" question | Low | Include in confirmation email + booking detail page |
| Customer support contact | Visible phone/email/chat. GlamCorner has "Customer Happiness Team" | Low | Already have contact page |
| Reviews/ratings | Social proof is standard. RTR's "Like Me" reviews (by body type) are particularly effective | High | Requires auth, moderation, review submission flow |

### Post-Purchase Experience

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Order status tracking (in-account) | RTR, GlamCorner show status: Confirmed > Shipped > Delivered > Return Due | Medium | Requires auth + order history page |
| Shipping tracking link | Standard expectation. Australia Post provides tracking numbers | Low | Store tracking_outbound/tracking_return on Booking |
| Return date reminder | Critical for avoiding late fees. Email/SMS 2 days before return due | Medium | Requires scheduled notification system |
| Return label in box | Physical operational requirement. Digital backup on order page | Low | Operational process + display on order detail |

### Account & Auth

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| User registration/login | Required for order tracking, rebooking | Medium | Supabase Auth integration |
| Order history | Users need to see past and current rentals | Medium | Query bookings table by user_id |
| Saved shipping address | Reduces friction on repeat orders | Low | Store on user profile |

---

## Differentiators

Features that set ASHIKA apart in the ethnic wear rental niche. Not universally expected, but create competitive advantage and customer delight.

### Ethnic Wear Specific (Unique to Niche)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Draping/styling guide per product | Saree draping is the #1 anxiety for non-Indian or diaspora customers. 100+ draping styles exist. AllBorrow does NOT offer this -- gap in market | Medium | Video/image content linked to product categories. Can start with curated YouTube links, upgrade to own content later |
| Occasion-based collections (Wedding Guest, Bride, Diwali, Eid) | Ethnic events have dress codes that Westerners/diaspora may not know. "What do I wear to a Sangeet vs Mehendi?" | Low | Curated collection pages with editorial guidance |
| "What's included" visual checklist | Show exactly what arrives: saree + blouse + petticoat + pins + draping guide. Reduces "is it just the fabric?" confusion | Low | Component on product detail page. Already have accessories_included field |
| Blouse size selector (separate from outfit size) | Saree is Free Size but blouse needs specific bust measurement. Saris and Things sends backup blouse sizes. This is THE sizing challenge for ethnic wear | Medium | Separate blouse_size field in CartItem. Potentially send backup blouse option |
| Cultural event guide ("What to wear to...") | Content marketing + conversion tool. "What to wear to an Indian wedding as a non-Indian guest" is a hugely searched query | Low | Blog/content pages. Drives organic SEO traffic |
| Pre-stitched/pre-pleated option indicator | AllBorrow's key selling point. Removes draping anxiety entirely. Products should clearly state if pre-stitched | Low | Boolean field on product or tag |
| Adjustable sizing indicators | Drawstring waists, stretchy blouses -- ethnic wear often has adjustable elements. AllBorrow emphasizes this heavily | Low | Field on Product: adjustable_features[] |

### Booking Experience

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Backup size option | GlamCorner charges $15 for backup dress. Saris and Things sends free backup blouse. For ethnic wear, backup blouse sizing is critical | Medium | Add second size to order at reduced cost. Inventory management for backup items |
| Availability notifications ("Notify me when available") | For a 10-30 product catalog, items will frequently be unavailable. Capture demand + bring users back | Medium | Email collection + trigger when inventory_block clears |
| "Book for my event" wizard | Instead of browsing then picking dates, start with: "When is your event?" > "What type?" > Show available items. Inverts the flow for event-driven shopping | Medium | Multi-step form leading to filtered catalog. Better conversion for first-time visitors |
| Express/rush delivery option | For last-minute events. Charge premium for 1-day express (metro areas only) | Low | Pricing tier + shipping option at checkout. Limit to Sydney/Melbourne postcodes |

### Trust & Sizing

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Size guide with cross-reference (AU/US/UK/Indian sizing) | Indian sizing differs from Australian. Fashneo-style cross-reference table eliminates confusion | Low | Static reference content per category |
| "Fit photos" from previous renters | RTR's killer feature -- see how it looks on someone your size. For ethnic wear, especially powerful | High | Requires photo upload, moderation, consent, body-type tagging |
| Fabric swatch / texture close-ups | Ethnic wear fabrics (silk, chiffon, georgette, brocade) drape very differently. Close-up photos help | Low | Photography requirement. Add to image gallery |
| Garment measurements per size (not just S/M/L) | Already in ProductSize type as `measurements`. Bust, waist, hip, length -- critical for ethnic wear where "Medium" varies wildly between brands | Low | Display measurements on product page. SizeMeasurements interface exists |

### Post-Rental

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| "Rent again" quick rebooking | For items users loved. One-click rebooking for a new date | Low | Pre-fill booking form from order history |
| Referral program | Niche community -- South Asian diaspora is tight-knit. Word-of-mouth is primary channel | Medium | Referral codes with discount for referrer + referee |
| Post-event photo sharing | Users at events in gorgeous outfits = free marketing. "Share your look" with permission = social proof | Low | Can start simple with Instagram hashtag + feature on site |

---

## Anti-Features

Features to deliberately NOT build in v1. Either too complex for launch scale, premature optimization, or actively harmful to the business model.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Peer-to-peer marketplace (HURR model) | Massive complexity: escrow, dispute resolution, quality control, dual-sided marketplace dynamics. You own 10-30 items -- you ARE the inventory | Keep single-vendor model. You control quality, cleaning, shipping. P2P is a v3+ consideration if demand exceeds your inventory |
| Subscription / membership model | RTR and GlamCorner offer subscriptions, but this requires 100+ items minimum, constant rotation, and high operational overhead. With 10-30 products, subscription math does not work | One-time rental only. Revisit when catalog exceeds 100 items |
| Virtual try-on / AR | Industry mentions it as "emerging" but no ethnic wear platform has it. Sarees/lehengas drape unpredictably -- AR would be inaccurate and expensive to build | Use fit photos from real renters + detailed measurements instead |
| AI-powered recommendations | Requires data volume you will not have at launch. 10-30 products can be browsed manually in under 2 minutes | Manual curation: "Staff picks", occasion-based collections. Revisit with 100+ products |
| Buy option (rent + buy hybrid) | HURR offers resale alongside rental. Adds inventory complexity, pricing confusion, and dilutes the rental value proposition | Pure rental only. "Wear the culture. Return the stress." -- buying defeats the tagline |
| Multi-currency / international shipping | Adds payment complexity, customs handling, variable shipping costs. Australian market alone is sufficient for launch | AUD only, Australia-only shipping. Restrict to AU postcodes |
| Wishlist with price-drop notifications | Rental prices are fixed (no dynamic pricing in v1). Wishlist without notification trigger is low-value | Simple "Save" feature is fine. Skip price-drop logic |
| Loyalty points / rewards program | Premature for launch traffic. Adds accounting complexity | Simple referral discount codes instead |
| Live chat support | Requires staffing or bot setup. Contact form + email is sufficient for low order volume | Email support with 24h response SLA. Add live chat when orders exceed 10/week |
| User-generated reviews (v1) | Requires moderation, fake review prevention, minimum order volume for meaningful reviews. With 10-30 products and low initial orders, reviews section will look empty and hurt trust | Use curated testimonials initially. Add review system in v2 when order volume supports it |
| Mobile app (native) | Web responsive is sufficient. App development doubles maintenance burden | Progressive Web App (PWA) if needed. Mobile-optimized web first |
| Dynamic pricing (peak season markup) | Adds confusion and trust issues. Fixed pricing is simpler and more transparent | Fixed rental prices. Revisit for Diwali/wedding season premium in Year 2 |

---

## Feature Dependencies

```
Authentication (Supabase Auth)
  |
  +-- User Profile
  |     +-- Saved Addresses
  |     +-- Order History
  |           +-- Rent Again
  |           +-- Return Tracking
  |
  +-- Booking Creation
        +-- Availability Check (requires inventory_blocks table)
        |     +-- Date Picker (frontend)
        |     +-- Size Availability (frontend)
        |
        +-- Payment (Stripe)
        |     +-- Rental Fee Capture
        |     +-- Bond Pre-Authorization
        |     +-- Bond Release/Capture (post-return)
        |
        +-- Order Confirmation Email
        |     +-- Shipping Label Generation (AusPost API)
        |     +-- Tracking Link
        |
        +-- Inventory Block Creation
              +-- Availability Calendar Updates

Product Catalog (Supabase)
  |
  +-- Product CRUD (admin)
  |     +-- Image Upload (Supabase Storage)
  |     +-- Size/Measurement Entry
  |
  +-- Category Browsing
  |     +-- Filter System
  |     +-- Sort System
  |     +-- Search
  |
  +-- Product Detail Page
        +-- Image Gallery
        +-- Size Selector + Blouse Size
        +-- Date Picker + Availability
        +-- Add to Cart

Cart System (Client State -> Validated on Submit)
  |
  +-- Add/Remove Items
  +-- Date + Size Selection
  +-- Proceed to Checkout
        +-- Shipping Form
        +-- Payment Form
        +-- Order Review
        +-- Submit (creates Booking)
```

---

## MVP Recommendation

For MVP with 10-30 products, prioritize building the complete rental flow end-to-end over breadth of features.

### Must Ship (MVP)

1. **Real product catalog** (Supabase-backed, replacing mock data)
2. **Availability checking** (inventory_blocks preventing double-booking)
3. **Date-driven booking flow** (event date picker with unavailable dates grayed out)
4. **Stripe checkout** (rental fee capture + $100 bond pre-auth)
5. **User authentication** (Supabase Auth for order tracking)
6. **Order confirmation email** (with rental dates, return instructions)
7. **Basic order status page** (user can see their booking status)
8. **Size guide with measurements** (per-product, per-size bust/waist/hip/length)
9. **Professional product photography** (minimum 5 photos per item)
10. **Clear return instructions** (in email + accessible on site)

### Ship Soon After MVP (v1.1)

- Blouse size backup option (critical for saree category)
- Draping/styling guides linked to products
- "Book for my event" wizard flow
- Return date reminder emails
- Occasion-based collection pages
- Notify-me-when-available for sold-out dates

### Defer to v2

- Fit photos from previous renters
- Full review/rating system
- Referral program
- Express delivery option
- Cultural event guide content
- Admin dashboard for order management

### Defer to v3+

- Peer-to-peer marketplace
- Subscription model
- AI recommendations
- Virtual try-on
- Native mobile app

---

## Ethnic Wear Specific Considerations

These are unique challenges/opportunities that general fashion rental platforms (GlamCorner, RTR) do not face:

### Sizing Complexity

| Category | Sizing Challenge | Solution |
|----------|-----------------|----------|
| Saree | One-size fabric, but blouse needs specific bust/underbust fit | Free Size saree + separate blouse size selector (S/M/L/XL with measurements). Consider backup blouse in different size |
| Lehenga | Skirt waist + blouse bust -- two different measurements needed | Provide both waist and bust measurements. Highlight adjustable waist (drawstring) where applicable |
| Salwar Kameez | Top (bust/shoulder) + bottom (waist/length) both matter | Full measurement chart. Many have elastic/drawstring pants |
| Sherwani | Chest + length primarily. More straightforward | Standard menswear sizing (S-3XL) with chest measurement |
| Kids | Age-based but highly variable | Age ranges + actual measurements. Adjustable features important |

### Draping Knowledge Gap

The target audience (diaspora women 18-45 in Australia) may include:
- Women who grew up wearing sarees (minimal help needed)
- Second-generation who have seen it but never done it themselves (need guides)
- Non-Indian partners attending events (need full tutorials)
- First-generation who only wear ethnic occasionally (need refreshers)

**Recommendation:** Categorize products by "draping difficulty" and provide appropriate guidance level. Pre-stitched options should be prominently labeled for beginners.

### What's In The Box

Unlike Western dresses (one piece), ethnic wear often requires multiple components:

| Category | Typical Contents |
|----------|-----------------|
| Saree | 6-yard fabric + blouse + petticoat + safety pins + optional pallu pin |
| Lehenga | Skirt + blouse/choli + dupatta |
| Salwar Kameez | Kurta/top + salwar/pants + dupatta |
| Sherwani | Sherwani coat + churidar pants + stole (optional) |

Each product listing must clearly show ALL included items. Missing a petticoat or not knowing one is included creates support tickets and poor experience.

### Cultural Context for Non-Indian Renters

Opportunity to serve the "What do I wear to an Indian wedding?" market:
- Wedding has multiple events (Sangeet, Mehendi, Ceremony, Reception) each with different dress codes
- Color conventions (avoid white/black at Hindu weddings, specific colors for specific events)
- Formality levels differ by event
- Jewelry/accessories expectations

This content drives organic search traffic and positions ASHIKA as the authority on Indian event dressing in Australia.

---

## Sources

**Competitor Platforms (Direct Analysis):**
- [GlamCorner - How It Works](https://www.glamcorner.com.au/help/how-it-works)
- [GlamCorner - One Time Rental](https://www.glamcorner.com.au/clothing)
- [Rent the Runway - How Renting Works](https://www.renttherunway.com/how_renting_works)
- [Rent the Runway - Find Your Fit](https://www.renttherunway.com/content/find-your-fit)
- [HURR Collective](https://www.hurrcollective.com/)
- [AllBorrow - How It Works](https://www.allborrow.com/pages/how-it-works)
- [Borrow the Bazaar](https://borrowthebazaar.com/)
- [Saris and Things - How It Works](https://www.sarisandthings.com/pages/how-it-works)
- [Leasing Looks](https://leasinglooks.com/)
- [Glamourental](https://glamourental.com/)

**Industry Analysis:**
- [FatBit - Build a Dress Rental Platform (2026 Guide)](https://www.fatbit.com/fab/launch-designer-dress-rental-portal-with-top-website-features/)
- [Yo-Rent - Online Clothing Rental Industry Growth](https://www.yo-rent.com/blog/clothing-rental-industry-growth-trends-and-opportunities/)
- [Fashion Rental Report Q1/Q2 2025](https://circularfashionnews.substack.com/p/fashion-rental-report-q1q2-2025)
- [WWD - HURR Hits 100 Million Pounds Milestone](https://wwd.com/sustainability/business/hurr-hits-milestone-notching-100-million-pounds-fashion-rentals-1236662543/)

**UX Patterns:**
- [Baymard - Date Picker Design Examples](https://baymard.com/ecommerce-design-examples/date-picker)
- [Smashing Magazine - Designing the Perfect Date Picker](https://www.smashingmagazine.com/2017/07/designing-perfect-date-time-picker/)
- [PathedIts - Fashion Brands Use Average 8 Photos Per Product](https://pathedits.com/blogs/tips/product-photography-standards-how-many-images-do-you-need-to-sell-apparel)

**Sizing & Measurements:**
- [Fabricoz - How to Measure Indian Clothes](https://www.fabricoz.com/pages/how-to-measure)
- [Fashneo - Indian Clothing Size Guide](https://fashneo.com/pages/size-guide-indian-clothing)
- [Andaaz Fashion - Size Guide](https://www.andaazfashion.com/size-guide.html)

**Trust & Quality:**
- [The Good Trade - Best Dress Rental Services 2026](https://www.thegoodtrade.com/features/places-to-rent-designer-dresses-and-clothing-online/)
- [The Quality Edit - Best Fashion Rental Services 2026](https://www.thequalityedit.com/articles/fashion-rental-services)

**Confidence Notes:**
- Competitor feature analysis: MEDIUM-HIGH (based on public-facing websites and reviews, not internal product specs)
- Industry standards (photo count, sizing): MEDIUM (based on aggregate industry analysis, verified across multiple sources)
- Ethnic wear specific features: HIGH (based on direct analysis of AllBorrow, Saris and Things, Borrow the Bazaar who serve exact same niche)
- UX patterns (date picker, checkout): HIGH (based on established UX research from Baymard, NN/g, Smashing Magazine)
