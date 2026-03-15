'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { CartItem } from './cart-item';
import { Button } from '@/components/ui';
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
          <div className="flex items-center justify-between p-6 border-b border-brand-black/10">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-brand-black">
              Your Bag ({itemCount})
            </h2>
            <button
              onClick={closeCart}
              className="p-2 text-brand-black hover:text-brand-gold transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h3 className="font-black text-brand-black uppercase tracking-[0.2em] mb-4">
                  Your bag is empty
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-10">
                  Looks like you haven&apos;t added anything yet.
                </p>
                <Link href="/shop" onClick={closeCart}>
                  <Button className="min-w-[200px] h-12 text-xs font-bold tracking-[0.2em]">
                    START SHOPPING
                  </Button>
                </Link>
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
            <div className="border-t border-brand-black/10 p-6 bg-[#F8FBFA]">
              {/* Pricing breakdown */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-gray-500">Rental Subtotal</span>
                  <span className="text-gray-900">${subtotal}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-brand-black">FREE</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-gray-500">
                    Security Bond (Hold)
                  </span>
                  <span className="text-gray-400">${bondTotal}*</span>
                </div>
                <div className="pt-6 border-t border-brand-black/5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">
                      Total
                    </span>
                    <span className="font-black text-brand-black text-2xl">
                      ${subtotal}
                    </span>
                  </div>
                  <p className="text-[9px] text-gray-400 mt-3 uppercase tracking-widest font-bold">
                    *Bond is pre-authorized, not charged
                  </p>
                </div>
              </div>

              {/* Checkout button */}
              <Link href="/checkout" onClick={closeCart}>
                <Button size="lg" className="w-full h-14 text-sm font-bold tracking-[0.2em]">
                  CHECKOUT
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
