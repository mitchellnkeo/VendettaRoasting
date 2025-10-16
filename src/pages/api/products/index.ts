import { NextApiRequest, NextApiResponse } from 'next';
import { ProductService } from '../../../lib/services/productService';
import { ProductFilters } from '../../../types/product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      category,
      search,
      min_price,
      max_price,
      is_featured,
      sort_by,
      sort_order,
      limit,
      offset
    } = req.query;

    const filters: ProductFilters = {
      category: category as string,
      search: search as string,
      min_price: min_price ? parseFloat(min_price as string) : undefined,
      max_price: max_price ? parseFloat(max_price as string) : undefined,
      is_featured: is_featured ? is_featured === 'true' : undefined,
      sort_by: sort_by as 'name' | 'price' | 'created_at',
      sort_order: sort_order as 'asc' | 'desc',
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined
    };

    const products = await ProductService.getProducts(filters);
    
    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}
