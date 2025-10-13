import { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/lib/auth/AuthContext';

// Mock product data
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Ethiopian Yirgacheffe',
    description: 'Bright and fruity with notes of citrus and berries.',
    price: 18.99,
    category: 'Single Origin',
    stock: 45,
    image: '/images/placeholder.jpg'
  },
  {
    id: '2',
    name: 'Colombian Supremo',
    description: 'Medium bodied with notes of caramel and nuts.',
    price: 17.99,
    category: 'Single Origin',
    stock: 32,
    image: '/images/placeholder.jpg'
  },
  {
    id: '3',
    name: 'Morning Blend',
    description: 'Smooth and balanced with chocolate notes.',
    price: 16.99,
    category: 'Blend',
    stock: 56,
    image: '/images/placeholder.jpg'
  },
  {
    id: '4',
    name: 'Espresso Roast',
    description: 'Dark and rich with a smooth finish.',
    price: 18.99,
    category: 'Blend',
    stock: 28,
    image: '/images/placeholder.jpg'
  },
  {
    id: '5',
    name: 'Decaf House Blend',
    description: 'All the flavor without the caffeine.',
    price: 19.99,
    category: 'Decaf',
    stock: 18,
    image: '/images/placeholder.jpg'
  },
  {
    id: '6',
    name: 'Sumatra Mandheling',
    description: 'Earthy and full-bodied with herbal notes.',
    price: 20.99,
    category: 'Single Origin',
    stock: 24,
    image: '/images/placeholder.jpg'
  }
];

export default function AdminProducts() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEditModal = (product: any) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentProduct({
      id: '',
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      image: '/images/placeholder.jpg'
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentProduct.id) {
      // Update existing product
      setProducts(products.map(product => 
        product.id === currentProduct.id ? currentProduct : product
      ));
    } else {
      // Add new product
      const newId = (parseInt(products[products.length - 1].id) + 1).toString();
      setProducts([...products, { ...currentProduct, id: newId }]);
    }
    
    closeModal();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
    });
  };

  return (
    <>
      <Head>
        <title>Product Management | Vendetta Roasting</title>
      </Head>
      <AdminLayout>
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-coffee-dark">Products</h1>
            <button
              onClick={openAddModal}
              className="bg-coffee hover:bg-coffee-light text-cream-light px-4 py-2 rounded-md"
            >
              Add New Product
            </button>
          </div>

          {/* Search and Filter */}
          <div className="mb-6">
            <div className="max-w-lg">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-coffee focus:border-coffee sm:text-sm"
                  placeholder="Search products by name or category"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-coffee-dark">{product.name}</div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-cream text-coffee">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => openEditModal(product)}
                              className="text-coffee hover:text-coffee-light mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Edit/Add Modal */}
        {isModalOpen && currentProduct && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleSave}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg leading-6 font-medium text-coffee-dark">
                          {currentProduct.id ? 'Edit Product' : 'Add New Product'}
                        </h3>
                        <div className="mt-4 space-y-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                              Product Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={currentProduct.name}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-coffee focus:border-coffee sm:text-sm"
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <textarea
                              id="description"
                              name="description"
                              rows={3}
                              value={currentProduct.description}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-coffee focus:border-coffee sm:text-sm"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                Price ($)
                              </label>
                              <input
                                type="number"
                                name="price"
                                id="price"
                                min="0"
                                step="0.01"
                                value={currentProduct.price}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-coffee focus:border-coffee sm:text-sm"
                                required
                              />
                            </div>

                            <div>
                              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                                Stock
                              </label>
                              <input
                                type="number"
                                name="stock"
                                id="stock"
                                min="0"
                                value={currentProduct.stock}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-coffee focus:border-coffee sm:text-sm"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                              Category
                            </label>
                            <select
                              id="category"
                              name="category"
                              value={currentProduct.category}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-coffee focus:border-coffee sm:text-sm"
                              required
                            >
                              <option value="">Select a category</option>
                              <option value="Single Origin">Single Origin</option>
                              <option value="Blend">Blend</option>
                              <option value="Decaf">Decaf</option>
                              <option value="Equipment">Equipment</option>
                              <option value="Merchandise">Merchandise</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-coffee text-base font-medium text-cream-light hover:bg-coffee-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coffee sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {currentProduct.id ? 'Save Changes' : 'Add Product'}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coffee sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
