import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/shop/${product.id}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden mb-4 rounded-sm shadow-sm">
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* Quick view on hover */}
        <div className="absolute inset-x-0 bottom-0 bg-brand-teal/95 py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center backdrop-blur-sm">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
            Quick View
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="text-center px-2">
        <p className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.15em] mb-1.5">
          {product.category.replace('_', ' ')}
        </p>
        <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-widest line-clamp-1 mb-2 group-hover:text-brand-teal transition-colors">
          {product.name}
        </h3>
        <div className="flex justify-center items-center gap-3">
          <span className="text-sm font-black text-brand-teal">
            ${product.rental_price}
          </span>
          <span className="text-[11px] text-gray-400 line-through font-medium">
            ${product.retail_price}
          </span>
        </div>
      </div>
    </Link>
  );
}
