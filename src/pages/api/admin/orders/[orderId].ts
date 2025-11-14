import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { query } from '../../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check authentication and admin role
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user?.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { orderId } = req.query;

  if (req.method === 'GET') {
    try {
      // Fetch order with customer info
      const orderResult = await query(
        `SELECT 
          o.*,
          u.email as customer_email,
          u.first_name || ' ' || u.last_name as customer_name,
          u.phone as customer_phone
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.id = $1 OR o.order_number = $1`,
        [orderId]
      );

      if (orderResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      const order = orderResult.rows[0];

      // Fetch order items
      const itemsResult = await query(
        `SELECT 
          oi.*,
          p.name as product_name,
          p.slug as product_slug
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = $1
        ORDER BY oi.created_at ASC`,
        [order.id]
      );

      res.status(200).json({
        success: true,
        data: {
          ...order,
          items: itemsResult.rows,
        },
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const { status, payment_status, notes, shipped_at, delivered_at } = req.body;

      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramIndex = 1;

      if (status) {
        updateFields.push(`status = $${paramIndex++}`);
        updateValues.push(status);
      }

      if (payment_status) {
        updateFields.push(`payment_status = $${paramIndex++}`);
        updateValues.push(payment_status);
      }

      if (notes !== undefined) {
        updateFields.push(`notes = $${paramIndex++}`);
        updateValues.push(notes);
      }

      if (shipped_at !== undefined) {
        updateFields.push(`shipped_at = $${paramIndex++}`);
        updateValues.push(shipped_at ? new Date(shipped_at).toISOString() : null);
      }

      if (delivered_at !== undefined) {
        updateFields.push(`delivered_at = $${paramIndex++}`);
        updateValues.push(delivered_at ? new Date(delivered_at).toISOString() : null);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields to update' });
      }

      updateFields.push(`updated_at = NOW()`);
      updateValues.push(orderId);

      const updateQuery = `
        UPDATE orders 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex} OR order_number = $${paramIndex}
        RETURNING *
      `;

      const result = await query(updateQuery, updateValues);

      res.status(200).json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

