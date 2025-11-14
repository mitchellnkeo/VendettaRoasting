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
      const { status, limit = '50', offset = '0' } = req.query;
      
      let ordersQuery = `
        SELECT 
          o.id,
          o.order_number,
          o.status,
          o.payment_status,
          o.total_amount,
          o.created_at,
          o.updated_at,
          u.email as customer_email,
          u.first_name || ' ' || u.last_name as customer_name
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
      `;
      
      const params: any[] = [];
      
      if (status && typeof status === 'string') {
        ordersQuery += ` WHERE o.status = $1`;
        params.push(status);
      }
      
      ordersQuery += ` ORDER BY o.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(parseInt(limit as string), parseInt(offset as string));

      const result = await query(ordersQuery, params);

      res.status(200).json({
        success: true,
        data: result.rows,
        total: result.rows.length,
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
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

