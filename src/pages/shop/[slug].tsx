import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Product } from '../../types/product'
import ProductImage from '../../components/ProductImage'
import { useCart } from '../../lib/cart/CartContext'

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

    setAddingToCart(true)
    setCartMessage(null)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Add item to cart
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image_url,
          slug: product.slug
        })
      }

      setCartMessage(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`)
      
      // Clear message after 3 seconds
      setTimeout(() => setCartMessage(null), 3000)
    } catch (error) {
      setCartMessage('Failed to add item to cart. Please try again.')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading... | Vendetta Roasting</title>
        </Head>
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
        <Head>
          <title>Product Not Found | Vendetta Roasting</title>
        </Head>
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

  return (
    <>
      <Head>
        <title>{product.name} | Vendetta Roasting</title>
        <meta name="description" content={product.description} />
      </Head>

      <div className="bg-cream-light py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-coffee hover:text-coffee-dark">Home</Link>
              </li>
              <li className="text-coffee">/</li>
              <li>
                <Link href="/shop" className="text-coffee hover:text-coffee-dark">Shop</Link>
              </li>
              <li className="text-coffee">/</li>
              <li className="text-coffee-dark font-medium">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div>
              <ProductImage 
                productId={product.id}
                className="h-96 lg:h-[500px] rounded-lg"
                alt={product.name}
                priority={true}
              />
              {/* TODO: Add image gallery when multiple images are implemented */}
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-4">
                <span className="bg-cream px-3 py-1 text-sm rounded-full text-coffee">
                  {product.category_name}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-coffee-dark mb-4">
                {product.name}
              </h1>

              <p className="text-xl text-coffee mb-6">
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
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold text-coffee-dark">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.wholesale_price && (
                      <p className="text-sm text-coffee">
                        Wholesale: ${product.wholesale_price.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-coffee">
                    {product.inventory_quantity > 0 ? (
                      <span className="text-green-600">In Stock</span>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
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
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coffee"
                    disabled={product.inventory_quantity === 0}
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
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
                  className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${
                    product.inventory_quantity > 0 && !addingToCart
                      ? 'bg-coffee text-cream-light hover:bg-coffee-light'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
        </div>
      </div>
    </>
  )
}
