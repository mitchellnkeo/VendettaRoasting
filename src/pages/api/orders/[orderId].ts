import { NextApiRequest, NextApiResponse } from 'next';

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

    // In a real application, you would fetch the order from the database
    // For now, we'll return a mock order
    const mockOrder = {
      id: orderId,
      paymentIntentId: 'pi_mock_payment_intent',
      items: [
        {
          productId: 'prod_1',
          name: 'Ethiopian Yirgacheffe',
          price: 18.99,
          quantity: 2,
          image: '/images/ethiopian-yirgacheffe.jpg'
        }
      ],
      customer: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890'
      },
      shipping: {
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'US'
        },
        method: 'standard',
        cost: 0,
        trackingNumber: 'TRK123456789'
      },
      totals: {
        subtotal: 37.98,
        shipping: 0,
        total: 37.98
      },
      status: 'shipped',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tracking: {
        status: 'shipped',
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        history: [
          {
            status: 'confirmed',
            timestamp: new Date().toISOString(),
            description: 'Order confirmed'
          },
          {
            status: 'processing',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            description: 'Order is being prepared'
          },
          {
            status: 'shipped',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            description: 'Order shipped'
          }
        ]
      }
    };

    res.status(200).json({
      success: true,
      data: mockOrder
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
