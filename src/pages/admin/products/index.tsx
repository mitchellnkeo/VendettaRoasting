import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/lib/auth/AuthContext';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  wholesale_price: number;
  sku: string;
  category_name: string;
  inventory_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  image_url: string;
  created_at: string;
}

export default function AdminProducts() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [filterFeatured, setFilterFeatured] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin, filterActive, filterFeatured]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      if (filterActive !== 'all') {
        params.append('is_active', filterActive === 'active' ? 'true' : 'false');
      }
      if (filterFeatured !== null) {
        params.append('is_featured', filterFeatured ? 'true' : 'false');
      }

      const response = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data || []);
      } else {
        console.error('Failed to fetch products:', data.message);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleToggleActive = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      const data = await response.json();
      if (data.success) {
        fetchProducts(); // Refresh list
      } else {
        alert(`Failed to update product: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('An error occurred while updating the product.');
    }
  };

  const handleToggleFeatured = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: !currentStatus }),
      });

      const data = await response.json();
      if (data.success) {
        fetchProducts(); // Refresh list
      } else {
        alert(`Failed to update product: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('An error occurred while updating the product.');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen-admin">
          <p className="text-coffee-dark">Loading admin panel...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // Redirect handled by useEffect
  }

  return (
    <>
      <Head>
        <title>Products | Admin - Vendetta Roasting</title>
      </Head>
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-coffee-dark">Product Management</h1>
              <Link
                href="/admin/products/new"
                className="px-4 py-2 bg-coffee text-cream-light rounded-md hover:bg-coffee-light transition-colors"
              >
                + Add New Product
              </Link>
            </div>

            {/* Filters and Search */}
            <div className="bg-white shadow rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <form onSubmit={handleSearch} className="md:col-span-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, description, or SKU..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-coffee focus:border-coffee sm:text-sm"
                  />
                </form>
                <div className="flex gap-2">
                  <select
                    value={filterActive}
                    onChange={(e) => setFilterActive(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-coffee focus:border-coffee sm:text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <select
                    value={filterFeatured === null ? 'all' : filterFeatured ? 'featured' : 'not-featured'}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilterFeatured(value === 'all' ? null : value === 'featured');
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-coffee focus:border-coffee sm:text-sm"
                  >
                    <option value="all">All Products</option>
                    <option value="featured">Featured</option>
                    <option value="not-featured">Not Featured</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inventory
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        Loading products...
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        {searchTerm ? 'No products match your search' : 'No products found'}
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {product.image_url && (
                              <img
                                className="h-10 w-10 rounded-md object-cover mr-3"
                                src={product.image_url}
                                alt={product.name}
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-coffee-dark">
                                {product.name}
                                {product.is_featured && (
                                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">{product.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.sku || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.category_name || 'Uncategorized'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-coffee-dark">
                          ${parseFloat(product.price.toString()).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={
                              product.inventory_quantity <= 10
                                ? 'text-red-600 font-medium'
                                : 'text-gray-500'
                            }
                          >
                            {product.inventory_quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleToggleActive(product.id, product.is_active)}
                              className={`text-xs px-2 py-1 rounded ${
                                product.is_active
                                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }`}
                              title={product.is_active ? 'Deactivate' : 'Activate'}
                            >
                              {product.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleToggleFeatured(product.id, product.is_featured)}
                              className={`text-xs px-2 py-1 rounded ${
                                product.is_featured
                                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                              title={product.is_featured ? 'Unfeature' : 'Feature'}
                            >
                              {product.is_featured ? '★' : '☆'}
                            </button>
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="text-coffee hover:text-coffee-light"
                            >
                              Edit →
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

