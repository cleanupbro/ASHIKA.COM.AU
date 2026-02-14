'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { ProductCategory } from '@/types';

interface FilterSection {
  id: string;
  title: string;
  options: { value: string; label: string }[];
}

const filterSections: FilterSection[] = [
  {
    id: 'category',
    title: 'Category',
    options: [
      { value: 'saree', label: 'Sarees' },
      { value: 'lehenga', label: 'Lehengas' },
      { value: 'salwar_kameez', label: 'Salwar Kameez' },
      { value: 'sherwani', label: 'Sherwanis' },
    ],
  },
  {
    id: 'price',
    title: 'Price Range',
    options: [
      { value: '0-100', label: 'Under $100' },
      { value: '100-150', label: '$100 - $150' },
      { value: '150-200', label: '$150 - $200' },
      { value: '200+', label: 'Over $200' },
    ],
  },
  {
    id: 'color',
    title: 'Color',
    options: [
      { value: 'red', label: 'Red' },
      { value: 'blue', label: 'Blue' },
      { value: 'green', label: 'Green' },
      { value: 'pink', label: 'Pink' },
      { value: 'gold', label: 'Gold' },
      { value: 'maroon', label: 'Maroon' },
      { value: 'teal', label: 'Teal' },
      { value: 'black', label: 'Black' },
      { value: 'ivory', label: 'Ivory' },
    ],
  },
  {
    id: 'occasion',
    title: 'Occasion',
    options: [
      { value: 'wedding', label: 'Wedding' },
      { value: 'festival', label: 'Festival' },
      { value: 'party', label: 'Party' },
      { value: 'reception', label: 'Reception' },
      { value: 'sangeet', label: 'Sangeet' },
      { value: 'mehendi', label: 'Mehendi' },
    ],
  },
  {
    id: 'tier',
    title: 'Collection',
    options: [
      { value: 'premium', label: 'Premium' },
      { value: 'lite', label: 'Lite' },
    ],
  },
];

export interface Filters {
  category?: ProductCategory;
  priceMin?: number;
  priceMax?: number;
  colors?: string[];
  occasions?: string[];
  tier?: string;
}

interface ProductFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export function ProductFilters({
  filters,
  onFilterChange,
  isMobile,
  onClose,
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['category', 'price']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleFilterSelect = (sectionId: string, value: string) => {
    const newFilters = { ...filters };

    switch (sectionId) {
      case 'category':
        newFilters.category = value === newFilters.category ? undefined : value as ProductCategory;
        break;
      case 'price':
        if (value === '200+') {
          newFilters.priceMin = 200;
          newFilters.priceMax = undefined;
        } else {
          const [min, max] = value.split('-').map(Number);
          newFilters.priceMin = min;
          newFilters.priceMax = max;
        }
        break;
      case 'color':
        newFilters.colors = newFilters.colors?.includes(value)
          ? newFilters.colors.filter((c) => c !== value)
          : [...(newFilters.colors || []), value];
        break;
      case 'occasion':
        newFilters.occasions = newFilters.occasions?.includes(value)
          ? newFilters.occasions.filter((o) => o !== value)
          : [...(newFilters.occasions || []), value];
        break;
      case 'tier':
        newFilters.tier = newFilters.tier === value ? undefined : value;
        break;
    }

    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const activeFiltersCount = [
    filters.category,
    filters.priceMin || filters.priceMax,
    filters.colors?.length,
    filters.occasions?.length,
    filters.tier,
  ].filter(Boolean).length;

  return (
    <div className={cn('bg-white', isMobile && 'h-full flex flex-col')}>
      {/* Header (mobile only) */}
      {isMobile && (
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-black">Filters</h2>
          <button onClick={onClose} className="p-2 text-brand-black hover:text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Clear all */}
      <div className="px-1 py-8 border-b border-gray-100 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-black">Refine By</span>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-[9px] text-gray-400 hover:text-brand-black uppercase tracking-widest font-black transition-colors"
          >
            Clear all ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Filter sections */}
      <div className={cn('flex-1 overflow-y-auto px-1', isMobile && 'pb-24 px-8')}>
        {filterSections.map((section) => (
          <div key={section.id} className="border-b border-gray-100 last:border-0">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex items-center justify-between w-full py-6 text-left group"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-black group-hover:text-brand-tan transition-colors">
                {section.title}
              </span>
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-brand-black transition-transform duration-500',
                  expandedSections.includes(section.id) && 'rotate-180'
                )}
              />
            </button>

            {expandedSections.includes(section.id) && (
              <div className="pb-8 space-y-4">
                {section.options.map((option) => {
                  const isSelected = getIsSelected(section.id, option.value, filters);

                  return (
                    <label
                      key={option.value}
                      className="flex items-center gap-4 cursor-pointer group"
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-sm border flex items-center justify-center transition-all duration-300",
                        isSelected ? "bg-brand-black border-brand-black" : "bg-white border-gray-300 group-hover:border-brand-black"
                      )}>
                         {isSelected && <div className="w-1.5 h-1.5 bg-white" />}
                      </div>
                      <input
                        type={section.id === 'color' || section.id === 'occasion' ? 'checkbox' : 'radio'}
                        name={section.id}
                        checked={isSelected}
                        onChange={() => handleFilterSelect(section.id, option.value)}
                        className="hidden"
                      />
                      <span className={cn(
                        'text-[10px] font-black uppercase tracking-widest transition-colors',
                        isSelected ? 'text-brand-black' : 'text-gray-400 group-hover:text-brand-black'
                      )}>
                        {option.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Apply button (mobile only) */}
      {isMobile && (
        <div className="p-8 bg-white border-t border-gray-100">
          <Button onClick={onClose} variant="secondary" className="w-full h-12 text-[10px] font-black tracking-[0.3em]">
            VIEW RESULTS
          </Button>
        </div>
      )}
    </div>
  );
}

function getIsSelected(sectionId: string, value: string, filters: Filters): boolean {
  switch (sectionId) {
    case 'category':
      return filters.category === value;
    case 'price':
      if (value === '200+') {
        return filters.priceMin === 200 && !filters.priceMax;
      }
      const [min, max] = value.split('-').map(Number);
      return filters.priceMin === min && filters.priceMax === max;
    case 'color':
      return filters.colors?.includes(value) || false;
    case 'occasion':
      return filters.occasions?.includes(value) || false;
    case 'tier':
      return filters.tier === value;
    default:
      return false;
  }
}
