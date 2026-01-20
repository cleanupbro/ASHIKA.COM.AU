'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui';
import { DateSelector } from '@/components/booking';
import { Product } from '@/types';
import { Check, Shirt, Sparkles, Ruler } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Category & Tier */}
      <div className="flex items-center gap-3">
        <Badge variant={product.tier === 'premium' ? 'premium' : 'lite'}>
          {product.tier}
        </Badge>
        <span className="text-sm text-gray-500 uppercase tracking-wide">
          {product.category.replace('_', ' ')}
        </span>
      </div>

      {/* Name */}
      <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900">
        {product.name}
      </h1>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-teal-600">
          ${product.rental_price}
        </span>
        <span className="text-lg text-gray-500">/week</span>
        <span className="text-sm text-gray-400 line-through">
          Retail ${product.retail_price}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">{product.description}</p>

      {/* Product details */}
      <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-gold-500" />
          <span className="text-gray-600">Work: {product.work}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Shirt className="w-4 h-4 text-teal-500" />
          <span className="text-gray-600">Fabric: {product.fabric}</span>
        </div>
      </div>

      {/* Inclusions */}
      {(product.blouse_included || product.accessories_included.length > 0) && (
        <div className="bg-teal-50 rounded-lg p-4">
          <h3 className="font-medium text-teal-900 mb-2">Includes:</h3>
          <ul className="space-y-1">
            {product.blouse_included && (
              <li className="flex items-center gap-2 text-sm text-teal-700">
                <Check className="w-4 h-4" />
                Blouse (stitched to your measurements)
              </li>
            )}
            {product.accessories_included.map((accessory) => (
              <li key={accessory} className="flex items-center gap-2 text-sm text-teal-700 capitalize">
                <Check className="w-4 h-4" />
                {accessory}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Size selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Select Size</h3>
          <button className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1">
            <Ruler className="w-4 h-4" />
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
                'px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all',
                selectedSize === size.size
                  ? 'border-teal-600 bg-teal-600 text-white'
                  : size.available > 0
                  ? 'border-gray-200 hover:border-teal-300 text-gray-700'
                  : 'border-gray-100 text-gray-300 cursor-not-allowed'
              )}
            >
              {size.size}
              {size.available === 0 && (
                <span className="block text-xs opacity-70">Out of stock</span>
              )}
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
