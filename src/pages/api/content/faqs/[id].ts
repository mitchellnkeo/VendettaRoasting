import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await query('SELECT * FROM faqs WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'FAQ not found' });
      }

      res.status(200).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const { question, answer, category, sort_order, is_active } = req.body;

      const result = await query(
        `UPDATE faqs 
         SET question = $1, answer = $2, category = $3, sort_order = $4, is_active = $5, updated_at = NOW()
         WHERE id = $6
         RETURNING *`,
        [question, answer, category, sort_order, is_active, id]
      );

      res.status(200).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error updating FAQ:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      await query('DELETE FROM faqs WHERE id = $1', [id]);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

