import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../../lib/stripe';

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

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create order object
    const order = {
      id: orderId,
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
        subtotal: totalAmount - shippingCost,
        shipping: shippingCost,
        total: totalAmount
      },
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // In a real application, you would:
    // 1. Save order to database
    // 2. Update product inventory
    // 3. Send confirmation email
    // 4. Create order tracking

    // For now, we'll simulate order creation
    console.log('Order created:', order);

    // Send confirmation email
    try {
      const emailResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/orders/send-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
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
        orderId: order.id,
        status: order.status,
        total: order.totals.total,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}
