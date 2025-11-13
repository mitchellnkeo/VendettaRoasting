import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await query('SELECT * FROM events WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }

      res.status(200).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const { title, description, event_date, location, address, price, max_attendees, is_active } = req.body;

      const result = await query(
        `UPDATE events 
         SET title = $1, description = $2, event_date = $3, location = $4, address = $5, 
             price = $6, max_attendees = $7, is_active = $8, updated_at = NOW()
         WHERE id = $9
         RETURNING *`,
        [title, description, event_date, location, address, price, max_attendees, is_active, id]
      );

      res.status(200).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      await query('DELETE FROM events WHERE id = $1', [id]);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

