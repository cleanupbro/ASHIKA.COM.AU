import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/shop/${product.id}`} className="group">
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

          {/* Quick view on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="bg-white text-teal-600 px-4 py-2 rounded-lg font-medium text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
              Quick View
            </span>
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
          <p className="text-xs text-gray-400 mt-1 line-through">
            Retail ${product.retail_price}
          </p>

          {/* Size availability */}
          <div className="mt-3 flex flex-wrap gap-1">
            {product.sizes.slice(0, 4).map((size) => (
              <span
                key={size.size}
                className={`text-xs px-2 py-0.5 rounded ${
                  size.available > 0
                    ? 'bg-teal-50 text-teal-700'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {size.size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-xs px-2 py-0.5 text-gray-500">
                +{product.sizes.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
