import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Product } from '../../types/product'
import ProductImage from '../../components/ProductImage'
import { useCart } from '../../lib/cart/CartContext'
import SEO from '../../components/SEO'
import { generateProductSchema, generateBreadcrumbSchema } from '../../lib/structuredData'
import { urlFor } from '../../lib/sanity'
import ReviewForm from '../../components/ReviewForm'
import ReviewsList from '../../components/ReviewsList'

export default function ProductDetail() {
  const router = useRouter()
  const { slug } = router.query
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [cartMessage, setCartMessage] = useState<string | null>(null)
  const { addItem } = useCart()

  useEffect(() => {
    if (!slug) return

    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${slug}`)
        const data = await response.json()
        
        if (data.success) {
          setProduct(data.data)
        } else {
          throw new Error(data.message || 'Failed to fetch product')
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  const handleAddToCart = async () => {
    if (!product) return

    // Check if product is out of stock
    if (product.inventory_quantity <= 0) {
      setCartMessage('This product is currently out of stock.')
      setTimeout(() => setCartMessage(null), 3000)
      return
    }

    // Check if requested quantity exceeds available inventory
    if (quantity > product.inventory_quantity) {
      setCartMessage(`Only ${product.inventory_quantity} ${product.inventory_quantity === 1 ? 'item' : 'items'} available in stock.`)
      setTimeout(() => setCartMessage(null), 3000)
      return
    }

    setAddingToCart(true)
    setCartMessage(null)

    try {
      // Check inventory before adding (double-check)
      const inventoryResponse = await fetch('/api/inventory/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity
        })
      });

      const inventoryData = await inventoryResponse.json();

      if (!inventoryData.success || !inventoryData.data.available) {
        const availableQty = inventoryData.data?.availableQuantity || 0;
        if (availableQty > 0) {
          setCartMessage(`Only ${availableQty} ${availableQty === 1 ? 'item' : 'items'} available. Please adjust quantity.`)
        } else {
          setCartMessage('This product is currently out of stock.')
        }
        setTimeout(() => setCartMessage(null), 3000)
        setAddingToCart(false)
        return
      }

      // Add item to cart
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image_url || '/images/placeholder.jpg',
          slug: product.slug
        })
      }

      setCartMessage(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`)
      
      // Clear message after 3 seconds
      setTimeout(() => setCartMessage(null), 3000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      setCartMessage('Failed to add item to cart. Please try again.')
      setTimeout(() => setCartMessage(null), 3000)
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <>
        <SEO title="Loading..." />
        <div className="bg-cream-light py-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coffee"></div>
              <p className="mt-4 text-coffee">Loading product...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <SEO title="Product Not Found" />
        <div className="bg-cream-light py-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <h1 className="text-4xl font-bold text-coffee-dark mb-4">Product Not Found</h1>
              <p className="text-coffee mb-8">
                {error || 'The product you are looking for does not exist.'}
              </p>
              <Link 
                href="/shop" 
                className="bg-coffee text-cream-light px-6 py-3 rounded-md hover:bg-coffee-light transition-colors"
              >
                Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Generate structured data
  const structuredData = [];
  
  // Product schema
  // Check if product has images array (from API response)
  const productWithImages = product as any;
  const primaryImage = productWithImages.images?.find((img: any) => img.is_primary) || productWithImages.images?.[0];
  const productImageUrl = primaryImage?.image_url || product.image_url || '';
  
  structuredData.push(generateProductSchema({
    name: product.name,
    description: product.short_description || product.description || '',
    image: productImageUrl,
    sku: product.sku || '',
    price: product.price,
    currency: 'USD',
    availability: product.inventory_quantity > 0 ? 'InStock' : 'OutOfStock',
    brand: {
      name: 'Vendetta Roasting',
    },
    category: product.category_name || '',
  }));

  // Breadcrumb schema
  structuredData.push(generateBreadcrumbSchema({
    items: [
      { name: 'Home', url: '/' },
      { name: 'Shop', url: '/shop' },
      { name: product.name, url: `/shop/${product.slug}` },
    ],
  }));

  return (
    <>
      <SEO
        title={product.meta_title || product.name}
        description={product.meta_description || product.short_description || product.description || ''}
        image={productImageUrl}
        url={`/shop/${product.slug}`}
        type="product"
        structuredData={structuredData}
        canonical={`/shop/${product.slug}`}
      />

      <div className="bg-cream-light py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-coffee hover:text-coffee-dark transition-colors duration-300">Home</Link>
              </li>
              <li className="text-coffee-light">/</li>
              <li>
                <Link href="/shop" className="text-coffee hover:text-coffee-dark transition-colors duration-300">Shop</Link>
              </li>
              <li className="text-coffee-light">/</li>
              <li className="text-coffee-dark font-semibold">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div>
              <div className="rounded-2xl overflow-hidden shadow-warm-lg">
                <ProductImage 
                  productId={product.id}
                  className="h-96 lg:h-[500px] w-full object-cover"
                  alt={product.name}
                  priority={true}
                />
              </div>
              {/* TODO: Add image gallery when multiple images are implemented */}
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-6">
                <span className="bg-cream px-4 py-2 text-sm font-semibold rounded-full text-coffee shadow-soft inline-block">
                  {product.category_name}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-coffee-dark mb-6 leading-tight">
                {product.name}
              </h1>

              <p className="text-lg text-coffee mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Product Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {product.origin && (
                  <div>
                    <h3 className="font-semibold text-coffee-dark">Origin</h3>
                    <p className="text-coffee">{product.origin}</p>
                  </div>
                )}
                {product.roast_level && (
                  <div>
                    <h3 className="font-semibold text-coffee-dark">Roast Level</h3>
                    <p className="text-coffee capitalize">{product.roast_level}</p>
                  </div>
                )}
                {product.weight_grams && (
                  <div>
                    <h3 className="font-semibold text-coffee-dark">Weight</h3>
                    <p className="text-coffee">{product.weight_grams}g</p>
                  </div>
                )}
                {product.sku && (
                  <div>
                    <h3 className="font-semibold text-coffee-dark">SKU</h3>
                    <p className="text-coffee">{product.sku}</p>
                  </div>
                )}
              </div>

              {product.flavor_notes && (
                <div className="mb-6">
                  <h3 className="font-semibold text-coffee-dark mb-2">Flavor Notes</h3>
                  <p className="text-coffee">{product.flavor_notes}</p>
                </div>
              )}

              {/* Price and Add to Cart */}
              <div className="border-t border-cream pt-8 mt-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-4xl font-bold text-coffee-dark">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.wholesale_price && (
                      <p className="text-sm text-coffee mt-2">
                        Wholesale: ${product.wholesale_price.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="text-sm">
                    {product.inventory_quantity > 0 ? (
                      <span className="inline-flex items-center text-green-600 font-semibold">
                        <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-red-600 font-semibold">
                        <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <label htmlFor="quantity" className="font-semibold text-coffee-dark">
                    Quantity:
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value);
                      const maxQuantity = Math.min(product.inventory_quantity || 0, 5);
                      setQuantity(Math.min(newQuantity, maxQuantity));
                    }}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coffee"
                    disabled={product.inventory_quantity === 0}
                  >
                    {Array.from({ length: Math.min(product.inventory_quantity || 0, 5) }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                    {product.inventory_quantity === 0 && (
                      <option value={0}>Out of Stock</option>
                    )}
                  </select>
                  {product.inventory_quantity > 0 && product.inventory_quantity < 5 && (
                    <span className="text-sm text-coffee">
                      (Only {product.inventory_quantity} available)
                    </span>
                  )}
                </div>

                {/* Success/Error Message */}
                {cartMessage && (
                  <div className={`mb-4 p-3 rounded-md ${
                    cartMessage.includes('Added') 
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    {cartMessage}
                  </div>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={product.inventory_quantity === 0 || addingToCart}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                    product.inventory_quantity > 0 && !addingToCart
                      ? 'bg-coffee text-cream-light hover:bg-coffee-light shadow-warm-lg hover:shadow-warm hover:scale-105'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {addingToCart ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-cream-light border-t-transparent rounded-full animate-spin mr-2" />
                      Adding to Cart...
                    </div>
                  ) : product.inventory_quantity > 0 ? (
                    'Add to Cart'
                  ) : (
                    'Out of Stock'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16 border-t border-cream pt-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-coffee-dark mb-2">Customer Reviews</h2>
              <p className="text-coffee">Share your experience with this product</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Review Form */}
              <div>
                <ReviewForm 
                  productId={product.id} 
                  productName={product.name}
                  onSubmitSuccess={() => {
                    // Optionally refresh reviews list
                    window.location.reload();
                  }}
                />
              </div>

              {/* Reviews List */}
              <div>
                <ReviewsList productId={product.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
