# ASHIKA.COM.AU - V1 Client Handover Document

Welcome to your new ASHIKA.COM.AU platform! This document outlines everything you need to know about your new site, including technical details, business logic rules, visual previews, and instructions for managing your data.

---

## 📸 Visual Previews

### Site Walkthrough Video
This auto-generated navigation recording demonstrates the main shopping flow, including category filtering, responsive mobile-menu interactions, the product detail view (Royal Blue Banarasi Silk Saree), the 7-day booking calendar, and the "Our Story" layout:
![Walkthrough Video](/Users/shamalkrishna/.gemini/antigravity/brain/19357034-bcb1-4939-ad9a-7d92fd15cf28/ashika_v1_walkthrough_1772237637375.webp)

### Generated Premium Product Catalog Images
To ensure the ASHIKA site lives up to its "Curated Luxury" promise, beautiful high-fashion editorial AI imagery has been generated and populated into your mock catalog.

#### Sarees
- ![Saree Blue](/Users/shamalkrishna/.gemini/antigravity/brain/19357034-bcb1-4939-ad9a-7d92fd15cf28/saree_blue_banarasi_1772229989810.png)
- ![Saree Red](/Users/shamalkrishna/.gemini/antigravity/brain/19357034-bcb1-4939-ad9a-7d92fd15cf28/saree_red_kanjeevaram_1772230014993.png)
- ![Saree Pink](/Users/shamalkrishna/.gemini/antigravity/brain/19357034-bcb1-4939-ad9a-7d92fd15cf28/saree_pink_chiffon_1772230076919.png)

#### Lehengas
- ![Lehenga Maroon](/Users/shamalkrishna/.gemini/antigravity/brain/19357034-bcb1-4939-ad9a-7d92fd15cf28/lehenga_maroon_bridal_1772230177890.png)
- ![Lehenga Teal](/Users/shamalkrishna/.gemini/antigravity/brain/19357034-bcb1-4939-ad9a-7d92fd15cf28/lehenga_teal_blue_1772230221831.png)

#### Sherwanis & Salwar Kameez
- ![Sherwani Ivory](/Users/shamalkrishna/.gemini/antigravity/brain/19357034-bcb1-4939-ad9a-7d92fd15cf28/sherwani_ivory_wedding_1772230604221.png)
- ![Salwar Red](/Users/shamalkrishna/.gemini/antigravity/brain/19357034-bcb1-4939-ad9a-7d92fd15cf28/salwar_red_anarkali_1772231229594.png)

*(Note: See the `public/images/products/` folder for the full suite of generated images).*

### Final Contact Page State
- ![Contact Page](/Users/shamalkrishna/.gemini/antigravity/brain/19357034-bcb1-4939-ad9a-7d92fd15cf28/contact_page_walkthrough_1772237941339.png)


---

## 🛠 Project Tech Stack

The architecture of ASHIKA.COM.AU uses modern, enterprise-ready tools:

- **Frontend & Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS tailored to the ASHIKA Brand Code (Teal & Gold)
- **Database & Auth**: Supabase / PostgreSQL (Schema documented in `decisions.json`)
- **Payments**: Stripe Checkout (with Bond Pre-authorization capabilities)
- **Deployment**: Vercel

---

## 💼 Business Logic & Rules Implementation

The following standard ASHIKA business rules have been directly integrated into the logic of the Product Detail and Checkout pages:

1. **Rental Configuration**:
   - **Rental Period**: 7 Days
   - **Delivery Buffer**: 3 Days before the event
   - **Cleaning Buffer**: 3 Days after return
   - **Bond Amount**: $100 AUD (authorized via Stripe but not captured upfront)
   - **Shipping Rate**: $0 (Free standard shipping both ways)
   - **Late Returns**: $50 AUD penalty after the 3-day grace period.

2. **Availability Calendar**:
   - Items selected for a specific date block the calendar dynamically from `-3 days` to `+3 days` around the event date stringency logic built-in.

---

## 📝 Ongoing Maintenance & Local Commands

### Modifying Products
Currently, the website is hooked up to the visual UI using mock data to ensure high-speed development of the Frontend.
You can modify current products, prices, stock amounts, and descriptions in:
`src/lib/mock-data/products.ts`

When ready to wire up the actual Supabase database in Stage 6, you will replace instances of `products.find(p => ...)` with Supabase API client wrapper functions.

### Running Local Development
To run this application on your local machine if you need to make changes before pushing to Vercel:

1. **Install dependencies**: Use `npm install` or `pnpm install`. *(Ensure you do not use Sudo locally unless required to avoid EPERM cache locks on `node_modules`)*. 
2. **Start the local server**: Run `npm run dev`.
3. **Open browser**: Visit `http://localhost:3000`

### E2E Testing with Playwright
We have written a comprehensive suite of 50 Playwright E2E scenario checks to validate routing, cart flows, missing images, and contact validation.
To run the automated tests against your machine, use:
`npx playwright test e2e/full-site.spec.ts`

---

## ✅ Next Steps

1. Review the UI components to ensure the brand vision fully aligns with expectations.
2. Initialize and configure the permanent Supabase database instances.
3. Hook up the final Stripe API Keys to actual production endpoints.
4. Finalize the exact SKU models in the real remote database schema.

**Welcome to the Borrowhood!**
