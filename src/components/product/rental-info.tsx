'use client';

import { useState } from 'react';
import { ChevronDown, Truck, Calendar, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-6 text-left group"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-black group-hover:text-brand-tan transition-colors">
          {title}
        </span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-brand-black transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div className="pb-8 text-xs text-gray-500 leading-relaxed font-medium tracking-wide">
          {children}
        </div>
      )}
    </div>
  );
}

export function RentalInfo() {
  return (
    <div className="pt-2">
      <AccordionItem title="How It Works" defaultOpen>
        <div className="space-y-6">
          <div className="flex gap-4">
            <Calendar className="w-4 h-4 flex-shrink-0 text-brand-black" />
            <div>
              <p className="font-black text-brand-black mb-1 uppercase tracking-widest text-[10px]">7-Day Rental</p>
              <p>Receive 3 days before event. Return 3 days after.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Truck className="w-4 h-4 flex-shrink-0 text-brand-black" />
            <div>
              <p className="font-black text-brand-black mb-1 uppercase tracking-widest text-[10px]">Free Shipping & Returns</p>
              <p>Express delivery Australia-wide. Prepaid return satchel included.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <RotateCcw className="w-4 h-4 flex-shrink-0 text-brand-black" />
            <div>
              <p className="font-black text-brand-black mb-1 uppercase tracking-widest text-[10px]">Dry Cleaning Included</p>
              <p>We handle the cleaning. Just pack and return.</p>
            </div>
          </div>
        </div>
      </AccordionItem>

      <AccordionItem title="Bond & Insurance">
        <p className="mb-4">
          A $100 security bond is pre-authorized on your card at checkout. This is not a charge, but a hold that is released upon safe return of the garment.
        </p>
        <p>
          Minor wear and tear (e.g., loose beads, small stains) is covered. Significant damage or theft will be charged at cost.
        </p>
      </AccordionItem>

      <AccordionItem title="Delivery Time">
        <p>
          <strong>Metro Areas:</strong> 1-2 business days<br />
          <strong>Regional Areas:</strong> 2-4 business days
        </p>
        <p className="mt-4 text-[9px] text-gray-400 uppercase tracking-wider">
          We recommend booking your rental to start 3 days before your event to ensure plenty of time for delivery.
        </p>
      </AccordionItem>
    </div>
  );
}
