'use client';

import { useState, createContext, useContext, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionContextType {
  openItems: string[];
  toggleItem: (value: string) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

interface AccordionProps {
  children: ReactNode;
  type?: 'single' | 'multiple';
  defaultValue?: string[];
  className?: string;
}

export function Accordion({
  children,
  type = 'single',
  defaultValue = [],
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultValue);

  const toggleItem = (value: string) => {
    if (type === 'single') {
      setOpenItems((prev) => (prev.includes(value) ? [] : [value]));
    } else {
      setOpenItems((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={cn('divide-y divide-gray-100', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  return (
    <div className={cn('py-0', className)} data-value={value}>
      {children}
    </div>
  );
}

interface AccordionTriggerProps {
  children: ReactNode;
  value: string;
  className?: string;
}

export function AccordionTrigger({ children, value, className }: AccordionTriggerProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionTrigger must be used within Accordion');

  const { openItems, toggleItem } = context;
  const isOpen = openItems.includes(value);

  return (
    <button
      onClick={() => toggleItem(value)}
      className={cn(
        'flex items-center justify-between w-full text-left py-6 font-bold text-black uppercase tracking-widest hover:text-gray-600 transition-colors',
        className
      )}
    >
      <span className="text-sm">{children}</span>
      <ChevronDown
        className={cn(
          'w-4 h-4 text-black transition-transform duration-300',
          isOpen && 'rotate-180'
        )}
      />
    </button>
  );
}

interface AccordionContentProps {
  children: ReactNode;
  value: string;
  className?: string;
}

export function AccordionContent({ children, value, className }: AccordionContentProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionContent must be used within Accordion');

  const { openItems } = context;
  const isOpen = openItems.includes(value);

  return (
    <div
      className={cn(
        'overflow-hidden transition-all duration-300',
        isOpen ? 'max-h-[500px] opacity-100 pb-8' : 'max-h-0 opacity-0'
      )}
    >
      <div className={cn('text-sm text-gray-500 uppercase tracking-wide leading-relaxed', className)}>{children}</div>
    </div>
  );
}
