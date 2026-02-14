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
        className="flex items-center gap-6 px-0 py-2 bg-transparent transition-colors group border-b border-transparent hover:border-brand-black"
      >
        <div className="flex flex-col items-start">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">SortBy</span>
          <span className="text-[10px] font-black uppercase tracking-[0.1em] text-brand-black">{currentOption?.label}</span>
        </div>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-brand-black transition-transform duration-500',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-64 bg-white shadow-2xl border border-gray-100 py-3 z-50 animate-fade-in">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                'flex items-center justify-between w-full px-8 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-left transition-colors',
                option.value === value
                  ? 'text-brand-black bg-brand-offwhite'
                  : 'text-gray-400 hover:text-brand-black hover:bg-brand-offwhite'
              )}
            >
              {option.label}
              {option.value === value && <Check className="w-3.5 h-3.5 text-brand-black" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
