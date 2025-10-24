import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  paymentIntentId: string
  items: OrderItem[]
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  shipping: {
    address: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
    method: string
    cost: number
    trackingNumber?: string
  }
  totals: {
    subtotal: number
    shipping: number
    total: number
  }
  status: string
  createdAt: string
  updatedAt: string
  tracking?: {
    status: string
    estimatedDelivery: string
    history: Array<{
      status: string
      timestamp: string
      description: string
    }>
  }
}

export default function OrderTracking() {
  const router = useRouter()
  const { orderId } = router.query
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) return

    const fetchOrder = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/orders/${orderId}`)
        const data = await response.json()

        if (data.success) {
          setOrder(data.data)
        } else {
          throw new Error(data.message || 'Failed to fetch order')
        }
      } catch (err) {
        console.error('Error fetching order:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

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
          <title>Loading Order | Vendetta Roasting</title>
        </Head>
        <div className="bg-cream-light py-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coffee mb-4"></div>
              <p className="text-coffee-dark text-lg">Loading order details...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (error || !order) {
    return (
      <>
        <Head>
          <title>Order Not Found | Vendetta Roasting</title>
        </Head>
        <div className="bg-cream-light py-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <p className="text-red-600 text-lg mb-4">Error: {error || 'Order not found'}</p>
              <Link href="/account/orders" className="text-coffee-dark hover:underline">
                Back to Orders
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
        <title>Order {order.id} | Vendetta Roasting</title>
        <meta name="description" content={`Track your order ${order.id}`} />
      </Head>

      <div className="bg-cream-light py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-coffee-dark mb-2">Order Details</h1>
              <p className="text-coffee-dark">Order #{order.id}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Status */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-coffee-dark mb-4">Order Status</h2>
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    {order.tracking?.estimatedDelivery && (
                      <span className="text-coffee">
                        Estimated delivery: {new Date(order.tracking.estimatedDelivery).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  {order.tracking?.trackingNumber && (
                    <div className="bg-cream p-4 rounded-md">
                      <p className="text-sm text-coffee-dark mb-1">Tracking Number</p>
                      <p className="font-mono text-coffee-dark">{order.tracking.trackingNumber}</p>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-coffee-dark mb-4">Order Items</h2>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={item.image || '/images/placeholder.jpg'}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-coffee-dark">{item.name}</h3>
                          <p className="text-sm text-coffee">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-coffee-dark">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-coffee-dark mb-4">Shipping Address</h2>
                  <div className="text-coffee">
                    <p>{order.customer.firstName} {order.customer.lastName}</p>
                    <p>{order.shipping.address.street}</p>
                    <p>{order.shipping.address.city}, {order.shipping.address.state} {order.shipping.address.zipCode}</p>
                    <p>{order.shipping.address.country}</p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                  <h2 className="text-xl font-semibold text-coffee-dark mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-coffee">Subtotal</span>
                      <span className="text-coffee-dark">${order.totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-coffee">Shipping</span>
                      <span className="text-coffee-dark">
                        {order.totals.shipping === 0 ? 'Free' : `$${order.totals.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-coffee-dark">Total</span>
                        <span className="font-semibold text-coffee-dark">${order.totals.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-coffee">
                    <div>
                      <span className="font-medium">Order Date:</span>
                      <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium">Payment Method:</span>
                      <p>Card ending in 4242</p>
                    </div>
                    <div>
                      <span className="font-medium">Shipping Method:</span>
                      <p className="capitalize">{order.shipping.method}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <Link 
                      href="/shop" 
                      className="block w-full text-center px-4 py-2 bg-coffee text-cream-light rounded-md hover:bg-coffee-light transition-colors"
                    >
                      Continue Shopping
                    </Link>
                    <Link 
                      href="/account/orders" 
                      className="block w-full text-center px-4 py-2 border border-coffee text-coffee-dark rounded-md hover:bg-cream transition-colors"
                    >
                      View All Orders
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
