import { Container } from '@/components/layout';
import Image from 'next/image';

const features = [
  {
    title: 'Premium Quality',
    description: 'Hand-picked, luxury ethnic wear from top designers.',
    icon: '/icon-fit.png',
  },
  {
    title: 'Perfect Fit Guarantee',
    description: 'Custom fitting options to ensure you look your best.',
    icon: '/icon-fit.png', 
  },
  {
    title: 'Hassle-Free Returns',
    description: 'Easy returns with pre-paid shipping labels included.',
    icon: '/icon-return.png',
  },
  {
    title: 'Express Delivery',
    description: 'Fast shipping across Australia for your last-minute events.',
    icon: '/icon-delivery.png',
  },
];

export function Features() {
  return (
    <section className="py-24 bg-brand-offwhite border-t border-gray-100">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature) => (
            <div key={feature.title} className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                <div className="relative w-8 h-8 opacity-60 group-hover:opacity-100 transition-opacity">
                   <Image 
                     src={feature.icon} 
                     alt={feature.title}
                     fill
                     className="object-contain"
                   />
                </div>
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-brand-black mb-3">
                {feature.title}
              </h3>
              <p className="text-[11px] font-bold text-gray-400 leading-relaxed uppercase tracking-wide">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
