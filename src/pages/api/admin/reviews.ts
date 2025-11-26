import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Fetch all reviews with filters
    try {
      const { status, search } = req.query;

      let reviewsQuery = `
        SELECT 
          r.id,
          r.product_id,
          r.sanity_product_id,
          r.rating,
          r.title,
          r.comment,
          r.reviewer_name,
          r.reviewer_email,
          r.user_id,
          r.is_approved,
          r.is_featured,
          r.created_at,
          r.updated_at,
          u.first_name,
          u.last_name,
          u.email as user_email
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramCount = 0;

      // Filter by approval status
      if (status === 'pending') {
        paramCount++;
        reviewsQuery += ` AND r.is_approved = false`;
      } else if (status === 'approved') {
        paramCount++;
        reviewsQuery += ` AND r.is_approved = true`;
      }

      // Search filter
      if (search && typeof search === 'string') {
        paramCount++;
        reviewsQuery += ` AND (
          r.reviewer_name ILIKE $${paramCount} OR
          r.reviewer_email ILIKE $${paramCount} OR
          r.comment ILIKE $${paramCount} OR
          r.title ILIKE $${paramCount}
        )`;
        params.push(`%${search}%`);
      }

      reviewsQuery += ` ORDER BY r.created_at DESC LIMIT 100`;

      const result = await query(reviewsQuery, params);

      res.status(200).json({
        success: true,
        data: result.rows.map((review: any) => ({
          id: review.id,
          productId: review.product_id || review.sanity_product_id,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          reviewerName: review.reviewer_name || 
            (review.first_name && review.last_name 
              ? `${review.first_name} ${review.last_name}` 
              : 'Anonymous'),
          reviewerEmail: review.reviewer_email || review.user_email,
          userId: review.user_id,
          isApproved: review.is_approved,
          isFeatured: review.is_featured,
          createdAt: review.created_at,
          updatedAt: review.updated_at
        }))
      });

    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch reviews',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

