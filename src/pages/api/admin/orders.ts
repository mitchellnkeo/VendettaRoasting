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
          COALESCE(u.first_name || ' ' || u.last_name, 'Guest') as customer_name
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
      `;
      
      const params: any[] = [];
      let paramIndex = 1;
      
      if (status && typeof status === 'string' && status !== 'all') {
        ordersQuery += ` WHERE o.status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      }
      
      ordersQuery += ` ORDER BY o.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(parseInt(limit as string), parseInt(offset as string));

      const result = await query(ordersQuery, params);

      // If database is not connected, return empty array with a message
      if (!process.env.DATABASE_URL) {
        return res.status(200).json({
          success: true,
          data: [],
          total: 0,
          message: 'Database not configured. Orders will appear here once DATABASE_URL is set.',
        });
      }

      res.status(200).json({
        success: true,
        data: result.rows || [],
        total: result.rows?.length || 0,
      });
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      
      // Handle database connection errors gracefully
      if (error.code === 'ENOTFOUND' || error.message?.includes('DATABASE_URL')) {
        return res.status(200).json({
          success: true,
          data: [],
          total: 0,
          message: 'Database connection error. Please check your DATABASE_URL configuration.',
        });
      }

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

