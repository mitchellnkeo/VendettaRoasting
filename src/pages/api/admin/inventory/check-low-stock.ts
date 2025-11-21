import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { getLowStockProducts } from '../../../../lib/inventory';
import { createLowStockAlertEmail, sendEmail } from '../../../../lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check authentication and admin role
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user?.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { threshold = 10 } = req.body;

    // Get low stock products
    const lowStockProducts = await getLowStockProducts(threshold);

    if (lowStockProducts.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No products with low stock',
        data: []
      });
    }

    // Transform products for email
    const productsForEmail = lowStockProducts.map((product: any) => ({
      name: product.name,
      sku: product.sku || 'N/A',
      currentInventory: product.inventoryQuantity || 0,
      threshold: product.lowStockThreshold || threshold
    }));

    // Send email alert
    const emailData = createLowStockAlertEmail({ products: productsForEmail });
    const emailSent = await sendEmail(emailData);

    res.status(200).json({
      success: true,
      message: emailSent 
        ? `Low stock alert sent for ${lowStockProducts.length} product(s)`
        : 'Low stock products found but email failed to send',
      data: lowStockProducts,
      emailSent
    });
  } catch (error) {
    console.error('Error checking low stock:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  }
}

