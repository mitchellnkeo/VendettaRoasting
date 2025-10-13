import Head from 'next/head'
import { useState } from 'react'

// Mock subscription plans
const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Coffee Lover',
    price: 18.99,
    description: 'Perfect for the casual coffee drinker',
    features: [
      '12oz bag of coffee',
      'Delivered every 2 weeks',
      'Choose from our signature blends',
      'Free shipping'
    ]
  },
  {
    id: 'standard',
    name: 'Coffee Enthusiast',
    price: 34.99,
    description: 'Our most popular subscription',
    features: [
      'Two 12oz bags of coffee',
      'Delivered every 2 weeks',
      'Choose from all our coffees',
      'Free shipping',
      'Early access to limited releases'
    ],
    popular: true
  },
  {
    id: 'premium',
    name: 'Coffee Connoisseur',
    price: 49.99,
    description: 'For the true coffee aficionado',
    features: [
      'Three 12oz bags of coffee',
      'Delivered every 2 weeks',
      'Choose from all our coffees including exclusives',
      'Free shipping',
      'Early access to limited releases',
      'Free coffee brewing equipment quarterly'
    ]
  }
];

// Frequency options
const FREQUENCY_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 Weeks' },
  { value: 'monthly', label: 'Monthly' }
];

export default function Subscriptions() {
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [frequency, setFrequency] = useState('biweekly');

  return (
    <>
      <Head>
        <title>Coffee Subscriptions | Vendetta Roasting</title>
        <meta name="description" content="Subscribe to regular coffee deliveries from Vendetta Roasting" />
      </Head>

      {/* Hero Section */}
      <section className="relative h-[50vh] bg-coffee-dark flex items-center">
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="container mx-auto px-4 z-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-cream-light mb-6">
            Coffee Subscription Service
          </h1>
          <p className="text-xl text-cream mb-8 max-w-2xl mx-auto">
            Never run out of freshly roasted coffee. Get your favorite beans delivered 
            right to your door on your schedule.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-cream-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-coffee-dark text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-coffee text-cream-light w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-xl font-semibold text-coffee-dark mb-3">Choose Your Plan</h3>
              <p className="text-coffee">
                Select from our subscription options based on your coffee consumption and preferences.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-coffee text-cream-light w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-xl font-semibold text-coffee-dark mb-3">Customize Your Coffee</h3>
              <p className="text-coffee">
                Pick your favorite beans, roast level, and grind type. Change your selections anytime.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-coffee text-cream-light w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-xl font-semibold text-coffee-dark mb-3">Enjoy Fresh Coffee</h3>
              <p className="text-coffee">
                Receive freshly roasted coffee on your schedule. Skip, pause, or cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-coffee-dark text-center mb-6">Choose Your Plan</h2>
          <p className="text-coffee text-center max-w-2xl mx-auto mb-12">
            All plans include free shipping, the ability to change coffee selections, 
            and the flexibility to skip deliveries or cancel anytime.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <div 
                key={plan.id}
                className={`rounded-lg overflow-hidden ${
                  plan.popular ? 'border-2 border-coffee relative' : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="bg-coffee text-cream-light py-1 px-4 text-sm font-medium text-center">
                    Most Popular
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-coffee-dark mb-2">{plan.name}</h3>
                  <p className="text-coffee mb-4">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-coffee-dark">${plan.price}</span>
                    <span className="text-coffee ml-1">/ delivery</span>
                  </div>
                  
                  <ul className="mb-6 space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-coffee flex-shrink-0 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-coffee">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full py-3 rounded-md transition-colors ${
                      selectedPlan === plan.id
                        ? 'bg-coffee text-cream-light'
                        : 'bg-cream hover:bg-coffee-light hover:text-cream-light text-coffee'
                    }`}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Delivery Frequency */}
          <div className="mt-12 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-coffee-dark mb-4">Delivery Frequency</h3>
            <div className="bg-cream-light p-6 rounded-lg">
              <div className="grid grid-cols-3 gap-4">
                {FREQUENCY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFrequency(option.value)}
                    className={`py-2 rounded-md transition-colors ${
                      frequency === option.value
                        ? 'bg-coffee text-cream-light'
                        : 'bg-white hover:bg-coffee-light hover:text-cream-light text-coffee'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <button className="w-full bg-coffee hover:bg-coffee-light text-cream-light py-3 rounded-md mt-8 transition-colors">
              Continue to Coffee Selection
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-coffee-dark text-center mb-12">What Our Subscribers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h3 className="font-semibold text-coffee-dark">Happy Customer #{item}</h3>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-coffee italic">
                  "The subscription service has been a game-changer. I never run out of coffee anymore, 
                  and the quality is consistently excellent. Highly recommend!"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-cream-light">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-coffee-dark text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-coffee-dark mb-2">Can I change my coffee selection?</h3>
              <p className="text-coffee">
                Yes! You can change your coffee selection for each delivery through your account dashboard.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-coffee-dark mb-2">How fresh is the coffee?</h3>
              <p className="text-coffee">
                We roast to order, so your coffee is shipped within 24-48 hours of roasting to ensure maximum freshness.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-coffee-dark mb-2">Can I skip a delivery?</h3>
              <p className="text-coffee">
                Absolutely! You can skip, pause, or cancel your subscription at any time through your account.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-coffee-dark mb-2">Is shipping really free?</h3>
              <p className="text-coffee">
                Yes, all subscription orders include free shipping to addresses within the United States.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
