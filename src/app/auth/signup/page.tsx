'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/contexts/auth-context';

export default function SignupPage() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, name);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Container>
          <div className="max-w-md mx-auto py-24 text-center">
            <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-brand-black mb-4">
              Check Your Email
            </h1>
            <p className="text-sm text-gray-600 mb-8">
              We&apos;ve sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
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
              Create Account
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Join ASHIKA to start renting
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
                Full Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                className="w-full"
              />
            </div>

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
                placeholder="Min 6 characters"
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
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </Button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-brand-black hover:text-brand-gold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
