import { Container } from '@/components/layout';
import { Star } from 'lucide-react';

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
          className={`w-3 h-3 ${
            i < rating ? 'text-black fill-black' : 'text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <Container>
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-black uppercase tracking-widest text-black mb-2">
            Reviews
          </h2>
          <div className="w-12 h-0.5 bg-black mx-auto"></div>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="border border-gray-100 p-8 flex flex-col"
            >
              <div className="mb-6">
                <StarRating rating={testimonial.rating} />
              </div>

              {/* Review text */}
              <p className="text-xs text-gray-600 uppercase tracking-widest leading-relaxed mb-8 flex-1 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Customer info */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                <div className="w-10 h-10 border border-black flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-black">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-black">{testimonial.name}</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof stats */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <p className="text-3xl font-black text-black mb-2 uppercase tracking-tighter">500+</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Happy Renters</p>
          </div>
          <div>
            <p className="text-3xl font-black text-black mb-2 uppercase tracking-tighter">4.9/5</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Average Rating</p>
          </div>
          <div>
            <p className="text-3xl font-black text-black mb-2 uppercase tracking-tighter">100%</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Satisfaction Guarantee</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
