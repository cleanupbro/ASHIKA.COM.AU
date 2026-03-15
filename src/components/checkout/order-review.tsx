'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import { CartItem } from '@/contexts/cart-context';
import { RENTAL_CONFIG } from '@/types';

interface OrderReviewProps {
  items: CartItem[];
  subtotal: number;
  bondTotal: number;
}

export function OrderReview({ items, subtotal, bondTotal }: OrderReviewProps) {
  return (
    <div className="bg-white border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-sm font-bold uppercase tracking-widest text-black">Order Summary</h3>
      </div>

      {/* Cart items */}
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div key={item.id} className="p-6">
            <div className="flex gap-4">
              {/* Image */}
              <div className="relative w-16 aspect-[3/4] bg-gray-100 overflow-hidden flex-shrink-0">
                <Image
                  src={item.product.thumbnail}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-black uppercase tracking-wide line-clamp-1">
                  {item.product.name}
                </h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                  {item.product.category.replace('_', ' ')} · Size {item.size}
                </p>

                {/* Timeline */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase tracking-wide">
                    <span>Event: {format(new Date(item.eventDate), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-black font-bold uppercase tracking-wide">
                    <span>Return: {format(new Date(item.rentalTimeline.returnBy), 'MMM d, yyyy')}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-3 text-right">
                  <span className="text-sm font-bold text-black">
                    ${item.product.rental_price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing breakdown */}
      <div className="p-6 bg-gray-50 space-y-3">
        <div className="flex justify-between text-xs uppercase tracking-wide">
          <span className="text-gray-500">Rental Subtotal</span>
          <span className="font-bold text-black">${subtotal}</span>
        </div>

        <div className="flex justify-between text-xs uppercase tracking-wide">
          <span className="text-gray-500">Shipping</span>
          <span className="font-bold text-black">FREE</span>
        </div>

        <div className="flex justify-between text-xs uppercase tracking-wide text-gray-400">
          <span>Security Bond (Hold)</span>
          <span>${bondTotal}*</span>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-bold uppercase tracking-widest text-black">Total</span>
            <span className="font-black text-brand-black text-2xl">${subtotal}</span>
          </div>
        </div>

        <p className="text-[9px] text-gray-400 uppercase tracking-widest leading-relaxed pt-2">
          *Bond is pre-authorized on your card but not charged. It will be released
          after return inspection.
        </p>
      </div>

      {/* Trust badges */}
      <div className="p-6 border-t border-gray-100 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-black uppercase tracking-widest">Free Shipping</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wide">Both ways</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-black uppercase tracking-widest">{RENTAL_CONFIG.RENTAL_PERIOD_DAYS}-Day Rental</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wide">Included</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-black uppercase tracking-widest">Secure Payment</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wide">SSL Encrypted</span>
        </div>
      </div>
    </div>
  );
}
