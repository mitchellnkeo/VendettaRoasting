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
      const { period = '30', startDate, endDate } = req.query;
      
      // Calculate date range
      let dateFilter = '';
      const params: any[] = [];
      let paramIndex = 1;

      if (startDate && endDate && typeof startDate === 'string' && typeof endDate === 'string') {
        dateFilter = `WHERE o.created_at >= $${paramIndex} AND o.created_at <= $${paramIndex + 1}`;
        params.push(new Date(startDate).toISOString(), new Date(endDate).toISOString());
        paramIndex += 2;
      } else {
        // Default to last N days
        const days = parseInt(period as string) || 30;
        dateFilter = `WHERE o.created_at >= NOW() - INTERVAL '${days} days'`;
        // No params needed for this case
      }

      // Revenue trends (daily for last 30 days, weekly for last 12 weeks, monthly for last 12 months)
      const revenueTrendsDailyQuery = `SELECT 
        DATE(o.created_at) as date,
        COALESCE(SUM(o.total_amount), 0) as revenue,
        COUNT(*) as orders
      FROM orders o
      ${dateFilter}
      AND o.payment_status = 'paid'
      GROUP BY DATE(o.created_at)
      ORDER BY date ASC`;
      
      const revenueTrendsDaily = params.length > 0 
        ? await query(revenueTrendsDailyQuery, params)
        : await query(revenueTrendsDailyQuery);

      const revenueTrendsWeeklyQuery = `SELECT 
        DATE_TRUNC('week', o.created_at) as week,
        COALESCE(SUM(o.total_amount), 0) as revenue,
        COUNT(*) as orders
      FROM orders o
      ${dateFilter}
      AND o.payment_status = 'paid'
      GROUP BY DATE_TRUNC('week', o.created_at)
      ORDER BY week ASC`;
      
      const revenueTrendsWeekly = params.length > 0
        ? await query(revenueTrendsWeeklyQuery, params)
        : await query(revenueTrendsWeeklyQuery);

      const revenueTrendsMonthlyQuery = `SELECT 
        DATE_TRUNC('month', o.created_at) as month,
        COALESCE(SUM(o.total_amount), 0) as revenue,
        COUNT(*) as orders
      FROM orders o
      ${dateFilter}
      AND o.payment_status = 'paid'
      GROUP BY DATE_TRUNC('month', o.created_at)
      ORDER BY month ASC`;
      
      const revenueTrendsMonthly = params.length > 0
        ? await query(revenueTrendsMonthlyQuery, params)
        : await query(revenueTrendsMonthlyQuery);

      // Top products (best sellers)
      const topProductsQuery = `SELECT 
        oi.product_name,
        oi.product_sku,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.total_price) as total_revenue,
        COUNT(DISTINCT oi.order_id) as order_count
      FROM order_items oi
      INNER JOIN orders o ON oi.order_id = o.id
      ${dateFilter}
      AND o.payment_status = 'paid'
      GROUP BY oi.product_name, oi.product_sku
      ORDER BY total_revenue DESC
      LIMIT 10`;
      
      const topProducts = params.length > 0
        ? await query(topProductsQuery, params)
        : await query(topProductsQuery);

      // Customer metrics
      const newCustomersQuery = `SELECT COUNT(DISTINCT o.user_id) as count
      FROM orders o
      ${dateFilter}
      AND o.user_id IS NOT NULL
      AND o.id = (
        SELECT MIN(o2.id)
        FROM orders o2
        WHERE o2.user_id = o.user_id
      )`;
      
      const newCustomers = params.length > 0
        ? await query(newCustomersQuery, params)
        : await query(newCustomersQuery);

      const repeatCustomersQuery = `SELECT COUNT(DISTINCT o.user_id) as count
      FROM orders o
      ${dateFilter}
      AND o.user_id IS NOT NULL
      AND (
        SELECT COUNT(*)
        FROM orders o2
        WHERE o2.user_id = o.user_id
      ) > 1`;
      
      const repeatCustomers = params.length > 0
        ? await query(repeatCustomersQuery, params)
        : await query(repeatCustomersQuery);

      // Order status breakdown
      const orderStatusBreakdownQuery = `SELECT 
        o.status,
        COUNT(*) as count,
        COALESCE(SUM(o.total_amount), 0) as revenue
      FROM orders o
      ${dateFilter}
      GROUP BY o.status
      ORDER BY count DESC`;
      
      const orderStatusBreakdown = params.length > 0
        ? await query(orderStatusBreakdownQuery, params)
        : await query(orderStatusBreakdownQuery);

      // Average order value
      const avgOrderValueQuery = `SELECT 
        COALESCE(AVG(o.total_amount), 0) as avg_value,
        COALESCE(MIN(o.total_amount), 0) as min_value,
        COALESCE(MAX(o.total_amount), 0) as max_value
      FROM orders o
      ${dateFilter}
      AND o.payment_status = 'paid'`;
      
      const avgOrderValue = params.length > 0
        ? await query(avgOrderValueQuery, params)
        : await query(avgOrderValueQuery);

      // Total revenue and orders
      const totalsQuery = `SELECT 
        COALESCE(SUM(o.total_amount), 0) as total_revenue,
        COUNT(*) as total_orders,
        COUNT(DISTINCT o.user_id) as unique_customers
      FROM orders o
      ${dateFilter}
      AND o.payment_status = 'paid'`;
      
      const totals = params.length > 0
        ? await query(totalsQuery, params)
        : await query(totalsQuery);

      res.status(200).json({
        success: true,
        data: {
          revenueTrends: {
            daily: revenueTrendsDaily.rows || [],
            weekly: revenueTrendsWeekly.rows || [],
            monthly: revenueTrendsMonthly.rows || [],
          },
          topProducts: topProducts.rows || [],
          customerMetrics: {
            newCustomers: parseInt(newCustomers.rows[0]?.count || '0'),
            repeatCustomers: parseInt(repeatCustomers.rows[0]?.count || '0'),
          },
          orderStatusBreakdown: orderStatusBreakdown.rows || [],
          averageOrderValue: {
            avg: parseFloat(avgOrderValue.rows[0]?.avg_value || '0'),
            min: parseFloat(avgOrderValue.rows[0]?.min_value || '0'),
            max: parseFloat(avgOrderValue.rows[0]?.max_value || '0'),
          },
          totals: {
            revenue: parseFloat(totals.rows[0]?.total_revenue || '0'),
            orders: parseInt(totals.rows[0]?.total_orders || '0'),
            customers: parseInt(totals.rows[0]?.unique_customers || '0'),
          },
        },
      });
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
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

