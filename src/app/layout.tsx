import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartProvider } from '@/contexts/cart-context';
import { CartDrawer } from '@/components/cart';

export const metadata: Metadata = {
  title: {
    default: 'ASHIKA | Indian Wear Hire Australia',
    template: '%s | ASHIKA',
  },
  description:
    'Rent premium Indian ethnic wear in Australia. Sarees, lehengas, sherwanis & more. Free shipping both ways. 7-day rental period.',
  keywords: [
    'Indian wear hire',
    'saree rental Australia',
    'lehenga rental',
    'Indian wedding dress hire',
    'ethnic wear rental Sydney',
  ],
  authors: [{ name: 'ASHIKA' }],
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://ashika.com.au',
    siteName: 'ASHIKA',
    title: 'ASHIKA | Indian Wear Hire Australia',
    description: 'Rent premium Indian ethnic wear in Australia. Wear the culture. Return the stress.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-body">
        <CartProvider>
          <Header />
          <main className="min-h-screen pt-16 md:pt-20">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
