import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Product, Category } from '../../types/product'
import ProductImage from '../../components/ProductImage'
import { useCart } from '../../lib/cart/CartContext'
import SEO from '../../components/SEO'

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  
  const { addItem } = useCart();

  // Fetch products and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsResponse = await fetch('/api/products');
        const productsData = await productsResponse.json();
        
        if (productsData.success) {
          setProducts(productsData.data);
        } else {
          throw new Error(productsData.message || 'Failed to fetch products');
        }

        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        
        if (categoriesData.success) {
          setCategories(categoriesData.data);
        } else {
          throw new Error(categoriesData.message || 'Failed to fetch categories');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category_name === selectedCategory);

  // Handle adding item to cart
  const handleAddToCart = async (product: Product) => {
    // Check if product is out of stock
    if (product.inventory_quantity <= 0) {
      setCartMessage(`${product.name} is currently out of stock.`);
      setTimeout(() => setCartMessage(null), 3000);
      return;
    }

    setAddingToCart(product.id);
    setCartMessage(null);

    try {
      // Check inventory before adding
      const inventoryResponse = await fetch('/api/inventory/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1
        })
      });

      const inventoryData = await inventoryResponse.json();

      if (!inventoryData.success || !inventoryData.data.available) {
        setCartMessage(`${product.name} is currently out of stock.`);
        setTimeout(() => setCartMessage(null), 3000);
        setAddingToCart(null);
        return;
      }

      // Add item to cart
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url || '/images/placeholder.jpg',
        slug: product.slug
      });

      // Track add to cart event
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        trackAddToCart({
          item_id: product.id,
          item_name: product.name,
          item_category: product.category_name || undefined,
          price: product.price,
          quantity: 1,
        });
      }

      setCartMessage(`Added ${product.name} to cart!`);

      // Clear message after 3 seconds
      setTimeout(() => setCartMessage(null), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setCartMessage('Failed to add item to cart. Please try again.');
      setTimeout(() => setCartMessage(null), 3000);
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <>
      <SEO
        title="Shop"
        description="Browse our selection of premium coffee beans, single-origin coffees, and signature blends. Fresh roasted and ethically sourced."
        url="/shop"
      />

      <div className="bg-cream-light py-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-coffee-dark mb-6 leading-tight">Shop Our Coffee</h1>
            <p className="text-lg text-coffee max-w-3xl mx-auto leading-relaxed">
              Explore our selection of ethically sourced, freshly roasted coffee beans. 
              Each batch is roasted to perfection to bring out the unique characteristics of the beans.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-6 py-3 rounded-full font-medium ${
                selectedCategory === 'All'
                  ? 'bg-coffee text-cream-light shadow-warm'
                  : 'bg-white text-coffee hover:bg-coffee-light hover:text-cream-light shadow-soft hover:shadow-warm'
              } transition-all duration-300 transform hover:scale-105`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 rounded-full font-medium ${
                  selectedCategory === category.name
                    ? 'bg-coffee text-cream-light shadow-warm'
                    : 'bg-white text-coffee hover:bg-coffee-light hover:text-cream-light shadow-soft hover:shadow-warm'
                } transition-all duration-300 transform hover:scale-105`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coffee"></div>
              <p className="mt-4 text-coffee">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-coffee text-cream-light px-4 py-2 rounded-md hover:bg-coffee-light transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Cart Message */}
          {cartMessage && (
            <div className={`mb-6 p-4 rounded-md ${
              cartMessage.includes('Added')
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {cartMessage}
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-coffee">No products found in this category.</p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-warm-lg transition-all duration-400 transform hover:-translate-y-2 group">
                    <Link href={`/shop/${product.slug}`}>
                      <div className="relative overflow-hidden">
                        <ProductImage 
                          productId={product.id}
                          images={(product as any).images || []}
                          fallbackImageUrl={product.image_url}
                          className="h-64 cursor-pointer group-hover:scale-110 transition-transform duration-500"
                          alt={product.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </Link>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <Link href={`/shop/${product.slug}`}>
                          <h2 className="text-xl font-bold text-coffee-dark hover:text-coffee-light cursor-pointer transition-colors duration-300 group-hover:text-coffee-light">
                            {product.name}
                          </h2>
                        </Link>
                        <span className="bg-cream px-3 py-1 text-xs font-medium rounded-full text-coffee shadow-soft">
                          {product.category_name}
                        </span>
                      </div>
                      <p className="text-coffee mb-4 leading-relaxed line-clamp-2">{product.description}</p>
                      <div className="mb-4">
                        {product.inventory_quantity > 0 ? (
                          <span className="inline-flex items-center text-sm text-green-600 font-semibold">
                            <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-sm text-red-600 font-semibold">
                            <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                            Out of Stock
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-coffee-dark">${product.price.toFixed(2)}</span>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          disabled={addingToCart === product.id || product.inventory_quantity === 0}
                          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
                            addingToCart === product.id || product.inventory_quantity === 0
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-coffee hover:bg-coffee-light text-cream-light shadow-soft hover:shadow-warm hover:scale-105'
                          }`}
                        >
                          {addingToCart === product.id ? (
                            <div className="flex items-center">
                              <div className="w-4 h-4 border-2 border-cream-light border-t-transparent rounded-full animate-spin mr-2" />
                              Adding...
                            </div>
                          ) : product.inventory_quantity === 0 ? (
                            'Out of Stock'
                          ) : (
                            'Add to Cart'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
