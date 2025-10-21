import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  slug: string
}

interface OrderSummaryProps {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  shippingMethod: string
  shippingCost: number
  taxRate?: number
  className?: string
}

const OrderSummary = ({ 
  items, 
  totalItems, 
  totalPrice, 
  shippingMethod, 
  shippingCost,
  taxRate = 0.08, // 8% tax rate
  className = ''
}: OrderSummaryProps) => {
  const subtotal = totalPrice
  const tax = subtotal * taxRate
  const total = subtotal + shippingCost + tax

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-coffee-dark mb-4">Order Summary</h2>
      
      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        <h3 className="font-medium text-coffee-dark">Items ({totalItems})</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={item.image || '/images/placeholder.jpg'}
                  alt={item.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-md"
                  sizes="48px"
                />
              </div>
              <div className="flex-grow min-w-0">
                <Link 
                  href={`/shop/${item.slug}`}
                  className="font-medium text-coffee-dark hover:underline text-sm line-clamp-2"
                >
                  {item.name}
                </Link>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-coffee text-sm">Qty: {item.quantity}</p>
                  <p className="font-semibold text-coffee-dark text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-coffee">
          <span>Subtotal ({totalItems} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-coffee">
          <span>Shipping ({shippingMethod === 'express' ? 'Express' : 'Standard'})</span>
          <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
        </div>
        
        <div className="flex justify-between text-coffee">
          <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-semibold text-coffee-dark">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="mt-6 p-4 bg-cream rounded-md">
        <h4 className="font-medium text-coffee-dark mb-2">Shipping Information</h4>
        <p className="text-sm text-coffee">
          {shippingMethod === 'express' 
            ? 'Express shipping: 2-3 business days'
            : 'Standard shipping: 5-7 business days'
          }
        </p>
        <p className="text-xs text-coffee mt-1">
          Orders are processed within 1-2 business days
        </p>
      </div>

      {/* Security Badge */}
      <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-coffee">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span>Secure checkout</span>
      </div>
    </div>
  )
}

export default OrderSummary
