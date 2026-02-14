import { Star, ThumbsUp, CheckCircle } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
  verified: boolean;
  occasion?: string;
}

// Mock reviews data - would come from database in production
const mockReviews: Review[] = [
  {
    id: '1',
    author: 'Meera R.',
    location: 'Sydney, NSW',
    rating: 5,
    date: '2 weeks ago',
    title: 'Absolutely stunning!',
    content:
      'The quality was incredible and it fit perfectly. I received so many compliments at my friend\'s wedding. The delivery was on time and the return process was seamless.',
    helpful: 12,
    verified: true,
    occasion: 'Wedding',
  },
  {
    id: '2',
    author: 'Kavitha S.',
    location: 'Melbourne, VIC',
    rating: 5,
    date: '1 month ago',
    title: 'Perfect for Diwali celebrations',
    content:
      'Wore this for our Diwali party and everyone loved it. The fabric quality is excellent and the colors are even more vibrant in person. Will definitely rent from ASHIKA again.',
    helpful: 8,
    verified: true,
    occasion: 'Festival',
  },
  {
    id: '3',
    author: 'Priyanka M.',
    location: 'Brisbane, QLD',
    rating: 4,
    date: '1 month ago',
    title: 'Great experience overall',
    content:
      'The outfit was beautiful and arrived well-packaged. Minor wrinkle from shipping but steaming took care of it. Great alternative to buying expensive traditional wear.',
    helpful: 5,
    verified: true,
    occasion: 'Engagement',
  },
];

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'w-4 h-4' : 'w-3 h-3';
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${
            i < rating ? 'text-brand-black fill-brand-black' : 'text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews(props: ProductReviewsProps) {
  // TODO: In production, fetch reviews from Supabase filtered by props.productId
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { productId } = props;
  const reviews = mockReviews;
  const averageRating = 4.8;
  const totalReviews = reviews.length;

  return (
    <section className="py-16 md:py-24">
      {/* Header with overall rating */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12 mb-16">
        <div>
          <h2 className="text-xl font-black uppercase tracking-[0.2em] text-brand-black mb-4">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-4">
            <StarRating rating={Math.round(averageRating)} size="lg" />
            <span className="text-xs font-black text-brand-black tracking-widest">{averageRating} OUT OF 5</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">Based on {totalReviews} reviews</span>
          </div>
        </div>

        {/* Rating breakdown */}
        <div className="flex flex-col gap-2 w-full max-w-xs">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter((r) => r.rating === stars).length;
            const percentage = (count / totalReviews) * 100;
            return (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-brand-black w-3">{stars}</span>
                <Star className="w-3 h-3 text-brand-black fill-brand-black" />
                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-black"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews list */}
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-100 pb-12 last:border-0 md:last:border-b"
          >
            {/* Review header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-brand-black">{review.author}</span>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-brand-black bg-gray-50 px-2 py-1">
                      <CheckCircle className="w-2.5 h-2.5" />
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-gray-400">
                  <span>{review.location}</span>
                  <span className="text-gray-300">•</span>
                  <span>{review.date}</span>
                </div>
              </div>
              <StarRating rating={review.rating} />
            </div>

            {/* Review content */}
            <h4 className="text-sm font-bold text-brand-black mb-3">{review.title}</h4>
            <p className="text-xs text-gray-600 leading-relaxed mb-4 font-medium">
              {review.content}
            </p>

            {/* Helpful button */}
            <div className="flex items-center justify-between">
              {review.occasion && (
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Worn for: <span className="text-brand-black">{review.occasion}</span></span>
              )}
              <button className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand-black transition-colors">
                <ThumbsUp className="w-3 h-3" />
                Helpful ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View all reviews link */}
      {totalReviews > 3 && (
        <div className="mt-12 text-center">
          <button className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-black border-b border-brand-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
            View all {totalReviews} reviews
          </button>
        </div>
      )}
    </section>
  );
}
