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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-brand-offwhite border-b border-gray-100">
        <Container>
          <div className="py-16 md:py-24 flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-[0.25em] text-brand-black mb-6 hero-title">
              {getCategoryTitle()}
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] max-w-lg leading-relaxed">
              Explore our curated selection of {filteredProducts.length} premium Indian pieces. <br className="hidden md:block" />
              Wear the culture. Return the stress.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-16">
          {/* Mobile filter button & sort */}
          <div className="flex items-center justify-between gap-4 mb-12 lg:hidden">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 px-8 py-3 bg-brand-black text-white shadow-xl"
            >
              <Filter className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
            </button>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          <div className="flex gap-16">
            {/* Desktop sidebar filters */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-40">
                <ProductFilters filters={filters} onFilterChange={setFilters} />
              </div>
            </aside>

            {/* Product grid */}
            <div className="flex-1">
              {/* Desktop sort and active filters */}
              <div className="hidden lg:flex items-center justify-between mb-12 border-b border-gray-100 pb-6">
                <div className="flex-1">
                  <ActiveFilters filters={filters} onFilterChange={setFilters} />
                </div>
                <SortDropdown value={sortBy} onChange={setSortBy} />
              </div>

              {/* Mobile active filters */}
              <div className="lg:hidden mb-10">
                <ActiveFilters filters={filters} onFilterChange={setFilters} />
              </div>

              <ProductGrid products={filteredProducts} />
            </div>
          </div>
        </div>
      </Container>

      {/* Mobile filter drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl animate-slide-in-right">
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
