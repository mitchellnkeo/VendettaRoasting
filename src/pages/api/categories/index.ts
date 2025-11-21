import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const categoriesResult = await query(
      `SELECT 
        id,
        name,
        slug,
        description,
        image_url,
        is_active,
        sort_order,
        created_at,
        updated_at
      FROM categories
      WHERE is_active = true
      ORDER BY sort_order ASC, name ASC`
    );
    
    res.status(200).json({
      success: true,
      data: categoriesResult.rows || []
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  }
}
