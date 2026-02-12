import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Container } from '@/components/layout';

export function Hero() {
  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.pexels.com/photos/12737669/pexels-photo-12737669.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Elegant Indian Fashion"
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <Container className="relative z-10 flex flex-col items-center text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-md">
            Welcome to <br /> the borrowhood
          </h1>
          <p className="text-base md:text-xl text-white mb-10 max-w-2xl mx-auto font-medium tracking-wide drop-shadow-sm">
            Indian Ethnic Wear for Rent. <br className="hidden md:block" />
            Look your best for every occasion without the high price tag.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/shop">
              <Button size="lg" variant="primary" className="min-w-[240px] text-base font-bold tracking-[0.2em] h-14">
                BROWSE THE COLLECTION
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
