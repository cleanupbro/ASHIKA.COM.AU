'use client';

import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { cn } from '@/lib/utils';

export function CartButton() {
  const { toggleCart, itemCount } = useCart();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 text-black hover:text-gray-600 transition-colors"
      aria-label={`BAG (${itemCount} ITEMS)`}
    >
      <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
      {itemCount > 0 && (
        <span
          className={cn(
            'absolute top-1 right-0 w-4 h-4 flex items-center justify-center',
            'bg-black text-white text-[8px] font-bold',
            'animate-in zoom-in duration-300'
          )}
        >
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  );
}
