import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { query } from '../../../../lib/database';
import { createReviewRequestEmail, sendEmail } from '../../../../lib/email';
import { sanityClient } from '../../../../lib/sanity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check authentication and admin role
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user?.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { orderId } = req.body;

      if (!orderId) {
        return res.status(400).json({ success: false, message: 'Order ID is required' });
      }

      // Fetch order details
      const orderResult = await query(
        `SELECT 
          o.id,
          o.order_number,
          o.status,
          o.delivered_at,
          o.created_at,
          u.email as customer_email,
          COALESCE(u.first_name || ' ' || u.last_name, 'Guest') as customer_name
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.id::text = $1 OR o.order_number = $1`,
        [orderId]
      );

      if (orderResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      const order = orderResult.rows[0];

      // Check if order is delivered
      if (order.status !== 'delivered') {
        return res.status(400).json({ 
          success: false, 
          message: 'Review requests can only be sent for delivered orders' 
        });
      }

      // Check if customer email exists
      if (!order.customer_email) {
        return res.status(400).json({ 
          success: false, 
          message: 'Customer email not found for this order' 
        });
      }

      // Fetch order items with product information
      const itemsResult = await query(
        `SELECT 
          oi.product_name,
          oi.product_sku,
          oi.quantity,
          oi.product_id,
          p.slug as product_slug
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = $1
        ORDER BY oi.created_at ASC`,
        [order.id]
      );

      // Get product slugs from Sanity (products are managed in Sanity)
      const items = await Promise.all(
        itemsResult.rows.map(async (item: any) => {
          let productSlug = item.product_slug;
          let productId = item.product_id;

          // Try to find product by SKU in Sanity first (most reliable)
          if (!productSlug && item.product_sku) {
            try {
              const sanityProduct = await sanityClient.fetch(
                `*[_type == "product" && sku == $sku][0] {
                  _id,
                  "slug": slug.current,
                  name
                }`,
                { sku: item.product_sku }
              );
              
              if (sanityProduct) {
                productSlug = sanityProduct.slug || '';
                productId = sanityProduct._id;
              }
            } catch (error) {
              console.error('Error fetching product by SKU from Sanity:', error);
            }
          }

          // If still no slug, try to find by product name (less reliable but better than nothing)
          if (!productSlug && item.product_name) {
            try {
              const sanityProduct = await sanityClient.fetch(
                `*[_type == "product" && name match $name][0] {
                  _id,
                  "slug": slug.current,
                  name
                }`,
                { name: `*${item.product_name}*` }
              );
              
              if (sanityProduct) {
                productSlug = sanityProduct.slug || '';
                productId = sanityProduct._id;
              }
            } catch (error) {
              console.error('Error fetching product by name from Sanity:', error);
            }
          }

          // Fallback: create a slug from product name
          if (!productSlug) {
            productSlug = item.product_name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
          }

          return {
            name: item.product_name,
            productSlug: productSlug || 'product',
            productId: productId || item.product_id,
            quantity: item.quantity,
          };
        })
      );

      if (items.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'No items found for this order' 
        });
      }

      // Get delivered date
      const deliveredDate = order.delivered_at 
        ? new Date(order.delivered_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        : new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });

      // Create and send review request email
      const reviewRequestEmail = createReviewRequestEmail({
        orderNumber: order.order_number,
        customerName: order.customer_name || 'Customer',
        customerEmail: order.customer_email,
        items,
        deliveredDate,
      });

      await sendEmail(reviewRequestEmail);

      // Optionally, track that review request was sent (could add a field to orders table)
      // For now, we'll just log it
      console.log(`✅ Review request email sent for order #${order.order_number}`);

      res.status(200).json({
        success: true,
        message: 'Review request email sent successfully',
      });
    } catch (error: any) {
      console.error('Error sending review request email:', error);
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

