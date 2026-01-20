'use client';

import { useState } from 'react';
import { Container } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { Mail, Check } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <section className="py-16 md:py-24 bg-teal-900">
      <Container size="md">
        <div className="text-center">
          <Mail className="w-12 h-12 text-gold-400 mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Get 10% Off Your First Rental
          </h2>
          <p className="text-teal-200 mb-8 max-w-lg mx-auto">
            Subscribe to our newsletter for exclusive offers, new arrivals, and styling tips.
          </p>

          {isSubmitted ? (
            <div className="flex items-center justify-center gap-3 text-gold-400">
              <div className="w-10 h-10 rounded-full bg-gold-400/20 flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <span className="text-lg font-medium">You&apos;re subscribed! Check your inbox.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-gold-400"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  loading={isLoading}
                  className="whitespace-nowrap"
                >
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-teal-300 mt-3">
                No spam, unsubscribe anytime. Read our{' '}
                <a href="/privacy" className="underline hover:text-white">
                  Privacy Policy
                </a>
              </p>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
