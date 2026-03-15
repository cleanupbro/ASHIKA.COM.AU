import { Suspense } from 'react';
import { Metadata } from 'next';
import { ShopContent } from './shop-content';
import { Container } from '@/components/layout';
import { ProductGridSkeleton } from '@/components/ui';
import { getProducts } from '@/lib/supabase/queries/products';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse our collection of premium Indian ethnic wear for rent.',
};

export const revalidate = 60; // Revalidate every 60 seconds

function ShopLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <Container>
          <div className="py-8 md:py-12">
            <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-24 bg-gray-100 rounded animate-pulse mt-2" />
          </div>
        </Container>
      </div>
      <Container>
        <div className="py-8">
          <ProductGridSkeleton count={8} />
        </div>
      </Container>
    </div>
  );
}

async function ShopPageContent() {
  const products = await getProducts();
  return <ShopContent initialProducts={products} />;
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopLoading />}>
      <ShopPageContent />
    </Suspense>
  );
}
