'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
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
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          'absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl',
          'transform transition-transform duration-300 ease-out',
          state.isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-teal-600" />
              <h2 className="font-display text-lg font-semibold">
                Your Cart ({itemCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-4">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Find the perfect outfit for your next event
                </p>
                <Button onClick={closeCart} variant="outline">
                  <Link href="/shop">Browse Collection</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
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
            <div className="border-t p-4 bg-gray-50">
              {/* Pricing breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rental subtotal</span>
                  <span className="font-medium">${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Security bond ({itemCount} × ${RENTAL_CONFIG.BOND_AMOUNT_AUD})
                  </span>
                  <span className="font-medium text-gray-500">${bondTotal}*</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">
                      Total due now
                    </span>
                    <span className="font-bold text-teal-600 text-lg">
                      ${subtotal}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    *Bond is pre-authorized but not charged
                  </p>
                </div>
              </div>

              {/* Checkout button */}
              <Link href="/checkout" onClick={closeCart}>
                <Button size="lg" className="w-full">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              {/* Continue shopping */}
              <button
                onClick={closeCart}
                className="w-full mt-3 text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
