import { Metadata } from 'next';
import { Container } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'ASHIKA terms of service and rental agreement.',
};

export default function TermsPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-16 md:py-24">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest text-black mb-4">
              Terms of Service
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
            <h2 className="text-sm font-bold text-black border-b border-black pb-2 inline-block mb-8">1. Acceptance of Terms</h2>
            <p className="mb-12">
              By accessing and using ASHIKA (&quot;the Service&quot;), you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>

            <h2 className="text-sm font-bold text-black border-b border-black pb-2 inline-block mb-8">2. Rental Agreement</h2>
            <h3 className="text-xs font-bold text-black mb-4">2.1 Rental Period</h3>
            <p className="mb-6">The standard rental period is 7 days, which includes:</p>
            <ul className="list-disc pl-5 mb-12 space-y-2">
              <li>3 days before your event (for delivery)</li>
              <li>Your event day</li>
              <li>3 days after your event (for returns)</li>
            </ul>

            <h3 className="text-xs font-bold text-black mb-4">2.2 Security Bond</h3>
            <p className="mb-12">
              A refundable security bond of $100 AUD is pre-authorized at the time of booking.
              This bond covers potential damage, loss, or late returns.
            </p>

            <h2 className="text-sm font-bold text-black border-b border-black pb-2 inline-block mb-8">3. Care of Rented Items</h2>
            <p className="mb-6">Customers are responsible for:</p>
            <ul className="list-disc pl-5 mb-12 space-y-2">
              <li>Handling all items with reasonable care</li>
              <li>Not altering, washing, or dry cleaning items</li>
              <li>Returning items in the same condition as received</li>
            </ul>

            <h2 className="text-sm font-bold text-black border-b border-black pb-2 inline-block mb-8">4. Shipping and Delivery</h2>
            <p className="mb-12">
              We provide free express shipping both ways across Australia. Delivery times vary by location (1-5 business days).
            </p>

            <h2 className="text-sm font-bold text-black border-b border-black pb-2 inline-block mb-8">5. Contact</h2>
            <p className="mb-6">
              For questions about these Terms of Service, please contact us at:
            </p>
            <ul className="space-y-2">
              <li>Email: info@ashika.com.au</li>
              <li>Phone: +61 400 000 000</li>
            </ul>
          </div>
        </Container>
      </section>
    </div>
  );
}
