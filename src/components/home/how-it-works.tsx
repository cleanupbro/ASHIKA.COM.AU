import { Container } from '@/components/layout';
import { Search, CalendarCheck, Package, RotateCcw } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Browse',
    description: 'Explore our curated collection of premium Indian ethnic wear.',
  },
  {
    icon: CalendarCheck,
    title: 'Select Date',
    description: 'Choose your event date. We ship 3 days before so it arrives on time.',
  },
  {
    icon: Package,
    title: 'Receive',
    description: 'Your outfit arrives at your doorstep with free express shipping.',
  },
  {
    icon: RotateCcw,
    title: 'Return',
    description: 'Ship it back within 3 days after your event. Prepaid label included.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-cream">
      <Container>
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-teal-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Renting is simple. Get stunning outfits without the commitment or storage hassle.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              {/* Connector line (hidden on mobile, shown on desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-teal-200" />
              )}

              {/* Step number & icon */}
              <div className="relative z-10 inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-600 text-white mb-4">
                <step.icon className="w-7 h-7" />
              </div>

              {/* Step number badge */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-6 h-6 rounded-full bg-gold-500 text-white text-xs font-bold flex items-center justify-center">
                {index + 1}
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-bold text-teal-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-16 bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-center">
            <div>
              <p className="text-3xl font-display font-bold text-teal-600 mb-2">7 Days</p>
              <p className="text-sm text-gray-600">Total rental period</p>
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-teal-600 mb-2">$0</p>
              <p className="text-sm text-gray-600">Shipping both ways</p>
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-teal-600 mb-2">$100</p>
              <p className="text-sm text-gray-600">Refundable bond</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
