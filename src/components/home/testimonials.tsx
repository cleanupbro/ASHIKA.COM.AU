import { Container } from '@/components/layout';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: '1',
    name: 'Priya Sharma',
    location: 'Sydney, NSW',
    rating: 5,
    text: "The saree was absolutely stunning! Perfect for my cousin's wedding. So happy I didn't have to buy something I'd only wear once. The quality exceeded my expectations.",
    product: 'Red Kanjeevaram Bridal Saree',
    avatar: 'PS',
  },
  {
    id: '2',
    name: 'Anjali Patel',
    location: 'Melbourne, VIC',
    rating: 5,
    text: 'Amazing quality lehenga. Arrived beautifully packaged and the return process was seamless. Will definitely rent again for my next event!',
    product: 'Teal Blue Designer Lehenga',
    avatar: 'AP',
  },
  {
    id: '3',
    name: 'Raj Kumar',
    location: 'Brisbane, QLD',
    rating: 5,
    text: "First time renting a sherwani and I was impressed. The fit was perfect and I got so many compliments at my brother's wedding. ASHIKA made it so easy.",
    product: 'Ivory Wedding Sherwani',
    avatar: 'RK',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'text-gold-500 fill-gold-500' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-teal-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join hundreds of happy renters across Australia who chose ASHIKA for their special occasions.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-cream rounded-2xl p-6 md:p-8 relative"
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-teal-100" />

              {/* Rating */}
              <StarRating rating={testimonial.rating} />

              {/* Review text */}
              <p className="text-gray-700 mt-4 mb-6 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Customer info */}
              <div className="flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-teal-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>

              {/* Product rented */}
              <div className="mt-4 pt-4 border-t border-teal-100">
                <p className="text-xs text-gray-500">
                  Rented: <span className="text-teal-700">{testimonial.product}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof stats */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-12 text-center">
          <div>
            <p className="text-3xl font-display font-bold text-teal-600">500+</p>
            <p className="text-sm text-gray-600">Happy Renters</p>
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-teal-600">4.9</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-teal-600">100%</p>
            <p className="text-sm text-gray-600">Satisfaction Guarantee</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
