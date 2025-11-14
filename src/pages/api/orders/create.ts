import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../../lib/stripe';
import { query, getClient } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      paymentIntentId,
      items,
      shippingAddress,
      customerInfo,
      totalAmount,
      shippingMethod,
      shippingCost
    } = req.body;

    // Validate required fields
    if (!paymentIntentId || !items || !shippingAddress || !customerInfo || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }

    // Calculate totals
    const subtotal = totalAmount - (shippingCost || 0);
    const taxAmount = 0; // Calculate tax if needed
    const finalTotal = totalAmount;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Check if user exists, create if not (for guest checkout)
    let userId = null;
    try {
      // Try to find existing user by email
      const userResult = await query(
        'SELECT id FROM users WHERE email = $1 LIMIT 1',
        [customerInfo.email]
      );

      if (userResult.rows.length > 0) {
        userId = userResult.rows[0].id;
      } else {
        // Create guest user for the order
        const newUserResult = await query(
          `INSERT INTO users (email, first_name, last_name, phone, role, created_at)
           VALUES ($1, $2, $3, $4, 'customer', NOW())
           RETURNING id`,
          [
            customerInfo.email,
            customerInfo.firstName,
            customerInfo.lastName,
            customerInfo.phone || null
          ]
        );
        userId = newUserResult.rows[0].id;
      }
    } catch (userError) {
      console.error('Error handling user:', userError);
      // Continue without user_id if database fails (guest order)
    }

    // Save order to database
    let orderId: string;
    try {
      const orderResult = await query(
        `INSERT INTO orders (
          order_number, user_id, status, payment_status,
          subtotal, tax_amount, shipping_amount, total_amount,
          payment_method, stripe_payment_intent_id,
          shipping_address, billing_address,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
        RETURNING id, order_number`,
        [
          orderNumber,
          userId,
          'pending', // Start as pending, admin can update
          'paid', // Payment succeeded
          subtotal,
          taxAmount,
          shippingCost || 0,
          finalTotal,
          'stripe',
          paymentIntentId,
          JSON.stringify(shippingAddress),
          JSON.stringify(shippingAddress), // Use shipping as billing for now
        ]
      );

      orderId = orderResult.rows[0].id;
      const savedOrderNumber = orderResult.rows[0].order_number;

      // Save order items
      for (const item of items) {
        try {
          await query(
            `INSERT INTO order_items (
              order_id, product_id, product_name, product_sku,
              quantity, unit_price, total_price, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
            [
              orderId,
              item.id || null, // Product ID if available
              item.name,
              item.sku || null,
              item.quantity,
              item.price,
              item.price * item.quantity
            ]
          );
        } catch (itemError) {
          console.error('Error saving order item:', itemError);
          // Continue with other items
        }
      }

      // Create order object for response
      const order = {
        id: orderId,
        order_number: savedOrderNumber,
        paymentIntentId,
        items: items.map((item: any) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        customer: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone
        },
        shipping: {
          address: shippingAddress,
          method: shippingMethod,
          cost: shippingCost
        },
        totals: {
          subtotal,
          shipping: shippingCost || 0,
          total: finalTotal
        },
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('✅ Order saved to database:', savedOrderNumber);

      // Send confirmation email
      try {
        const emailResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/orders/send-confirmation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: savedOrderNumber,
            customerEmail: order.customer.email,
            customerName: `${order.customer.firstName} ${order.customer.lastName}`,
            orderTotal: order.totals.total,
            items: order.items,
            shippingAddress: order.shipping.address,
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
          })
        });

        if (emailResponse.ok) {
          console.log('✅ Confirmation email sent successfully');
        } else {
          console.log('⚠️ Failed to send confirmation email');
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Don't fail the order creation if email fails
      }

      res.status(201).json({
        success: true,
        data: {
          orderId: savedOrderNumber,
          orderUuid: orderId,
          status: order.status,
          total: order.totals.total,
          createdAt: order.createdAt
        }
      });
    } catch (dbError: any) {
      console.error('Database error creating order:', dbError);
      
      // If database fails, still return success but log the error
      // This allows the payment to complete even if DB is down
      res.status(201).json({
        success: true,
        warning: 'Order payment processed but database save failed. Please contact support.',
        data: {
          orderId: orderNumber,
          status: 'pending',
          total: finalTotal,
          createdAt: new Date().toISOString()
        }
      });
    }

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}
