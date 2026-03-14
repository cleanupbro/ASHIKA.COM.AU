import { Metadata } from 'next';
import { Container } from '@/components/layout';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'ASHIKA terms of service and rental agreement.',
};

export default function TermsPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-brand-teal py-20 md:py-24">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-white mb-6">
              Terms of Service
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
            <h2 className="text-xs font-black text-brand-teal border-b-2 border-brand-gold pb-3 inline-block mb-10">1. Acceptance of Terms</h2>
            <p className="mb-14 text-gray-600">
              By accessing and using ASHIKA (&quot;the Service&quot;), you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>

            <h2 className="text-xs font-black text-brand-teal border-b-2 border-brand-gold pb-3 inline-block mb-10">2. Rental Agreement</h2>
            <h3 className="text-[10px] font-black text-brand-gold mb-6 tracking-[0.2em]">2.1 Rental Period</h3>
            <p className="mb-8 text-gray-600">The standard rental period is 7 days, which includes:</p>
            <ul className="list-disc pl-5 mb-14 space-y-4 text-gray-600 marker:text-brand-teal">
              <li>3 days before your event (for delivery)</li>
              <li>Your event day</li>
              <li>3 days after your event (for returns)</li>
            </ul>

            <h3 className="text-[10px] font-black text-brand-gold mb-6 tracking-[0.2em]">2.2 Security Bond</h3>
            <p className="mb-14 text-gray-600">
              A refundable security bond of $100 AUD is pre-authorized at the time of booking.
              This bond covers potential damage, loss, or late returns.
            </p>

            <h2 className="text-xs font-black text-brand-teal border-b-2 border-brand-gold pb-3 inline-block mb-10">3. Care of Rented Items</h2>
            <p className="mb-8 text-gray-600">Customers are responsible for:</p>
            <ul className="list-disc pl-5 mb-14 space-y-4 text-gray-600 marker:text-brand-teal">
              <li>Handling all items with reasonable care</li>
              <li>Not altering, washing, or dry cleaning items</li>
              <li>Returning items in the same condition as received</li>
            </ul>

            <h2 className="text-xs font-black text-brand-teal border-b-2 border-brand-gold pb-3 inline-block mb-10">4. Shipping and Delivery</h2>
            <p className="mb-14 text-gray-600">
              We provide free express shipping both ways across Australia. Delivery times vary by location (1-5 business days).
            </p>

            <h2 className="text-xs font-black text-brand-teal border-b-2 border-brand-gold pb-3 inline-block mb-10">5. Contact</h2>
            <p className="mb-8 text-gray-600">
              For questions about these Terms of Service, please contact us at:
            </p>
            <ul className="space-y-4 text-gray-900 font-bold">
              <li className="flex items-center gap-4">
                 <span className="text-brand-gold">Email:</span>
                 <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="hover:text-brand-teal transition-colors">{SITE_CONFIG.supportEmail}</a>
              </li>
            </ul>
          </div>
        </Container>
      </section>
    </div>
  );
}
