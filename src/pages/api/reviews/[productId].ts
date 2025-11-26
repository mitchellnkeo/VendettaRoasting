import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { productId } = req.query;

    if (!productId || typeof productId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Check if productId is a UUID (database product) or text (Sanity product ID)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);
    
    // Fetch approved reviews for the product
    const reviewsQuery = isUUID
      ? `
        SELECT 
          r.id,
          r.rating,
          r.title,
          r.comment,
          r.reviewer_name,
          r.user_id,
          r.is_featured,
          r.created_at,
          u.first_name,
          u.last_name
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.product_id = $1 
          AND r.is_approved = true
        ORDER BY 
          r.is_featured DESC,
          r.created_at DESC
        LIMIT 50
      `
      : `
        SELECT 
          r.id,
          r.rating,
          r.title,
          r.comment,
          r.reviewer_name,
          r.user_id,
          r.is_featured,
          r.created_at,
          u.first_name,
          u.last_name
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.sanity_product_id = $1 
          AND r.is_approved = true
        ORDER BY 
          r.is_featured DESC,
          r.created_at DESC
        LIMIT 50
      `;

    const result = await query(reviewsQuery, [productId]);

    // Calculate average rating
    const avgRatingQuery = isUUID
      ? `
        SELECT 
          AVG(rating) as average_rating,
          COUNT(*) as total_reviews
        FROM reviews
        WHERE product_id = $1 
          AND is_approved = true
      `
      : `
        SELECT 
          AVG(rating) as average_rating,
          COUNT(*) as total_reviews
        FROM reviews
        WHERE sanity_product_id = $1 
          AND is_approved = true
      `;

    const avgResult = await query(avgRatingQuery, [productId]);
    const averageRating = avgResult.rows[0]?.average_rating 
      ? parseFloat(avgResult.rows[0].average_rating).toFixed(1)
      : null;
    const totalReviews = parseInt(avgResult.rows[0]?.total_reviews || '0');

    // Format reviews
    const reviews = result.rows.map((review: any) => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      reviewerName: review.reviewer_name || 
        (review.first_name && review.last_name 
          ? `${review.first_name} ${review.last_name}` 
          : 'Anonymous'),
      isFeatured: review.is_featured,
      createdAt: review.created_at
    }));

    res.status(200).json({
      success: true,
      data: {
        reviews,
        averageRating: averageRating ? parseFloat(averageRating) : null,
        totalReviews
      }
    });

  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

