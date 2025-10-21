import { NextApiRequest, NextApiResponse } from 'next'
import { stripe, formatAmountForStripe } from '../../../lib/stripe'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { amount, currency = 'usd', metadata = {} } = req.body

    // Validate amount
    if (!amount || amount < 0.50) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount. Minimum charge is $0.50'
      })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(amount),
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    })
  }
}
