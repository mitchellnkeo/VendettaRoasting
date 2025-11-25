import { Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Announcements from '../components/Announcements'
import SEO from '../components/SEO'
import { generateOrganizationSchema, generateWebsiteSchema } from '../lib/structuredData'
import { useCart } from '../lib/cart/CartContext'
import { Product } from '../types/product'
import ProductImage from '../components/ProductImage'

const inter = Inter({ subsets: ['latin'] })

interface HomepageContent {
  title: string
  heroSubtitle: string
  heroImage: string | null
  heroCtaPrimary: string
  heroCtaSecondary: string
  aboutTitle: string
  aboutContent: Array<{ paragraph: string }>
  aboutCtaText: string
  subscriptionTitle: string
  subscriptionDescription: string
  subscriptionCtaText: string
  featuredProductsTitle?: string
  featuredProductsDescription?: string
  featuredProducts?: Product[]
}

export default function Home() {
  const [content, setContent] = useState<HomepageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [siteSettings, setSiteSettings] = useState<any>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [cartMessage, setCartMessage] = useState<string | null>(null)
  const { addItem } = useCart()

  useEffect(() => {
    fetchHomepageContent()
    fetchSiteSettings()
  }, [])

  const fetchSiteSettings = async () => {
    try {
      const response = await fetch('/api/content/siteSettings')
      const data = await response.json()
      if (data.success) {
        setSiteSettings(data.data)
      }
    } catch (error) {
      console.error('Error fetching site settings:', error)
    }
  }

  const fetchHomepageContent = async () => {
    try {
      const response = await fetch('/api/content/homepage')
      const data = await response.json()
      
      if (data.success) {
        setContent(data.data)
      }
    } catch (error) {
      console.error('Error fetching homepage content:', error)
    } finally {
      setLoading(false)
    }
  }

  // Default content fallback
  const defaultContent: HomepageContent = {
    title: 'Vendetta Roasting',
    heroSubtitle: 'Crafting exceptional coffee with passion and precision',
    heroImage: null,
    heroCtaPrimary: 'Shop Coffee',
    heroCtaSecondary: 'Subscribe',
    aboutTitle: 'Our Story',
    aboutContent: [
      {
        paragraph:
          'Vendetta Roasting was born from a passion for exceptional coffee and a commitment to ethical sourcing. Our journey began in a small garage in Seattle, where we experimented with different roasting techniques to bring out the unique characteristics of each bean.',
      },
      {
        paragraph:
          'Today, we work directly with farmers around the world to source the finest beans, paying fair prices and supporting sustainable farming practices.',
      },
    ],
    aboutCtaText: 'Learn More',
    subscriptionTitle: 'Never Run Out of Great Coffee',
    subscriptionDescription:
      'Subscribe to regular deliveries and save 15%. Choose your frequency, beans, and grind.',
    subscriptionCtaText: 'Start a Subscription',
  }

  const displayContent = content || defaultContent

  // Handle adding featured product to cart
  const handleAddToCart = async (product: Product) => {
    // Check if product is out of stock
    if (product.inventory_quantity <= 0) {
      setCartMessage(`${product.name} is currently out of stock.`)
      setTimeout(() => setCartMessage(null), 3000)
      return
    }

    setAddingToCart(product.id)
    setCartMessage(null)

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
      })

      const inventoryData = await inventoryResponse.json()

      if (!inventoryData.success || !inventoryData.data.available) {
        setCartMessage(`${product.name} is currently out of stock.`)
        setTimeout(() => setCartMessage(null), 3000)
        setAddingToCart(null)
        return
      }

      // Add item to cart
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url || '/images/placeholder.jpg',
        slug: product.slug
      })

      setCartMessage(`Added ${product.name} to cart!`)
      setTimeout(() => setCartMessage(null), 3000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      setCartMessage('Failed to add item to cart. Please try again.')
      setTimeout(() => setCartMessage(null), 3000)
    } finally {
      setAddingToCart(null)
    }
  }

  // Generate structured data
  const structuredData = [];
  
  // Website schema
  structuredData.push(generateWebsiteSchema());
  
  // Organization schema
  if (siteSettings) {
    structuredData.push(generateOrganizationSchema({
      name: siteSettings.companyName || 'Vendetta Roasting',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://vendettaroasting.com',
      description: siteSettings.tagline || 'Premium coffee roasting company',
      address: siteSettings.footerAddress ? {
        street: siteSettings.footerAddress.street,
        city: siteSettings.footerAddress.city,
        state: siteSettings.footerAddress.state,
        zipCode: siteSettings.footerAddress.zipCode,
        country: 'USA',
      } : undefined,
      contactPoint: siteSettings.footerAddress ? {
        email: siteSettings.footerAddress.email,
        telephone: siteSettings.footerAddress.phone,
        contactType: 'Customer Service',
      } : undefined,
      sameAs: siteSettings.socialMedia ? [
        siteSettings.socialMedia.instagram,
        siteSettings.socialMedia.facebook,
        siteSettings.socialMedia.twitter,
        siteSettings.socialMedia.youtube,
        siteSettings.socialMedia.tiktok,
      ].filter(Boolean) : undefined,
    }));
  }

  return (
    <>
      <SEO
        title={displayContent.title}
        description={displayContent.heroSubtitle || 'Premium coffee roasting company offering exceptional coffee beans, subscriptions, and wholesale solutions.'}
        image={displayContent.heroImage || undefined}
        url="/"
        type="website"
        structuredData={structuredData}
      />
      
      {/* Announcements Banner */}
      <Announcements />
      
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] bg-coffee-dark flex items-center overflow-hidden">
        {/* Background Image */}
        {displayContent.heroImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={displayContent.heroImage}
              alt={displayContent.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-10"></div>
        {/* Content */}
        <div className="container mx-auto px-4 z-20 text-center relative">
          <h1 className="text-5xl md:text-7xl font-bold text-cream-light mb-6 leading-tight tracking-tight">
            {displayContent.title}
          </h1>
          <p className="text-xl md:text-2xl text-cream-light mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            {displayContent.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/shop" className="bg-coffee hover:bg-coffee-light text-cream-light px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-warm-lg hover:shadow-warm hover:scale-105 transform">
              {displayContent.heroCtaPrimary}
            </Link>
            <Link href="/subscriptions" className="bg-transparent hover:bg-cream-light hover:text-coffee border-2 border-cream-light text-cream-light px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 transform backdrop-blur-sm">
              {displayContent.heroCtaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {displayContent.featuredProducts && displayContent.featuredProducts.length > 0 && (
        <section className="py-20 bg-cream-light">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-coffee-dark mb-4">
                {displayContent.featuredProductsTitle || 'Featured Coffees'}
              </h2>
              {displayContent.featuredProductsDescription && (
                <p className="text-lg text-coffee max-w-2xl mx-auto">
                  {displayContent.featuredProductsDescription}
                </p>
              )}
            </div>

            {/* Cart Message */}
            {cartMessage && (
              <div className={`mb-6 p-4 rounded-xl max-w-2xl mx-auto ${
                cartMessage.includes('Added')
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {cartMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayContent.featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-warm-lg transition-all duration-400 transform hover:-translate-y-2 group">
                  <Link href={`/shop/${product.slug}`}>
                    <div className="relative overflow-hidden">
                      <ProductImage 
                        productId={product.id}
                        className="h-64 cursor-pointer group-hover:scale-110 transition-transform duration-500"
                        alt={product.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </Link>
                  <div className="p-6">
                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="text-xl font-bold text-coffee-dark mb-3 group-hover:text-coffee-light transition-colors duration-300 cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-coffee mb-6 leading-relaxed line-clamp-2">
                      {product.short_description || product.description}
                    </p>
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
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-coffee via-coffee-light to-coffee text-cream-light relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(240,230,217,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="bg-gradient-to-br from-cream-dark to-cream h-96 w-full rounded-2xl shadow-warm-lg overflow-hidden">
                <div className="h-full w-full bg-gradient-to-br from-coffee-dark/20 to-coffee-light/20"></div>
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">{displayContent.aboutTitle}</h2>
              <div className="space-y-6 mb-8">
                {displayContent.aboutContent.map((item, index) => (
                  <p key={index} className="text-lg leading-relaxed text-cream-light/95">
                    {item.paragraph}
                  </p>
                ))}
              </div>
              <Link href="/about" className="inline-block border-2 border-cream-light hover:bg-cream-light hover:text-coffee px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-soft hover:shadow-warm hover:scale-105 transform">
                {displayContent.aboutCtaText}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Highlight */}
      <section className="py-20 bg-gradient-to-br from-cream via-cream-light to-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(58,38,24,0.1) 1px, transparent 0)', backgroundSize: '50px 50px' }}></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-coffee-dark mb-6 leading-tight">{displayContent.subscriptionTitle}</h2>
          <p className="text-xl text-coffee mb-10 max-w-3xl mx-auto leading-relaxed">
            {displayContent.subscriptionDescription}
          </p>
          <Link href="/subscriptions" className="inline-block bg-coffee hover:bg-coffee-light text-cream-light px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-warm-lg hover:shadow-warm hover:scale-105 transform">
            {displayContent.subscriptionCtaText}
          </Link>
        </div>
      </section>
    </>
  )
}
