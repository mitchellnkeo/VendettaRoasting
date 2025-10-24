// Subscription plans and billing configuration
export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  interval: 'month' | 'week'
  features: string[]
  popular?: boolean
  stripePriceId?: string
}

export interface Subscription {
  id: string
  customerId: string
  planId: string
  status: 'active' | 'paused' | 'cancelled' | 'past_due'
  currentPeriodStart: string
  currentPeriodEnd: string
  nextDelivery: string
  deliveryFrequency: 'weekly' | 'biweekly' | 'monthly'
  items: Array<{
    productId: string
    name: string
    quantity: number
    price: number
  }>
}

// Subscription plans configuration
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic Coffee Subscription',
    description: 'Perfect for coffee lovers who want regular deliveries',
    price: 24.99,
    interval: 'month',
    features: [
      '2 bags of premium coffee per month',
      'Free shipping',
      'Flexible delivery schedule',
      'Cancel anytime'
    ],
    stripePriceId: 'price_basic_monthly' // This would be your actual Stripe price ID
  },
  {
    id: 'premium',
    name: 'Premium Coffee Subscription',
    description: 'For serious coffee enthusiasts who want variety',
    price: 39.99,
    interval: 'month',
    features: [
      '3 bags of premium coffee per month',
      'Exclusive limited edition roasts',
      'Free shipping',
      'Priority customer support',
      'Cancel anytime'
    ],
    popular: true,
    stripePriceId: 'price_premium_monthly'
  },
  {
    id: 'weekly',
    name: 'Weekly Coffee Subscription',
    description: 'Fresh coffee delivered every week',
    price: 19.99,
    interval: 'week',
    features: [
      '1 bag of premium coffee per week',
      'Free shipping',
      'Always fresh',
      'Cancel anytime'
    ],
    stripePriceId: 'price_weekly'
  }
]

// Delivery frequency options
export const DELIVERY_FREQUENCIES = [
  { value: 'weekly', label: 'Every Week', description: 'Fresh coffee every week' },
  { value: 'biweekly', label: 'Every 2 Weeks', description: 'Perfect for regular coffee drinkers' },
  { value: 'monthly', label: 'Every Month', description: 'Monthly coffee delivery' }
]

// Coffee preferences for subscription customization
export const COFFEE_PREFERENCES = [
  { id: 'light', name: 'Light Roast', description: 'Bright and acidic' },
  { id: 'medium', name: 'Medium Roast', description: 'Balanced flavor' },
  { id: 'dark', name: 'Dark Roast', description: 'Rich and bold' },
  { id: 'espresso', name: 'Espresso', description: 'Perfect for espresso drinks' },
  { id: 'decaf', name: 'Decaf', description: 'All the flavor, no caffeine' }
]

// Subscription status helpers
export const getSubscriptionStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'paused':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    case 'past_due':
      return 'bg-orange-100 text-orange-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const getSubscriptionStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return '✓'
    case 'paused':
      return '⏸️'
    case 'cancelled':
      return '❌'
    case 'past_due':
      return '⚠️'
    default:
      return '❓'
  }
}

// Calculate next delivery date
export const calculateNextDelivery = (frequency: string, lastDelivery?: string): string => {
  const baseDate = lastDelivery ? new Date(lastDelivery) : new Date()
  
  switch (frequency) {
    case 'weekly':
      return new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
    case 'biweekly':
      return new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString()
    case 'monthly':
      return new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
    default:
      return new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
  }
}
