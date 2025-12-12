import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { SUBSCRIPTION_PLANS, DELIVERY_FREQUENCIES, COFFEE_PREFERENCES } from '../../lib/subscription'

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  interval: 'month' | 'week'
  features: string[]
  popular?: boolean
}

export default function SubscriptionSignup() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [deliveryFrequency, setDeliveryFrequency] = useState<string>('monthly')
  const [coffeePreferences, setCoffeePreferences] = useState<string[]>([])
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/subscriptions/plans')
        const data = await response.json()
        
        if (data.success) {
          setPlans(data.data)
          // Auto-select the popular plan
          const popularPlan = data.data.find((plan: SubscriptionPlan) => plan.popular)
          if (popularPlan) {
            setSelectedPlan(popularPlan.id)
          }
        } else {
          throw new Error(data.message || 'Failed to fetch plans')
        }
      } catch (err) {
        console.error('Error fetching plans:', err)
        setError('Failed to load subscription plans')
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingAddress(prev => ({ ...prev, [name]: value }))
  }

  const handlePreferenceChange = (preferenceId: string) => {
    setCoffeePreferences(prev => 
      prev.includes(preferenceId)
        ? prev.filter(id => id !== preferenceId)
        : [...prev, preferenceId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate form
      if (!selectedPlan) {
        throw new Error('Please select a subscription plan')
      }
      if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email) {
        throw new Error('Please fill in all required customer information')
      }
      if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
        throw new Error('Please fill in all required shipping information')
      }

      // Create subscription
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlan,
          customerEmail: customerInfo.email,
          customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          paymentMethodId: 'pm_mock_payment_method', // In real app, this would come from Stripe Elements
          deliveryFrequency,
          coffeePreferences,
          shippingAddress
        })
      })

      const result = await response.json()

      if (result.success) {
        // Track subscription signup
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
          const { trackSubscriptionSignup } = require('../../lib/analytics');
          const selectedPlanData = plans.find((p: SubscriptionPlan) => p.id === selectedPlan);
          trackSubscriptionSignup({
            subscription_id: result.data.subscriptionId,
            value: selectedPlanData?.price || 0,
            currency: 'USD',
            plan_name: selectedPlanData?.name || selectedPlan,
          });
        }
        
        setSuccess(`Subscription created successfully! Subscription ID: ${result.data.subscriptionId}`)
        // Reset form
        setSelectedPlan('')
        setDeliveryFrequency('monthly')
        setCoffeePreferences([])
        setCustomerInfo({ firstName: '', lastName: '', email: '', phone: '' })
        setShippingAddress({ street: '', city: '', state: '', zipCode: '', country: 'US' })
      } else {
        throw new Error(result.message || 'Failed to create subscription')
      }
    } catch (err) {
      console.error('Error creating subscription:', err)
      setError(err instanceof Error ? err.message : 'Failed to create subscription')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <>
        <Head>
          <title>Subscription Signup | Vendetta Roasting</title>
        </Head>
        <div className="bg-cream-light py-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coffee mb-4"></div>
              <p className="text-coffee-dark text-lg">Loading subscription plans...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Start Your Subscription | Vendetta Roasting</title>
        <meta name="description" content="Start your coffee subscription today" />
      </Head>

      <div className="bg-cream-light py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-coffee-dark mb-2">Start Your Coffee Subscription</h1>
              <p className="text-coffee-dark">Get premium coffee delivered to your door regularly</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Plan Selection */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-coffee-dark mb-4">Choose Your Plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedPlan === plan.id
                          ? 'border-coffee bg-cream'
                          : 'border-gray-200 hover:border-coffee-light'
                      } ${plan.popular ? 'ring-2 ring-coffee ring-opacity-50' : ''}`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.popular && (
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <span className="bg-coffee text-cream-light px-3 py-1 text-xs font-medium rounded-full">
                            Most Popular
                          </span>
                        </div>
                      )}
                      <div className="text-center">
                        <h3 className="font-semibold text-coffee-dark mb-2">{plan.name}</h3>
                        <div className="mb-4">
                          <span className="text-3xl font-bold text-coffee-dark">${plan.price}</span>
                          <span className="text-coffee">/{plan.interval}</span>
                        </div>
                        <p className="text-sm text-coffee mb-4">{plan.description}</p>
                        <ul className="text-sm text-coffee space-y-1">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-coffee rounded-full mr-2"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Preferences */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-coffee-dark mb-4">Delivery Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {DELIVERY_FREQUENCIES.map((frequency) => (
                    <label
                      key={frequency.value}
                      className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        deliveryFrequency === frequency.value
                          ? 'border-coffee bg-cream'
                          : 'border-gray-200 hover:border-coffee-light'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryFrequency"
                        value={frequency.value}
                        checked={deliveryFrequency === frequency.value}
                        onChange={(e) => setDeliveryFrequency(e.target.value)}
                        className="text-coffee focus:ring-coffee"
                      />
                      <div>
                        <div className="font-medium text-coffee-dark">{frequency.label}</div>
                        <div className="text-sm text-coffee">{frequency.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Coffee Preferences */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-coffee-dark mb-4">Coffee Preferences</h2>
                <p className="text-coffee mb-4">Select your preferred roast levels (you can choose multiple):</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {COFFEE_PREFERENCES.map((preference) => (
                    <label
                      key={preference.id}
                      className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-cream transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={coffeePreferences.includes(preference.id)}
                        onChange={() => handlePreferenceChange(preference.id)}
                        className="text-coffee focus:ring-coffee"
                      />
                      <div>
                        <div className="font-medium text-coffee-dark">{preference.name}</div>
                        <div className="text-sm text-coffee">{preference.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-coffee-dark mb-4">Customer Information</h2>
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
                      value={customerInfo.firstName}
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
                      value={customerInfo.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-coffee-dark mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={customerInfo.email}
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
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-coffee-dark mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="street" className="block text-sm font-medium text-coffee-dark mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      required
                      value={shippingAddress.street}
                      onChange={handleAddressChange}
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
                        value={shippingAddress.city}
                        onChange={handleAddressChange}
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
                        value={shippingAddress.state}
                        onChange={handleAddressChange}
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
                        value={shippingAddress.zipCode}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-between items-center">
                <Link href="/subscriptions" className="text-coffee-dark hover:underline">
                  ← Back to Subscriptions
                </Link>
                <button
                  type="submit"
                  disabled={submitting || !selectedPlan}
                  className={`px-8 py-3 rounded-md font-medium transition-colors ${
                    submitting || !selectedPlan
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-coffee text-cream-light hover:bg-coffee-light'
                  }`}
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-cream-light border-t-transparent rounded-full animate-spin mr-2" />
                      Creating Subscription...
                    </div>
                  ) : (
                    'Start Subscription'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
