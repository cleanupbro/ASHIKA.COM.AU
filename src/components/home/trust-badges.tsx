import { Container } from '@/components/layout';
import { Sparkles, Truck, RotateCcw, CreditCard, Shield } from 'lucide-react';

const badges = [
  {
    icon: Sparkles,
    title: 'Free Cleaning',
    description: 'Return without washing',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Both ways, Australia-wide',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: 'Prepaid label included',
  },
  {
    icon: CreditCard,
    title: 'No Membership',
    description: 'Rent anytime you need',
  },
  {
    icon: Shield,
    title: '$100 Bond Only',
    description: 'Fully refundable',
  },
];

export function TrustBadges() {
  return (
    <section className="py-12 bg-teal-900">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-teal-800 flex items-center justify-center mb-3">
                <badge.icon className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="text-white font-medium text-sm md:text-base mb-1">
                {badge.title}
              </h3>
              <p className="text-teal-200 text-xs md:text-sm">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
