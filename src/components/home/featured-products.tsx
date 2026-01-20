import Link from 'next/link';
import { Container } from '@/components/layout';
import { Button, Badge } from '@/components/ui';
import { getFeaturedProducts } from '@/lib/mock-data/products';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export function FeaturedProducts() {
  const products = getFeaturedProducts(8);

  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-teal-900 mb-4">
              Featured Collection
            </h2>
            <p className="text-gray-600 max-w-xl">
              Our most loved pieces, handpicked for special occasions
            </p>
          </div>
          <Link href="/shop" className="hidden md:block">
            <Button variant="ghost" className="group">
              View All
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="group"
            >
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* Image */}
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  {/* Tier badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant={product.tier === 'premium' ? 'premium' : 'lite'}>
                      {product.tier}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {product.category.replace('_', ' ')}
                  </p>
                  <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-teal-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-teal-600">
                      ${product.rental_price}
                    </span>
                    <span className="text-sm text-gray-400">/week</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Retail ${product.retail_price}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/shop">
            <Button variant="primary" className="w-full max-w-xs">
              View All Products
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
