import Link from 'next/link';
import { Container } from '@/components/layout';
import { ProductCard } from './product-card';
import { ProductCategory } from '@/types';
import { products as allProducts } from '@/lib/mock-data/products';

interface RelatedProductsProps {
  currentProductId: string;
  category: ProductCategory;
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  // Get products from same category, excluding current product
  const relatedProducts = allProducts
    .filter((p) => p.category === category && p.id !== currentProductId)
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <Container>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-teal-900">
              You May Also Like
            </h2>
            <p className="text-gray-600 mt-1">
              More {category.replace('_', ' ')}s from our collection
            </p>
          </div>
          <Link
            href={`/shop?category=${category}`}
            className="hidden md:block text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
