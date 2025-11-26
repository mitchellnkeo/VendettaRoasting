import { useState, useEffect } from 'react';

// Declare grecaptcha for TypeScript
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

interface ReviewFormProps {
  productId: string;
  productName: string;
  onSubmitSuccess?: () => void;
}

export default function ReviewForm({ productId, productName, onSubmitSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Load reCAPTCHA script if configured
    if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !window.grecaptcha) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setMessage({ type: 'error', text: 'Please select a rating' });
      return;
    }

    if (!comment.trim()) {
      setMessage({ type: 'error', text: 'Please write a review comment' });
      return;
    }

    if (!reviewerName.trim()) {
      setMessage({ type: 'error', text: 'Please enter your name' });
      return;
    }

    if (!reviewerEmail.trim()) {
      setMessage({ type: 'error', text: 'Please enter your email' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      // Get reCAPTCHA token if configured
      let recaptchaToken = '';
      if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && window.grecaptcha) {
        try {
          await new Promise<void>((resolve) => {
            window.grecaptcha.ready(() => {
              resolve();
            });
          });
          recaptchaToken = await window.grecaptcha.execute(
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
            { action: 'review_form' }
          );
        } catch (error) {
          console.error('reCAPTCHA error:', error);
          // Continue without token if reCAPTCHA fails
        }
      }

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating,
          title: title.trim() || null,
          comment: comment.trim(),
          reviewerName: reviewerName.trim(),
          reviewerEmail: reviewerEmail.trim(),
          recaptchaToken,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message || 'Review submitted successfully! It will be visible after admin approval.' });
        // Reset form
        setRating(0);
        setTitle('');
        setComment('');
        setReviewerName('');
        setReviewerEmail('');
        
        // Call success callback if provided
        if (onSubmitSuccess) {
          setTimeout(() => {
            onSubmitSuccess();
          }, 2000);
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to submit review. Please try again.' });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again later.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft p-8">
      <h3 className="text-2xl font-bold text-coffee-dark mb-6">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-coffee-dark mb-3">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-transform duration-200 hover:scale-110"
              >
                <svg
                  className={`w-10 h-10 ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-coffee font-medium">
                {rating} {rating === 1 ? 'star' : 'stars'}
              </span>
            )}
          </div>
        </div>

        {/* Reviewer Name */}
        <div>
          <label htmlFor="reviewerName" className="block text-sm font-semibold text-coffee-dark mb-2">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="reviewerName"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee focus:border-transparent"
            placeholder="John Doe"
            required
          />
        </div>

        {/* Reviewer Email */}
        <div>
          <label htmlFor="reviewerEmail" className="block text-sm font-semibold text-coffee-dark mb-2">
            Your Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="reviewerEmail"
            value={reviewerEmail}
            onChange={(e) => setReviewerEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee focus:border-transparent"
            placeholder="john@example.com"
            required
          />
        </div>

        {/* Review Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-coffee-dark mb-2">
            Review Title (Optional)
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee focus:border-transparent"
            placeholder="Great coffee!"
            maxLength={255}
          />
        </div>

        {/* Review Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-semibold text-coffee-dark mb-2">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee focus:border-transparent resize-none"
            placeholder="Share your thoughts about this product..."
            required
          />
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-xl ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
            submitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-coffee hover:bg-coffee-light text-cream-light shadow-warm-lg hover:shadow-warm hover:scale-105'
          }`}
        >
          {submitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-cream-light border-t-transparent rounded-full animate-spin mr-2" />
              Submitting...
            </div>
          ) : (
            'Submit Review'
          )}
        </button>

        <p className="text-sm text-coffee text-center">
          Your review will be reviewed by our team before being published.
        </p>
      </form>
    </div>
  );
}

