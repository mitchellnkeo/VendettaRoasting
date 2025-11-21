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

      let subscriptionsQuery = `
        SELECT 
          s.id,
          s.stripe_subscription_id,
          s.status,
          s.plan_name,
          s.plan_price,
          s.frequency,
          s.next_delivery_date,
          s.is_active,
          s.created_at,
          s.updated_at,
          u.email as customer_email,
          u.first_name || ' ' || u.last_name as customer_name
        FROM subscriptions s
        LEFT JOIN users u ON s.user_id = u.id
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (status && typeof status === 'string' && status !== 'all') {
        subscriptionsQuery += ` WHERE s.status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      }

      subscriptionsQuery += ` 
        ORDER BY s.created_at DESC 
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      params.push(parseInt(limit as string), parseInt(offset as string));

      const result = await query(subscriptionsQuery, params);

      // Fetch subscription items for each subscription
      const subscriptionsWithItems = await Promise.all(
        (result.rows || []).map(async (sub: any) => {
          try {
            const itemsResult = await query(
              `SELECT 
                si.*,
                p.name as product_name,
                p.slug as product_slug
              FROM subscription_items si
              LEFT JOIN products p ON si.product_id = p.id
              WHERE si.subscription_id = $1`,
              [sub.id]
            );
            return {
              ...sub,
              items: itemsResult.rows || [],
            };
          } catch (error) {
            console.error('Error fetching subscription items:', error);
            return {
              ...sub,
              items: [],
            };
          }
        })
      );

      res.status(200).json({
        success: true,
        data: subscriptionsWithItems,
        total: subscriptionsWithItems.length,
      });
    } catch (error: any) {
      console.error('Error fetching subscriptions:', error);
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

