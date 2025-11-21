import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { SUBSCRIPTION_PLANS, getSubscriptionStatusColor, getSubscriptionStatusIcon } from '../../lib/subscription'

interface Subscription {
  id: string
  planId: string
  status: 'active' | 'paused' | 'cancelled' | 'past_due'
  currentPeriodStart: string
  currentPeriodEnd: string
  nextDelivery: string
  deliveryFrequency: string
  items: Array<{
    productId: string
    name: string
    quantity: number
    price: number
  }>
}

export default function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch subscriptions from API
        const response = await fetch('/api/subscriptions')
        const data = await response.json()
        
        if (data.success) {
          setSubscriptions(data.data || [])
        } else {
          setError(data.message || 'Failed to load subscriptions')
          setSubscriptions([])
        }
      } catch (err) {
        console.error('Error fetching subscriptions:', err)
        setError('Failed to load subscriptions. Please try again.')
        setSubscriptions([])
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [])

  const handlePauseSubscription = async (subscriptionId: string) => {
    try {
      // In a real application, you would call the pause API
      console.log('Pausing subscription:', subscriptionId)
      
      // Update local state
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, status: 'paused' as const }
            : sub
        )
      )
    } catch (error) {
      console.error('Error pausing subscription:', error)
    }
  }

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      // In a real application, you would call the cancel API
      console.log('Cancelling subscription:', subscriptionId)
      
      // Update local state
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, status: 'cancelled' as const }
            : sub
        )
      )
    } catch (error) {
      console.error('Error cancelling subscription:', error)
    }
  }

  if (loading) {
    return (
      <>
        <Head>
          <title>Managing Subscriptions | Vendetta Roasting</title>
        </Head>
        <div className="bg-cream-light py-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coffee mb-4"></div>
              <p className="text-coffee-dark text-lg">Loading your subscriptions...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Manage Subscriptions | Vendetta Roasting</title>
        <meta name="description" content="Manage your coffee subscriptions" />
      </Head>

      <div className="bg-cream-light py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-coffee-dark mb-2">Manage Subscriptions</h1>
              <p className="text-coffee-dark">Manage your coffee delivery subscriptions</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {subscriptions.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-coffee-dark mb-2">No active subscriptions</h2>
                <p className="text-coffee mb-6">Start a coffee subscription to get regular deliveries.</p>
                <Link href="/subscriptions" className="inline-flex items-center px-6 py-3 bg-coffee text-cream-light rounded-md hover:bg-coffee-light transition-colors">
                  Browse Subscriptions
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {subscriptions.map((subscription) => {
                  const plan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.planId)
                  
                  return (
                    <div key={subscription.id} className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div className="mb-4 md:mb-0">
                          <h3 className="text-lg font-semibold text-coffee-dark mb-1">
                            {plan?.name || 'Coffee Subscription'}
                          </h3>
                          <p className="text-sm text-coffee">
                            Subscription #{subscription.id}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSubscriptionStatusColor(subscription.status)}`}>
                            {getSubscriptionStatusIcon(subscription.status)} {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                          </span>
                          <span className="text-lg font-semibold text-coffee-dark">
                            ${subscription.items[0]?.price.toFixed(2) || '0.00'}/{plan?.interval || 'month'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                          <h4 className="font-medium text-coffee-dark mb-1">Next Delivery</h4>
                          <p className="text-sm text-coffee">
                            {new Date(subscription.nextDelivery).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-coffee-dark mb-1">Delivery Frequency</h4>
                          <p className="text-sm text-coffee capitalize">
                            {subscription.deliveryFrequency}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-coffee-dark mb-1">Billing Period</h4>
                          <p className="text-sm text-coffee">
                            {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handlePauseSubscription(subscription.id)}
                            disabled={subscription.status !== 'active'}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                              subscription.status === 'active'
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {subscription.status === 'paused' ? 'Resume' : 'Pause'}
                          </button>
                          <button 
                            onClick={() => handleCancelSubscription(subscription.id)}
                            disabled={subscription.status === 'cancelled'}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                              subscription.status !== 'cancelled'
                                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                        <Link 
                          href={`/subscriptions/${subscription.id}`}
                          className="inline-flex items-center px-4 py-2 border border-coffee text-coffee-dark rounded-md hover:bg-cream transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/subscriptions" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="inline-block w-12 h-12 bg-coffee-light rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-coffee" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-coffee-dark mb-2">Browse Subscriptions</h3>
                <p className="text-sm text-coffee">Explore our subscription plans</p>
              </Link>

              <Link href="/orders" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="inline-block w-12 h-12 bg-coffee-light rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-coffee" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-semibold text-coffee-dark mb-2">Order History</h3>
                <p className="text-sm text-coffee">View your past orders</p>
              </Link>

              <Link href="/account" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="inline-block w-12 h-12 bg-coffee-light rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-coffee" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-coffee-dark mb-2">Account Settings</h3>
                <p className="text-sm text-coffee">Manage your account</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
