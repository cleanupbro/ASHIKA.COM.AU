'use client';

import { Container } from '@/components/layout';
import Image from 'next/image';

const steps = [
  {
    number: '1',
    title: 'BROWSE',
    image: '/step-1.png', // Placeholder or AI generated later
  },
  {
    number: '2',
    title: 'FILTER',
    image: '/step-2.png',
  },
  {
    number: '3',
    title: 'BORROW',
    image: '/step-3.png',
  },
  {
    number: '4',
    title: 'RETURN',
    image: '/step-4.png',
  },
];

export function Borrowhood() {
  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-black tracking-[0.2em] text-brand-black uppercase mb-4">
            WELCOME TO THE BORROWHOOD.
          </h2>
          <p className="text-[11px] font-bold tracking-[0.1em] text-gray-500 uppercase">
            Why buy for a one-time occasion if you can simply borrow?
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative group overflow-hidden">
              <div className="aspect-[3/4] relative bg-brand-tan/20 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-[1.02]">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
              
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
                <span className="text-[10px] font-black text-brand-black">{step.number}</span>
              </div>
              
              <div className="mt-4 text-center">
                <span className="text-[10px] font-black tracking-[0.2em] text-brand-black uppercase">
                  {step.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
