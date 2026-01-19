---
name: supabase-setup
description: Database setup, migrations, RLS policies, and Supabase configuration for ASHIKA
version: 1.0
triggers:
  - database
  - supabase
  - migration
  - schema
  - RLS
  - auth
---

# Supabase Setup Skill

## Purpose

Configure Supabase as the complete backend: database, authentication, storage, and real-time subscriptions.

## When to Use

- Initial project setup
- Creating or modifying database tables
- Setting up Row Level Security (RLS)
- Configuring authentication
- Managing file storage

---

## Project Setup

### 1. Initialize Supabase

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize in project
supabase init

# Link to remote project (get project ref from Supabase dashboard)
supabase link --project-ref YOUR_PROJECT_REF
```

### 2. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Client Setup

### Browser Client

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Singleton for client components
let client: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!client) {
    client = createClient();
  }
  return client;
}
```

### Server Client

```typescript
// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore in Server Components
          }
        },
      },
    }
  );
}
```

### Admin Client (Service Role)

```typescript
// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';

// ⚠️ Only use server-side! Service role bypasses RLS
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

---

## Database Schema

### Migration: 001_initial_schema.sql

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  size TEXT,
  blouse_included BOOLEAN DEFAULT false,
  rental_price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  images TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  fabric TEXT,
  occasion TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'available',
  featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_category CHECK (category IN (
    'saree', 'lehenga', 'salwar_kameez', 'sherwani', 'kurta', 'kids', 'accessories'
  )),
  CONSTRAINT valid_status CHECK (status IN (
    'available', 'rented', 'cleaning', 'damaged', 'retired'
  ))
);

-- Create slug from name
CREATE OR REPLACE FUNCTION generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  NEW.slug := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_product_slug
  BEFORE INSERT ON products
  FOR EACH ROW
  WHEN (NEW.slug IS NULL)
  EXECUTE FUNCTION generate_slug();

-- User profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postcode TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  
  event_date DATE NOT NULL,
  rental_start DATE NOT NULL,
  rental_end DATE NOT NULL,
  cleaning_end DATE NOT NULL,
  
  status TEXT DEFAULT 'pending',
  
  rental_fee DECIMAL(10,2) NOT NULL,
  bond_amount DECIMAL(10,2) DEFAULT 100.00,
  bond_status TEXT DEFAULT 'pending',
  bond_capture_reason TEXT,
  
  stripe_payment_intent_id TEXT,
  stripe_bond_intent_id TEXT,
  
  shipping_address JSONB,
  shipping_label_url TEXT,
  return_label_url TEXT,
  tracking_number TEXT,
  return_tracking_number TEXT,
  
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  returned_at TIMESTAMPTZ,
  inspected_at TIMESTAMPTZ,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_booking_status CHECK (status IN (
    'pending', 'confirmed', 'shipped', 'delivered', 
    'returned', 'inspecting', 'completed', 'disputed', 'cancelled'
  )),
  CONSTRAINT valid_bond_status CHECK (bond_status IN (
    'pending', 'held', 'released', 'partial_capture', 'full_capture'
  ))
);

-- Inventory blocks (prevents double booking)
CREATE TABLE public.inventory_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  block_start DATE NOT NULL,
  block_end DATE NOT NULL,
  reason TEXT DEFAULT 'rental',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_block_reason CHECK (reason IN (
    'rental', 'cleaning', 'maintenance', 'reserved'
  ))
);

-- Index for fast availability queries
CREATE INDEX idx_inventory_blocks_lookup 
ON inventory_blocks(product_id, block_start, block_end);

-- Index for product filtering
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;

-- Index for booking queries
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(event_date);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Migration: 002_rls_policies.sql

```sql
-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_blocks ENABLE ROW LEVEL SECURITY;

-- Products: Public read, admin write
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Products are editable by admin"
  ON products FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Profiles: Users can manage their own
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Bookings: Users see own, admin sees all
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can update bookings"
  ON bookings FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- Inventory blocks: Public read (for availability), admin write
CREATE POLICY "Inventory blocks are viewable by everyone"
  ON inventory_blocks FOR SELECT
  USING (true);

CREATE POLICY "Inventory blocks managed by system/admin"
  ON inventory_blocks FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'service_role');
```

---

## Authentication Setup

### Auth Callback Route

```typescript
// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`);
}
```

### Create Profile on Sign Up

```sql
-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Storage Setup

### Bucket Configuration

```sql
-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true);

-- Create bucket for user uploads (Phase 2: Sell to Us)
INSERT INTO storage.buckets (id, name, public)
VALUES ('submissions', 'submissions', false);

-- Storage policies
CREATE POLICY "Product images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "Admin can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products' AND auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can upload to submissions"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'submissions' AND auth.role() = 'authenticated');
```

---

## Type Generation

```bash
# Generate TypeScript types from database schema
supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
```

### Using Generated Types

```typescript
// lib/supabase/types.ts is auto-generated
import { Database } from './types';

export type Product = Database['public']['Tables']['products']['Row'];
export type Booking = Database['public']['Tables']['bookings']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
```

---

## Common Queries

### Fetch Available Products

```typescript
export async function getAvailableProducts(filters?: {
  category?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const supabase = createClient();
  
  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'available')
    .order('created_at', { ascending: false });
  
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.size) {
    query = query.eq('size', filters.size);
  }
  if (filters?.minPrice) {
    query = query.gte('rental_price', filters.minPrice);
  }
  if (filters?.maxPrice) {
    query = query.lte('rental_price', filters.maxPrice);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as Product[];
}
```

### Check Product Availability

```typescript
export async function getProductAvailability(
  productId: string,
  startDate: string,
  endDate: string
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('inventory_blocks')
    .select('block_start, block_end')
    .eq('product_id', productId)
    .or(`block_start.lte.${endDate},block_end.gte.${startDate}`);
  
  if (error) throw error;
  
  return {
    available: data.length === 0,
    blocks: data,
  };
}
```

---

## Testing

### Local Development

```bash
# Start local Supabase
supabase start

# Run migrations
supabase db push

# Reset database (careful!)
supabase db reset
```

### Seed Data

```sql
-- supabase/seed.sql
INSERT INTO products (name, category, size, rental_price, blouse_included, images, status)
VALUES 
  ('Royal Red Banarasi Saree', 'saree', 'free_size', 120.00, true, 
   ARRAY['https://example.com/saree1.jpg'], 'available'),
  ('Emerald Green Lehenga', 'lehenga', 'M', 180.00, true,
   ARRAY['https://example.com/lehenga1.jpg'], 'available'),
  ('Navy Blue Sherwani', 'sherwani', 'L', 150.00, false,
   ARRAY['https://example.com/sherwani1.jpg'], 'available');
```

---

*This skill ensures consistent database setup across the project. Always run migrations through Supabase CLI, never modify production directly.*
