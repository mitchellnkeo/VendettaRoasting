import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/lib/auth/AuthContext'

export default function Account() {
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    memberSince: ''
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [subscriptionStatus, setSubscriptionStatus] = useState<{status: string, nextDelivery: string, plan: string} | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setLoading(true)
        
        // Fetch user data from database
        if (user?.email) {
          const userResponse = await fetch(`/api/users?email=${encodeURIComponent(user.email)}`)
          const userData_result = await userResponse.json()
          
          if (userData_result.success && userData_result.data) {
            const dbUser = userData_result.data
            setUserData({
              firstName: dbUser.first_name || user.name?.split(' ')[0] || '',
              lastName: dbUser.last_name || user.name?.split(' ').slice(1).join(' ') || '',
              email: dbUser.email || user.email || '',
              memberSince: dbUser.created_at || new Date().toISOString()
            })
          } else {
            // Fallback to auth context
            setUserData({
              firstName: user.name?.split(' ')[0] || '',
              lastName: user.name?.split(' ').slice(1).join(' ') || '',
              email: user.email || '',
              memberSince: new Date().toISOString()
            })
          }
        } else {
          setUserData({
            firstName: user?.name?.split(' ')[0] || '',
            lastName: user?.name?.split(' ').slice(1).join(' ') || '',
            email: user?.email || '',
            memberSince: new Date().toISOString()
          })
        }

        // Fetch recent orders
        try {
          const ordersResponse = await fetch('/api/account/orders')
          const ordersData = await ordersResponse.json()
          if (ordersData.success) {
            setRecentOrders(ordersData.data.slice(0, 2) || [])
          }
        } catch (err) {
          console.error('Error fetching recent orders:', err)
        }

        // Fetch subscription status
        try {
          const subResponse = await fetch('/api/subscriptions')
          const subData = await subResponse.json()
          if (subData.success && subData.data && subData.data.length > 0) {
            const activeSub = subData.data.find((s: any) => s.status === 'active')
            if (activeSub) {
              setSubscriptionStatus({
                status: 'active',
                nextDelivery: activeSub.nextDelivery || activeSub.currentPeriodEnd || '',
                plan: activeSub.planId || 'Monthly Coffee Box'
              })
            }
          }
        } catch (err) {
          console.error('Error fetching subscription:', err)
        }
      } catch (err) {
        console.error('Error fetching account data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAccountData()
  }, [user])

  if (loading) {
    return (
      <>
        <Head>
          <title>My Account | Vendetta Roasting</title>
        </Head>
        <div className="bg-cream-light py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-coffee-light rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="h-4 bg-coffee-light rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-coffee-light rounded w-3/4"></div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="h-4 bg-coffee-light rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-coffee-light rounded w-3/4"></div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="h-4 bg-coffee-light rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-coffee-light rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>My Account | Vendetta Roasting</title>
        <meta name="description" content="Your Vendetta Roasting account dashboard" />
      </Head>

      <div className="bg-cream-light py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-coffee-dark mb-2">
                Welcome back, {userData.firstName}!
              </h1>
              <p className="text-coffee">
                Manage your account, view orders, and track your coffee journey.
              </p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Account Info */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-coffee-dark mb-4">Account Info</h3>
                <div className="space-y-2">
                  <p className="text-coffee">
                    <span className="font-medium">Name:</span> {userData.firstName} {userData.lastName}
                  </p>
                  <p className="text-coffee">
                    <span className="font-medium">Email:</span> {userData.email}
                  </p>
                  <p className="text-coffee">
                    <span className="font-medium">Member since:</span> {new Date(userData.memberSince).toLocaleDateString()}
                  </p>
                </div>
                <Link 
                  href="/account/settings"
                  className="inline-block mt-4 text-coffee hover:text-coffee-light font-medium"
                >
                  Edit Profile →
                </Link>
              </div>

              {/* Recent Orders */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-coffee-dark mb-4">Recent Orders</h3>
                {recentOrders.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {recentOrders.map((order) => (
                        <div key={order.id || order.order_number} className="text-coffee">
                          <p className="font-medium">Order #{order.order_number || order.id}</p>
                          <p className="text-sm text-coffee-light">
                            {new Date(order.date || order.created_at).toLocaleDateString()} - ${(order.total || order.total_amount || 0).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <Link 
                      href="/account/orders"
                      className="inline-block mt-4 text-coffee hover:text-coffee-light font-medium"
                    >
                      View All Orders →
                    </Link>
                  </>
                ) : (
                  <div className="text-coffee">
                    <p className="text-sm mb-4">No recent orders</p>
                    <Link 
                      href="/shop"
                      className="inline-block text-coffee hover:text-coffee-light font-medium"
                    >
                      Start Shopping →
                    </Link>
                  </div>
                )}
              </div>

              {/* Subscription Status */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-coffee-dark mb-4">Subscription</h3>
                {subscriptionStatus ? (
                  <>
                    <div className="space-y-2">
                      <p className="text-coffee">
                        <span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                          subscriptionStatus.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {subscriptionStatus.status.charAt(0).toUpperCase() + subscriptionStatus.status.slice(1)}
                        </span>
                      </p>
                      {subscriptionStatus.nextDelivery && (
                        <p className="text-coffee">
                          <span className="font-medium">Next delivery:</span> {new Date(subscriptionStatus.nextDelivery).toLocaleDateString()}
                        </p>
                      )}
                      <p className="text-coffee">
                        <span className="font-medium">Plan:</span> {subscriptionStatus.plan}
                      </p>
                    </div>
                    <Link 
                      href="/subscriptions/manage"
                      className="inline-block mt-4 text-coffee hover:text-coffee-light font-medium"
                    >
                      Manage Subscription →
                    </Link>
                  </>
                ) : (
                  <div className="text-coffee">
                    <p className="text-sm mb-4">No active subscription</p>
                    <Link 
                      href="/subscriptions"
                      className="inline-block text-coffee hover:text-coffee-light font-medium"
                    >
                      View Plans →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-coffee-dark mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link 
                  href="/shop"
                  className="flex items-center p-4 border border-coffee-light rounded-lg hover:bg-cream transition-colors"
                >
                  <div className="text-coffee mr-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-coffee-dark">Shop Coffee</p>
                    <p className="text-sm text-coffee">Browse our selection</p>
                  </div>
                </Link>

                <Link 
                  href="/subscriptions"
                  className="flex items-center p-4 border border-coffee-light rounded-lg hover:bg-cream transition-colors"
                >
                  <div className="text-coffee mr-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-coffee-dark">Subscriptions</p>
                    <p className="text-sm text-coffee">Manage your plan</p>
                  </div>
                </Link>

                <Link 
                  href="/account/orders"
                  className="flex items-center p-4 border border-coffee-light rounded-lg hover:bg-cream transition-colors"
                >
                  <div className="text-coffee mr-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-coffee-dark">Order History</p>
                    <p className="text-sm text-coffee">View past orders</p>
                  </div>
                </Link>

                <Link 
                  href="/account/settings"
                  className="flex items-center p-4 border border-coffee-light rounded-lg hover:bg-cream transition-colors"
                >
                  <div className="text-coffee mr-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-coffee-dark">Account Settings</p>
                    <p className="text-sm text-coffee">Update your info</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

