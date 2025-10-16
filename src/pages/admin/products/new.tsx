import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Category } from '../../../types/product'
import AdminLayout from '../../../components/admin/AdminLayout'

export default function NewProduct() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    price: '',
    wholesale_price: '',
    sku: '',
    category_id: '',
    weight_grams: '',
    origin: '',
    roast_level: '',
    flavor_notes: '',
    inventory_quantity: '',
    low_stock_threshold: '10',
    is_active: true,
    is_featured: false,
    meta_title: '',
    meta_description: ''
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        
        if (data.success) {
          setCategories(data.data)
        } else {
          throw new Error(data.message || 'Failed to fetch categories')
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    }

    fetchCategories()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // TODO: Implement API call to create product
      console.log('Creating product:', formData)
      alert('Product creation functionality will be implemented with database connection')
      
      // For now, just redirect back to products list
      router.push('/admin/products')
    } catch (err) {
      console.error('Error creating product:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Add New Product | Admin | Vendetta Roasting</title>
      </Head>
      
      <AdminLayout>
        <div>
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm text-coffee mb-4">
              <Link href="/admin" className="hover:text-coffee-light">Admin</Link>
              <span>/</span>
              <Link href="/admin/products" className="hover:text-coffee-light">Products</Link>
              <span>/</span>
              <span className="text-coffee-dark">New Product</span>
            </nav>
            <h1 className="text-2xl font-semibold text-coffee-dark">Add New Product</h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-600">Error: {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-coffee-dark mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-coffee-dark mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-coffee-dark mb-2">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                  />
                </div>

                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-coffee-dark mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                  />
                </div>

                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-coffee-dark mb-2">
                    Category *
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="description" className="block text-sm font-medium text-coffee-dark mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                />
              </div>

              <div className="mt-6">
                <label htmlFor="short_description" className="block text-sm font-medium text-coffee-dark mb-2">
                  Short Description
                </label>
                <input
                  type="text"
                  id="short_description"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-coffee-dark mb-4">Pricing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-coffee-dark mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                  />
                </div>

                <div>
                  <label htmlFor="wholesale_price" className="block text-sm font-medium text-coffee-dark mb-2">
                    Wholesale Price
                  </label>
                  <input
                    type="number"
                    id="wholesale_price"
                    name="wholesale_price"
                    value={formData.wholesale_price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                  />
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-coffee-dark mb-4">Product Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="weight_grams" className="block text-sm font-medium text-coffee-dark mb-2">
                    Weight (grams)
                  </label>
                  <input
                    type="number"
                    id="weight_grams"
                    name="weight_grams"
                    value={formData.weight_grams}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                  />
                </div>

                <div>
                  <label htmlFor="origin" className="block text-sm font-medium text-coffee-dark mb-2">
                    Origin
                  </label>
                  <input
                    type="text"
                    id="origin"
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                  />
                </div>

                <div>
                  <label htmlFor="roast_level" className="block text-sm font-medium text-coffee-dark mb-2">
                    Roast Level
                  </label>
                  <select
                    id="roast_level"
                    name="roast_level"
                    value={formData.roast_level}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                  >
                    <option value="">Select roast level</option>
                    <option value="light">Light</option>
                    <option value="medium-light">Medium Light</option>
                    <option value="medium">Medium</option>
                    <option value="medium-dark">Medium Dark</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="inventory_quantity" className="block text-sm font-medium text-coffee-dark mb-2">
                    Inventory Quantity
                  </label>
                  <input
                    type="number"
                    id="inventory_quantity"
                    name="inventory_quantity"
                    value={formData.inventory_quantity}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="flavor_notes" className="block text-sm font-medium text-coffee-dark mb-2">
                  Flavor Notes
                </label>
                <textarea
                  id="flavor_notes"
                  name="flavor_notes"
                  value={formData.flavor_notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                />
              </div>
            </div>

            {/* Status */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-coffee-dark mb-4">Status</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-coffee focus:ring-coffee border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm text-coffee-dark">
                    Active (visible to customers)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-coffee focus:ring-coffee border-gray-300 rounded"
                  />
                  <label htmlFor="is_featured" className="ml-2 text-sm text-coffee-dark">
                    Featured (show on homepage)
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/products"
                className="px-4 py-2 border border-gray-300 rounded-md text-coffee hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-coffee text-cream-light rounded-md hover:bg-coffee-light transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </>
  )
}
