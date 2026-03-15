import Link from 'next/link';
import { Container } from '@/components/layout';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white">
      <Container>
        <div className="text-center max-w-xl mx-auto">
          {/* 404 visual */}
          <div className="mb-10">
            <span className="text-8xl md:text-9xl font-black text-brand-black/10 uppercase tracking-[0.2em]">
              404
            </span>
          </div>

          {/* Message */}
          <h1 className="text-2xl md:text-4xl font-black text-brand-black uppercase tracking-[0.2em] mb-6">
            Page Not Found
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-12 leading-relaxed">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. <br />
            It might have been moved or doesn&apos;t exist.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/">
              <Button size="lg" className="min-w-[200px] h-14 text-sm font-bold tracking-[0.2em]">
                GO HOME
              </Button>
            </Link>
            <Link href="/shop">
              <Button size="lg" variant="outline" className="min-w-[200px] h-14 text-sm font-bold tracking-[0.2em]">
                BROWSE SHOP
              </Button>
            </Link>
          </div>

          {/* Help text */}
          <p className="mt-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Need help?{' '}
            <Link href="/contact" className="text-brand-gold hover:text-brand-black transition-colors">
              Contact us
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
