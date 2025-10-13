import Head from 'next/head'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Vendetta Roasting</title>
        <meta name="description" content="Premium coffee roasting company" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-coffee-dark flex items-center">
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="container mx-auto px-4 z-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-cream-light mb-6">
            Vendetta Roasting
          </h1>
          <p className="text-xl md:text-2xl text-cream mb-8 max-w-2xl mx-auto">
            Crafting exceptional coffee with passion and precision
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/shop" className="bg-coffee hover:bg-coffee-light text-cream-light px-8 py-3 rounded-md text-lg font-medium transition-colors">
              Shop Coffee
            </Link>
            <Link href="/subscriptions" className="bg-transparent hover:bg-cream-light hover:text-coffee border-2 border-cream-light text-cream-light hover:border-cream-light px-8 py-3 rounded-md text-lg font-medium transition-colors">
              Subscribe
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-cream-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-coffee-dark text-center mb-12">Featured Coffees</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-coffee-dark mb-2">Signature Blend #{item}</h3>
                  <p className="text-coffee mb-4">A rich and balanced coffee with notes of chocolate, caramel, and a hint of citrus.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-coffee-dark">$18.99</span>
                    <button className="bg-coffee hover:bg-coffee-light text-cream-light px-4 py-2 rounded-md transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-coffee text-cream-light">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="bg-gray-300 h-96 w-full rounded-lg"></div>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="mb-6">
                Vendetta Roasting was born from a passion for exceptional coffee and a commitment to ethical sourcing. 
                Our journey began in a small garage in Seattle, where we experimented with different roasting techniques 
                to bring out the unique characteristics of each bean.
              </p>
              <p className="mb-6">
                Today, we work directly with farmers around the world to source the finest beans, 
                paying fair prices and supporting sustainable farming practices.
              </p>
              <Link href="/about" className="inline-block border-2 border-cream-light hover:bg-cream-light hover:text-coffee px-6 py-3 rounded-md transition-colors">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Highlight */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-coffee-dark mb-6">Never Run Out of Great Coffee</h2>
          <p className="text-xl text-coffee mb-8 max-w-2xl mx-auto">
            Subscribe to regular deliveries and save 15%. Choose your frequency, beans, and grind.
          </p>
          <Link href="/subscriptions" className="bg-coffee hover:bg-coffee-light text-cream-light px-8 py-3 rounded-md text-lg font-medium transition-colors">
            Start a Subscription
          </Link>
        </div>
      </section>
    </>
  )
}
