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
      <section className="bg-gradient-to-br from-teal-900 to-teal-800 text-white py-12 md:py-16">
        <Container>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Terms of Service
          </h1>
          <p className="text-teal-200">
            Last updated: January 2026
          </p>
        </Container>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <Container size="md">
          <div className="prose prose-gray max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using ASHIKA (&quot;the Service&quot;), you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>

            <h2>2. Rental Agreement</h2>
            <h3>2.1 Rental Period</h3>
            <p>
              The standard rental period is 7 days, which includes:
            </p>
            <ul>
              <li>3 days before your event (for delivery)</li>
              <li>Your event day</li>
              <li>3 days after your event (for returns)</li>
            </ul>

            <h3>2.2 Security Bond</h3>
            <p>
              A refundable security bond of $100 AUD is pre-authorized at the time of booking.
              This bond covers potential damage, loss, or late returns. The bond is released
              upon successful return and inspection of the rented items.
            </p>

            <h3>2.3 Late Returns</h3>
            <p>
              Items must be returned within 3 days after your event date. A grace period of
              3 additional days is provided. After the grace period, a late fee of $50 per
              day may be charged.
            </p>

            <h2>3. Care of Rented Items</h2>
            <h3>3.1 Your Responsibilities</h3>
            <ul>
              <li>Handle all items with reasonable care</li>
              <li>Do not alter, wash, dry clean, or repair any items</li>
              <li>Keep items away from fire, cigarette smoke, and hazardous substances</li>
              <li>Return all items and accessories in the same condition as received</li>
            </ul>

            <h3>3.2 Damage and Loss</h3>
            <p>
              Normal wear and tear is expected and accepted. However, customers are responsible
              for damage beyond normal wear, including but not limited to:
            </p>
            <ul>
              <li>Permanent stains (makeup, food, drinks)</li>
              <li>Tears, rips, or burns</li>
              <li>Missing accessories or components</li>
              <li>Alterations to the garment</li>
            </ul>
            <p>
              Damage costs may be partially or fully charged against the security bond.
              Significant damage may incur additional charges.
            </p>

            <h2>4. Shipping and Delivery</h2>
            <p>
              We provide free express shipping both ways across Australia. Delivery times are:
            </p>
            <ul>
              <li>Metro areas: 2-3 business days</li>
              <li>Regional areas: 3-5 business days</li>
            </ul>
            <p>
              It is your responsibility to ensure accurate delivery information is provided.
              ASHIKA is not responsible for delays caused by incorrect addresses or
              inaccessible delivery locations.
            </p>

            <h2>5. Cancellations and Refunds</h2>
            <h3>5.1 Cancellation Policy</h3>
            <ul>
              <li>More than 7 days before event: Full refund</li>
              <li>3-7 days before event: 50% refund</li>
              <li>Less than 3 days before event: No refund</li>
            </ul>

            <h3>5.2 ASHIKA Cancellations</h3>
            <p>
              If ASHIKA cancels your order due to item unavailability or other circumstances,
              you will receive a full refund and, where possible, alternative options.
            </p>

            <h2>6. Pricing</h2>
            <p>
              All prices are displayed in Australian Dollars (AUD) and include GST.
              The security bond is separate from the rental fee and is fully refundable
              subject to the terms outlined above.
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
              All content on this website, including text, images, logos, and designs,
              is the property of ASHIKA and protected by Australian copyright law.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              ASHIKA&apos;s liability is limited to the rental fee paid. We are not liable for
              any indirect, incidental, or consequential damages arising from the use
              of our Service or rented items.
            </p>

            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be
              effective immediately upon posting to our website. Continued use of the
              Service constitutes acceptance of modified terms.
            </p>

            <h2>10. Contact</h2>
            <p>
              For questions about these Terms of Service, please contact us at:
            </p>
            <ul>
              <li>Email: info@ashika.com.au</li>
              <li>Phone: +61 400 000 000</li>
            </ul>
          </div>
        </Container>
      </section>
    </div>
  );
}
