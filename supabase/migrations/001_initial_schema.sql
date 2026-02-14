-- ==========================================
-- ASHIKA — Initial Database Schema
-- ==========================================
-- Run this in Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist"; -- Required for EXCLUDE constraint

-- ==========================================
-- ENUMS
-- ==========================================

CREATE TYPE product_category AS ENUM (
  'saree', 'lehenga', 'salwar_kameez', 'sherwani',
  'kurta', 'kids', 'accessories'
);

CREATE TYPE product_status AS ENUM (
  'available', 'rented', 'cleaning', 'damaged', 'retired'
);

CREATE TYPE product_tier AS ENUM ('lite', 'premium');

CREATE TYPE booking_status AS ENUM (
  'pending', 'confirmed', 'shipped', 'delivered',
  'returned', 'inspecting', 'completed', 'disputed', 'cancelled'
);

CREATE TYPE bond_status AS ENUM (
  'pending', 'held', 'released', 'partial_capture', 'full_capture'
);

CREATE TYPE block_reason AS ENUM (
  'rental', 'cleaning', 'maintenance', 'reserved'
);

-- ==========================================
-- PRODUCTS TABLE
-- ==========================================

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category product_category NOT NULL,
  subcategory TEXT,
  occasion TEXT[] DEFAULT '{}',
  color TEXT NOT NULL,
  colors TEXT[] DEFAULT '{}',
  rental_price DECIMAL(10,2) NOT NULL CHECK (rental_price > 0),
  retail_price DECIMAL(10,2) NOT NULL CHECK (retail_price > 0),
  tier product_tier DEFAULT 'lite',
  sizes JSONB DEFAULT '[]',
  description TEXT,
  fabric TEXT,
  work TEXT,
  blouse_included BOOLEAN DEFAULT false,
  accessories_included TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  thumbnail TEXT,
  status product_status DEFAULT 'available',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for products
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_price ON products(rental_price);
CREATE INDEX idx_products_tier ON products(tier);

-- Full-text search index
CREATE INDEX idx_products_search ON products USING GIN (
  to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || color)
);

-- ==========================================
-- BOOKINGS TABLE
-- ==========================================

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT NOT NULL,
  size TEXT,

  -- Dates
  event_date DATE NOT NULL,
  rental_start DATE NOT NULL,
  rental_end DATE NOT NULL,
  cleaning_end DATE NOT NULL,

  -- Status
  status booking_status DEFAULT 'pending',

  -- Financials
  rental_fee DECIMAL(10,2) NOT NULL CHECK (rental_fee > 0),
  bond_amount DECIMAL(10,2) DEFAULT 100.00,
  bond_status bond_status DEFAULT 'pending',
  bond_capture_reason TEXT,

  -- Stripe
  stripe_payment_intent_id TEXT,
  stripe_bond_intent_id TEXT,

  -- Shipping
  shipping_label_url TEXT,
  return_label_url TEXT,
  tracking_number TEXT,
  return_tracking_number TEXT,

  -- Timestamps
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  returned_at TIMESTAMPTZ,
  inspected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_date_sequence CHECK (
    rental_start < event_date AND
    event_date < rental_end AND
    rental_end < cleaning_end
  )
);

-- Indexes for bookings
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_product ON bookings(product_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_event_date ON bookings(event_date);
CREATE INDEX idx_bookings_dates ON bookings(rental_start, rental_end, cleaning_end);

-- ==========================================
-- INVENTORY BLOCKS TABLE
-- ==========================================

CREATE TABLE inventory_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  block_start DATE NOT NULL,
  block_end DATE NOT NULL,
  reason block_reason DEFAULT 'rental',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent overlapping blocks for the same product
  CONSTRAINT no_overlapping_blocks EXCLUDE USING gist (
    product_id WITH =,
    daterange(block_start, block_end, '[]') WITH &&
  )
);

-- Indexes for inventory blocks
CREATE INDEX idx_inventory_blocks_product ON inventory_blocks(product_id);
CREATE INDEX idx_inventory_blocks_dates ON inventory_blocks(block_start, block_end);
CREATE INDEX idx_inventory_blocks_booking ON inventory_blocks(booking_id);

-- ==========================================
-- FUNCTIONS
-- ==========================================

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Check product availability function
CREATE OR REPLACE FUNCTION check_product_availability(
  p_product_id UUID,
  p_start_date DATE,
  p_end_date DATE
) RETURNS BOOLEAN AS $$
DECLARE
  conflict_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO conflict_count
  FROM inventory_blocks
  WHERE product_id = p_product_id
    AND block_start <= p_end_date
    AND block_end >= p_start_date;

  RETURN conflict_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Get blocked dates for a product (next 6 months)
CREATE OR REPLACE FUNCTION get_blocked_dates(
  p_product_id UUID
) RETURNS TABLE (
  block_start DATE,
  block_end DATE,
  reason block_reason
) AS $$
BEGIN
  RETURN QUERY
  SELECT ib.block_start, ib.block_end, ib.reason
  FROM inventory_blocks ib
  WHERE ib.product_id = p_product_id
    AND ib.block_end >= CURRENT_DATE
    AND ib.block_start <= CURRENT_DATE + INTERVAL '6 months'
  ORDER BY ib.block_start;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- TRIGGERS
-- ==========================================

-- Auto-update timestamps
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_blocks ENABLE ROW LEVEL SECURITY;

-- Products: Anyone can read available products
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (status != 'retired');

-- Products: Only admins can modify
CREATE POLICY "Products are modifiable by admins only"
  ON products FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Bookings: Users can view their own bookings
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

-- Bookings: Users can create bookings
CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Bookings: Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Bookings: Admins can modify all bookings
CREATE POLICY "Admins can modify all bookings"
  ON bookings FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Inventory blocks: Anyone can view (for availability checking)
CREATE POLICY "Inventory blocks are viewable by everyone"
  ON inventory_blocks FOR SELECT
  USING (true);

-- Inventory blocks: Only admins can modify
CREATE POLICY "Inventory blocks are modifiable by admins only"
  ON inventory_blocks FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- ==========================================
-- SERVICE ROLE BYPASS
-- ==========================================
-- The service role bypasses RLS automatically
-- Use it for backend operations (webhooks, admin tasks)
