'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, ChevronRight, User, ShoppingBag, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Shop All', href: '/shop', icon: ShoppingBag },
  { name: 'Sarees', href: '/shop?category=saree' },
  { name: 'Lehengas', href: '/shop?category=lehenga' },
  { name: 'Suits', href: '/shop?category=salwar_kameez' },
  { name: 'Groom', href: '/shop?category=sherwani' },
];

const secondaryNav = [
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'About Us', href: '/about' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact', icon: Phone },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-500 md:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-[70] transform transition-transform duration-500 ease-out md:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-teal/10">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-teal">Menu</span>
          <button
            onClick={onClose}
            className="p-2 text-brand-teal hover:text-brand-gold transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Navigation */}
        <div className="overflow-y-auto h-[calc(100%-80px)]">
          <div className="py-8">
            <h3 className="px-6 text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mb-4">
              Collections
            </h3>
            <nav>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-6 py-5 text-gray-900 hover:text-brand-teal transition-colors border-b border-brand-teal/5 last:border-0"
                >
                  <span className="text-xs font-bold uppercase tracking-widest">{item.name}</span>
                  <ChevronRight className="w-4 h-4 text-brand-teal" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t border-brand-teal/5 py-8">
            <h3 className="px-6 text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mb-4">
              Information
            </h3>
            <nav>
              {secondaryNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-6 py-5 text-gray-900 hover:text-brand-teal transition-colors"
                >
                  <span className="text-xs font-bold uppercase tracking-widest">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t border-gray-100 py-6">
            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center gap-3 px-6 py-4 text-black hover:bg-gray-50 transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">My Account</span>
            </Link>
          </div>

          {/* Contact info */}
          <div className="border-t border-gray-100 p-6 bg-white">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-4 font-bold">Contact Support</p>
            <a
              href="mailto:info@ashika.com.au"
              className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-black"
            >
              <Mail className="w-4 h-4" />
              info@ashika.com.au
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
