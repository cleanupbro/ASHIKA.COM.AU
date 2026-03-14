# ASHIKA: Project Phases & Roadmap

This document outlines the step-by-step phases of the ASHIKA platform development. It serves as a clear guide for current and future developers to quickly understand what has been completed, and exactly what needs to be built next.

---

## ✅ PHASE 1: UI/UX & Frontend Foundation (COMPLETED - MARCH 2026)
*This phase focused on delivering a premium, fully-responsive frontend with mock data to secure client approval on the visual direction.*

- [x] **Setup & Configuration**
  - Next.js 14 App Router setup
  - Tailwind CSS configuration (Teal & Gold theme)
  - TypeScript strict mode enforcement
- [x] **Global UI Architecture**
  - Premium Navigation Bar with glassmorphism
  - Footer with standard links
  - Reusable UI primitives (Buttons, Inputs, Cards)
- [x] **Core Pages (Static & Mock)**
  - Landing Page (Cinematic Video Hero, Value Props, Featured Carousel)
  - Shop Listing Page (Category filters, grid layout)
  - Individual Product Detail Pages (Image gallery, calendar placeholder, description)
  - Cart & Checkout Shell (UI only)
  - Supporting Pages (About Us, FAQ, Contact Form UI)
- [x] **Booking Calendar Front-End**
  - "From" / "To" date selection logic
  - Buffer awareness visualization
- [x] **Asset Generation**
  - High-quality AI placeholders for Sarees, Lehengas, Sherwanis, Salwar Kameez
  - Cinematic background video integration
- [x] **Testing & Handoff**
  - E2E Playwright baseline scripts written and verified 
  - Vercel automated deployments configured
  - Plain-text V1 Client Handover Document created

---

## 🚧 PHASE 2: Backend, Database & Auth (NEXT UP)
*This phase will replace all mock data (`src/lib/mock-data/products.ts`) with live database rows and implement user tracking.*

- [ ] **Supabase Setup**
  - Initialize Supabase project
  - Create PostgreSQL base schema (`profiles`, `products`, `inventory_blocks`, `bookings`)
  - Configure Row Level Security (RLS) policies
  - Insert initial real product catalog (replace AI images with actual photography)
- [ ] **Authentication**
  - Implement Supabase Auth (Email/Password, Magic Link, or Google Auth)
  - Create User Profile page (View active rentals, order history)
  - Protect Admin routes
- [ ] **Dynamic Product Hydration**
  - Fetch products from Supabase on Shop page
  - Fetch product details from Supabase on Product page
  - Handle missing/inactive products gracefully

---

## 🚧 PHASE 3: Checkout Engine & Payments
*The core transactional logic for the rental marketplace.*

- [ ] **Stripe Integration**
  - Set up Stripe API keys in Vercel/Supabase
  - Implement Stripe Elements on Checkout page
- [ ] **Payment & Bond Logic**
  - Configure Payment Intents for the total rental fee (Immediate Capture)
  - Configure Setup Intents for the $100 Bond (Pre-authorize/Hold only)
  - Webhook listener for successful payments
- [ ] **AusPost Integration (Optional/V1.5)**
  - Auto-generate return shipping labels via Australia Post API upon checkout success

---

## 🚧 PHASE 4: The Booking & Availability Engine
*The most critical logic piece — ensuring no double bookings occur.*

- [ ] **Server-Side Availability Validation**
  - API Route: `POST /api/bookings`
  - Logic: Validate requested dates against existing `inventory_blocks`
  - Logic: Enforce 3-day pre-ship buffer and 3-day post-clean buffer
- [ ] **Post-Purchase Triggers**
  - Upon Stripe success webhook: Create `booking` record
  - Upon Stripe success webhook: Create `inventory_block` record locking those dates
  - Send email confirmation to user and admin via Resend/SendGrid

---

## 🚧 PHASE 5: Admin Dashboard & Go Live
*Tools for the business owner to manage rentals and bonds.*

- [ ] **Admin Panel (Basic)**
  - View all active bookings
  - Mark items as "Shipped" / "Returned"
- [ ] **Bond Resolution Workflow**
  - Admin button to *Release Bond* (cancels the Stripe hold)
  - Admin button to *Capture Bond* (charges the card for damages/late fees)
- [ ] **Final Pre-Launch Audit**
  - Stripe switched from Test Mode to Live Mode
  - Domain officially propagated
  - Production DB backup configured
