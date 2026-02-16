import { Container } from '@/components/layout';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero Banner */}
      <section className="relative h-[60vh] w-full mb-24">
        <Image
          src="/hero_poster_cinematic.png"
          alt="About Ashika"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-[0.2em] uppercase text-center">
            The Ashika Story
          </h1>
        </div>
      </section>

      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xs font-black text-brand-black uppercase tracking-[0.3em] mb-8">
            Wear the Culture. Return the Stress.
          </h2>
          <p className="text-sm md:text-base leading-loose text-gray-600 font-medium mb-12">
            ASHIKA was born from a simple idea: Indian fashion is stunning, but it shouldn't be single-use. 
            We believe in a world where you can wear the most exquisite Lehengas, Sarees, and Sherwanis 
            without the guilt of a cluttered closet or the heavy price tag.
          </p>
          
          <div className="grid md:grid-cols-3 gap-12 text-left mt-24">
            <div>
              <h3 className="text-xl font-black text-brand-black mb-4">01. CURATED LUXURY</h3>
              <p className="text-xs leading-relaxed text-gray-500 font-bold uppercase tracking-wide">
                We partner with top designers and authenticate every piece to ensure you're wearing only the best.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-black text-brand-black mb-4">02. SUSTAINABLE FASHION</h3>
              <p className="text-xs leading-relaxed text-gray-500 font-bold uppercase tracking-wide">
                By renting, you reduce textile waste and contribute to a more circular fashion economy.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-black text-brand-black mb-4">03. HYGIENE FIRST</h3>
              <p className="text-xs leading-relaxed text-gray-500 font-bold uppercase tracking-wide">
                Every item is dry-cleaned and sanitized to hospital-grade standards before it reaches you.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
