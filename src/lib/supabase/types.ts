// ==========================================
// ASHIKA — Supabase Database Types
// ==========================================
// Run `npx supabase gen types typescript` to regenerate

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          sku: string;
          name: string;
          slug: string;
          category: 'saree' | 'lehenga' | 'salwar_kameez' | 'sherwani' | 'kurta' | 'kids' | 'accessories';
          subcategory: string | null;
          occasion: string[];
          color: string;
          colors: string[];
          rental_price: number;
          retail_price: number;
          tier: 'lite' | 'premium';
          sizes: Json;
          description: string | null;
          fabric: string | null;
          work: string | null;
          blouse_included: boolean;
          accessories_included: string[];
          images: string[];
          thumbnail: string | null;
          status: 'available' | 'rented' | 'cleaning' | 'damaged' | 'retired';
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sku: string;
          name: string;
          slug: string;
          category: 'saree' | 'lehenga' | 'salwar_kameez' | 'sherwani' | 'kurta' | 'kids' | 'accessories';
          subcategory?: string | null;
          occasion?: string[];
          color: string;
          colors?: string[];
          rental_price: number;
          retail_price: number;
          tier?: 'lite' | 'premium';
          sizes?: Json;
          description?: string | null;
          fabric?: string | null;
          work?: string | null;
          blouse_included?: boolean;
          accessories_included?: string[];
          images?: string[];
          thumbnail?: string | null;
          status?: 'available' | 'rented' | 'cleaning' | 'damaged' | 'retired';
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sku?: string;
          name?: string;
          slug?: string;
          category?: 'saree' | 'lehenga' | 'salwar_kameez' | 'sherwani' | 'kurta' | 'kids' | 'accessories';
          subcategory?: string | null;
          occasion?: string[];
          color?: string;
          colors?: string[];
          rental_price?: number;
          retail_price?: number;
          tier?: 'lite' | 'premium';
          sizes?: Json;
          description?: string | null;
          fabric?: string | null;
          work?: string | null;
          blouse_included?: boolean;
          accessories_included?: string[];
          images?: string[];
          thumbnail?: string | null;
          status?: 'available' | 'rented' | 'cleaning' | 'damaged' | 'retired';
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          size: string | null;
          event_date: string;
          rental_start: string;
          rental_end: string;
          cleaning_end: string;
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'returned' | 'inspecting' | 'completed' | 'disputed' | 'cancelled';
          rental_fee: number;
          bond_amount: number;
          bond_status: 'pending' | 'held' | 'released' | 'partial_capture' | 'full_capture';
          bond_capture_reason: string | null;
          stripe_payment_intent_id: string | null;
          stripe_bond_intent_id: string | null;
          shipping_label_url: string | null;
          return_label_url: string | null;
          tracking_number: string | null;
          return_tracking_number: string | null;
          shipped_at: string | null;
          delivered_at: string | null;
          returned_at: string | null;
          inspected_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          size?: string | null;
          event_date: string;
          rental_start: string;
          rental_end: string;
          cleaning_end: string;
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'returned' | 'inspecting' | 'completed' | 'disputed' | 'cancelled';
          rental_fee: number;
          bond_amount?: number;
          bond_status?: 'pending' | 'held' | 'released' | 'partial_capture' | 'full_capture';
          bond_capture_reason?: string | null;
          stripe_payment_intent_id?: string | null;
          stripe_bond_intent_id?: string | null;
          shipping_label_url?: string | null;
          return_label_url?: string | null;
          tracking_number?: string | null;
          return_tracking_number?: string | null;
          shipped_at?: string | null;
          delivered_at?: string | null;
          returned_at?: string | null;
          inspected_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          size?: string | null;
          event_date?: string;
          rental_start?: string;
          rental_end?: string;
          cleaning_end?: string;
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'returned' | 'inspecting' | 'completed' | 'disputed' | 'cancelled';
          rental_fee?: number;
          bond_amount?: number;
          bond_status?: 'pending' | 'held' | 'released' | 'partial_capture' | 'full_capture';
          bond_capture_reason?: string | null;
          stripe_payment_intent_id?: string | null;
          stripe_bond_intent_id?: string | null;
          shipping_label_url?: string | null;
          return_label_url?: string | null;
          tracking_number?: string | null;
          return_tracking_number?: string | null;
          shipped_at?: string | null;
          delivered_at?: string | null;
          returned_at?: string | null;
          inspected_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      inventory_blocks: {
        Row: {
          id: string;
          product_id: string;
          booking_id: string | null;
          block_start: string;
          block_end: string;
          reason: 'rental' | 'cleaning' | 'maintenance' | 'reserved';
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          booking_id?: string | null;
          block_start: string;
          block_end: string;
          reason?: 'rental' | 'cleaning' | 'maintenance' | 'reserved';
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          booking_id?: string | null;
          block_start?: string;
          block_end?: string;
          reason?: 'rental' | 'cleaning' | 'maintenance' | 'reserved';
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      check_product_availability: {
        Args: {
          p_product_id: string;
          p_start_date: string;
          p_end_date: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      product_category: 'saree' | 'lehenga' | 'salwar_kameez' | 'sherwani' | 'kurta' | 'kids' | 'accessories';
      product_status: 'available' | 'rented' | 'cleaning' | 'damaged' | 'retired';
      product_tier: 'lite' | 'premium';
      booking_status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'returned' | 'inspecting' | 'completed' | 'disputed' | 'cancelled';
      bond_status: 'pending' | 'held' | 'released' | 'partial_capture' | 'full_capture';
      block_reason: 'rental' | 'cleaning' | 'maintenance' | 'reserved';
    };
  };
};

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Convenience types
export type Product = Tables<'products'>;
export type Booking = Tables<'bookings'>;
export type InventoryBlock = Tables<'inventory_blocks'>;
