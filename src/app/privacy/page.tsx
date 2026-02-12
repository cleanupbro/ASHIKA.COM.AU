import { Metadata } from 'next';
import { Container } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ASHIKA privacy policy - how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-16 md:py-24">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest text-black mb-4">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500 uppercase tracking-widest">
              Last updated: January 2026
            </p>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <Container size="md">
          <div className="prose prose-sm prose-gray max-w-none uppercase tracking-wide leading-relaxed">
            <h2 className="text-sm font-bold text-black border-b border-black pb-2 inline-block mb-8">1. Introduction</h2>
            <p className="mb-12">
              ASHIKA (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy and is committed to
              protecting your personal information. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you use our
              website and services.
            </p>

            <h2 className="text-sm font-bold text-black border-b border-black pb-2 inline-block mb-8">2. Information We Collect</h2>
            <h3 className="text-xs font-bold text-black mb-4">2.1 Personal Information</h3>
            <p className="mb-6">We may collect the following personal information:</p>
            <ul className="list-disc pl-5 mb-12 space-y-2">
              <li>Name and contact details (email, phone number)</li>
              <li>Shipping and billing addresses</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Account credentials</li>
              <li>Order history and preferences</li>
              <li>Body measurements for sizing purposes</li>
            </ul>

            <h3 className="text-xs font-bold text-black mb-4">2.2 Automatically Collected Information</h3>
            <p className="mb-6">When you visit our website, we may automatically collect:</p>
            <ul className="list-disc pl-5 mb-12 space-y-2">
              <li>IP address and browser type</li>
              <li>Device information</li>
              <li>Pages visited and time spent on site</li>
              <li>Referring website</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2 className="text-sm font-bold text-black border-b border-black pb-2 inline-block mb-8">3. How We Use Your Information</h2>
            <p className="mb-6">We use your information to:</p>
            <ul className="list-disc pl-5 mb-12 space-y-2">
              <li>Process and fulfill your rental orders</li>
              <li>Communicate with you about your orders</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-sm font-bold text-black border-b border-black pb-2 inline-block mb-8">4. Information Sharing</h2>
            <p className="mb-12">
              We do not sell your personal information to third parties. We only share with service providers (Australia Post, Stripe) or as required by law.
            </p>

            <h2 className="text-sm font-bold text-black border-b border-black pb-2 inline-block mb-8">5. Contact Us</h2>
            <p className="mb-6">
              If you have questions about this Privacy Policy or our data practices,
              please contact us:
            </p>
            <ul className="space-y-2">
              <li>Email: privacy@ashika.com.au</li>
              <li>Phone: +61 400 000 000</li>
              <li>Address: Sydney, NSW, Australia</li>
            </ul>
          </div>
        </Container>
      </section>
    </div>
  );
}
