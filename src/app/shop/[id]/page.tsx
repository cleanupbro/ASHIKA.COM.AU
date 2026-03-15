import { notFound } from 'next/navigation';
import { Container } from '@/components/layout';
import {
  ProductImages,
  ProductInfo,
  RentalInfo,
  ProductReviews,
} from '@/components/product';
import { RelatedProducts } from '@/components/product/related-products';
import { getProductById, getAllProductIds } from '@/lib/supabase/queries/products';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const revalidate = 60;
export const dynamicParams = true;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const ids = await getAllProductIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | ASHIKA`,
      description: `Rent ${product.name} for $${product.rental_price}/week. ${product.description}`,
      images: [product.thumbnail],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <Container>
          <nav className="py-6">
            <ol className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
              <li>
                <Link href="/" className="text-gray-400 hover:text-brand-black transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-brand-black transition-colors">
                  Shop
                </Link>
              </li>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <li>
                <Link
                  href={`/shop?category=${product.category}`}
                  className="text-gray-400 hover:text-brand-black transition-colors"
                >
                  {product.category.replace('_', ' ')}
                </Link>
              </li>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <li className="text-brand-black truncate max-w-[200px]">
                {product.name}
              </li>
            </ol>
          </nav>
        </Container>
      </div>

      {/* Product details */}
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left: Images */}
            <ProductImages images={product.images} name={product.name} />

            {/* Right: Info */}
            <div className="space-y-10">
              <ProductInfo product={product} />
              <RentalInfo />
            </div>
          </div>
        </div>

        {/* Customer reviews */}
        <div className="border-t border-gray-100">
          <ProductReviews productId={product.id} />
        </div>
      </Container>

      {/* Related products */}
      <RelatedProducts
        currentProductId={product.id}
        category={product.category}
      />
    </div>
  );
}
