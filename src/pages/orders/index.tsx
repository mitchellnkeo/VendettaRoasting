import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  itemCount: number
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch orders from API
        const response = await fetch('/api/account/orders')
        const data = await response.json()
        
        if (data.success) {
          // Transform API data to match component interface
          const transformedOrders: Order[] = data.data.map((order: any) => ({
            id: order.order_number || order.id,
            status: order.status,
            total: order.total || order.total_amount,
            createdAt: order.date || order.created_at,
            itemCount: order.items?.length || 0,
            items: order.items || []
          }))
          setOrders(transformedOrders)
        } else {
          setError(data.message || 'Failed to load orders')
          setOrders([])
        }
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError('Failed to load orders. Please try again.')
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'shipped':
        return 'bg-green-100 text-green-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '✓'
      case 'processing':
        return '⏳'
      case 'shipped':
        return '🚚'
      case 'delivered':
        return '📦'
      default:
        return '❓'
    }
  }

  if (loading) {
    return (
      <>
        <Head>
          <title>My Orders | Vendetta Roasting</title>
        </Head>
        <div className="bg-cream-light py-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coffee mb-4"></div>
              <p className="text-coffee-dark text-lg">Loading your orders...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>My Orders | Vendetta Roasting</title>
        <meta name="description" content="View your order history and track shipments" />
      </Head>

      <div className="bg-cream-light py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-coffee-dark mb-2">My Orders</h1>
              <p className="text-coffee-dark">Track your orders and view order history</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-coffee-dark mb-2">No orders yet</h2>
                <p className="text-coffee mb-6">Start shopping to see your orders here.</p>
                <Link href="/shop" className="inline-flex items-center px-6 py-3 bg-coffee text-cream-light rounded-md hover:bg-coffee-light transition-colors">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div className="mb-4 md:mb-0">
                        <h3 className="text-lg font-semibold text-coffee-dark mb-1">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-coffee">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <span className="text-lg font-semibold text-coffee-dark">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-coffee-dark mb-2">Items ({order.itemCount})</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm text-coffee">
                            <span>{item.name} × {item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <Link 
                        href={`/orders/${order.id}`}
                        className="inline-flex items-center px-4 py-2 border border-coffee text-coffee-dark rounded-md hover:bg-cream transition-colors"
                      >
                        View Details
                      </Link>
                      {order.status === 'shipped' && (
                        <button className="inline-flex items-center px-4 py-2 bg-coffee text-cream-light rounded-md hover:bg-coffee-light transition-colors">
                          Track Package
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/shop" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="inline-block w-12 h-12 bg-coffee-light rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-coffee" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L3 9z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-coffee-dark mb-2">Continue Shopping</h3>
                <p className="text-sm text-coffee">Browse our latest coffee selection</p>
              </Link>

              <Link href="/subscriptions" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="inline-block w-12 h-12 bg-coffee-light rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-coffee" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-coffee-dark mb-2">Subscriptions</h3>
                <p className="text-sm text-coffee">Set up recurring coffee delivery</p>
              </Link>

              <Link href="/account" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="inline-block w-12 h-12 bg-coffee-light rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-coffee" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-coffee-dark mb-2">Account Settings</h3>
                <p className="text-sm text-coffee">Manage your account information</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
