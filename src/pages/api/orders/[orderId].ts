import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { orderId } = req.query;

    if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Fetch order from database
    // Try to find order by ID or order_number
    const orderResult = await query(
      `SELECT
        o.*,
        u.email as customer_email,
        u.first_name || ' ' || u.last_name as customer_name,
        u.phone as customer_phone
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id::text = $1 OR o.order_number = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    // Fetch order items
    const itemsResult = await query(
      `SELECT
        oi.*,
        p.name as product_name,
        p.slug as product_slug,
        p.image_url
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
      ORDER BY oi.created_at ASC`,
      [order.id]
    );

    // Transform to match expected format
    const transformedOrder = {
      id: order.id,
      order_number: order.order_number,
      paymentIntentId: order.stripe_payment_intent_id,
      items: itemsResult.rows.map((item: any) => ({
        productId: item.product_id,
        name: item.product_name || item.product_name,
        price: parseFloat(item.unit_price.toString()),
        quantity: item.quantity,
        image: item.image_url || '/images/placeholder-coffee.jpg'
      })),
      customer: {
        firstName: order.shipping_address?.firstName || order.customer_name?.split(' ')[0] || '',
        lastName: order.shipping_address?.lastName || order.customer_name?.split(' ').slice(1).join(' ') || '',
        email: order.customer_email || order.shipping_address?.email || '',
        phone: order.customer_phone || order.shipping_address?.phone || ''
      },
      shipping: {
        address: order.shipping_address || {},
        method: order.shipping_method || 'standard',
        cost: parseFloat(order.shipping_amount?.toString() || '0'),
        trackingNumber: order.tracking_number || null
      },
      totals: {
        subtotal: parseFloat(order.subtotal?.toString() || '0'),
        shipping: parseFloat(order.shipping_amount?.toString() || '0'),
        tax: parseFloat(order.tax_amount?.toString() || '0'),
        total: parseFloat(order.total_amount?.toString() || '0')
      },
      status: order.status,
      payment_status: order.payment_status,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      shipped_at: order.shipped_at,
      delivered_at: order.delivered_at,
      tracking: {
        status: order.status,
        estimatedDelivery: order.shipped_at 
          ? new Date(new Date(order.shipped_at).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()
          : null,
        history: [
          {
            status: 'confirmed',
            timestamp: order.created_at,
            description: 'Order confirmed'
          },
          ...(order.status !== 'pending' ? [{
            status: 'processing',
            timestamp: order.updated_at,
            description: 'Order is being prepared'
          }] : []),
          ...(order.shipped_at ? [{
            status: 'shipped',
            timestamp: order.shipped_at,
            description: 'Order shipped'
          }] : []),
          ...(order.delivered_at ? [{
            status: 'delivered',
            timestamp: order.delivered_at,
            description: 'Order delivered'
          }] : [])
        ]
      }
    };

    res.status(200).json({
      success: true,
      data: transformedOrder
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}
