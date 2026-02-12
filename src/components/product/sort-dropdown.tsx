'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = sortOptions.find((opt) => opt.value === value);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-0 py-2 bg-white transition-colors group"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-teal group-hover:text-brand-gold transition-colors">{currentOption?.label}</span>
        <ChevronDown
          className={cn(
            'w-3 h-3 text-brand-teal transition-transform duration-300 group-hover:text-brand-gold',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl border border-brand-teal/10 py-2 z-20">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                'flex items-center justify-between w-full px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-left transition-colors',
                option.value === value
                  ? 'text-brand-teal bg-teal-50'
                  : 'text-gray-400 hover:text-brand-teal hover:bg-teal-50/50'
              )}
            >
              {option.label}
              {option.value === value && <Check className="w-3 h-3 text-brand-teal" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
