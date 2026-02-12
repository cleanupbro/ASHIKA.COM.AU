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
    <section className="py-12 bg-gray-50 border-t border-gray-100">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="flex flex-col items-center text-center group"
            >
              <div className="mb-4 text-black group-hover:scale-110 transition-transform duration-300">
                <badge.icon className="w-8 h-8 stroke-1" />
              </div>
              <h3 className="text-black font-bold text-xs uppercase tracking-widest mb-2">
                {badge.title}
              </h3>
              <p className="text-gray-500 text-xs font-medium">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
