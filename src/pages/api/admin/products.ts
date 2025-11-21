import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { query } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check authentication and admin role
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user?.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const { search, category, is_active, is_featured, limit = '50', offset = '0' } = req.query;

      let productsQuery = `
        SELECT 
          p.*,
          c.name as category_name,
          c.slug as category_slug,
          pi.image_url
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN LATERAL (
          SELECT image_url 
          FROM product_images 
          WHERE product_id = p.id AND is_primary = true 
          LIMIT 1
        ) pi ON true
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (search && typeof search === 'string') {
        productsQuery += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex} OR p.sku ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      if (category && typeof category === 'string') {
        productsQuery += ` AND c.slug = $${paramIndex}`;
        params.push(category);
        paramIndex++;
      }

      if (is_active !== undefined) {
        productsQuery += ` AND p.is_active = $${paramIndex}`;
        params.push(is_active === 'true');
        paramIndex++;
      }

      if (is_featured !== undefined && is_featured === 'true') {
        productsQuery += ` AND p.is_featured = true`;
      }

      productsQuery += ` 
        ORDER BY p.created_at DESC 
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      params.push(parseInt(limit as string), parseInt(offset as string));

      const result = await query(productsQuery, params);

      res.status(200).json({
        success: true,
        data: result.rows || [],
        total: result.rows?.length || 0,
      });
    } catch (error: any) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        name,
        slug,
        description,
        short_description,
        price,
        wholesale_price,
        sku,
        category_id,
        weight_grams,
        origin,
        roast_level,
        flavor_notes,
        is_active,
        is_featured,
        inventory_quantity,
        meta_title,
        meta_description,
      } = req.body;

      // Validate required fields
      if (!name || !slug || !price) {
        return res.status(400).json({
          success: false,
          message: 'Name, slug, and price are required',
        });
      }

      const insertQuery = `
        INSERT INTO products (
          name, slug, description, short_description, price, wholesale_price,
          sku, category_id, weight_grams, origin, roast_level, flavor_notes,
          is_active, is_featured, inventory_quantity, meta_title, meta_description
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
        ) RETURNING *
      `;

      const result = await query(insertQuery, [
        name,
        slug,
        description || null,
        short_description || null,
        price,
        wholesale_price || null,
        sku || null,
        category_id || null,
        weight_grams || null,
        origin || null,
        roast_level || null,
        flavor_notes || null,
        is_active !== undefined ? is_active : true,
        is_featured !== undefined ? is_featured : false,
        inventory_quantity || 0,
        meta_title || null,
        meta_description || null,
      ]);

      res.status(201).json({
        success: true,
        data: result.rows[0],
      });
    } catch (error: any) {
      console.error('Error creating product:', error);
      
      // Handle unique constraint violations
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'A product with this slug or SKU already exists',
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

