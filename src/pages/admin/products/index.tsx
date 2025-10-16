import Head from 'next/head'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Product, Category } from '../../../types/product'
import AdminLayout from '../../../components/admin/AdminLayout'

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch products
        const productsResponse = await fetch('/api/products')
        const productsData = await productsResponse.json()
        
        if (productsData.success) {
          setProducts(productsData.data)
        } else {
          throw new Error(productsData.message || 'Failed to fetch products')
        }

        // Fetch categories
        const categoriesResponse = await fetch('/api/categories')
        const categoriesData = await categoriesResponse.json()
        
        if (categoriesData.success) {
          setCategories(categoriesData.data)
        } else {
          throw new Error(categoriesData.message || 'Failed to fetch categories')
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category_name === selectedCategory
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleToggleStatus = async (productId: string, currentStatus: boolean) => {
    try {
      // TODO: Implement API call to update product status
      console.log('Toggle product status:', productId, !currentStatus)
      alert('Product status update functionality will be implemented with database connection')
    } catch (err) {
      console.error('Error updating product status:', err)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      // TODO: Implement API call to delete product
      console.log('Delete product:', productId)
      alert('Product deletion functionality will be implemented with database connection')
    } catch (err) {
      console.error('Error deleting product:', err)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coffee"></div>
            <p className="mt-4 text-coffee">Loading products...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Manage Products | Admin | Vendetta Roasting</title>
      </Head>
      
      <AdminLayout>
        <div>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-coffee-dark">Product Management</h1>
              <p className="text-coffee">Manage your coffee products and inventory</p>
            </div>
            <Link 
              href="/admin/products/new"
              className="bg-coffee text-cream-light px-4 py-2 rounded-md hover:bg-coffee-light transition-colors"
            >
              Add New Product
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-coffee-dark mb-2">
                  Search Products
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-coffee-dark mb-2">
                  Filter by Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                >
                  <option value="All">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-600">Error: {error}</p>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inventory
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        {error ? 'Error loading products' : 'No products found'}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 bg-gray-200 rounded-md mr-4"></div>
                            <div>
                              <div className="text-sm font-medium text-coffee-dark">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.category_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleStatus(product.id, product.is_active)}
                            className={`px-2 py-1 text-xs rounded-full ${
                              product.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.inventory_quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              href={`/admin/products/${product.slug}/edit`}
                              className="text-coffee hover:text-coffee-light"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 text-sm text-gray-500">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </AdminLayout>
    </>
  )
}