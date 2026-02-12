import { Container } from '@/components/layout';
import { Search, Filter, ShoppingBag, RotateCcw } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Browse',
    description: 'Explore our curated collection of premium Indian ethnic wear for any occasion.',
  },
  {
    icon: Filter,
    title: 'Filter',
    description: 'Filter by date, size, and color to find your perfect look.',
  },
  {
    icon: ShoppingBag,
    title: 'Borrow',
    description: 'Select your rental dates and we will ship it free to your doorstep.',
  },
  {
    icon: RotateCcw,
    title: 'Return',
    description: 'Ship it back using the pre-paid label included in your box.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#F8FBFA]">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-brand-teal mb-4">
            How It Works
          </h2>
          <p className="text-brand-gold font-bold text-xs uppercase tracking-widest">Simple. Sustainable. Stylish.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center group">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-sm mb-8 group-hover:scale-110 transition-transform duration-300 relative">
                <step.icon className="w-10 h-10 stroke-[1.5] text-brand-teal" />
                <span className="absolute -top-1 -right-1 w-8 h-8 bg-brand-gold text-white text-xs font-bold flex items-center justify-center rounded-full shadow-sm">
                  {index + 1}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-black uppercase tracking-widest text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 tracking-wide leading-relaxed px-6 font-medium">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
