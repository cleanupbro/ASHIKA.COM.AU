import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
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
    <footer className="bg-[#F8FBFA] pt-24 pb-12 border-t border-brand-teal/10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* ASHIKA Column */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand-teal mb-8">
              ASHIKA
            </h3>
            <ul className="space-y-4">
              {footerLinks.ashika.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-brand-teal transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* HELP Column */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand-teal mb-8">
              CUSTOMER CARE
            </h3>
            <ul className="space-y-4">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-brand-teal transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* FOLLOW US Column */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand-teal mb-8">
              STAY CONNECTED
            </h3>
            <div className="flex gap-6 mb-8">
              <a href="#" className="text-gray-400 hover:text-brand-teal transition-colors">
                <Instagram className="w-6 h-6 stroke-[1.5]" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-teal transition-colors">
                <Facebook className="w-6 h-6 stroke-[1.5]" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-teal transition-colors">
                <Twitter className="w-6 h-6 stroke-[1.5]" />
              </a>
            </div>
            <div className="bg-white p-6 shadow-sm border border-brand-teal/5">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold mb-2">
                 Need styling help?
               </h4>
               <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                 Chat with our experts <br /> Monday - Friday
               </p>
            </div>
          </div>

          {/* NEWSLETTER Column */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand-teal mb-8">
              THE BORROWHOOD
            </h3>
            <p className="text-xs font-medium text-gray-500 mb-6 uppercase tracking-widest leading-relaxed">
              Sign up for style updates & <br /> exclusive early access.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full px-5 py-4 bg-white border border-gray-100 text-[10px] font-bold tracking-widest focus:outline-none focus:border-brand-teal transition-colors shadow-sm"
              />
              <button
                type="button"
                className="w-full bg-brand-teal text-white px-5 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-teal-700 transition-colors shadow-sm"
              >
                JOIN US
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-brand-teal/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-8">
            <Link href="/terms" className="text-[10px] font-bold text-gray-400 hover:text-brand-teal uppercase tracking-widest transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-[10px] font-bold text-gray-400 hover:text-brand-teal uppercase tracking-widest transition-colors">
              Privacy
            </Link>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} ASHIKA. WEAR THE CULTURE. RETURN THE STRESS.
          </p>
        </div>
      </Container>
    </footer>
  );
}
