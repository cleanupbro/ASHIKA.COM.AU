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
      <section className="bg-brand-teal py-24 md:py-32">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-[0.2em] text-white mb-8 leading-tight drop-shadow-sm">
              Wear the Culture. <br />
              <span className="text-brand-gold">Return the Stress.</span>
            </h1>
            <p className="text-[10px] md:text-xs text-brand-cream uppercase tracking-[0.3em] font-bold max-w-2xl mx-auto leading-relaxed">
              ASHIKA makes premium Indian ethnic wear accessible to everyone in Australia. <br />
              We believe in celebration without compromise.
            </p>
          </div>
        </Container>
      </section>

      {/* Our Story */}
      <section className="py-32">
        <Container>
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-teal mb-12 border-b-2 border-brand-gold pb-3 inline-block">
                Our Story
              </h2>
              <div className="space-y-8 text-sm text-gray-600 leading-relaxed font-medium tracking-wide">
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
            <div className="bg-[#F8FBFA] p-12 lg:p-24 border border-brand-teal/5 shadow-sm">
              <blockquote className="text-2xl md:text-4xl font-black text-brand-teal uppercase tracking-tight leading-tight italic">
                &quot;Every person deserves to feel magnificent on their special day,
                regardless of budget.&quot;
              </blockquote>
              <div className="w-16 h-1 bg-brand-gold mt-10"></div>
              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">ASHIKA Founders</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-32 bg-[#F8FBFA] border-y border-brand-teal/5">
        <Container>
          <div className="text-center mb-20">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-teal mb-4">
              Our Values
            </h2>
            <div className="w-16 h-1 bg-brand-gold mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {values.map((value) => (
              <div
                key={value.title}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 border border-brand-teal/5">
                  <value.icon className="w-8 h-8 text-brand-teal stroke-[1.5]" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-xs text-gray-500 font-medium tracking-wide leading-relaxed px-4">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-32 bg-white">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] text-brand-teal mb-10">
              Join the Borrowhood
            </h2>
            <Link href="/shop">
              <Button size="lg" className="min-w-[280px] h-14 text-sm font-bold tracking-[0.2em]">
                START BROWSING
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
