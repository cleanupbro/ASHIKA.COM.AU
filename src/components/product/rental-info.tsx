'use client';

import { useState } from 'react';
import { ChevronDown, Truck, Calendar, Shield, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-brand-teal/10 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-5 text-left group"
      >
        <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 group-hover:text-brand-teal transition-colors">
          {title}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-brand-teal transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div className="pb-6 text-sm text-gray-600 leading-relaxed font-medium">
          {children}
        </div>
      )}
    </div>
  );
}

export function RentalInfo() {
  return (
    <div className="pt-6">
      <AccordionItem title="How It Works" defaultOpen>
        <div className="space-y-5">
          <div className="flex gap-4">
            <Calendar className="w-5 h-5 flex-shrink-0 text-brand-teal" />
            <div>
              <p className="font-bold text-gray-900 mb-1 uppercase tracking-wide text-xs">7-Day Rental</p>
              <p>Receive 3 days before event. Return 3 days after.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Truck className="w-5 h-5 flex-shrink-0 text-brand-teal" />
            <div>
              <p className="font-bold text-gray-900 mb-1 uppercase tracking-wide text-xs">Free Shipping & Returns</p>
              <p>Express delivery Australia-wide. Prepaid return satchel included.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <RotateCcw className="w-5 h-5 flex-shrink-0 text-brand-teal" />
            <div>
              <p className="font-bold text-gray-900 mb-1 uppercase tracking-wide text-xs">Dry Cleaning Included</p>
              <p>We handle the cleaning. Just pack and return.</p>
            </div>
          </div>
        </div>
      </AccordionItem>

      <AccordionItem title="Bond & Insurance">
        <p className="mb-2">
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
        <p className="mt-2 text-xs text-gray-500">
          We recommend booking your rental to start 3 days before your event to ensure plenty of time for delivery.
        </p>
      </AccordionItem>
    </div>
  );
}
