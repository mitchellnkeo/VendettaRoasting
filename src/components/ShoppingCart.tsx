import { useState } from 'react'
import { useCart } from '../lib/cart/CartContext'
import Link from 'next/link'
import Image from 'next/image'

interface ShoppingCartProps {
  isOpen: boolean
  onClose: () => void
}

export default function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { state, removeItem, updateQuantity, clearCart } = useCart()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    setIsUpdating(id)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300))
    updateQuantity(id, newQuantity)
    setIsUpdating(null)
  }

  const handleRemoveItem = async (id: string) => {
    setIsUpdating(id)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300))
    removeItem(id)
    setIsUpdating(null)
  }

  const handleClearCart = async () => {
    setIsUpdating('clear')
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    clearCart()
    setIsUpdating(null)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Cart Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-coffee-light">
          <h2 className="text-xl font-semibold text-coffee-dark">
            Shopping Cart ({state.itemCount})
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-coffee hover:text-coffee-light transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {state.items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-coffee-light mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-coffee-dark mb-2">Your cart is empty</h3>
              <p className="text-coffee mb-6">Add some delicious coffee to get started!</p>
              <Link 
                href="/shop"
                onClick={onClose}
                className="bg-coffee text-cream-light px-6 py-3 rounded-md hover:bg-coffee-light transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-coffee-light rounded-lg">
                  {/* Product Image */}
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.image || '/images/placeholder.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-coffee-dark truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-coffee">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={isUpdating === item.id}
                      className="w-8 h-8 rounded-full border border-coffee-light flex items-center justify-center text-coffee hover:bg-cream disabled:opacity-50"
                    >
                      {isUpdating === item.id ? (
                        <div className="w-4 h-4 border-2 border-coffee border-t-transparent rounded-full animate-spin" />
                      ) : (
                        '-'
                      )}
                    </button>
                    
                    <span className="w-8 text-center text-coffee-dark font-medium">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={isUpdating === item.id}
                      className="w-8 h-8 rounded-full border border-coffee-light flex items-center justify-center text-coffee hover:bg-cream disabled:opacity-50"
                    >
                      {isUpdating === item.id ? (
                        <div className="w-4 h-4 border-2 border-coffee border-t-transparent rounded-full animate-spin" />
                      ) : (
                        '+'
                      )}
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isUpdating === item.id}
                    className="p-2 text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    {isUpdating === item.id ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-coffee-light p-6 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-coffee-dark">Total:</span>
              <span className="text-xl font-bold text-coffee">${state.total.toFixed(2)}</span>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleClearCart}
                disabled={isUpdating === 'clear'}
                className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {isUpdating === 'clear' ? 'Clearing...' : 'Clear Cart'}
              </button>
              
              <Link
                href="/cart"
                onClick={onClose}
                className="block w-full bg-coffee text-cream-light py-3 px-4 rounded-md hover:bg-coffee-light transition-colors text-center"
              >
                View Cart & Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
