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
    <section className="py-24 bg-white border-t border-gray-100">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-2xl font-black uppercase tracking-widest text-black mb-2">
            You May Also Like
          </h2>
          <div className="w-12 h-0.5 bg-black mx-auto mb-4"></div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Handpicked {category.replace('_', ' ')}s
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href={`/shop?category=${category}`}
            className="text-[10px] font-bold text-black uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors"
          >
            View All {category.replace('_', ' ')}s
          </Link>
        </div>
      </Container>
    </section>
  );
}
