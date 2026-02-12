'use client';

import { useState } from 'react';
import { DateSelector } from '@/components/booking';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/cart-context';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addItem } = useCart();

  const handleAddToCart = (eventDate: Date) => {
    if (selectedSize) {
      addItem(product, selectedSize, eventDate);
    }
  };

  return (
    <div className="space-y-8">
      {/* Name & Price */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] text-gray-900 mb-4">
          {product.name}
        </h1>
        <div className="flex items-center gap-4 mb-6">
          <span className="text-2xl font-black text-brand-teal">
            ${product.rental_price}
          </span>
          <span className="text-sm font-medium text-gray-400 line-through">
            RRP ${product.retail_price}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="border-t border-b border-brand-teal/10 py-8">
        <p className="text-sm text-gray-600 leading-relaxed mb-6 font-medium">{product.description}</p>
        <div className="grid grid-cols-2 gap-6 text-xs">
          <div>
            <span className="font-bold text-brand-gold uppercase tracking-widest block mb-2">Details</span>
            <span className="text-gray-600 font-medium uppercase tracking-wide">{product.work}</span>
          </div>
          <div>
            <span className="font-bold text-brand-gold uppercase tracking-widest block mb-2">Material</span>
            <span className="text-gray-600 font-medium uppercase tracking-wide">{product.fabric}</span>
          </div>
        </div>
      </div>

      {/* Size selection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">Select Size</h3>
          <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 underline hover:text-brand-teal transition-colors">
            Size Guide
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {product.sizes.map((size) => (
            <button
              key={size.size}
              onClick={() => setSelectedSize(size.size)}
              disabled={size.available === 0}
              className={cn(
                'min-w-[56px] h-14 flex items-center justify-center text-sm font-bold transition-all border shadow-sm',
                selectedSize === size.size
                  ? 'border-brand-teal bg-brand-teal text-white'
                  : size.available > 0
                  ? 'border-gray-200 hover:border-brand-teal text-gray-900 bg-white hover:text-brand-teal'
                  : 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
              )}
            >
              {size.size}
            </button>
          ))}
        </div>
      </div>

      {/* Date selection & Add to cart */}
      <DateSelector
        productId={product.id}
        rentalPrice={product.rental_price}
        selectedSize={selectedSize}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
