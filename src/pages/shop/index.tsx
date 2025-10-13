import Head from 'next/head'
import { useState } from 'react'

// Mock product data
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Ethiopian Yirgacheffe',
    description: 'Bright and fruity with notes of citrus and berries.',
    price: 18.99,
    category: 'Single Origin',
    image: '/images/placeholder.jpg'
  },
  {
    id: '2',
    name: 'Colombian Supremo',
    description: 'Medium bodied with notes of caramel and nuts.',
    price: 17.99,
    category: 'Single Origin',
    image: '/images/placeholder.jpg'
  },
  {
    id: '3',
    name: 'Morning Blend',
    description: 'Smooth and balanced with chocolate notes.',
    price: 16.99,
    category: 'Blend',
    image: '/images/placeholder.jpg'
  },
  {
    id: '4',
    name: 'Espresso Roast',
    description: 'Dark and rich with a smooth finish.',
    price: 18.99,
    category: 'Blend',
    image: '/images/placeholder.jpg'
  },
  {
    id: '5',
    name: 'Decaf House Blend',
    description: 'All the flavor without the caffeine.',
    price: 19.99,
    category: 'Decaf',
    image: '/images/placeholder.jpg'
  },
  {
    id: '6',
    name: 'Sumatra Mandheling',
    description: 'Earthy and full-bodied with herbal notes.',
    price: 20.99,
    category: 'Single Origin',
    image: '/images/placeholder.jpg'
  }
];

// Categories for filtering
const CATEGORIES = ['All', 'Single Origin', 'Blend', 'Decaf'];

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'All' 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(product => product.category === selectedCategory);

  return (
    <>
      <Head>
        <title>Shop | Vendetta Roasting</title>
        <meta name="description" content="Shop our selection of premium coffee beans" />
      </Head>

      <div className="bg-cream-light py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-coffee-dark mb-4">Shop Our Coffee</h1>
            <p className="text-coffee max-w-2xl mx-auto">
              Explore our selection of ethically sourced, freshly roasted coffee beans. 
              Each batch is roasted to perfection to bring out the unique characteristics of the beans.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category
                    ? 'bg-coffee text-cream-light'
                    : 'bg-cream text-coffee hover:bg-coffee-light hover:text-cream-light'
                } transition-colors`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold text-coffee-dark">{product.name}</h2>
                    <span className="bg-cream px-2 py-1 text-xs rounded-full text-coffee">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-coffee mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-coffee-dark">${product.price.toFixed(2)}</span>
                    <button className="bg-coffee hover:bg-coffee-light text-cream-light px-4 py-2 rounded-md transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
