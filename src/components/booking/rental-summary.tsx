'use client';

import { format } from 'date-fns';
import { Package, Calendar, RotateCcw, CreditCard } from 'lucide-react';
import { formatRentalTimeline } from '@/lib/mock-data/availability';
import { RENTAL_CONFIG } from '@/types';

interface RentalSummaryProps {
  eventDate: Date;
  rentalPrice: number;
  showPricing?: boolean;
}

export function RentalSummary({
  eventDate,
  rentalPrice,
  showPricing = true,
}: RentalSummaryProps) {
  const timeline = formatRentalTimeline(eventDate);

  return (
    <div className="bg-cream rounded-xl p-4 space-y-4">
      <h4 className="font-medium text-teal-900">Rental Timeline</h4>

      <div className="space-y-3">
        {/* Ship by date */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Package className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Ships to you</p>
            <p className="text-sm text-gray-600">
              {format(timeline.shipBy, 'EEEE, MMM d')}
            </p>
          </div>
        </div>

        {/* Event date */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-gold-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Your Event</p>
            <p className="text-sm text-gray-600">
              {format(timeline.eventDate, 'EEEE, MMM d')}
            </p>
          </div>
        </div>

        {/* Return by date */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
            <RotateCcw className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Return by</p>
            <p className="text-sm text-gray-600">
              {format(timeline.returnBy, 'EEEE, MMM d')}
            </p>
          </div>
        </div>
      </div>

      {/* Pricing breakdown */}
      {showPricing && (
        <div className="pt-4 border-t border-teal-200 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{RENTAL_CONFIG.RENTAL_PERIOD_DAYS}-day rental</span>
            <span className="font-medium">${rentalPrice}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping (both ways)</span>
            <span className="font-medium text-green-600">FREE</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <CreditCard className="w-3 h-3" />
              Security bond (refundable)
            </span>
            <span className="font-medium text-gray-500">${RENTAL_CONFIG.BOND_AMOUNT_AUD}*</span>
          </div>
          <div className="pt-2 border-t border-teal-200">
            <div className="flex justify-between">
              <span className="font-medium text-gray-900">Total due now</span>
              <span className="font-bold text-teal-900">${rentalPrice}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              *Bond is pre-authorized but not charged. Released within 3-5 days of return.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
