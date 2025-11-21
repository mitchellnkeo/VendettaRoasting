import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { query } from '../../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check authentication and admin role
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user?.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { productId } = req.query;

  if (req.method === 'GET') {
    try {
      const productResult = await query(
        `SELECT 
          p.*,
          c.name as category_name,
          c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id::text = $1 OR p.slug = $1`,
        [productId]
      );

      if (productResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      // Fetch product images
      const imagesResult = await query(
        `SELECT * FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC, is_primary DESC`,
        [productResult.rows[0].id]
      );

      res.status(200).json({
        success: true,
        data: {
          ...productResult.rows[0],
          images: imagesResult.rows || [],
        },
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  } else if (req.method === 'PUT') {
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

      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramIndex = 1;

      if (name) {
        updateFields.push(`name = $${paramIndex++}`);
        updateValues.push(name);
      }
      if (slug) {
        updateFields.push(`slug = $${paramIndex++}`);
        updateValues.push(slug);
      }
      if (description !== undefined) {
        updateFields.push(`description = $${paramIndex++}`);
        updateValues.push(description);
      }
      if (short_description !== undefined) {
        updateFields.push(`short_description = $${paramIndex++}`);
        updateValues.push(short_description);
      }
      if (price !== undefined) {
        updateFields.push(`price = $${paramIndex++}`);
        updateValues.push(price);
      }
      if (wholesale_price !== undefined) {
        updateFields.push(`wholesale_price = $${paramIndex++}`);
        updateValues.push(wholesale_price);
      }
      if (sku !== undefined) {
        updateFields.push(`sku = $${paramIndex++}`);
        updateValues.push(sku);
      }
      if (category_id !== undefined) {
        updateFields.push(`category_id = $${paramIndex++}`);
        updateValues.push(category_id);
      }
      if (weight_grams !== undefined) {
        updateFields.push(`weight_grams = $${paramIndex++}`);
        updateValues.push(weight_grams);
      }
      if (origin !== undefined) {
        updateFields.push(`origin = $${paramIndex++}`);
        updateValues.push(origin);
      }
      if (roast_level !== undefined) {
        updateFields.push(`roast_level = $${paramIndex++}`);
        updateValues.push(roast_level);
      }
      if (flavor_notes !== undefined) {
        updateFields.push(`flavor_notes = $${paramIndex++}`);
        updateValues.push(flavor_notes);
      }
      if (is_active !== undefined) {
        updateFields.push(`is_active = $${paramIndex++}`);
        updateValues.push(is_active);
      }
      if (is_featured !== undefined) {
        updateFields.push(`is_featured = $${paramIndex++}`);
        updateValues.push(is_featured);
      }
      if (inventory_quantity !== undefined) {
        updateFields.push(`inventory_quantity = $${paramIndex++}`);
        updateValues.push(inventory_quantity);
      }
      if (meta_title !== undefined) {
        updateFields.push(`meta_title = $${paramIndex++}`);
        updateValues.push(meta_title);
      }
      if (meta_description !== undefined) {
        updateFields.push(`meta_description = $${paramIndex++}`);
        updateValues.push(meta_description);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields to update' });
      }

      updateFields.push(`updated_at = NOW()`);
      updateValues.push(productId);

      const updateQuery = `
        UPDATE products
        SET ${updateFields.join(', ')}
        WHERE id::text = $${paramIndex} OR slug = $${paramIndex}
        RETURNING *
      `;

      const result = await query(updateQuery, updateValues);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      res.status(200).json({
        success: true,
        data: result.rows[0],
      });
    } catch (error: any) {
      console.error('Error updating product:', error);
      
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'A product with this slug or SKU already exists',
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await query(
        `DELETE FROM products WHERE id::text = $1 OR slug = $1 RETURNING *`,
        [productId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

