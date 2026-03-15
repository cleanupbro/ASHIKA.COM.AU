'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/contexts/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      router.push('/shop');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto py-24">
          <div className="text-center mb-12">
            <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-brand-black mb-4">
              Welcome Back
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Sign in to your ASHIKA account
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

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full"
              />
            </div>

            <div className="flex justify-end">
              <Link
                href="/auth/reset"
                className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand-black transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-14 text-[10px] font-black tracking-[0.3em] bg-brand-black text-white hover:bg-gray-800"
              disabled={loading}
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </Button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-brand-black hover:text-brand-gold transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
