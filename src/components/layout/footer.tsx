import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone } from 'lucide-react';
import { Container } from './container';

const footerLinks = {
  shop: [
    { name: 'Sarees', href: '/shop?category=saree' },
    { name: 'Lehengas', href: '/shop?category=lehenga' },
    { name: 'Salwar Kameez', href: '/shop?category=salwar_kameez' },
    { name: 'Sherwanis', href: '/shop?category=sherwani' },
  ],
  help: [
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Size Guide', href: '/size-guide' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-teal-950 text-white">
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="inline-block">
                <span className="font-display text-2xl font-bold text-white">
                  ASHIKA
                </span>
              </Link>
              <p className="mt-3 text-sm text-teal-200">
                Indian Wear Hire Australia
              </p>
              <p className="mt-2 text-sm text-teal-300 italic">
                &quot;Wear the culture. Return the stress.&quot;
              </p>

              {/* Social */}
              <div className="flex gap-4 mt-6">
                <a
                  href="https://instagram.com/ashika.com.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-300 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com/ashika.com.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-300 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Shop */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-200">
                Shop
              </h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-teal-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-200">
                Help
              </h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.help.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-teal-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-200">
                Contact
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href="mailto:info@ashika.com.au"
                    className="flex items-center gap-2 text-sm text-teal-300 hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    info@ashika.com.au
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+61400000000"
                    className="flex items-center gap-2 text-sm text-teal-300 hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    +61 400 000 000
                  </a>
                </li>
                <li className="pt-2">
                  <span className="text-sm text-teal-300">
                    Sydney, Australia
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-teal-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-teal-400">
              &copy; {new Date().getFullYear()} ASHIKA. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-teal-400">
                Australian-owned & operated
              </span>
              <span className="text-lg">🇦🇺</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
