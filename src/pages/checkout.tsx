import Head from 'next/head'
import Link from 'next/link'
import { useCart } from '../lib/cart/CartContext'
import OrderSummary from '../components/OrderSummary'
import { useState, useEffect } from 'react'

export default function Checkout() {
  const { state, removeItem, updateQuantity, clearCart } = useCart()
  const { items, itemCount: totalItems, total: totalPrice } = state
  const [isClient, setIsClient] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
    shippingMethod: 'standard'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // TODO: Implement actual checkout logic
    console.log('Checkout form submitted:', formData)
    
    setIsSubmitting(false)
    // TODO: Redirect to success page or payment
  }

  if (!isClient) {
    return (
      <>
        <Head>
          <title>Loading Checkout | Vendetta Roasting</title>
        </Head>
        <div className="bg-cream-light py-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <p className="text-coffee-dark text-lg">Loading checkout...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Redirect to cart if empty
  if (items.length === 0) {
    return (
      <>
        <Head>
          <title>Checkout | Vendetta Roasting</title>
        </Head>
        <div className="bg-cream-light py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-2xl font-bold text-coffee-dark mb-4">Your cart is empty</h1>
              <p className="text-coffee mb-6">Add some items to your cart before checking out.</p>
              <Link href="/shop" className="inline-flex items-center px-6 py-3 bg-coffee text-cream-light rounded-md hover:bg-coffee-light transition-colors">
                Continue Shopping
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
        <title>Checkout | Vendetta Roasting</title>
        <meta name="description" content="Complete your coffee order" />
      </Head>

      <div className="bg-cream-light py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-coffee-dark mb-2">Checkout</h1>
              <p className="text-coffee-dark">Complete your order</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Contact Information */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-coffee-dark mb-4">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-coffee-dark mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-coffee-dark mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-coffee-dark mb-4">Shipping Information</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-coffee-dark mb-1">
                            First Name *
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-coffee-dark mb-1">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-coffee-dark mb-1">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-coffee-dark mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            required
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-coffee-dark mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            required
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                          />
                        </div>
                        <div>
                          <label htmlFor="zipCode" className="block text-sm font-medium text-coffee-dark mb-1">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            required
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Method */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-coffee-dark mb-4">Shipping Method</h2>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="standard"
                          checked={formData.shippingMethod === 'standard'}
                          onChange={handleInputChange}
                          className="text-coffee focus:ring-coffee"
                        />
                        <div>
                          <span className="font-medium text-coffee-dark">Standard Shipping</span>
                          <p className="text-sm text-coffee">5-7 business days - Free</p>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="express"
                          checked={formData.shippingMethod === 'express'}
                          onChange={handleInputChange}
                          className="text-coffee focus:ring-coffee"
                        />
                        <div>
                          <span className="font-medium text-coffee-dark">Express Shipping</span>
                          <p className="text-sm text-coffee">2-3 business days - $9.99</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-between items-center">
                    <Link href="/cart" className="text-coffee-dark hover:underline">
                      ← Back to Cart
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-8 py-3 rounded-md font-medium transition-colors ${
                        isSubmitting
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-coffee text-cream-light hover:bg-coffee-light'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-cream-light border-t-transparent rounded-full animate-spin mr-2" />
                          Processing...
                        </div>
                      ) : (
                        'Continue to Payment'
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <OrderSummary
                  items={items}
                  totalItems={totalItems}
                  totalPrice={totalPrice}
                  shippingMethod={formData.shippingMethod}
                  shippingCost={formData.shippingMethod === 'express' ? 9.99 : 0}
                  className="sticky top-4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
