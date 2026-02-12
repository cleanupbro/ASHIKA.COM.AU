'use client';

import { format } from 'date-fns';
import Image from 'next/image';
import { X } from 'lucide-react';
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
    <div className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
      {/* Image */}
      <div className="relative w-20 aspect-[3/4] bg-gray-100 overflow-hidden flex-shrink-0">
        <Image
          src={item.product.thumbnail}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-bold text-black text-sm uppercase tracking-wide line-clamp-1">
              {item.product.name}
            </h4>
            <button
              onClick={onRemove}
              className="text-gray-400 hover:text-black transition-colors"
              aria-label="Remove item"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">
            {item.product.category.replace('_', ' ')} · Size {item.size}
          </p>
        </div>

        {/* Timeline */}
        <div className="mt-3">
          <p className="text-xs text-black font-medium">
            Event: {format(eventDate, 'MMM d')}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Return by: {format(returnBy, 'MMM d')}
          </p>
        </div>

        {/* Price */}
        <div className="mt-2 text-right">
          <span className="font-bold text-black text-sm">
            ${item.product.rental_price}
          </span>
        </div>
      </div>
    </div>
  );
}
