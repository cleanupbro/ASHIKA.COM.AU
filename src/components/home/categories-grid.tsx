import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/layout';
import { STOCK_IMAGES } from '@/lib/mock-data/products';

const categories = [
  {
    name: 'Sarees',
    slug: 'saree',
    image: STOCK_IMAGES.categories.saree,
  },
  {
    name: 'Lehengas',
    slug: 'lehenga',
    image: STOCK_IMAGES.categories.lehenga,
  },
  {
    name: 'Suits',
    slug: 'salwar_kameez',
    image: STOCK_IMAGES.categories.salwar_kameez,
  },
  {
    name: 'Groom',
    slug: 'sherwani',
    image: STOCK_IMAGES.categories.sherwani,
  },
];

export function CategoriesGrid() {
  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-brand-teal mb-4">
            Shop Collections
          </h2>
          <div className="w-16 h-1 bg-brand-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="group relative aspect-[4/5] overflow-hidden block shadow-sm"
            >
              {/* Image */}
              <div className="absolute inset-0">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>

              {/* Text Overlay */}
              <div className="absolute inset-0 flex items-end justify-center p-6 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-brand-teal/70 transition-colors duration-500">
                <div className="bg-white/95 backdrop-blur-sm px-6 py-4 w-full text-center group-hover:bg-brand-gold transition-colors duration-300">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 group-hover:text-white transition-colors">
                    {category.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
