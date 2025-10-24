import Head from 'next/head'
import Link from 'next/link'
import { useCart } from '../lib/cart/CartContext'
import OrderSummary from '../components/OrderSummary'
import AddressForm from '../components/AddressForm'
import SavedAddresses from '../components/SavedAddresses'
import PaymentForm from '../components/PaymentForm'
import { useState, useEffect } from 'react'

export default function Checkout() {
  const { state, removeItem, updateQuantity, clearCart } = useCart()
  const { items, itemCount: totalItems, total: totalPrice } = state
  const [isClient, setIsClient] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    shippingMethod: 'standard'
  })
  
  // Address state
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: ''
  })
  
  const [useSavedAddress, setUseSavedAddress] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Payment state
  const [paymentStep, setPaymentStep] = useState<'form' | 'payment' | 'processing' | 'success'>('form')
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

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

  const handleAddressChange = (address: any) => {
    setShippingAddress(address)
  }

  const handleSavedAddressSelect = (address: any) => {
    setShippingAddress(address)
    setUseSavedAddress(true)
  }

  const handlePaymentSuccess = (paymentIntent: any) => {
    setPaymentStep('processing')
    setPaymentError(null)
    
    // Simulate order processing
    setTimeout(() => {
      const newOrderId = `ORD-${Date.now()}`
      setOrderId(newOrderId)
      setPaymentStep('success')
      
      // Clear cart after successful payment
      clearCart()
    }, 2000)
  }

  const handlePaymentError = (error: string) => {
    setPaymentError(error)
    setPaymentStep('form')
  }

  const proceedToPayment = () => {
    setPaymentStep('payment')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form validation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Proceed to payment step
    setPaymentStep('payment')
    setIsSubmitting(false)
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

            {/* Payment Step Logic */}
            {paymentStep === 'form' && (
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
                          value={shippingAddress.phone}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-coffee-dark mb-4">Shipping Information</h2>
                    
                    {/* Address Options */}
                    <div className="mb-6">
                      <div className="flex space-x-4 mb-4">
                        <button
                          type="button"
                          onClick={() => setUseSavedAddress(false)}
                          className={`px-4 py-2 rounded-md font-medium transition-colors ${
                            !useSavedAddress
                              ? 'bg-coffee text-cream-light'
                              : 'bg-gray-100 text-coffee-dark hover:bg-gray-200'
                          }`}
                        >
                          New Address
                        </button>
                        <button
                          type="button"
                          onClick={() => setUseSavedAddress(true)}
                          className={`px-4 py-2 rounded-md font-medium transition-colors ${
                            useSavedAddress
                              ? 'bg-coffee text-cream-light'
                              : 'bg-gray-100 text-coffee-dark hover:bg-gray-200'
                          }`}
                        >
                          Saved Addresses
                        </button>
                      </div>
                    </div>

                    {/* Address Form or Saved Addresses */}
                    {!useSavedAddress ? (
                      <AddressForm
                        onAddressChange={handleAddressChange}
                        initialAddress={shippingAddress}
                      />
                    ) : (
                      <SavedAddresses
                        onAddressSelect={handleSavedAddressSelect}
                      />
                    )}
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
            )}

            {/* Payment Step */}
            {paymentStep === 'payment' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Payment Form */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-coffee-dark mb-4">Payment Information</h2>
                    
                    {paymentError && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-800">{paymentError}</p>
                      </div>
                    )}

                    <PaymentForm
                      amount={totalPrice + (formData.shippingMethod === 'express' ? 9.99 : 0)}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </div>
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
            )}

            {/* Processing Step */}
            {paymentStep === 'processing' && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-coffee mb-4"></div>
                <h2 className="text-2xl font-semibold text-coffee-dark mb-2">Processing Your Order</h2>
                <p className="text-coffee">Please wait while we process your payment...</p>
              </div>
            )}

            {/* Success Step */}
            {paymentStep === 'success' && (
              <div className="text-center py-12">
                <div className="inline-block w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-coffee-dark mb-2">Order Confirmed!</h2>
                <p className="text-coffee mb-4">Thank you for your order. We'll send you a confirmation email shortly.</p>
                <p className="text-sm text-coffee mb-6">Order ID: {orderId}</p>
                <div className="space-x-4">
                  <Link href="/shop" className="inline-flex items-center px-6 py-3 bg-coffee text-cream-light rounded-md hover:bg-coffee-light transition-colors">
                    Continue Shopping
                  </Link>
                  <Link href="/account/orders" className="inline-flex items-center px-6 py-3 border border-coffee text-coffee-dark rounded-md hover:bg-cream transition-colors">
                    View Orders
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
