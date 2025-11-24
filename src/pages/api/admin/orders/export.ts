import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { query } from '../../../../lib/database';

// Helper function to escape CSV fields
function escapeCSV(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  const stringValue = String(value);
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

// Helper function to format date
function formatDate(date: string | Date | null): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check authentication and admin role
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user?.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { 
      status, 
      startDate, 
      endDate,
      limit = '10000' // Large limit for exports
    } = req.query;

    // Build query to fetch orders with all details
    let ordersQuery = `
      SELECT 
        o.id,
        o.order_number,
        o.status,
        o.payment_status,
        o.subtotal,
        o.tax_amount,
        o.shipping_amount,
        o.total_amount,
        o.currency,
        o.payment_method,
        o.shipping_address,
        o.billing_address,
        o.notes,
        o.shipped_at,
        o.delivered_at,
        o.created_at,
        o.updated_at,
        u.email as customer_email,
        u.first_name as customer_first_name,
        u.last_name as customer_last_name,
        u.phone as customer_phone
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;
    
    if (status && typeof status === 'string' && status !== 'all') {
      ordersQuery += ` AND o.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (startDate && typeof startDate === 'string') {
      ordersQuery += ` AND o.created_at >= $${paramIndex}`;
      params.push(new Date(startDate).toISOString());
      paramIndex++;
    }

    if (endDate && typeof endDate === 'string') {
      ordersQuery += ` AND o.created_at <= $${paramIndex}`;
      params.push(new Date(endDate).toISOString());
      paramIndex++;
    }
    
    ordersQuery += ` ORDER BY o.created_at DESC LIMIT $${paramIndex}`;
    params.push(parseInt(limit as string));

    const ordersResult = await query(ordersQuery, params);
    const orders = ordersResult.rows || [];

    // Fetch order items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order: any) => {
        const itemsResult = await query(
          `SELECT 
            product_name,
            product_sku,
            quantity,
            unit_price,
            total_price
          FROM order_items
          WHERE order_id = $1
          ORDER BY created_at ASC`,
          [order.id]
        );
        return {
          ...order,
          items: itemsResult.rows || []
        };
      })
    );

    // Generate CSV content
    const csvRows: string[] = [];

    // CSV Header
    csvRows.push([
      'Order Number',
      'Order Date',
      'Status',
      'Payment Status',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Shipping Address',
      'Billing Address',
      'Item Name',
      'Item SKU',
      'Quantity',
      'Unit Price',
      'Item Total',
      'Subtotal',
      'Tax',
      'Shipping',
      'Total',
      'Currency',
      'Payment Method',
      'Shipped Date',
      'Delivered Date',
      'Notes'
    ].map(escapeCSV).join(','));

    // CSV Data Rows
    ordersWithItems.forEach((order: any) => {
      const shippingAddress = typeof order.shipping_address === 'string' 
        ? JSON.parse(order.shipping_address) 
        : order.shipping_address || {};
      const billingAddress = typeof order.billing_address === 'string' 
        ? JSON.parse(order.billing_address) 
        : order.billing_address || {};

      const shippingAddressStr = [
        shippingAddress.street,
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.zipCode,
        shippingAddress.country
      ].filter(Boolean).join(', ');

      const billingAddressStr = [
        billingAddress.street,
        billingAddress.city,
        billingAddress.state,
        billingAddress.zipCode,
        billingAddress.country
      ].filter(Boolean).join(', ');

      const customerName = order.customer_first_name || order.customer_last_name
        ? `${order.customer_first_name || ''} ${order.customer_last_name || ''}`.trim()
        : 'Guest';

      // If order has items, create one row per item
      if (order.items && order.items.length > 0) {
        order.items.forEach((item: any, index: number) => {
          const row = [
            order.order_number,
            formatDate(order.created_at),
            order.status,
            order.payment_status,
            customerName,
            order.customer_email || '',
            order.customer_phone || '',
            shippingAddressStr,
            billingAddressStr,
            item.product_name || '',
            item.product_sku || '',
            item.quantity,
            parseFloat(item.unit_price?.toString() || '0').toFixed(2),
            parseFloat(item.total_price?.toString() || '0').toFixed(2),
            // Only show totals on first row of each order
            index === 0 ? parseFloat(order.subtotal?.toString() || '0').toFixed(2) : '',
            index === 0 ? parseFloat(order.tax_amount?.toString() || '0').toFixed(2) : '',
            index === 0 ? parseFloat(order.shipping_amount?.toString() || '0').toFixed(2) : '',
            index === 0 ? parseFloat(order.total_amount?.toString() || '0').toFixed(2) : '',
            index === 0 ? (order.currency || 'USD') : '',
            index === 0 ? (order.payment_method || '') : '',
            index === 0 ? formatDate(order.shipped_at) : '',
            index === 0 ? formatDate(order.delivered_at) : '',
            index === 0 ? (order.notes || '').replace(/\n/g, ' ') : ''
          ].map(escapeCSV).join(',');
          csvRows.push(row);
        });
      } else {
        // Order with no items (shouldn't happen, but handle it)
        const row = [
          order.order_number,
          formatDate(order.created_at),
          order.status,
          order.payment_status,
          customerName,
          order.customer_email || '',
          order.customer_phone || '',
          shippingAddressStr,
          billingAddressStr,
          '',
          '',
          '',
          '',
          '',
          parseFloat(order.subtotal?.toString() || '0').toFixed(2),
          parseFloat(order.tax_amount?.toString() || '0').toFixed(2),
          parseFloat(order.shipping_amount?.toString() || '0').toFixed(2),
          parseFloat(order.total_amount?.toString() || '0').toFixed(2),
          order.currency || 'USD',
          order.payment_method || '',
          formatDate(order.shipped_at),
          formatDate(order.delivered_at),
          (order.notes || '').replace(/\n/g, ' ')
        ].map(escapeCSV).join(',');
        csvRows.push(row);
      }
    });

    const csvContent = csvRows.join('\n');

    // Set headers for CSV download
    const filename = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);

  } catch (error: any) {
    console.error('Error exporting orders:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error exporting orders',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}

