import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/database';
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

    // Build query
    let productsQuery = `
      SELECT 
        p.*,
        c.name as category_name,
        pi.image_url
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN LATERAL (
        SELECT image_url 
        FROM product_images 
        WHERE product_id = p.id AND is_primary = true 
        LIMIT 1
      ) pi ON true
      WHERE p.is_active = true
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // Apply filters
    if (category && typeof category === 'string') {
      productsQuery += ` AND c.slug = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (search && typeof search === 'string') {
      productsQuery += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (min_price) {
      productsQuery += ` AND p.price >= $${paramIndex}`;
      params.push(parseFloat(min_price as string));
      paramIndex++;
    }

    if (max_price) {
      productsQuery += ` AND p.price <= $${paramIndex}`;
      params.push(parseFloat(max_price as string));
      paramIndex++;
    }

    if (is_featured === 'true') {
      productsQuery += ` AND p.is_featured = true`;
    }

    // Apply sorting
    const sortBy = sort_by || 'created_at';
    const sortOrder = sort_order || 'desc';
    productsQuery += ` ORDER BY p.${sortBy} ${sortOrder.toUpperCase()}`;

    // Apply limit and offset
    if (limit) {
      productsQuery += ` LIMIT $${paramIndex}`;
      params.push(parseInt(limit as string));
      paramIndex++;
    } else {
      productsQuery += ` LIMIT 100`; // Default limit
    }

    if (offset) {
      productsQuery += ` OFFSET $${paramIndex}`;
      params.push(parseInt(offset as string));
    }

    const result = await query(productsQuery, params);

    // Transform database results to match Product interface
    const products = (result.rows || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description || '',
      short_description: row.short_description || '',
      price: parseFloat(row.price.toString()),
      wholesale_price: row.wholesale_price ? parseFloat(row.wholesale_price.toString()) : undefined,
      sku: row.sku,
      category_id: row.category_id,
      category_name: row.category_name || '',
      weight_grams: row.weight_grams,
      origin: row.origin,
      roast_level: row.roast_level,
      flavor_notes: row.flavor_notes,
      image_url: row.image_url || '/images/placeholder-coffee.jpg',
      is_active: row.is_active,
      is_featured: row.is_featured,
      inventory_quantity: row.inventory_quantity || 0,
      meta_title: row.meta_title,
      meta_description: row.meta_description,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));

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
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  }
}
