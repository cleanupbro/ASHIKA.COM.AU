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
    setIsOpen(false); 
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
    <div className="space-y-6 border-t border-gray-100 pt-8">
      {/* Date selector trigger */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-black mb-3">Event Date</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full flex items-center justify-between px-4 py-4 border transition-all',
            isOpen ? 'border-brand-black ring-1 ring-brand-black' : 'border-gray-200 hover:border-brand-black',
            selectedDate && !isOpen && 'border-brand-black'
          )}
        >
          <div className="flex items-center gap-3">
            <Calendar className={cn('w-4 h-4', selectedDate ? 'text-brand-black' : 'text-gray-400')} />
            <span className={cn('text-xs font-bold uppercase tracking-widest', selectedDate ? 'text-brand-black' : 'text-gray-400')}>
              {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select your event date'}
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-brand-black" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>

      {/* Calendar dropdown */}
      {isOpen && (
        <div className="animate-fade-in">
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
        <div className="p-4 bg-red-50 text-[10px] uppercase tracking-wider text-red-600 font-bold border border-red-100">
          {error}
        </div>
      )}

      {/* Add to Cart button */}
      <Button
        size="lg"
        className="w-full h-14 uppercase tracking-[0.2em] font-black text-[10px]"
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
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-50">
        <div className="text-center">
          <p className="font-black text-brand-black uppercase tracking-[0.1em] text-[9px] mb-1">Free Shipping</p>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest">Both ways</p>
        </div>
        <div className="text-center border-l border-gray-100">
          <p className="font-black text-brand-black uppercase tracking-[0.1em] text-[9px] mb-1">7-Day Rental</p>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest">Includes buffer</p>
        </div>
        <div className="text-center border-l border-gray-100">
          <p className="font-black text-brand-black uppercase tracking-[0.1em] text-[9px] mb-1">$100 Bond</p>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest">Refundable</p>
        </div>
      </div>
    </div>
  );
}
