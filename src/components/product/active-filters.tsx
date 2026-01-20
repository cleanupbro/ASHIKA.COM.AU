'use client';

import { X } from 'lucide-react';
import { Filters } from './product-filters';

interface ActiveFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export function ActiveFilters({ filters, onFilterChange }: ActiveFiltersProps) {
  const activeFilters: { label: string; onRemove: () => void }[] = [];

  // Category
  if (filters.category) {
    activeFilters.push({
      label: filters.category.replace('_', ' '),
      onRemove: () => onFilterChange({ ...filters, category: undefined }),
    });
  }

  // Price range
  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    let label = '';
    if (filters.priceMin && filters.priceMax) {
      label = `$${filters.priceMin} - $${filters.priceMax}`;
    } else if (filters.priceMin) {
      label = `Over $${filters.priceMin}`;
    } else if (filters.priceMax) {
      label = `Under $${filters.priceMax}`;
    }
    activeFilters.push({
      label,
      onRemove: () => onFilterChange({ ...filters, priceMin: undefined, priceMax: undefined }),
    });
  }

  // Colors
  filters.colors?.forEach((color) => {
    activeFilters.push({
      label: color,
      onRemove: () =>
        onFilterChange({
          ...filters,
          colors: filters.colors?.filter((c) => c !== color),
        }),
    });
  });

  // Occasions
  filters.occasions?.forEach((occasion) => {
    activeFilters.push({
      label: occasion,
      onRemove: () =>
        onFilterChange({
          ...filters,
          occasions: filters.occasions?.filter((o) => o !== occasion),
        }),
    });
  });

  // Tier
  if (filters.tier) {
    activeFilters.push({
      label: filters.tier,
      onRemove: () => onFilterChange({ ...filters, tier: undefined }),
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeFilters.map((filter, index) => (
        <button
          key={`${filter.label}-${index}`}
          onClick={filter.onRemove}
          className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm hover:bg-teal-100 transition-colors capitalize"
        >
          {filter.label}
          <X className="w-3 h-3" />
        </button>
      ))}
      {activeFilters.length > 1 && (
        <button
          onClick={() => onFilterChange({})}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
