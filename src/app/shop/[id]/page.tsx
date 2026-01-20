import { notFound } from 'next/navigation';
import { Container } from '@/components/layout';
import {
  ProductImages,
  ProductInfo,
  RentalInfo,
  ProductReviews,
  RelatedProducts,
} from '@/components/product';
import { getProductById, products } from '@/lib/mock-data/products';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = getProductById(resolvedParams.id);

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
  const product = getProductById(resolvedParams.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <Container>
          <nav className="py-4">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-teal-600">
                  <Home className="w-4 h-4" />
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <li>
                <Link href="/shop" className="text-gray-500 hover:text-teal-600">
                  Shop
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <li>
                <Link
                  href={`/shop?category=${product.category}`}
                  className="text-gray-500 hover:text-teal-600 capitalize"
                >
                  {product.category.replace('_', ' ')}
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <li className="text-gray-900 font-medium truncate max-w-[200px]">
                {product.name}
              </li>
            </ol>
          </nav>
        </Container>
      </div>

      {/* Product details */}
      <Container>
        <div className="py-8 md:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Images */}
            <ProductImages images={product.images} name={product.name} />

            {/* Right: Info */}
            <div className="space-y-8">
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
