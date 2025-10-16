import { query } from '../database';
import { Product, ProductWithImages, Category, ProductFilters } from '../../types/product';

export class ProductService {
  // Get all products with optional filters
  static async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    let sql = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;
    
    const params: any[] = [];
    let paramCount = 0;

    // Add filters
    if (filters.category) {
      paramCount++;
      sql += ` AND c.slug = $${paramCount}`;
      params.push(filters.category);
    }

    if (filters.search) {
      paramCount++;
      sql += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
    }

    if (filters.min_price !== undefined) {
      paramCount++;
      sql += ` AND p.price >= $${paramCount}`;
      params.push(filters.min_price);
    }

    if (filters.max_price !== undefined) {
      paramCount++;
      sql += ` AND p.price <= $${paramCount}`;
      params.push(filters.max_price);
    }

    if (filters.is_featured !== undefined) {
      paramCount++;
      sql += ` AND p.is_featured = $${paramCount}`;
      params.push(filters.is_featured);
    }

    // Add sorting
    if (filters.sort_by) {
      const sortColumn = filters.sort_by === 'created_at' ? 'p.created_at' : `p.${filters.sort_by}`;
      const sortOrder = filters.sort_order || 'asc';
      sql += ` ORDER BY ${sortColumn} ${sortOrder.toUpperCase()}`;
    } else {
      sql += ` ORDER BY p.created_at DESC`;
    }

    // Add pagination
    if (filters.limit) {
      paramCount++;
      sql += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
    }

    if (filters.offset) {
      paramCount++;
      sql += ` OFFSET $${paramCount}`;
      params.push(filters.offset);
    }

    const result = await query(sql, params);
    return result.rows;
  }

  // Get a single product by ID
  static async getProductById(id: string): Promise<Product | null> {
    const sql = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1 AND p.is_active = true
    `;
    
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  // Get a single product by slug
  static async getProductBySlug(slug: string): Promise<Product | null> {
    const sql = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = $1 AND p.is_active = true
    `;
    
    const result = await query(sql, [slug]);
    return result.rows[0] || null;
  }

  // Get product with images
  static async getProductWithImages(id: string): Promise<ProductWithImages | null> {
    const product = await this.getProductById(id);
    if (!product) return null;

    const imagesSql = `
      SELECT * FROM product_images 
      WHERE product_id = $1 
      ORDER BY sort_order ASC, created_at ASC
    `;
    
    const imagesResult = await query(imagesSql, [id]);
    
    return {
      ...product,
      images: imagesResult.rows
    };
  }

  // Get all categories
  static async getCategories(): Promise<Category[]> {
    const sql = `
      SELECT * FROM categories 
      WHERE is_active = true 
      ORDER BY sort_order ASC, name ASC
    `;
    
    const result = await query(sql);
    return result.rows;
  }

  // Get featured products
  static async getFeaturedProducts(limit: number = 6): Promise<Product[]> {
    return this.getProducts({
      is_featured: true,
      limit
    });
  }

  // Search products
  static async searchProducts(searchTerm: string, limit: number = 20): Promise<Product[]> {
    return this.getProducts({
      search: searchTerm,
      limit
    });
  }

  // Get products by category
  static async getProductsByCategory(categorySlug: string, limit?: number): Promise<Product[]> {
    return this.getProducts({
      category: categorySlug,
      limit
    });
  }

  // Get product count for pagination
  static async getProductCount(filters: ProductFilters = {}): Promise<number> {
    let sql = `
      SELECT COUNT(*) as count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;
    
    const params: any[] = [];
    let paramCount = 0;

    // Add same filters as getProducts
    if (filters.category) {
      paramCount++;
      sql += ` AND c.slug = $${paramCount}`;
      params.push(filters.category);
    }

    if (filters.search) {
      paramCount++;
      sql += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
    }

    if (filters.min_price !== undefined) {
      paramCount++;
      sql += ` AND p.price >= $${paramCount}`;
      params.push(filters.min_price);
    }

    if (filters.max_price !== undefined) {
      paramCount++;
      sql += ` AND p.price <= $${paramCount}`;
      params.push(filters.max_price);
    }

    if (filters.is_featured !== undefined) {
      paramCount++;
      sql += ` AND p.is_featured = $${paramCount}`;
      params.push(filters.is_featured);
    }

    const result = await query(sql, params);
    return parseInt(result.rows[0].count);
  }
}
