import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { query } from '../../../../lib/database';
import { createOrderShippedEmail, createOrderDeliveredEmail, sendEmail } from '../../../../lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check authentication and admin role
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user?.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { orderId } = req.query;
  
  // Decode orderId if it's URL encoded
  const decodedOrderId = typeof orderId === 'string' ? decodeURIComponent(orderId) : orderId;

  if (req.method === 'GET') {
    try {
      // Fetch order with customer info
      // Try matching by UUID first, then by order_number
      const orderResult = await query(
        `SELECT 
          o.*,
          u.email as customer_email,
          u.first_name || ' ' || u.last_name as customer_name,
          u.phone as customer_phone
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.id::text = $1 OR o.order_number = $1`,
        [decodedOrderId]
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
      // First, get the current order to compare status changes
      const currentOrderResult = await query(
        `SELECT 
          o.*,
          u.email as customer_email,
          u.first_name || ' ' || u.last_name as customer_name
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.id::text = $1 OR o.order_number = $1`,
        [decodedOrderId]
      );

      if (currentOrderResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      const currentOrder = currentOrderResult.rows[0];
      const oldStatus = currentOrder.status;
      const { status, payment_status, notes, shipped_at, delivered_at, tracking_number, tracking_url } = req.body;

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

      // Handle tracking_number (store in notes or a separate field if exists)
      // For now, we'll append it to notes if provided
      if (tracking_number) {
        const trackingNote = `\n\nTracking Number: ${tracking_number}${tracking_url ? `\nTracking URL: ${tracking_url}` : ''}`;
        const updatedNotes = (currentOrder.notes || '') + trackingNote;
        updateFields.push(`notes = $${paramIndex++}`);
        updateValues.push(updatedNotes);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields to update' });
      }

      updateFields.push(`updated_at = NOW()`);
      updateValues.push(decodedOrderId);

      const updateQuery = `
        UPDATE orders 
        SET ${updateFields.join(', ')}
        WHERE id::text = $${paramIndex} OR order_number = $${paramIndex}
        RETURNING *
      `;

      const result = await query(updateQuery, updateValues);
      const updatedOrder = result.rows[0];

      // Send email notifications based on status changes
      const statusChanged = status && status !== oldStatus;
      
      if (statusChanged && status === 'shipped' && currentOrder.customer_email) {
        try {
          // Fetch order items for email
          const itemsResult = await query(
            `SELECT product_name, quantity FROM order_items WHERE order_id = $1`,
            [currentOrder.id]
          );

          const shippingAddress = typeof currentOrder.shipping_address === 'string' 
            ? JSON.parse(currentOrder.shipping_address) 
            : currentOrder.shipping_address;

          const estimatedDelivery = shipped_at 
            ? new Date(new Date(shipped_at).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
            : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString();

          const shippedEmail = createOrderShippedEmail({
            orderNumber: currentOrder.order_number,
            customerName: currentOrder.customer_name || 'Customer',
            customerEmail: currentOrder.customer_email,
            items: itemsResult.rows.map((item: any) => ({
              name: item.product_name,
              quantity: item.quantity
            })),
            shippingAddress: shippingAddress || {
              street: 'Address not provided',
              city: 'City not provided',
              state: 'State not provided',
              zipCode: 'ZIP not provided',
              country: 'Country not provided'
            },
            trackingNumber: tracking_number,
            trackingUrl: tracking_url,
            estimatedDelivery
          });

          await sendEmail(shippedEmail);
          console.log('✅ Order shipped email sent successfully');
        } catch (emailError) {
          console.error('Error sending shipped email:', emailError);
          // Don't fail the update if email fails
        }
      }

      if (statusChanged && status === 'delivered' && currentOrder.customer_email) {
        try {
          // Fetch order items for email
          const itemsResult = await query(
            `SELECT product_name, quantity FROM order_items WHERE order_id = $1`,
            [currentOrder.id]
          );

          const deliveredDate = delivered_at 
            ? new Date(delivered_at).toLocaleDateString()
            : new Date().toLocaleDateString();

          const deliveredEmail = createOrderDeliveredEmail({
            orderNumber: currentOrder.order_number,
            customerName: currentOrder.customer_name || 'Customer',
            customerEmail: currentOrder.customer_email,
            items: itemsResult.rows.map((item: any) => ({
              name: item.product_name,
              quantity: item.quantity
            })),
            deliveredDate
          });

          await sendEmail(deliveredEmail);
          console.log('✅ Order delivered email sent successfully');
        } catch (emailError) {
          console.error('Error sending delivered email:', emailError);
          // Don't fail the update if email fails
        }
      }

      res.status(200).json({
        success: true,
        data: updatedOrder,
        emailSent: statusChanged && (status === 'shipped' || status === 'delivered')
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

