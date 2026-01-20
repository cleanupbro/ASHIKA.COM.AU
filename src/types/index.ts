// ==========================================
// ASHIKA — Shared Type Definitions
// ==========================================

// ----- Product Categories -----
export type ProductCategory = 'saree' | 'lehenga' | 'salwar_kameez' | 'sherwani';
export type ProductTier = 'lite' | 'premium';
export type ProductStatus = 'available' | 'rented' | 'maintenance' | 'retired';

// ----- Size Types by Category -----
export type SareeSize = 'Free Size';
export type ClothingSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL';

export interface SizeMeasurements {
  bust?: string;
  waist?: string;
  hip?: string;
  length?: string;
  shoulder?: string;
  chest?: string;
}

export interface ProductSize {
  size: string;
  quantity: number;
  available: number;
  measurements?: SizeMeasurements;
}

// ----- Product -----
export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: ProductCategory;
  subcategory?: string;
  occasion: string[];
  color: string;
  colors: string[];
  rental_price: number;
  retail_price: number;
  tier: ProductTier;
  sizes: ProductSize[];
  description: string;
  fabric: string;
  work: string;
  blouse_included: boolean;
  accessories_included: string[];
  images: string[];
  thumbnail: string;
  status: ProductStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

// ----- Cart -----
export interface CartItem {
  id: string;
  product: Product;
  size: string;
  event_date: string;
  rental_start: string;
  rental_end: string;
  quantity: number;
}

// ----- Booking -----
export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'returned'
  | 'inspecting'
  | 'completed'
  | 'damaged'
  | 'cancelled';

export type BondStatus =
  | 'held'
  | 'released'
  | 'partial_capture'
  | 'full_capture';

export interface Booking {
  id: string;
  user_id: string;
  product_id: string;
  size: string;
  event_date: string;
  rental_start: string;
  rental_end: string;
  cleaning_end: string;
  status: BookingStatus;
  bond_status: BondStatus;
  bond_payment_intent_id?: string;
  bond_capture_reason?: string;
  rental_fee: number;
  tracking_outbound?: string;
  tracking_return?: string;
  created_at: string;
  updated_at: string;
}

// ----- Inventory Block -----
export interface InventoryBlock {
  id: string;
  product_id: string;
  booking_id: string;
  block_start: string;
  block_end: string;
  reason: 'rental' | 'maintenance' | 'reserved';
}

// ----- Shipping Address -----
export interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: 'AU';
}

// ----- Rental Config (Immutable) -----
export const RENTAL_CONFIG = {
  RENTAL_PERIOD_DAYS: 7,
  DELIVERY_BUFFER_DAYS: 3,
  CLEANING_BUFFER_DAYS: 3,
  BOND_AMOUNT_AUD: 100,
  SHIPPING_COST_AUD: 0,
  LATE_RETURN_FEE_AUD: 50,
  LATE_RETURN_GRACE_DAYS: 3,
} as const;
