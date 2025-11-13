import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await query('SELECT * FROM announcements WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Announcement not found' });
      }

      res.status(200).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error fetching announcement:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const { title, content, is_active, is_featured, published_at } = req.body;

      const result = await query(
        `UPDATE announcements 
         SET title = $1, content = $2, is_active = $3, is_featured = $4, published_at = $5, updated_at = NOW()
         WHERE id = $6
         RETURNING *`,
        [title, content, is_active, is_featured, published_at, id]
      );

      res.status(200).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error updating announcement:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      await query('DELETE FROM announcements WHERE id = $1', [id]);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting announcement:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

