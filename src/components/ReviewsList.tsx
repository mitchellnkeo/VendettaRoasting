import { useState, useEffect } from 'react';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  reviewerName: string;
  isFeatured: boolean;
  createdAt: string;
}

interface ReviewsListProps {
  productId: string;
}

export default function ReviewsList({ productId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews/${productId}`);
      const data = await response.json();

      if (data.success) {
        setReviews(data.data.reviews);
        setAverageRating(data.data.averageRating);
        setTotalReviews(data.data.totalReviews);
      } else {
        setError(data.message || 'Failed to load reviews');
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coffee"></div>
        <p className="mt-4 text-coffee">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchReviews}
          className="text-coffee hover:text-coffee-light underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-coffee text-lg">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  // Separate featured and regular reviews
  const featuredReviews = reviews.filter((r) => r.isFeatured);
  const regularReviews = reviews.filter((r) => !r.isFeatured);

  return (
    <div className="space-y-8">
      {/* Average Rating Summary */}
      {averageRating && totalReviews > 0 && (
        <div className="bg-cream rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-coffee-dark mb-2">Customer Reviews</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-4xl font-bold text-coffee-dark">{averageRating}</span>
                  <div className="flex items-center">
                    {renderStars(Math.round(averageRating))}
                  </div>
                </div>
                <span className="text-coffee">
                  Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Reviews */}
      {featuredReviews.length > 0 && (
        <div>
          <h4 className="text-xl font-bold text-coffee-dark mb-4 flex items-center">
            <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Featured Reviews
          </h4>
          <div className="space-y-4">
            {featuredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl shadow-soft p-6 border-2 border-yellow-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm font-semibold text-coffee-dark">
                        {review.reviewerName}
                      </span>
                      <span className="text-xs text-coffee-light bg-yellow-100 px-2 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                    {review.title && (
                      <h5 className="text-lg font-bold text-coffee-dark">{review.title}</h5>
                    )}
                  </div>
                  <span className="text-sm text-coffee">{formatDate(review.createdAt)}</span>
                </div>
                <p className="text-coffee leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Reviews */}
      {regularReviews.length > 0 && (
        <div>
          {featuredReviews.length > 0 && (
            <h4 className="text-xl font-bold text-coffee-dark mb-4">All Reviews</h4>
          )}
          <div className="space-y-4">
            {regularReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl shadow-soft p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm font-semibold text-coffee-dark">
                        {review.reviewerName}
                      </span>
                    </div>
                    {review.title && (
                      <h5 className="text-lg font-bold text-coffee-dark">{review.title}</h5>
                    )}
                  </div>
                  <span className="text-sm text-coffee">{formatDate(review.createdAt)}</span>
                </div>
                <p className="text-coffee leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

