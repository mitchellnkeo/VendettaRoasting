import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { query } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get authenticated user
    const session = await getServerSession(req, res, authOptions);
    
    // Allow viewing orders even if not logged in via NextAuth
    // We'll try to get email from session, or allow query by email parameter
    let userEmail: string | null = null;
    
    if (session && session.user?.email) {
      userEmail = session.user.email;
      console.log('User logged in via NextAuth:', userEmail);
    } else {
      // Try to get email from query parameter (for guest order lookup)
      const { email } = req.query;
      if (email && typeof email === 'string') {
        userEmail = email;
        console.log('Looking up orders by email parameter:', userEmail);
      } else {
        return res.status(401).json({ 
          success: false, 
          message: 'Please log in or provide your email to view orders.' 
        });
      }
    }

    // Find user by email (case-insensitive search)
    const userResult = await query(
      'SELECT id, email FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1',
      [userEmail]
    );

    if (!userResult || userResult.rows.length === 0) {
      console.log('User not found in database:', userEmail);
      console.log('Checking if any users exist in database...');
      
      // Debug: Check what users exist
      const allUsers = await query('SELECT email FROM users LIMIT 5');
      console.log('Sample users in database:', allUsers.rows.map((u: any) => u.email));
      
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No account found. Orders will appear here after your first purchase.',
      });
    }

    const userId = userResult.rows[0].id;
    console.log('Found user ID:', userId);

    // Fetch orders for this user
    const ordersResult = await query(
      `SELECT 
        o.id,
        o.order_number,
        o.status,
        o.payment_status,
        o.total_amount,
        o.created_at,
        o.updated_at
      FROM orders o
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC`,
      [userId]
    );

    if (!ordersResult || !ordersResult.rows || ordersResult.rows.length === 0) {
      console.log('No orders found for user:', userId);
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No orders found. Your order history will appear here after you place an order.',
      });
    }

    console.log(`Found ${ordersResult.rows.length} orders for user`);

    // Fetch order items for each order
    const ordersWithItems = await Promise.all(
      ordersResult.rows.map(async (order: any) => {
        const itemsResult = await query(
          `SELECT 
            product_name,
            quantity,
            unit_price,
            total_price
          FROM order_items
          WHERE order_id = $1
          ORDER BY created_at ASC`,
          [order.id]
        );

        return {
          id: order.order_number, // Use order_number for display
          orderId: order.id, // Keep UUID for internal use
          order_number: order.order_number,
          date: order.created_at,
          status: order.status,
          payment_status: order.payment_status,
          total: parseFloat(order.total_amount.toString()),
          items: itemsResult.rows.map((item: any) => ({
            name: item.product_name,
            quantity: item.quantity,
            price: parseFloat(item.unit_price.toString()),
          })),
        };
      })
    );

    res.status(200).json({
      success: true,
      data: ordersWithItems,
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}

