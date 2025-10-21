import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  amount: number
  onSuccess: (paymentIntent: any) => void
  onError: (error: string) => void
  className?: string
}

const CheckoutForm = ({ amount, onSuccess, onError }: Omit<PaymentFormProps, 'className'>) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            metadata: {
              source: 'vendetta-roasting-checkout'
            }
          }),
        })

        const data = await response.json()

        if (data.success) {
          setClientSecret(data.clientSecret)
        } else {
          onError(data.message || 'Failed to initialize payment')
        }
      } catch (error) {
        onError('Failed to initialize payment')
      }
    }

    createPaymentIntent()
  }, [amount, onError])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setIsProcessing(true)

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      })

      if (error) {
        onError(error.message || 'Payment failed')
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent)
      }
    } catch (error) {
      onError('Payment processing failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-gray-300 rounded-md">
        <CardElement options={cardElementOptions} />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing || !clientSecret}
        className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${
          !stripe || !elements || isProcessing || !clientSecret
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-coffee text-cream-light hover:bg-coffee-light'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-cream-light border-t-transparent rounded-full animate-spin mr-2" />
            Processing Payment...
          </div>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </button>
    </form>
  )
}

const PaymentForm = ({ amount, onSuccess, onError, className = '' }: PaymentFormProps) => {
  return (
    <div className={className}>
      <Elements stripe={stripePromise}>
        <CheckoutForm
          amount={amount}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Elements>
    </div>
  )
}

export default PaymentForm
