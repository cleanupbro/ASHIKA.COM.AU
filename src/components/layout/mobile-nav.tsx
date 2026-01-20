'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, ChevronRight, User, ShoppingBag, HelpCircle, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Shop All', href: '/shop', icon: ShoppingBag },
  { name: 'Sarees', href: '/shop?category=saree' },
  { name: 'Lehengas', href: '/shop?category=lehenga' },
  { name: 'Salwar Kameez', href: '/shop?category=salwar_kameez' },
  { name: 'Sherwanis', href: '/shop?category=sherwani' },
];

const secondaryNav = [
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'About Us', href: '/about' },
  { name: 'FAQ', href: '/faq', icon: HelpCircle },
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
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ease-out md:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="font-display text-xl font-bold text-teal-900">Menu</span>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="overflow-y-auto h-[calc(100%-64px)]">
          <div className="py-4">
            <h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Shop by Category
            </h3>
            <nav>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                >
                  <span className="font-medium">{item.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t border-gray-100 py-4">
            <h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Information
            </h3>
            <nav>
              {secondaryNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t border-gray-100 py-4">
            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="font-medium">My Account</span>
            </Link>
          </div>

          {/* Contact info */}
          <div className="border-t border-gray-100 p-4 bg-gray-50">
            <p className="text-xs text-gray-500 mb-3">Need help?</p>
            <a
              href="mailto:info@ashika.com.au"
              className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700"
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
