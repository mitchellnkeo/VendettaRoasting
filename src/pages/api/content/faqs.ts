import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const result = await query(
        'SELECT * FROM faqs WHERE is_active = true ORDER BY sort_order ASC, created_at ASC'
      );

      res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  } else if (req.method === 'POST') {
    // Create new FAQ (admin only)
    try {
      const { question, answer, category, sort_order, is_active } = req.body;

      if (!question || !answer) {
        return res.status(400).json({
          success: false,
          message: 'Question and answer are required'
        });
      }

      const result = await query(
        `INSERT INTO faqs (question, answer, category, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          question,
          answer,
          category || 'general',
          sort_order || 0,
          is_active ?? true
        ]
      );

      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error creating FAQ:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
