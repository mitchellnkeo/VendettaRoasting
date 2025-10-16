export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: number;
  wholesale_price?: number;
  sku?: string;
  category_id: string;
  category_name: string;
  weight_grams?: number;
  origin?: string;
  roast_level?: string;
  flavor_notes?: string;
  is_active: boolean;
  is_featured: boolean;
  inventory_quantity: number;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
}

export interface ProductWithImages extends Product {
  images: ProductImage[];
}

export interface ProductFilters {
  category?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  is_active?: boolean;
  sort_by?: 'name' | 'price' | 'created_at';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}
