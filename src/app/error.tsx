'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white">
      <Container>
        <div className="text-center max-w-xl mx-auto">
          {/* Error icon */}
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-10 shadow-sm">
            <AlertTriangle className="w-10 h-10 text-red-600 stroke-[1.5]" />
          </div>

          {/* Message */}
          <h1 className="text-2xl md:text-4xl font-black text-brand-black uppercase tracking-[0.2em] mb-6">
            Something went wrong
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-12 leading-relaxed">
            We apologize for the inconvenience. An unexpected error has occurred. <br />
            Please try again or return to the homepage.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button onClick={reset} size="lg" className="min-w-[200px] h-14 text-sm font-bold tracking-[0.2em]">
              TRY AGAIN
            </Button>
            <Link href="/">
              <Button size="lg" variant="outline" className="min-w-[200px] h-14 text-sm font-bold tracking-[0.2em]">
                GO HOME
              </Button>
            </Link>
          </div>

          {/* Help text */}
          <p className="mt-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            If the problem persists, please{' '}
            <Link href="/contact" className="text-brand-gold hover:text-brand-black transition-colors">
              contact support
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
