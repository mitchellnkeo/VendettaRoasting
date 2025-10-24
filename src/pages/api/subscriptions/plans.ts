import { NextApiRequest, NextApiResponse } from 'next';
import { SUBSCRIPTION_PLANS } from '../../../lib/subscription';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // In a real application, you would:
    // 1. Fetch plans from Stripe
    // 2. Apply any user-specific pricing or discounts
    // 3. Filter plans based on user eligibility

    res.status(200).json({
      success: true,
      data: SUBSCRIPTION_PLANS
    });

  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}
