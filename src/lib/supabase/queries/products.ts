import { createClient } from '@/lib/supabase/server';
import type { Product, ProductCategory } from '@/types';
import type { Database } from '@/lib/supabase/types';

type ProductRow = Database['public']['Tables']['products']['Row'];

/** Map Supabase row to app Product type */
function mapProduct(row: ProductRow): Product {
  return {
    ...row,
    category: row.category as ProductCategory,
    subcategory: row.subcategory ?? undefined,
    description: row.description ?? '',
    fabric: row.fabric ?? '',
    work: row.work ?? '',
    thumbnail: row.thumbnail ?? row.images?.[0] ?? '',
    sizes: Array.isArray(row.sizes) ? (row.sizes as unknown as Product['sizes']) : [],
    status: row.status as Product['status'],
    tier: row.tier as Product['tier'],
  };
}

/** Get all available products */
export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .neq('status', 'retired')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return (data ?? []).map(mapProduct);
}

/** Get a single product by UUID */
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return mapProduct(data);
}

/** Get a single product by slug */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return mapProduct(data);
}

/** Get featured products */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .eq('status', 'available')
    .limit(limit);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return (data ?? []).map(mapProduct);
}

/** Get products by category */
export async function getProductsByCategory(
  category: ProductCategory,
  excludeId?: string
): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('status', 'available');

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query.limit(4);

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }

  return (data ?? []).map(mapProduct);
}

/** Get all product IDs for static generation (build-time safe — no cookies) */
export async function getAllProductIds(): Promise<string[]> {
  const { createClient: createDirectClient } = await import('@supabase/supabase-js');
  const supabase = createDirectClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase
    .from('products')
    .select('id')
    .neq('status', 'retired');

  if (error || !data) return [];
  return data.map((p: { id: string }) => p.id);
}
