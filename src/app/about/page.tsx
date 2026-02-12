import { Metadata } from 'next';
import { Container } from '@/components/layout';
import { Sparkles, Heart, Recycle, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui';

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
      <section className="bg-white border-b border-gray-100 py-24">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-black mb-8 leading-tight">
              Wear the Culture. <br />
              <span className="text-gray-300">Return the Stress.</span>
            </h1>
            <p className="text-sm md:text-base text-gray-500 uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
              ASHIKA makes premium Indian ethnic wear accessible to everyone in Australia.
              We believe in celebration without compromise.
            </p>
          </div>
        </Container>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <Container>
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-12 border-b border-black pb-2 inline-block">
                Our Story
              </h2>
              <div className="space-y-6 text-sm text-gray-600 leading-relaxed uppercase tracking-wide">
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
            <div className="bg-gray-50 p-12 lg:p-20">
              <blockquote className="text-2xl md:text-4xl font-black text-black uppercase tracking-tight leading-tight italic">
                &quot;Every person deserves to feel magnificent on their special day,
                regardless of budget.&quot;
              </blockquote>
              <div className="w-12 h-1 bg-black mt-8"></div>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-black">ASHIKA Founders</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-4">
              Our Values
            </h2>
            <div className="w-12 h-0.5 bg-black mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {values.map((value) => (
              <div
                key={value.title}
                className="text-center group"
              >
                <div className="w-16 h-16 border border-black flex items-center justify-center mx-auto mb-6 group-hover:bg-black group-hover:text-white transition-all duration-300">
                  <value.icon className="w-6 h-6 stroke-1" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4">
                  {value.title}
                </h3>
                <p className="text-xs text-gray-500 uppercase tracking-wide leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <Container>
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-black mb-8">
              Experience ASHIKA
            </h2>
            <Link href="/shop">
              <Button variant="primary" className="min-w-[240px] uppercase tracking-widest text-xs py-4">
                START BROWSING
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
