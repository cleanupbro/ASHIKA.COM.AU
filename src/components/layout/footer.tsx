import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';
import { Container } from './container';

const footerLinks = {
  ashika: [
    { name: 'About Us', href: '/about' },
    { name: 'The Ashika Story', href: '/story' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Sustainability', href: '/sustainability' },
  ],
  help: [
    { name: 'Help Center', href: '/help' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Delivery & Returns', href: '/delivery' },
    { name: 'Fit Guarantee', href: '/fit-guarantee' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-brand-offwhite pt-24 pb-12 border-t border-gray-100">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* ASHIKA Column */}
          <div>
            <span className="font-sans text-lg tracking-[0.4em] font-black text-brand-black uppercase block mb-8">
              ASHIKA
            </span>
            <ul className="space-y-3">
              {footerLinks.ashika.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand-black transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* HELP Column */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-black mb-8">
              CUSTOMER CARE
            </h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand-black transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT Column */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-black mb-8">
              CONTACT US
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose mb-6">
              HELL0@ASHIKA.COM.AU <br />
              SYDNEY, AUSTRALIA
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 border border-gray-200 rounded-full text-brand-black hover:bg-brand-black hover:text-white transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 border border-gray-200 rounded-full text-brand-black hover:bg-brand-black hover:text-white transition-all">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* NEWSLETTER Column */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-black mb-8">
              SIGN UP FOR ALL THINGS ASHIKA
            </h3>
            <form className="relative">
              <input
                type="email"
                placeholder="enter your email address"
                className="w-full bg-transparent border-b border-gray-300 py-3 text-[10px] font-bold tracking-widest uppercase focus:outline-none focus:border-brand-black transition-colors"
              />
              <button
                type="button"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-brand-black hover:translate-x-1 transition-transform"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8">
            <Link href="/terms" className="text-[9px] font-bold text-gray-400 hover:text-brand-black uppercase tracking-widest">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-[9px] font-bold text-gray-400 hover:text-brand-black uppercase tracking-widest">
              Privacy Policy
            </Link>
          </div>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            &copy; 2024 ASHIKA.inc. All Rights Reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
