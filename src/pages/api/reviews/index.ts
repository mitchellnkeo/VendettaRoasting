import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/database';
import { createRateLimit, RATE_LIMITS } from '../../../lib/rateLimit';
import { validateRecaptcha } from '../../../lib/recaptcha';
import { sanitizeString, sanitizeEmail, sanitizeText } from '../../../lib/sanitize';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Rate limiting
    const rateLimit = createRateLimit(RATE_LIMITS.REVIEWS);
    const rateLimitResult = rateLimit(req);

    if (!rateLimitResult.allowed) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
      });
    }

    // Submit a new review
    try {
      const { productId, rating, title, comment, reviewerName, reviewerEmail, userId, recaptchaToken } = req.body;

      // Verify reCAPTCHA
      if (process.env.RECAPTCHA_SECRET_KEY) {
        const recaptchaValid = await validateRecaptcha(recaptchaToken);
        if (!recaptchaValid) {
          return res.status(400).json({
            success: false,
            message: 'reCAPTCHA verification failed. Please try again.',
          });
        }
      }

      // Sanitize inputs
      const sanitizedTitle = title ? sanitizeString(title) : null;
      const sanitizedComment = sanitizeText(comment);
      const sanitizedReviewerName = sanitizeString(reviewerName);
      const sanitizedReviewerEmail = sanitizeEmail(reviewerEmail);

      // Validate required fields
      if (!productId || !rating || !sanitizedComment) {
        return res.status(400).json({
          success: false,
          message: 'Product ID, rating, and comment are required'
        });
      }

      // Validate rating
      const ratingNum = parseInt(rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      // Validate reviewer info (either user_id or reviewer_name/email required)
      if (!userId && (!sanitizedReviewerName || !sanitizedReviewerEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Reviewer name and email are required for anonymous reviews'
        });
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
        ratingNum,
        sanitizedTitle,
        sanitizedComment,
        sanitizedReviewerName || null,
        sanitizedReviewerEmail || null
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

