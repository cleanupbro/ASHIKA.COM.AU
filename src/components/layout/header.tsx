'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container } from './container';
import { CartButton } from '@/components/cart';

const navigation = [
  { name: 'COLLECTIONS', href: '/shop' },
  { name: "WOMEN'S INDIAN WEAR", href: '/shop' },
  { name: "MEN'S INDIAN WEAR", href: '/shop' },
  { name: 'ACCESSORIES', href: '/shop' },
  { name: 'HOW IT WORKS', href: '/#how-it-works' },
  { name: 'OUR STORY', href: '/about' },
  { name: 'CONTACT US', href: '/contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top Promotional Bar */}
      <div className="bg-brand-teal text-center py-2.5 px-4 text-[10px] md:text-xs font-bold tracking-[0.2em]">
        <span className="text-white uppercase">FREE 2 DAY SHIPPING AUSTRALIA WIDE</span>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'bg-white border-b border-gray-100 transition-all duration-300',
          isScrolled ? 'shadow-sm' : ''
        )}
      >
        <Container>
          <div className="flex items-center justify-between h-[70px] md:h-[90px]">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 z-10">
              <span className="font-sans text-xl md:text-2xl tracking-[0.3em] font-black text-brand-teal uppercase">
                ASHIKA
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-4 xxl:gap-6 absolute left-1/2 transform -translate-x-1/2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-[10px] font-bold tracking-widest text-gray-800 hover:text-brand-teal transition-colors uppercase"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center gap-4 z-10">
              <button
                className="p-2 text-black hover:text-gray-600 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>

              <Link
                href="/account"
                className="hidden md:block p-2 text-black hover:text-gray-600 transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5 stroke-[1.5]" />
              </Link>

              <CartButton />

              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 text-black hover:text-gray-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 stroke-[1.5]" />
                ) : (
                  <Menu className="w-6 h-6 stroke-[1.5]" />
                )}
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-300 bg-white absolute w-full border-b border-gray-100',
            isMobileMenuOpen ? 'max-h-[80vh] overflow-y-auto' : 'max-h-0'
          )}
        >
          <nav className="px-6 py-4 flex flex-col">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="py-4 text-[10px] font-black tracking-[0.2em] border-b border-brand-teal/5 last:border-0 uppercase text-gray-900 hover:text-brand-teal transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/account"
              className="py-4 text-sm font-semibold tracking-wide text-black border-t border-gray-100 uppercase"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Account
            </Link>
          </nav>
        </div>
      </header>
    </div>
  );
}
