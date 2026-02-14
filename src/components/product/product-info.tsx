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
    <div className="space-y-10">
      {/* Name & Price */}
      <div>
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-[0.2em] text-brand-black mb-4 leading-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-4 mb-2">
          <span className="text-xl font-black text-brand-black tracking-wider">
            ${product.rental_price}
          </span>
          <span className="text-xs font-bold text-gray-400 line-through tracking-widest">
            RRP ${product.retail_price}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="border-t border-b border-gray-100 py-8">
        <p className="text-xs text-gray-500 leading-loose mb-8 font-medium tracking-wide uppercase">{product.description}</p>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <span className="text-[10px] font-black text-brand-black uppercase tracking-[0.2em] block mb-2">Details</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{product.work}</span>
          </div>
          <div>
            <span className="text-[10px] font-black text-brand-black uppercase tracking-[0.2em] block mb-2">Material</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{product.fabric}</span>
          </div>
        </div>
      </div>

      {/* Size selection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-black">Select Size</h3>
          <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 underline hover:text-brand-black transition-colors">
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
                'min-w-[60px] h-12 flex items-center justify-center text-[10px] font-black transition-all border',
                selectedSize === size.size
                  ? 'border-brand-black bg-brand-black text-white'
                  : size.available > 0
                  ? 'border-gray-200 hover:border-brand-black text-brand-black bg-white'
                  : 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50' // diagonal line simulation could be added here
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
