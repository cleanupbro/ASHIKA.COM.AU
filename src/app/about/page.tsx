import { Metadata } from 'next';
import { Container } from '@/components/layout';
import { Sparkles, Heart, Recycle, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about ASHIKA - Australian Indian wear rental service making premium ethnic fashion accessible.',
};

const values = [
  {
    icon: Sparkles,
    title: 'Quality First',
    description: 'Every piece in our collection is carefully selected and maintained to ensure you look stunning on your special day.',
  },
  {
    icon: Heart,
    title: 'Customer Care',
    description: 'We treat every customer like family. Our team is dedicated to making your rental experience seamless and joyful.',
  },
  {
    icon: Recycle,
    title: 'Sustainability',
    description: 'By renting instead of buying, you reduce fashion waste and contribute to a more sustainable future.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We celebrate the rich diversity of Indian culture and help Australians experience its beautiful traditions.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-900 to-teal-800 text-white py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Wear the Culture.{' '}
              <span className="text-gold-400">Return the Stress.</span>
            </h1>
            <p className="text-lg md:text-xl text-teal-100 leading-relaxed">
              ASHIKA makes premium Indian ethnic wear accessible to everyone in Australia.
              We believe you shouldn&apos;t have to buy an expensive outfit you&apos;ll only wear once.
            </p>
          </div>
        </Container>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-teal-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  ASHIKA was born from a simple observation: Indian ethnic wear is stunningly beautiful,
                  but prohibitively expensive to buy for one-time occasions. We saw friends and family
                  spending thousands on outfits they&apos;d wear once, or settling for lower quality options
                  that didn&apos;t do justice to these important moments.
                </p>
                <p>
                  We founded ASHIKA to bridge this gap. Our name comes from &quot;Ashik&quot; meaning
                  &quot;lover&quot; in Sanskrit – we&apos;re lovers of culture, of celebration, and of making
                  beautiful moments possible for everyone.
                </p>
                <p>
                  Based in Sydney, we serve customers across Australia with our carefully curated
                  collection of sarees, lehengas, sherwanis, and more. Each piece is professionally
                  cleaned and maintained to ensure you receive it in perfect condition.
                </p>
              </div>
            </div>
            <div className="bg-cream rounded-2xl p-8 md:p-12">
              <blockquote className="font-display text-2xl md:text-3xl text-teal-900 italic">
                &quot;Every person deserves to feel magnificent on their special day,
                regardless of budget.&quot;
              </blockquote>
              <p className="mt-4 text-gray-600">— ASHIKA Founders</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-teal-900 mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at ASHIKA
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-xl p-6 text-center shadow-sm"
              >
                <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="font-display text-xl font-bold text-teal-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-teal-900 text-white">
        <Container>
          <div className="text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience ASHIKA?
            </h2>
            <p className="text-teal-200 mb-8 max-w-lg mx-auto">
              Browse our collection and find the perfect outfit for your next celebration.
            </p>
            <a
              href="/shop"
              className="inline-flex items-center px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-medium rounded-lg transition-colors"
            >
              Start Browsing
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
}
