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
    <div className="space-y-4">
      {/* Date selector trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between p-4 rounded-xl border-2 transition-colors',
          isOpen ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-gray-300',
          selectedDate && !isOpen && 'border-teal-600'
        )}
      >
        <div className="flex items-center gap-3">
          <Calendar className={cn('w-5 h-5', selectedDate ? 'text-teal-600' : 'text-gray-400')} />
          <div className="text-left">
            <p className="text-sm text-gray-500">Event Date</p>
            <p className={cn('font-medium', selectedDate ? 'text-teal-900' : 'text-gray-900')}>
              {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select your event date'}
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

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
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Add to Cart button */}
      <Button
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={!selectedDate || !selectedSize}
      >
        {!selectedSize
          ? 'Select Size to Continue'
          : !selectedDate
          ? 'Select Event Date to Continue'
          : 'Add to Cart'}
      </Button>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
        <div className="p-2 bg-gray-50 rounded-lg">
          <p className="font-medium text-gray-700">Free Shipping</p>
          <p>Both ways</p>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">
          <p className="font-medium text-gray-700">7-Day Rental</p>
          <p>Includes buffer</p>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">
          <p className="font-medium text-gray-700">$100 Bond</p>
          <p>Fully refundable</p>
        </div>
      </div>
    </div>
  );
}
