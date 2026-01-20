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
        newFilters.category = value as ProductCategory;
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
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-display text-lg font-bold text-teal-900">Filters</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Clear all */}
      {activeFiltersCount > 0 && (
        <div className="p-4 border-b">
          <button
            onClick={clearAllFilters}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            Clear all ({activeFiltersCount})
          </button>
        </div>
      )}

      {/* Filter sections */}
      <div className={cn('flex-1 overflow-y-auto', isMobile && 'pb-24')}>
        {filterSections.map((section) => (
          <div key={section.id} className="border-b border-gray-100">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex items-center justify-between w-full p-4 text-left"
            >
              <span className="font-medium text-gray-900">{section.title}</span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-gray-500 transition-transform',
                  expandedSections.includes(section.id) && 'rotate-180'
                )}
              />
            </button>

            {expandedSections.includes(section.id) && (
              <div className="px-4 pb-4 space-y-2">
                {section.options.map((option) => {
                  const isSelected = getIsSelected(section.id, option.value, filters);

                  return (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type={section.id === 'color' || section.id === 'occasion' ? 'checkbox' : 'radio'}
                        name={section.id}
                        checked={isSelected}
                        onChange={() => handleFilterSelect(section.id, option.value)}
                        className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500 rounded"
                      />
                      <span className={cn(
                        'text-sm transition-colors',
                        isSelected ? 'text-teal-600 font-medium' : 'text-gray-600 group-hover:text-gray-900'
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
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
          <Button onClick={onClose} className="w-full">
            Show Results
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
