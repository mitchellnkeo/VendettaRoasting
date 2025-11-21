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
        // Note: Sanity uses isActive, but we'll filter client-side for now
        // since the API filters by isActive=true by default
      }
      if (filterFeatured !== null) {
        params.append('is_featured', filterFeatured ? 'true' : 'false');
      }

      // Fetch from public products API (which now uses Sanity)
      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        let filteredProducts = data.data || [];
        
        // Client-side filter for active/inactive since Sanity API only returns active by default
        if (filterActive !== 'all') {
          filteredProducts = filteredProducts.filter((p: Product) => 
            filterActive === 'active' ? p.is_active : !p.is_active
          );
        }
        
        setProducts(filteredProducts);
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

  // Products are managed in Sanity Studio, so we just link to it
  const sanityStudioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'https://vendetta-roasting.sanity.studio';

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
              <div className="flex gap-3">
                <a
                  href={process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'https://vendetta-roasting.sanity.studio'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-coffee text-cream-light rounded-md hover:bg-coffee-light transition-colors"
                >
                  ✏️ Edit in Sanity Studio
                </a>
              </div>
            </div>

            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Products are managed in Sanity Studio
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      To create or edit products, use the Sanity Studio link above. 
                      Products are stored in Sanity CMS for easy content management.
                    </p>
                    <p className="mt-1">
                      This page shows a read-only view of products for quick reference.
                    </p>
                  </div>
                </div>
              </div>
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
                          <a
                            href={`${sanityStudioUrl}/desk/product;${product.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-coffee hover:text-coffee-light"
                          >
                            Edit in Studio →
                          </a>
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

