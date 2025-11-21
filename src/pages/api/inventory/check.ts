import { NextApiRequest, NextApiResponse } from 'next';
import { checkInventory } from '../../../lib/inventory';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required'
      });
    }

    const inventoryCheck = await checkInventory(productId, parseInt(quantity));

    res.status(200).json({
      success: true,
      data: inventoryCheck
    });
  } catch (error) {
    console.error('Error checking inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

