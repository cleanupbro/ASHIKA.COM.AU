'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/contexts/auth-context';

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await resetPassword(email);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Container>
          <div className="max-w-md mx-auto py-24 text-center">
            <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-brand-black mb-4">
              Check Your Email
            </h1>
            <p className="text-sm text-gray-600 mb-8">
              If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link.
            </p>
            <Link href="/auth/login">
              <Button variant="outline" className="text-[10px] font-black tracking-[0.3em]">
                BACK TO LOGIN
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto py-24">
          <div className="text-center mb-12">
            <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-brand-black mb-4">
              Reset Password
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Enter your email to receive a reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-widest p-4">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-14 text-[10px] font-black tracking-[0.3em] bg-brand-black text-white hover:bg-gray-800"
              disabled={loading}
            >
              {loading ? 'SENDING...' : 'SEND RESET LINK'}
            </Button>
          </form>

          <div className="mt-12 text-center">
            <Link href="/auth/login" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-brand-black transition-colors">
              Back to login
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
