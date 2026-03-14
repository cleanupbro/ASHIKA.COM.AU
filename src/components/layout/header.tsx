'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';
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
      <div className="bg-brand-tan text-center py-2 px-4 text-[9px] font-black tracking-[0.2em] transition-colors">
        <span className="text-brand-black uppercase">READY TO SHIP. FREE STYLING HELP.</span>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300',
          isScrolled ? 'py-2 shadow-sm' : 'py-4'
        )}
      >
        <Container>
          <div className="flex items-center justify-between h-[50px] md:h-[60px]">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 z-10">
              <span className="font-sans text-lg md:text-xl tracking-[0.4em] font-black text-brand-black uppercase">
                ASHIKA
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-6 xxl:gap-8 absolute left-1/2 transform -translate-x-1/2">
              {navigation.slice(0, 4).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-[9px] font-black tracking-[0.15em] text-brand-black hover:text-brand-tan transition-colors uppercase"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/shop"
                className="text-brand-black hover:text-brand-tan transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4 stroke-[2]" />
              </Link>
            </nav>

            {/* Right side icons */}
            <div className="flex items-center gap-3 z-10">
              <CartButton />

              {/* Mobile menu button */}
              <button
                className="xl:hidden p-2 text-brand-black hover:text-brand-tan transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 stroke-[2]" />
                ) : (
                  <Menu className="w-5 h-5 stroke-[2]" />
                )}
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'xl:hidden overflow-hidden transition-all duration-500 ease-in-out bg-white absolute w-full border-b border-gray-100',
            isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <nav className="px-8 py-10 flex flex-col gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[10px] font-black tracking-[0.2em] uppercase text-brand-black hover:text-brand-tan transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-6 border-t border-gray-100 flex gap-4">
              <Link
                href="/contact"
                className="text-[10px] font-black tracking-[0.2em] uppercase text-brand-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Need Help?
              </Link>
              <Link
                href="/faq"
                className="text-[10px] font-black tracking-[0.2em] uppercase text-brand-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
}
