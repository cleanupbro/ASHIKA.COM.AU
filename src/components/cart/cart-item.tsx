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
            <h4 className="font-black text-gray-900 text-[11px] uppercase tracking-[0.15em] line-clamp-1">
              {item.product.name}
            </h4>
            <button
              onClick={onRemove}
              className="text-gray-400 hover:text-brand-black transition-colors"
              aria-label="Remove item"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[9px] text-brand-gold font-bold uppercase tracking-widest mt-1.5">
            {item.product.category.replace('_', ' ')} · SIZE {item.size}
          </p>
        </div>

        {/* Timeline */}
        <div className="mt-3 space-y-1">
          <p className="text-[10px] text-gray-900 font-bold uppercase tracking-wide">
            EVENT: {format(eventDate, 'MMM d, yyyy')}
          </p>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest">
            RETURN BY: {format(returnBy, 'MMM d')}
          </p>
        </div>

        {/* Price */}
        <div className="mt-2 text-right">
          <span className="font-black text-brand-black text-xs tracking-widest">
            ${item.product.rental_price}
          </span>
        </div>
      </div>
    </div>
  );
}
