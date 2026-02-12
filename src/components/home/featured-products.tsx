import Link from 'next/link';
import { Container } from '@/components/layout';
import { Button } from '@/components/ui';
import { getFeaturedProducts } from '@/lib/mock-data/products';
import { ProductCard } from '@/components/product';

export function FeaturedProducts() {
  const products = getFeaturedProducts(8);

  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-brand-teal mb-4">
            Trending Now
          </h2>
          <div className="w-16 h-1 bg-brand-gold mx-auto mb-6"></div>
          <p className="text-xs text-gray-500 uppercase tracking-[0.2em] font-bold">
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
            <Button variant="outline" size="lg" className="min-w-[280px] h-14 text-sm font-bold tracking-[0.2em]">
              VIEW ALL COLLECTIONS
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
