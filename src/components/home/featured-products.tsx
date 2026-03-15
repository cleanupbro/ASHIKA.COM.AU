import Link from 'next/link';
import { Container } from '@/components/layout';
import { Button } from '@/components/ui';
import { getFeaturedProducts } from '@/lib/supabase/queries/products';
import { ProductCard } from '@/components/product';

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(8);

  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-[0.2em] text-brand-black mb-4">
            Trending Now
          </h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            Most Loved Styles This Week
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link href="/shop">
            <Button variant="outline" className="min-w-[280px] h-12 text-[10px] font-black tracking-[0.3em]">
              VIEW ALL COLLECTIONS
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
