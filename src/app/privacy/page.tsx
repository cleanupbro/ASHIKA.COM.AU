import { Metadata } from 'next';
import { Container } from '@/components/layout';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ASHIKA privacy policy - how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-brand-teal py-20 md:py-24">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-[10px] md:text-xs text-brand-cream font-bold uppercase tracking-[0.3em]">
              Last updated: January 2026
            </p>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-24 md:py-32">
        <Container size="md">
          <div className="prose prose-sm prose-gray max-w-none uppercase tracking-widest font-medium leading-relaxed">
            <h2 className="text-xs font-black text-brand-teal border-b-2 border-brand-gold pb-3 inline-block mb-10">1. Introduction</h2>
            <p className="mb-14 text-gray-600">
              ASHIKA (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy and is committed to
              protecting your personal information. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you use our
              website and services.
            </p>

            <h2 className="text-xs font-black text-brand-teal border-b-2 border-brand-gold pb-3 inline-block mb-10">2. Information We Collect</h2>
            <h3 className="text-[10px] font-black text-brand-gold mb-6 tracking-[0.2em]">2.1 Personal Information</h3>
            <p className="mb-8 text-gray-600">We may collect the following personal information:</p>
            <ul className="list-disc pl-5 mb-14 space-y-4 text-gray-600 marker:text-brand-teal">
              <li>Name and contact details (email, phone number)</li>
              <li>Shipping and billing addresses</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Account credentials</li>
              <li>Order history and preferences</li>
              <li>Body measurements for sizing purposes</li>
            </ul>

            <h3 className="text-[10px] font-black text-brand-gold mb-6 tracking-[0.2em]">2.2 Automatically Collected Information</h3>
            <p className="mb-8 text-gray-600">When you visit our website, we may automatically collect:</p>
            <ul className="list-disc pl-5 mb-14 space-y-4 text-gray-600 marker:text-brand-teal">
              <li>IP address and browser type</li>
              <li>Device information</li>
              <li>Pages visited and time spent on site</li>
              <li>Referring website</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2 className="text-xs font-black text-brand-teal border-b-2 border-brand-gold pb-3 inline-block mb-10">3. How We Use Your Information</h2>
            <p className="mb-8 text-gray-600">We use your information to:</p>
            <ul className="list-disc pl-5 mb-14 space-y-4 text-gray-600 marker:text-brand-teal">
              <li>Process and fulfill your rental orders</li>
              <li>Communicate with you about your orders</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-xs font-black text-brand-teal border-b-2 border-brand-gold pb-3 inline-block mb-10">4. Information Sharing</h2>
            <p className="mb-14 text-gray-600">
              We do not sell your personal information to third parties. We only share with service providers (Australia Post, Stripe) or as required by law.
            </p>

            <h2 className="text-xs font-black text-brand-teal border-b-2 border-brand-gold pb-3 inline-block mb-10">5. Contact Us</h2>
            <p className="mb-8 text-gray-600">
              If you have questions about this Privacy Policy or our data practices,
              please contact us:
            </p>
            <ul className="space-y-4 text-gray-900 font-bold">
              <li className="flex items-center gap-4">
                 <span className="text-brand-gold">Email:</span>
                 <a href={`mailto:${SITE_CONFIG.privacyEmail}`} className="hover:text-brand-teal transition-colors">{SITE_CONFIG.privacyEmail}</a>
              </li>
              <li className="flex items-center gap-4">
                 <span className="text-brand-gold">Address:</span>
                 <span>{SITE_CONFIG.location}</span>
              </li>
            </ul>
          </div>
        </Container>
      </section>
    </div>
  );
}
