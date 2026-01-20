'use client';

import { useState } from 'react';
import { ChevronDown, Truck, Calendar, Shield, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionItem({ title, icon: Icon, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-teal-600" />
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-500 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && <div className="pb-4 text-sm text-gray-600 space-y-2">{children}</div>}
    </div>
  );
}

export function RentalInfo() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-4 bg-cream border-b border-gray-100">
        <h3 className="font-display text-lg font-bold text-teal-900">
          How Rental Works
        </h3>
      </div>

      <div className="px-4">
        <AccordionItem title="7-Day Rental Period" icon={Calendar} defaultOpen>
          <p>Your rental includes a full 7-day period:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>3 days before</strong> your event: We ship the outfit</li>
            <li><strong>Event day:</strong> Wear it and shine!</li>
            <li><strong>3 days after:</strong> Return window</li>
          </ul>
        </AccordionItem>

        <AccordionItem title="Free Shipping Both Ways" icon={Truck}>
          <p>
            We provide free express shipping Australia-wide. Your outfit will arrive
            with a prepaid return label, making the return process hassle-free.
          </p>
          <p className="mt-2">
            Estimated delivery: 2-3 business days (metro), 3-5 business days (regional).
          </p>
        </AccordionItem>

        <AccordionItem title="$100 Refundable Bond" icon={Shield}>
          <p>
            A $100 security bond is pre-authorized (not charged) on your card at checkout.
            This protects against damage or late returns.
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Normal wear:</strong> Bond fully released</li>
            <li><strong>Minor damage:</strong> Partial capture may apply</li>
            <li><strong>Late return:</strong> $50 fee after 3-day grace period</li>
          </ul>
        </AccordionItem>

        <AccordionItem title="Easy Returns" icon={RotateCcw}>
          <p>
            Simply place the outfit in the provided garment bag, attach the prepaid
            label, and drop it at any Australia Post outlet.
          </p>
          <p className="mt-2 text-teal-700 font-medium">
            No dry cleaning required! We handle that for you.
          </p>
        </AccordionItem>
      </div>
    </div>
  );
}
