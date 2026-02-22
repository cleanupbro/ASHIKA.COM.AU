import { Container } from "@/components/layout";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 ${filled ? "text-amber-500" : "text-gray-200"} transition-colors`}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function UserAvatarIcon({
  initials,
  gender,
}: {
  initials: string;
  gender: "female" | "male";
}) {
  return (
    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-tan/40 to-brand-tan/80 flex items-center justify-center relative overflow-hidden group/avatar">
      {/* Subtle shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/avatar:translate-x-full transition-transform duration-1000 ease-in-out" />
      <svg
        className="w-6 h-6 text-brand-black/70"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {gender === "female" ? (
          <>
            {/* Female avatar — longer hair, softer features */}
            <circle cx="12" cy="8" r="4" />
            <path d="M6 21v-1a6 6 0 0 1 12 0v1" />
            {/* Hair detail */}
            <path d="M8 6c0-2 1.5-4 4-4s4 2 4 4" strokeWidth="1" />
            <path d="M7 8c-1 1-1 3-0.5 5" strokeWidth="0.75" />
            <path d="M17 8c1 1 1 3 0.5 5" strokeWidth="0.75" />
          </>
        ) : (
          <>
            {/* Male avatar */}
            <circle cx="12" cy="8" r="4" />
            <path d="M6 21v-1a6 6 0 0 1 12 0v1" />
          </>
        )}
      </svg>
      {/* Initials fallback overlay */}
      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold tracking-widest text-brand-black/0 group-hover/avatar:text-brand-black/60 transition-all duration-300">
        {initials}
      </span>
    </div>
  );
}

const testimonials = [
  {
    id: "1",
    name: "Priya Sharma",
    location: "Sydney, NSW",
    rating: 5,
    text: "The saree was absolutely stunning! Perfect for my cousin's wedding. So happy I didn't have to buy something I'd only wear once. The quality exceeded my expectations.",
    product: "Red Kanjeevaram Bridal Saree",
    avatar: "PS",
    gender: "female" as const,
  },
  {
    id: "2",
    name: "Anjali Patel",
    location: "Melbourne, VIC",
    rating: 5,
    text: "Amazing quality lehenga. Arrived beautifully packaged and the return process was seamless. Will definitely rent again for my next event!",
    product: "Teal Blue Designer Lehenga",
    avatar: "AP",
    gender: "female" as const,
  },
  {
    id: "3",
    name: "Raj Kumar",
    location: "Brisbane, QLD",
    rating: 5,
    text: "First time renting a sherwani and I was impressed. The fit was perfect and I got so many compliments at my brother's wedding. ASHIKA made it so easy.",
    product: "Ivory Wedding Sherwani",
    avatar: "RK",
    gender: "male" as const,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} filled={i < rating} />
      ))}
    </div>
  );
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
    </svg>
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
            <div key={testimonial.id} className="testimonial-card group">
              {/* Quote icon */}
              <QuoteIcon className="w-6 h-6 text-brand-tan/50 mb-4 group-hover:text-brand-tan transition-colors duration-500" />

              <div className="mb-4">
                <StarRating rating={testimonial.rating} />
              </div>

              {/* Review text */}
              <p className="text-xs text-gray-600 uppercase tracking-widest leading-relaxed mb-8 flex-1 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Customer info */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                <UserAvatarIcon
                  initials={testimonial.avatar}
                  gender={testimonial.gender}
                />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-black">
                    {testimonial.name}
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof stats */}
      </Container>
    </section>
  );
}
