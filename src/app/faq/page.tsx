import { Metadata } from 'next';
import { Container } from '@/components/layout';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui';
import Link from 'next/link';
import { Button } from '@/components/ui';

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
      <section className="bg-brand-teal py-20 md:py-24">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-white mb-6">
              FAQ
            </h1>
            <p className="text-[10px] md:text-xs text-brand-cream font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about renting with ASHIKA.
            </p>
          </div>
        </Container>
      </section>

      {/* FAQ Content */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="max-w-3xl mx-auto space-y-20">
            {faqCategories.map((category) => (
              <div key={category.title}>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-teal mb-10 border-b-2 border-brand-gold pb-3 inline-block">
                  {category.title}
                </h2>
                <div className="bg-white border-b border-brand-teal/5 last:border-0 overflow-hidden">
                  <Accordion type="single" className="divide-y divide-brand-teal/5">
                    {category.faqs.map((faq, index) => {
                      const value = `${category.title}-${index}`;
                      return (
                        <AccordionItem key={index} value={value} className="border-0">
                          <AccordionTrigger value={value} className="text-[13px] font-bold uppercase tracking-widest text-gray-900 py-6 text-left hover:text-brand-teal transition-colors">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent value={value} className="text-[13px] text-gray-500 font-medium leading-relaxed pb-8">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="max-w-3xl mx-auto mt-24 text-center p-16 bg-[#F8FBFA] border border-brand-teal/5 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-teal mb-6">
              Still have questions?
            </h3>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-10">
              Our team is here to help. Reach out and we&apos;ll get back to you within 24 hours.
            </p>
            <Link href="/contact">
              <Button className="min-w-[240px] h-14 text-sm font-bold tracking-[0.2em]">
                CONTACT US
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
