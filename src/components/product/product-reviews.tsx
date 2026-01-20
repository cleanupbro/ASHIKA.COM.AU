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
  const sizeClass = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${
            i < rating ? 'text-gold-500 fill-gold-500' : 'text-gray-300'
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
    <section className="py-8">
      {/* Header with overall rating */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-teal-900 mb-2">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-3">
            <StarRating rating={Math.round(averageRating)} size="lg" />
            <span className="text-lg font-semibold text-teal-900">{averageRating}</span>
            <span className="text-gray-500">({totalReviews} reviews)</span>
          </div>
        </div>

        {/* Rating breakdown */}
        <div className="flex gap-1">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter((r) => r.rating === stars).length;
            const percentage = (count / totalReviews) * 100;
            return (
              <div key={stars} className="flex items-center gap-1">
                <span className="text-xs text-gray-500 w-3">{stars}</span>
                <Star className="w-3 h-3 text-gold-500 fill-gold-500" />
                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-100 pb-6 last:border-0"
          >
            {/* Review header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-teal-900">{review.author}</span>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Verified Renter
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{review.location}</span>
                  <span>•</span>
                  <span>{review.date}</span>
                  {review.occasion && (
                    <>
                      <span>•</span>
                      <span className="text-teal-600">{review.occasion}</span>
                    </>
                  )}
                </div>
              </div>
              <StarRating rating={review.rating} />
            </div>

            {/* Review content */}
            <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              {review.content}
            </p>

            {/* Helpful button */}
            <button className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-600 transition-colors">
              <ThumbsUp className="w-4 h-4" />
              Helpful ({review.helpful})
            </button>
          </div>
        ))}
      </div>

      {/* View all reviews link */}
      {totalReviews > 3 && (
        <div className="mt-6 text-center">
          <button className="text-teal-600 hover:text-teal-700 font-medium text-sm">
            View all {totalReviews} reviews
          </button>
        </div>
      )}
    </section>
  );
}
