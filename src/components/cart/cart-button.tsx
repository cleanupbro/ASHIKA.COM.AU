'use client';

import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { cn } from '@/lib/utils';

export function CartButton() {
  const { toggleCart, itemCount } = useCart();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 text-brand-teal hover:text-brand-gold transition-colors"
      aria-label={`BAG (${itemCount} ITEMS)`}
    >
      <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
      {itemCount > 0 && (
        <span
          className={cn(
            'absolute top-1 right-0 w-4 h-4 flex items-center justify-center',
            'bg-brand-gold text-white text-[8px] font-black',
            'animate-in zoom-in duration-300'
          )}
        >
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  );
}
