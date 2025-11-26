import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { reviewId } = req.query;

  if (!reviewId || typeof reviewId !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Review ID is required'
    });
  }

  if (req.method === 'PATCH' || req.method === 'PUT') {
    // Update review (approve, reject, feature, etc.)
    try {
      const { isApproved, isFeatured } = req.body;

      const updateFields: string[] = [];
      const params: any[] = [];
      let paramCount = 0;

      if (typeof isApproved === 'boolean') {
        paramCount++;
        updateFields.push(`is_approved = $${paramCount}`);
        params.push(isApproved);
      }

      if (typeof isFeatured === 'boolean') {
        paramCount++;
        updateFields.push(`is_featured = $${paramCount}`);
        params.push(isFeatured);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields to update'
        });
      }

      paramCount++;
      updateFields.push(`updated_at = NOW()`);
      params.push(reviewId);

      const updateQuery = `
        UPDATE reviews
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await query(updateQuery, params);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      res.status(200).json({
        success: true,
        data: result.rows[0]
      });

    } catch (error: any) {
      console.error('Error updating review:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update review',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  } else if (req.method === 'DELETE') {
    // Delete review
    try {
      const deleteQuery = `DELETE FROM reviews WHERE id = $1 RETURNING *`;
      const result = await query(deleteQuery, [reviewId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Review deleted successfully'
      });

    } catch (error: any) {
      console.error('Error deleting review:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete review',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

