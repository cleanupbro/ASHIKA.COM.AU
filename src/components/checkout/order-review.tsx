'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import { Package, Calendar, RotateCcw, Truck, CreditCard } from 'lucide-react';
import { CartItem } from '@/contexts/cart-context';
import { RENTAL_CONFIG } from '@/types';

interface OrderReviewProps {
  items: CartItem[];
  subtotal: number;
  bondTotal: number;
}

export function OrderReview({ items, subtotal, bondTotal }: OrderReviewProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="font-display font-semibold text-gray-900">Order Summary</h3>
      </div>

      {/* Cart items */}
      <div className="divide-y">
        {items.map((item) => (
          <div key={item.id} className="p-4">
            <div className="flex gap-4">
              {/* Image */}
              <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={item.product.thumbnail}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                  {item.product.name}
                </h4>
                <p className="text-xs text-gray-500 capitalize mt-0.5">
                  {item.product.category.replace('_', ' ')} · Size {item.size}
                </p>

                {/* Timeline */}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Package className="w-3 h-3" />
                    <span>Ships: {format(new Date(item.rentalTimeline.shipBy), 'MMM d')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-teal-600 font-medium">
                    <Calendar className="w-3 h-3" />
                    <span>Event: {format(new Date(item.eventDate), 'MMM d')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <RotateCcw className="w-3 h-3" />
                    <span>Return: {format(new Date(item.rentalTimeline.returnBy), 'MMM d')}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-2 text-right">
                  <span className="font-semibold text-teal-600">
                    ${item.product.rental_price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing breakdown */}
      <div className="p-4 bg-gray-50 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Rental subtotal</span>
          <span className="font-medium">${subtotal}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            Shipping (both ways)
          </span>
          <span className="font-medium text-green-600">FREE</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" />
            Security bond (pre-auth)
          </span>
          <span className="text-gray-500">${bondTotal}*</span>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Total due now</span>
            <span className="font-bold text-teal-600 text-xl">${subtotal}</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 pt-2">
          *Bond is pre-authorized on your card but not charged. It will be released
          within 3-5 business days after we receive and inspect your return.
        </p>
      </div>

      {/* Trust badges */}
      <div className="p-4 grid grid-cols-3 gap-2 border-t">
        <div className="text-center p-2">
          <p className="text-xs font-medium text-gray-700">Free Shipping</p>
          <p className="text-xs text-gray-500">Both ways</p>
        </div>
        <div className="text-center p-2 border-x">
          <p className="text-xs font-medium text-gray-700">{RENTAL_CONFIG.RENTAL_PERIOD_DAYS}-Day Rental</p>
          <p className="text-xs text-gray-500">Included</p>
        </div>
        <div className="text-center p-2">
          <p className="text-xs font-medium text-gray-700">Secure Payment</p>
          <p className="text-xs text-gray-500">SSL Encrypted</p>
        </div>
      </div>
    </div>
  );
}
