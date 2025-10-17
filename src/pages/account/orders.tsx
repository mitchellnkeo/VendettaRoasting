import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Order {
  id: string
  date: string
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled'
  total: number
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'delivered' | 'shipped' | 'processing' | 'cancelled'>('all')

  useEffect(() => {
    // TODO: Fetch orders from API
    // Simulate loading and data
    setTimeout(() => {
      setOrders([
        {
          id: '12345',
          date: '2024-12-15',
          status: 'delivered',
          total: 24.99,
          items: [
            { name: 'Signature Blend #1', quantity: 1, price: 18.99 },
            { name: 'Coffee Mug', quantity: 1, price: 6.00 }
          ]
        },
        {
          id: '12344',
          date: '2024-12-10',
          status: 'delivered',
          total: 18.99,
          items: [
            { name: 'Signature Blend #2', quantity: 1, price: 18.99 }
          ]
        },
        {
          id: '12343',
          date: '2024-12-05',
          status: 'shipped',
          total: 35.98,
          items: [
            { name: 'Signature Blend #3', quantity: 2, price: 17.99 }
          ]
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredOrders = orders.filter(order => 
    filter === 'all' || order.status === filter
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered'
      case 'shipped':
        return 'Shipped'
      case 'processing':
        return 'Processing'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <>
        <Head>
          <title>Order History | Vendetta Roasting</title>
        </Head>
        <div className="bg-cream-light py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-coffee-light rounded w-1/4 mb-6"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="h-4 bg-coffee-light rounded w-1/4 mb-4"></div>
                      <div className="h-6 bg-coffee-light rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-coffee-light rounded w-1/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Order History | Vendetta Roasting</title>
        <meta name="description" content="View your order history and track your coffee purchases" />
      </Head>

      <div className="bg-cream-light py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-coffee-dark">Order History</h1>
                <Link 
                  href="/account/dashboard"
                  className="text-coffee hover:text-coffee-light font-medium"
                >
                  ← Back to Dashboard
                </Link>
              </div>
              <p className="text-coffee">
                Track your coffee orders and view order details.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
                {[
                  { key: 'all', label: 'All Orders' },
                  { key: 'delivered', label: 'Delivered' },
                  { key: 'shipped', label: 'Shipped' },
                  { key: 'processing', label: 'Processing' },
                  { key: 'cancelled', label: 'Cancelled' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key as any)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      filter === key
                        ? 'bg-coffee text-cream-light'
                        : 'text-coffee hover:bg-cream'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="text-coffee-light mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-coffee-dark mb-2">No orders found</h3>
                <p className="text-coffee mb-4">
                  {filter === 'all' 
                    ? "You haven't placed any orders yet."
                    : `No orders with status "${getStatusText(filter)}" found.`
                  }
                </p>
                <Link 
                  href="/shop"
                  className="bg-coffee text-cream-light px-6 py-3 rounded-md hover:bg-coffee-light transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-coffee-dark">
                          Order #{order.id}
                        </h3>
                        <p className="text-coffee">
                          Placed on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-coffee-dark">
                          ${order.total.toFixed(2)}
                        </p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-coffee-light pt-4">
                      <h4 className="font-medium text-coffee-dark mb-3">Items:</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div>
                              <p className="text-coffee-dark font-medium">{item.name}</p>
                              <p className="text-sm text-coffee">Quantity: {item.quantity}</p>
                            </div>
                            <p className="text-coffee font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end mt-4 space-x-3">
                      <button className="px-4 py-2 border border-coffee-light text-coffee rounded-md hover:bg-cream transition-colors">
                        View Details
                      </button>
                      {order.status === 'delivered' && (
                        <button className="px-4 py-2 bg-coffee text-cream-light rounded-md hover:bg-coffee-light transition-colors">
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
