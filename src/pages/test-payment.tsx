import Head from 'next/head'
import { useState } from 'react'
import PaymentForm from '../components/PaymentForm'

export default function TestPayment() {
  const [result, setResult] = useState<string | null>(null)

  const handleSuccess = (paymentIntent: any) => {
    setResult(`Payment successful! ID: ${paymentIntent.id}`)
  }

  const handleError = (error: string) => {
    setResult(`Payment failed: ${error}`)
  }

  return (
    <>
      <Head>
        <title>Test Payment | Vendetta Roasting</title>
      </Head>

      <div className="bg-cream-light py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-coffee-dark mb-8">Test Stripe Payment</h1>
            
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-coffee-dark mb-4">Test Payment Form</h2>
              <p className="text-coffee mb-4">Test amount: $25.00</p>
              
              <PaymentForm
                amount={25.00}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </div>

            {result && (
              <div className={`p-4 rounded-md ${
                result.includes('successful')
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {result}
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="font-semibold text-blue-800 mb-2">Test Cards:</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li><strong>Success:</strong> 4242 4242 4242 4242</li>
                <li><strong>Declined:</strong> 4000 0000 0000 0002</li>
                <li><strong>Insufficient Funds:</strong> 4000 0000 0000 9995</li>
                <li><strong>Any future date</strong> for expiry</li>
                <li><strong>Any 3-digit CVC</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
