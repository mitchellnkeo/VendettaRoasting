import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../../lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      planId,
      customerEmail,
      customerName,
      paymentMethodId,
      deliveryFrequency,
      coffeePreferences,
      shippingAddress
    } = req.body;

    // Validate required fields
    if (!planId || !customerEmail || !customerName || !paymentMethodId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields for subscription creation'
      });
    }

    // In a real application, you would:
    // 1. Create or retrieve Stripe customer
    // 2. Create subscription with the selected plan
    // 3. Set up payment method
    // 4. Configure delivery preferences
    // 5. Save subscription to database

    // For now, we'll simulate subscription creation
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate Stripe customer creation
    const customer = {
      id: `cus_${Date.now()}`,
      email: customerEmail,
      name: customerName
    };

    // Simulate subscription creation
    const subscription = {
      id: subscriptionId,
      customerId: customer.id,
      planId,
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      nextDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      deliveryFrequency: deliveryFrequency || 'monthly',
      items: [
        {
          productId: 'prod_subscription_coffee',
          name: 'Premium Coffee Subscription',
          quantity: 1,
          price: 24.99
        }
      ],
      preferences: coffeePreferences || ['medium'],
      shippingAddress: shippingAddress || {}
    };

    console.log('🎯 SUBSCRIPTION CREATED:');
    console.log('Subscription ID:', subscription.id);
    console.log('Customer:', customer.name, customer.email);
    console.log('Plan:', planId);
    console.log('Status:', subscription.status);
    console.log('Next Delivery:', subscription.nextDelivery);

    res.status(201).json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        customerId: customer.id,
        status: subscription.status,
        nextDelivery: subscription.nextDelivery,
        currentPeriodEnd: subscription.currentPeriodEnd
      }
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subscription',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}
