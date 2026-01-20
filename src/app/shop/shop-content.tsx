'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/layout';
import {
  ProductGrid,
  ProductFilters,
  SortDropdown,
  ActiveFilters,
  type Filters,
  type SortOption,
} from '@/components/product';
import { products as allProducts } from '@/lib/mock-data/products';
import { ProductCategory } from '@/types';
import { Filter } from 'lucide-react';

export function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as ProductCategory | null;

  const [filters, setFilters] = useState<Filters>({
    category: initialCategory || undefined,
  });
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Apply filters
    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.priceMin !== undefined) {
      result = result.filter((p) => p.rental_price >= filters.priceMin!);
    }
    if (filters.priceMax !== undefined) {
      result = result.filter((p) => p.rental_price <= filters.priceMax!);
    }
    if (filters.colors?.length) {
      result = result.filter((p) =>
        filters.colors!.some((c) => p.colors.includes(c) || p.color === c)
      );
    }
    if (filters.occasions?.length) {
      result = result.filter((p) =>
        filters.occasions!.some((o) => p.occasion.includes(o))
      );
    }
    if (filters.tier) {
      result = result.filter((p) => p.tier === filters.tier);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.rental_price - b.rental_price);
        break;
      case 'price-high':
        result.sort((a, b) => b.rental_price - a.rental_price);
        break;
      case 'popular':
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case 'newest':
      default:
        // Already in creation order
        break;
    }

    return result;
  }, [filters, sortBy]);

  const getCategoryTitle = () => {
    if (filters.category) {
      const titles: Record<ProductCategory, string> = {
        saree: 'Sarees',
        lehenga: 'Lehengas',
        salwar_kameez: 'Salwar Kameez',
        sherwani: 'Sherwanis',
      };
      return titles[filters.category];
    }
    return 'All Products';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <Container>
          <div className="py-8 md:py-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-teal-900">
              {getCategoryTitle()}
            </h1>
            <p className="text-gray-600 mt-2">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-8">
          {/* Mobile filter button & sort */}
          <div className="flex items-center justify-between gap-4 mb-6 lg:hidden">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </button>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          {/* Active filters */}
          <div className="mb-6">
            <ActiveFilters filters={filters} onFilterChange={setFilters} />
          </div>

          <div className="flex gap-8">
            {/* Desktop sidebar filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-xl border border-gray-100 overflow-hidden">
                <ProductFilters filters={filters} onFilterChange={setFilters} />
              </div>
            </aside>

            {/* Product grid */}
            <div className="flex-1">
              {/* Desktop sort */}
              <div className="hidden lg:flex justify-end mb-6">
                <SortDropdown value={sortBy} onChange={setSortBy} />
              </div>

              <ProductGrid products={filteredProducts} />
            </div>
          </div>
        </div>
      </Container>

      {/* Mobile filter drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white">
            <ProductFilters
              filters={filters}
              onFilterChange={setFilters}
              isMobile
              onClose={() => setIsMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
