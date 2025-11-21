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
      // Get total sales (sum of all paid orders)
      const salesResult = await query(
        `SELECT COALESCE(SUM(total_amount), 0) as total_sales
         FROM orders
         WHERE payment_status = 'paid'`
      );
      const totalSales = parseFloat(salesResult.rows[0]?.total_sales || '0');

      // Get pending orders count
      const pendingResult = await query(
        `SELECT COUNT(*) as count
         FROM orders
         WHERE status = 'pending'`
      );
      const pendingOrders = parseInt(pendingResult.rows[0]?.count || '0');

      // Get total customers count
      const customersResult = await query(
        `SELECT COUNT(DISTINCT user_id) as count
         FROM orders
         WHERE user_id IS NOT NULL`
      );
      const totalCustomers = parseInt(customersResult.rows[0]?.count || '0');

      // Get active subscriptions count (if subscriptions table exists)
      let activeSubscriptions = 0;
      try {
        const subscriptionsResult = await query(
          `SELECT COUNT(*) as count
           FROM subscriptions
           WHERE status = 'active'`
        );
        activeSubscriptions = parseInt(subscriptionsResult.rows[0]?.count || '0');
      } catch (error) {
        // Subscriptions table might not exist yet
        console.log('Subscriptions table not found, returning 0');
      }

      // Get recent orders (last 5)
      const recentOrdersResult = await query(
        `SELECT
          o.id,
          o.order_number,
          o.status,
          o.total_amount,
          o.created_at,
          u.email as customer_email,
          COALESCE(u.first_name || ' ' || u.last_name, 'Guest') as customer_name
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 5`
      );

      res.status(200).json({
        success: true,
        data: {
          totalSales,
          pendingOrders,
          totalCustomers,
          activeSubscriptions,
          recentOrders: recentOrdersResult.rows || [],
        },
      });
    } catch (error: any) {
      console.error('Error fetching admin stats:', error);
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

