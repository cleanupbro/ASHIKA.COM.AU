import { Metadata } from 'next';
import { Container } from '@/components/layout';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about ASHIKA Indian wear rental service.',
};

const faqCategories = [
  {
    title: 'Rental Process',
    faqs: [
      {
        question: 'How does the rental process work?',
        answer: 'Simply browse our collection, select your outfit, choose your event date, and complete checkout. We ship your outfit 3 days before your event with free express shipping. After your event, return it within 3 days using the prepaid label we provide.',
      },
      {
        question: 'How long is the rental period?',
        answer: 'The rental period is 7 days total: 3 days before your event (for delivery), your event day, and 3 days after for returns. This gives you plenty of time to receive, wear, and return your outfit.',
      },
      {
        question: 'Can I extend my rental period?',
        answer: 'Yes, extensions are available subject to availability. Please contact us at least 2 days before your return date. Extension fees apply.',
      },
      {
        question: 'What if the outfit doesn\'t fit?',
        answer: 'We provide detailed size guides for each item. If the fit isn\'t quite right, contact us immediately. Depending on timing and availability, we may be able to arrange an exchange.',
      },
    ],
  },
  {
    title: 'Shipping & Returns',
    faqs: [
      {
        question: 'Is shipping free?',
        answer: 'Yes! We offer free express shipping both ways across Australia. Your outfit arrives 3 days before your event, and we include a prepaid return label.',
      },
      {
        question: 'How do I return my rental?',
        answer: 'Simply place the outfit back in the garment bag provided, attach the prepaid return label, and drop it at any Australia Post outlet. No dry cleaning required - we handle that!',
      },
      {
        question: 'What if I\'m late returning?',
        answer: 'We provide a 3-day grace period after the scheduled return date. After this, a $50/day late fee applies. Please contact us if you anticipate any delays.',
      },
      {
        question: 'Do you ship to regional areas?',
        answer: 'Yes, we ship Australia-wide. Metro areas receive delivery in 2-3 business days; regional areas in 3-5 business days. Plan accordingly based on your location.',
      },
    ],
  },
  {
    title: 'Payments & Bond',
    faqs: [
      {
        question: 'What is the security bond?',
        answer: 'A $100 security bond is pre-authorized (not charged) on your card at checkout. This protects against damage or loss. If the outfit is returned in good condition, the bond is automatically released.',
      },
      {
        question: 'When is the bond released?',
        answer: 'The bond is typically released within 3-5 business days after we receive and inspect your return. You\'ll receive an email confirmation.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express), as well as Apple Pay and Google Pay through our secure Stripe payment system.',
      },
      {
        question: 'Can I cancel my order?',
        answer: 'Yes, you can cancel up to 7 days before your event for a full refund. Cancellations within 7 days may incur a cancellation fee of 50% of the rental price.',
      },
    ],
  },
  {
    title: 'Care & Damage',
    faqs: [
      {
        question: 'Do I need to dry clean the outfit before returning?',
        answer: 'No! We professionally clean all outfits between rentals. Simply return the outfit without washing or dry cleaning.',
      },
      {
        question: 'What if I damage the outfit?',
        answer: 'Minor wear and tear is expected and covered. For significant damage (stains, tears, missing accessories), we may partially or fully capture the $100 bond. In extreme cases, additional charges may apply.',
      },
      {
        question: 'What counts as "normal wear"?',
        answer: 'Light wrinkles, minor makeup traces that can be cleaned, and small deodorant marks are all considered normal wear. Major stains, rips, alterations, or missing items are not.',
      },
      {
        question: 'What if something is missing when I receive it?',
        answer: 'Please check your order immediately upon receipt. If anything is missing or damaged, contact us within 24 hours with photos. We\'ll arrange a replacement or refund.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-900 to-teal-800 text-white py-12 md:py-16">
        <Container>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-teal-200 max-w-2xl">
            Everything you need to know about renting Indian ethnic wear from ASHIKA.
          </p>
        </Container>
      </section>

      {/* FAQ Content */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-3xl mx-auto space-y-12">
            {faqCategories.map((category) => (
              <div key={category.title}>
                <h2 className="font-display text-2xl font-bold text-teal-900 mb-6">
                  {category.title}
                </h2>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <Accordion type="single" className="px-6">
                    {category.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.title}-${index}`}>
                        <AccordionTrigger value={`${category.title}-${index}`}>
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent value={`${category.title}-${index}`}>
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="max-w-3xl mx-auto mt-12 text-center p-8 bg-cream rounded-xl">
            <h3 className="font-display text-xl font-bold text-teal-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-4">
              Our team is here to help. Reach out and we&apos;ll get back to you within 24 hours.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
