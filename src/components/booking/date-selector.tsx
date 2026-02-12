'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { AvailabilityCalendar } from './availability-calendar';
import { RentalSummary } from './rental-summary';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { isProductAvailable } from '@/lib/mock-data/availability';

interface DateSelectorProps {
  productId: string;
  rentalPrice: number;
  selectedSize: string | null;
  onAddToCart: (eventDate: Date) => void;
}

export function DateSelector({
  productId,
  rentalPrice,
  selectedSize,
  onAddToCart,
}: DateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDateSelect = (date: Date) => {
    setError(null);

    // Verify availability
    if (!isProductAvailable(productId, date)) {
      setError('This date is not available. Please select another date.');
      return;
    }

    setSelectedDate(date);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Please select a size first.');
      return;
    }

    if (!selectedDate) {
      setError('Please select an event date.');
      return;
    }

    onAddToCart(selectedDate);
  };

  return (
    <div className="space-y-6 border-t border-gray-100 pt-6">
      {/* Date selector trigger */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-3">Event Date</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full flex items-center justify-between px-4 py-3 border transition-colors',
            isOpen ? 'border-black' : 'border-gray-200 hover:border-gray-400',
            selectedDate && !isOpen && 'border-black'
          )}
        >
          <div className="flex items-center gap-3">
            <Calendar className={cn('w-4 h-4', selectedDate ? 'text-black' : 'text-gray-400')} />
            <span className={cn('text-sm font-medium', selectedDate ? 'text-black' : 'text-gray-500')}>
              {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select your event date'}
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>

      {/* Calendar dropdown */}
      {isOpen && (
        <div className="space-y-4">
          <AvailabilityCalendar
            productId={productId}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </div>
      )}

      {/* Rental summary */}
      {selectedDate && (
        <RentalSummary eventDate={selectedDate} rentalPrice={rentalPrice} />
      )}

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-100 text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      {/* Add to Cart button */}
      <Button
        size="lg"
        className="w-full uppercase tracking-widest font-bold text-xs py-4"
        onClick={handleAddToCart}
        disabled={!selectedDate || !selectedSize}
      >
        {!selectedSize
          ? 'Select Size to Continue'
          : !selectedDate
          ? 'Select Event Date to Continue'
          : 'ADD TO BAG'}
      </Button>

      {/* Trust badges */}
      <div className="flex justify-between text-center pt-2">
        <div className="text-xs text-gray-500">
          <p className="font-bold text-black uppercase tracking-wide">Free Shipping</p>
          <p>Both ways</p>
        </div>
        <div className="text-xs text-gray-500">
          <p className="font-bold text-black uppercase tracking-wide">7-Day Rental</p>
          <p>Includes buffer</p>
        </div>
        <div className="text-xs text-gray-500">
          <p className="font-bold text-black uppercase tracking-wide">$100 Bond</p>
          <p>Fully refundable</p>
        </div>
      </div>
    </div>
  );
}
