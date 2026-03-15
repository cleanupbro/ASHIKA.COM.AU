import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartProvider } from '@/contexts/cart-context';
import { AuthProvider } from '@/contexts/auth-context';
import { CartDrawer } from '@/components/cart';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || SITE_CONFIG.url),
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
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: 'ASHIKA | Indian Wear Hire Australia',
    description: `Rent premium Indian ethnic wear in Australia. ${SITE_CONFIG.tagline}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="min-h-screen pt-[120px]">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
