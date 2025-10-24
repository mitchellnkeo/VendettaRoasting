import { NextApiRequest, NextApiResponse } from 'next';
import { createOrderConfirmationEmail, sendEmail } from '../../../lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { 
      orderId, 
      customerEmail, 
      customerName, 
      orderTotal, 
      items, 
      shippingAddress,
      estimatedDelivery 
    } = req.body;

    // Validate required fields
    if (!orderId || !customerEmail || !customerName || !orderTotal || !items) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields for email confirmation'
      });
    }

    // Create email template
    const emailData = createOrderConfirmationEmail({
      orderId,
      customerName,
      customerEmail,
      orderTotal,
      items,
      shippingAddress: shippingAddress || {
        street: 'Address not provided',
        city: 'City not provided',
        state: 'State not provided',
        zipCode: 'ZIP not provided',
        country: 'Country not provided'
      },
      estimatedDelivery: estimatedDelivery || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
    });

    // Send email
    const emailSent = await sendEmail(emailData);

    if (emailSent) {
      res.status(200).json({
        success: true,
        message: 'Order confirmation email sent successfully',
        data: {
          orderId,
          emailSent: true,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send confirmation email'
      });
    }

  } catch (error) {
    console.error('Error sending confirmation email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send confirmation email',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}
