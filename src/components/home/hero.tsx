import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Container } from '@/components/layout';
import { Truck, Sparkles, Shield } from 'lucide-react';

const trustBadges = [
  { icon: Sparkles, text: 'Free Dry Cleaning' },
  { icon: Truck, text: 'Free Shipping' },
  { icon: Shield, text: '$100 Refundable Bond' },
];

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Full-width hero image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1920&h=1280&fit=crop&q=80"
          alt="Woman wearing elegant Indian saree with traditional jewelry"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-2xl py-20 md:py-24">
          {/* Tagline */}
          <p className="text-teal-400 font-medium tracking-wide mb-4 uppercase text-sm">
            ASHIKA • Indian Wear Hire Australia
          </p>

          {/* Main headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Wear the culture.
            <br />
            <span className="text-gold-400">Return the stress.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl">
            Rent stunning sarees, lehengas & sherwanis for your special occasions.
            Free shipping Australia-wide. No dry cleaning required.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/shop">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8">
                Browse Collection
              </Button>
            </Link>
            <Link href="/#how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white/50 text-white hover:bg-white/10 px-8"
              >
                How It Works
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6">
            {trustBadges.map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 text-white/90">
                <badge.icon className="w-5 h-5 text-teal-400" />
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Subtle gradient at bottom for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
