import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '../lib/cart/CartContext'
import { useState, useEffect } from 'react'

export default function Cart() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <>
        <Head>
          <title>Loading Cart | Vendetta Roasting</title>
        </Head>
        <div className="bg-cream-light py-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <p className="text-coffee-dark text-lg">Loading cart...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Shopping Cart | Vendetta Roasting</title>
        <meta name="description" content="Review your coffee selections and proceed to checkout" />
      </Head>

      <div className="bg-cream-light py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-coffee-dark mb-2">Shopping Cart</h1>
              <p className="text-coffee-dark">
                {totalItems === 0 ? 'Your cart is empty' : `${totalItems} item${totalItems === 1 ? '' : 's'} in your cart`}
              </p>
            </div>

            {items.length === 0 ? (
              /* Empty Cart */
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-coffee-light mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h2 className="text-xl font-semibold text-coffee-dark mb-2">Your cart is empty</h2>
                  <p className="text-coffee mb-6">Start shopping to add items to your cart</p>
                </div>
                <Link href="/shop" className="inline-flex items-center px-6 py-3 bg-coffee text-cream-light rounded-md hover:bg-coffee-light transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L3 9z" />
                  </svg>
                  Start Shopping
                </Link>
              </div>
            ) : (
              /* Cart with Items */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-coffee-dark">Cart Items</h2>
                        <button
                          onClick={clearCart}
                          className="text-sm text-red-600 hover:text-red-800 hover:underline"
                        >
                          Clear Cart
                        </button>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                      {items.map((item) => (
                        <div key={item.id} className="p-6">
                          <div className="flex items-center space-x-4">
                            {/* Product Image */}
                            <div className="relative w-20 h-20 flex-shrink-0">
                              <Image
                                src={item.image || '/images/placeholder.jpg'}
                                alt={item.name}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded-md"
                                sizes="80px"
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-grow">
                              <Link href={`/shop/${item.slug}`} className="font-medium text-coffee-dark hover:underline">
                                {item.name}
                              </Link>
                              <p className="text-sm text-coffee">${item.price.toFixed(2)} each</p>
                              
                              {/* Quantity Controls */}
                              <div className="flex items-center mt-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="px-3 py-1 border border-gray-300 rounded-l-md text-coffee-dark hover:bg-gray-100"
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </button>
                                <span className="px-4 py-1 border-t border-b border-gray-300 text-coffee-dark">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="px-3 py-1 border border-gray-300 rounded-r-md text-coffee-dark hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Price and Remove */}
                            <div className="text-right">
                              <p className="font-semibold text-coffee-dark">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-600 hover:text-red-800 text-sm mt-1"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                    <h2 className="text-lg font-semibold text-coffee-dark mb-4">Order Summary</h2>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-coffee">
                        <span>Subtotal ({totalItems} items)</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-coffee">
                        <span>Shipping</span>
                        <span>Calculated at checkout</span>
                      </div>
                      <div className="flex justify-between text-coffee">
                        <span>Tax</span>
                        <span>Calculated at checkout</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-lg font-semibold text-coffee-dark">
                          <span>Total</span>
                          <span>${totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <Link href="/checkout" className="block w-full text-center px-4 py-3 bg-coffee text-cream-light rounded-md hover:bg-coffee-light transition-colors mb-3">
                      Proceed to Checkout
                    </Link>
                    
                    <Link href="/shop" className="block w-full text-center px-4 py-2 text-coffee-dark hover:underline">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
