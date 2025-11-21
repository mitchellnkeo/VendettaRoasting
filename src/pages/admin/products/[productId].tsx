import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/lib/auth/AuthContext';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  wholesale_price: number;
  cost: number;
  sku: string;
  category_id: string;
  weight_grams: number;
  origin: string;
  roast_level: string;
  flavor_notes: string;
  is_active: boolean;
  is_featured: boolean;
  inventory_quantity: number;
  low_stock_threshold: number;
  meta_title: string;
  meta_description: string;
  images: Array<{ id: string; image_url: string; alt_text: string; is_primary: boolean }>;
}

export default function EditProduct() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const { productId } = router.query;
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    price: '',
    wholesale_price: '',
    cost: '',
    sku: '',
    category_id: '',
    weight_grams: '',
    origin: '',
    roast_level: '',
    flavor_notes: '',
    is_active: true,
    is_featured: false,
    inventory_quantity: '0',
    low_stock_threshold: '10',
    meta_title: '',
    meta_description: '',
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  useEffect(() => {
    if (isAdmin && productId) {
      fetchCategories();
      fetchProduct();
    }
  }, [isAdmin, productId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/products/${encodeURIComponent(productId as string)}`);
      const data = await response.json();

      if (data.success) {
        const prod = data.data;
        setProduct(prod);
        setFormData({
          name: prod.name || '',
          slug: prod.slug || '',
          description: prod.description || '',
          short_description: prod.short_description || '',
          price: prod.price?.toString() || '',
          wholesale_price: prod.wholesale_price?.toString() || '',
          cost: prod.cost?.toString() || '',
          sku: prod.sku || '',
          category_id: prod.category_id || '',
          weight_grams: prod.weight_grams?.toString() || '',
          origin: prod.origin || '',
          roast_level: prod.roast_level || '',
          flavor_notes: prod.flavor_notes || '',
          is_active: prod.is_active !== undefined ? prod.is_active : true,
          is_featured: prod.is_featured !== undefined ? prod.is_featured : false,
          inventory_quantity: prod.inventory_quantity?.toString() || '0',
          low_stock_threshold: prod.low_stock_threshold?.toString() || '10',
          meta_title: prod.meta_title || '',
          meta_description: prod.meta_description || '',
        });
      } else {
        setError(data.message || 'Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? value
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!formData.name || !formData.slug || !formData.price) {
        setError('Name, slug, and price are required');
        setSaving(false);
        return;
      }

      const response = await fetch(`/api/admin/products/${encodeURIComponent(productId as string)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          wholesale_price: formData.wholesale_price ? parseFloat(formData.wholesale_price) : null,
          cost: formData.cost ? parseFloat(formData.cost) : null,
          weight_grams: formData.weight_grams ? parseInt(formData.weight_grams) : null,
          inventory_quantity: parseInt(formData.inventory_quantity),
          low_stock_threshold: parseInt(formData.low_stock_threshold),
          category_id: formData.category_id || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/products');
      } else {
        setError(data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError('An error occurred while updating the product');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen-admin">
          <p className="text-coffee-dark">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  if (error && !product) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">Error</h1>
          <p className="text-coffee-dark mb-6">{error}</p>
          <Link href="/admin/products" className="text-coffee hover:text-coffee-light">
            ← Back to Products
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Product | Admin - Vendetta Roasting</title>
      </Head>
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/admin/products" className="text-coffee hover:text-coffee-light">
              ← Back to Products
            </Link>
          </div>

          <h1 className="text-2xl font-semibold text-coffee-dark mb-6">Edit Product</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {product && (
            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
              {/* Product Images */}
              {product.images && product.images.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-coffee-dark mb-4">Product Images</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {product.images.map((img) => (
                      <div key={img.id} className="relative">
                        <img
                          src={img.image_url}
                          alt={img.alt_text || product.name}
                          className="w-full h-32 object-cover rounded-md"
                        />
                        {img.is_primary && (
                          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Image management coming soon. For now, images are managed separately.
                  </p>
                </div>
              )}

              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-semibold text-coffee-dark mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-coffee focus:border-coffee"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug *
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-coffee focus:border-coffee"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description
                    </label>
                    <input
                      type="text"
                      name="short_description"
                      value={formData.short_description}
                      onChange={handleInputChange}
                      maxLength={500}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-coffee focus:border-coffee"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-coffee focus:border-coffee"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h2 className="text-lg font-semibold text-coffee-dark mb-4">Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-coffee focus:border-coffee"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wholesale Price
                    </label>
                    <input
                      type="number"
                      name="wholesale_price"
                      value={formData.wholesale_price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-coffee focus:border-coffee"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost
                    </label>
                    <input
                      type="number"
                      name="cost"
                      value={formData.cost}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-coffee focus:border-coffee"
                    />
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div>
                <h2 className="text-lg font-semibold text-coffee-dark mb-4">Product Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-coffee focus:border-coffee"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-coffee focus:border-coffee"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (grams)
                    </label>
                    <input
                      type="number"
                      name="weight_grams"
                      value={formData.weight_grams}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-coffee focus:border-coffee"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Origin
                    </label>
                    <input
                      type="text"
                      name="origin"
                      value={formData.origin}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-coffee focus:border-coffee"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Roast Level
                    </label>
                    <select
                      name="roast_level"
                      value={formData.roast_level}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-coffee focus:border-coffee"
                    >
                      <option value="">Select roast level</option>
                      <option value="Light">Light</option>
                      <option value="Medium">Medium</option>
                      <option value="Medium-Dark">Medium-Dark</option>
                      <option value="Dark">Dark</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Flavor Notes
                    </label>
                    <input
                      type="text"
                      name="flavor_notes"
                      value={formData.flavor_notes}
                      onChange={handleInputChange}
                      placeholder="e.g., Chocolate, Caramel, Citrus"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-coffee focus:border-coffee"
                    />
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div>
                <h2 className="text-lg font-semibold text-coffee-dark mb-4">Inventory</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="inventory_quantity"
                      value={formData.inventory_quantity}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-coffee focus:border-coffee"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Low Stock Threshold
                    </label>
                    <input
                      type="number"
                      name="low_stock_threshold"
                      value={formData.low_stock_threshold}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-coffee focus:border-coffee"
                    />
                  </div>
                </div>
              </div>

              {/* SEO */}
              <div>
                <h2 className="text-lg font-semibold text-coffee-dark mb-4">SEO</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleInputChange}
                      maxLength={255}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-coffee focus:border-coffee"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-coffee focus:border-coffee"
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h2 className="text-lg font-semibold text-coffee-dark mb-4">Status</h2>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Link
                  href="/admin/products"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-coffee text-cream-light rounded-md hover:bg-coffee-light transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </AdminLayout>
    </>
  );
}

