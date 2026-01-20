import Link from 'next/link';
import { Container } from '@/components/layout';
import { Home, ArrowRight, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
      <Container>
        <div className="text-center max-w-md mx-auto">
          {/* 404 visual */}
          <div className="mb-8">
            <span className="font-display text-8xl md:text-9xl font-bold text-teal-200">
              404
            </span>
          </div>

          {/* Message */}
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
            It might have been moved or doesn&apos;t exist.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Search className="w-4 h-4" />
              Browse Shop
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Help text */}
          <p className="mt-8 text-sm text-gray-500">
            Need help?{' '}
            <Link href="/contact" className="text-teal-600 hover:text-teal-700">
              Contact us
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
