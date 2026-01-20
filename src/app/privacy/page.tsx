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
      <section className="bg-gradient-to-br from-teal-900 to-teal-800 text-white py-12 md:py-16">
        <Container>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Privacy Policy
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
            <h2>1. Introduction</h2>
            <p>
              ASHIKA (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy and is committed to
              protecting your personal information. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you use our
              website and services.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>We may collect the following personal information:</p>
            <ul>
              <li>Name and contact details (email, phone number)</li>
              <li>Shipping and billing addresses</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Account credentials</li>
              <li>Order history and preferences</li>
              <li>Body measurements for sizing purposes</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>When you visit our website, we may automatically collect:</p>
            <ul>
              <li>IP address and browser type</li>
              <li>Device information</li>
              <li>Pages visited and time spent on site</li>
              <li>Referring website</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Process and fulfill your rental orders</li>
              <li>Communicate with you about your orders</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>4. Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>
                <strong>Service providers:</strong> Including shipping companies (Australia Post),
                payment processors (Stripe), and email service providers
              </li>
              <li>
                <strong>Legal requirements:</strong> When required by law or to protect our rights
              </li>
              <li>
                <strong>Business transfers:</strong> In connection with a merger, acquisition, or
                sale of assets
              </li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect
              your personal information, including:
            </p>
            <ul>
              <li>SSL encryption for all data transmission</li>
              <li>Secure payment processing through PCI-compliant providers</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
            </ul>

            <h2>6. Cookies</h2>
            <p>
              We use cookies and similar technologies to enhance your experience. You can
              control cookies through your browser settings. Essential cookies are required
              for the website to function properly.
            </p>
            <p>Types of cookies we use:</p>
            <ul>
              <li><strong>Essential cookies:</strong> Required for basic functionality</li>
              <li><strong>Analytics cookies:</strong> Help us understand site usage</li>
              <li><strong>Preference cookies:</strong> Remember your settings</li>
            </ul>

            <h2>7. Your Rights</h2>
            <p>Under Australian Privacy Law, you have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information (subject to legal requirements)</li>
              <li>Opt-out of marketing communications</li>
              <li>Make a privacy complaint</li>
            </ul>

            <h2>8. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the
              purposes outlined in this policy, including:
            </p>
            <ul>
              <li>Order records: 7 years (tax requirements)</li>
              <li>Account information: Until account deletion requested</li>
              <li>Marketing preferences: Until you opt-out</li>
            </ul>

            <h2>9. Children&apos;s Privacy</h2>
            <p>
              Our services are not intended for children under 18. We do not knowingly
              collect personal information from children.
            </p>

            <h2>10. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party sites. We are not responsible
              for the privacy practices of these sites. We encourage you to review their
              privacy policies.
            </p>

            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of
              significant changes by posting the new policy on our website and updating
              the &quot;Last updated&quot; date.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our data practices,
              please contact us:
            </p>
            <ul>
              <li>Email: privacy@ashika.com.au</li>
              <li>Phone: +61 400 000 000</li>
              <li>Address: Sydney, NSW, Australia</li>
            </ul>

            <h2>13. Complaints</h2>
            <p>
              If you believe we have breached the Australian Privacy Principles, you may
              lodge a complaint with us or the Office of the Australian Information
              Commissioner (OAIC).
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
