'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { CartItem } from './cart-item';
import { Button } from '@/components/ui';
import { RENTAL_CONFIG } from '@/types';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { state, closeCart, removeItem, itemCount, subtotal, bondTotal } = useCart();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCart();
      }
    };

    if (state.isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [state.isOpen, closeCart]);

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          'absolute right-0 top-0 bottom-0 w-full max-w-md bg-white',
          'transform transition-transform duration-500 ease-out',
          state.isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-widest text-black">
              Your Bag ({itemCount})
            </h2>
            <button
              onClick={closeCart}
              className="p-2 text-black hover:text-gray-600 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h3 className="font-bold text-black uppercase tracking-wide mb-2">
                  Your bag is empty
                </h3>
                <p className="text-sm text-gray-500 mb-8">
                  Looks like you haven't added anything yet.
                </p>
                <Button onClick={closeCart} variant="primary" className="uppercase tracking-widest">
                  <Link href="/shop">Start Shopping</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {state.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer with pricing */}
          {state.items.length > 0 && (
            <div className="border-t border-gray-100 p-6 bg-white">
              {/* Pricing breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-black">${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-black">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Bond ({itemCount} × ${RENTAL_CONFIG.BOND_AMOUNT_AUD})
                  </span>
                  <span className="font-medium text-gray-400">${bondTotal}*</span>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold uppercase tracking-wide text-black">
                      Total
                    </span>
                    <span className="font-bold text-black text-xl">
                      ${subtotal}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wide">
                    *Bond is pre-authorized, not charged
                  </p>
                </div>
              </div>

              {/* Checkout button */}
              <Link href="/checkout" onClick={closeCart}>
                <Button size="lg" className="w-full uppercase tracking-widest font-bold text-xs py-4">
                  Checkout
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
