import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/layout';
import { STOCK_IMAGES } from '@/lib/mock-data/products';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Sarees',
    slug: 'saree',
    description: 'Traditional & contemporary',
    image: STOCK_IMAGES.categories.saree,
  },
  {
    name: 'Lehengas',
    slug: 'lehenga',
    description: 'Bridal & festive',
    image: STOCK_IMAGES.categories.lehenga,
  },
  {
    name: 'Salwar Kameez',
    slug: 'salwar_kameez',
    description: 'Elegant & comfortable',
    image: STOCK_IMAGES.categories.salwar_kameez,
  },
  {
    name: 'Sherwanis',
    slug: 'sherwani',
    description: 'For the groom',
    image: STOCK_IMAGES.categories.sherwani,
  },
];

export function CategoriesGrid() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-teal-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of Indian ethnic wear for every occasion
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100"
            >
              {/* Image */}
              <div className="absolute inset-0">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-white/80 mb-3">
                  {category.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-gold-400 group-hover:gap-2 transition-all">
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
