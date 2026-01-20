'use client';

import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { cn } from '@/lib/utils';

export function CartButton() {
  const { toggleCart, itemCount } = useCart();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      aria-label={`Cart (${itemCount} items)`}
    >
      <ShoppingBag className="w-5 h-5" />
      {itemCount > 0 && (
        <span
          className={cn(
            'absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center',
            'bg-teal-600 text-white text-xs font-bold rounded-full',
            'animate-in zoom-in duration-200'
          )}
        >
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  );
}
