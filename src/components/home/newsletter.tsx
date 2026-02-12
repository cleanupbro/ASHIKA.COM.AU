'use client';

import { useState } from 'react';
import { Container } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { Check } from 'lucide-react';

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
    <section className="py-24 bg-white border-t border-gray-100">
      <Container size="md">
        <div className="text-center">
          <h2 className="text-2xl font-black text-black mb-4 uppercase tracking-widest">
            Join Our Community
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto text-sm">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>

          {isSubmitted ? (
            <div className="flex items-center justify-center gap-3 text-black">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wide">Subscribed!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-0">
                <Input
                  type="email"
                  placeholder="ENTER YOUR EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-50 border-r-0 focus:ring-0 focus:border-black rounded-none"
                />
                <Button
                  type="submit"
                  variant="primary"
                  loading={isLoading}
                  className="whitespace-nowrap rounded-none min-w-[140px]"
                >
                  SUBSCRIBE
                </Button>
              </div>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
