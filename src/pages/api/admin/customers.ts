import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { query } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check authentication and admin role
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user?.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const { search, limit = '50', offset = '0' } = req.query;

      let customersQuery = `
        SELECT 
          u.id,
          u.email,
          u.first_name,
          u.last_name,
          u.phone,
          u.role,
          u.is_active,
          u.created_at,
          COUNT(DISTINCT o.id) as total_orders,
          COALESCE(SUM(CASE WHEN o.payment_status = 'paid' THEN o.total_amount ELSE 0 END), 0) as total_spent
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        WHERE u.role = 'customer'
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (search && typeof search === 'string') {
        customersQuery += ` AND (
          u.email ILIKE $${paramIndex} OR 
          u.first_name ILIKE $${paramIndex} OR 
          u.last_name ILIKE $${paramIndex}
        )`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      customersQuery += ` 
        GROUP BY u.id, u.email, u.first_name, u.last_name, u.phone, u.role, u.is_active, u.created_at
        ORDER BY u.created_at DESC 
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      params.push(parseInt(limit as string), parseInt(offset as string));

      const result = await query(customersQuery, params);

      res.status(200).json({
        success: true,
        data: result.rows || [],
        total: result.rows?.length || 0,
      });
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

