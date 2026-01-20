'use client';

import { format } from 'date-fns';
import Image from 'next/image';
import { X, Calendar, Package, RotateCcw } from 'lucide-react';
import { CartItem as CartItemType } from '@/contexts/cart-context';

interface CartItemProps {
  item: CartItemType;
  onRemove: () => void;
}

export function CartItem({ item, onRemove }: CartItemProps) {
  const eventDate = new Date(item.eventDate);
  const shipBy = new Date(item.rentalTimeline.shipBy);
  const returnBy = new Date(item.rentalTimeline.returnBy);

  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
      {/* Image */}
      <div className="relative w-20 h-24 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={item.product.thumbnail}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
              {item.product.name}
            </h4>
            <p className="text-xs text-gray-500 capitalize">
              {item.product.category.replace('_', ' ')} · Size {item.size}
            </p>
          </div>
          <button
            onClick={onRemove}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Remove item"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Timeline */}
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Package className="w-3 h-3" />
            <span>Ships: {format(shipBy, 'MMM d')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-teal-600 font-medium">
            <Calendar className="w-3 h-3" />
            <span>Event: {format(eventDate, 'MMM d')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <RotateCcw className="w-3 h-3" />
            <span>Return: {format(returnBy, 'MMM d')}</span>
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
  );
}
