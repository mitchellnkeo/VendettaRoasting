import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Submit a new review
    try {
      const { productId, rating, title, comment, reviewerName, reviewerEmail, userId } = req.body;

      // Validate required fields
      if (!productId || !rating || !comment) {
        return res.status(400).json({
          success: false,
          message: 'Product ID, rating, and comment are required'
        });
      }

      // Validate rating
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      // Validate reviewer info (either user_id or reviewer_name/email required)
      if (!userId && (!reviewerName || !reviewerEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Reviewer name and email are required for anonymous reviews'
        });
      }

      // Validate email format if provided
      if (reviewerEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(reviewerEmail)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid email address'
          });
        }
      }

      // Check if product exists (we'll need to get it from Sanity or database)
      // For now, we'll assume the product exists if productId is provided

      // Check if productId is a UUID (database product) or text (Sanity product ID)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);
      
      // Insert review (requires admin approval by default)
      // Use sanity_product_id if it's not a UUID (Sanity product), otherwise use product_id
      const insertQuery = isUUID
        ? `
          INSERT INTO reviews (
            product_id,
            user_id,
            rating,
            title,
            comment,
            reviewer_name,
            reviewer_email,
            is_approved,
            created_at,
            updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, false, NOW(), NOW())
          RETURNING *
        `
        : `
          INSERT INTO reviews (
            sanity_product_id,
            user_id,
            rating,
            title,
            comment,
            reviewer_name,
            reviewer_email,
            is_approved,
            created_at,
            updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, false, NOW(), NOW())
          RETURNING *
        `;

      const result = await query(insertQuery, [
        productId,
        userId || null,
        rating,
        title || null,
        comment,
        reviewerName || null,
        reviewerEmail || null
      ]);

      res.status(201).json({
        success: true,
        message: 'Review submitted successfully. It will be visible after admin approval.',
        data: result.rows[0]
      });

    } catch (error: any) {
      console.error('Error submitting review:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit review',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

