import Link from 'next/link';
import SEO from '../components/SEO';
import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <SEO
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist."
        noindex={true}
      />
      <div className="bg-cream-light min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-2xl shadow-soft p-12 md:p-16">
            {/* 404 Number */}
            <h1 className="text-8xl md:text-9xl font-bold text-coffee-light mb-6">404</h1>
            
            {/* Error Message */}
            <h2 className="text-3xl md:text-4xl font-bold text-coffee-dark mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-coffee mb-8 max-w-md mx-auto">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or the URL might be incorrect.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/"
                className="inline-block bg-coffee hover:bg-coffee-light text-cream-light px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-soft hover:shadow-warm"
              >
                Go to Homepage
              </Link>
              <Link
                href="/shop"
                className="inline-block border-2 border-coffee text-coffee hover:bg-coffee hover:text-cream-light px-8 py-4 rounded-full font-semibold transition-all duration-300"
              >
                Browse Shop
              </Link>
            </div>

            {/* Helpful Links */}
            <div className="mt-12 pt-8 border-t border-cream">
              <p className="text-coffee mb-4">You might be looking for:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/shop" className="text-coffee-light hover:text-coffee-dark underline">
                  Shop
                </Link>
                <Link href="/about" className="text-coffee-light hover:text-coffee-dark underline">
                  About
                </Link>
                <Link href="/contact" className="text-coffee-light hover:text-coffee-dark underline">
                  Contact
                </Link>
                <Link href="/subscriptions" className="text-coffee-light hover:text-coffee-dark underline">
                  Subscriptions
                </Link>
                <Link href="/wholesale" className="text-coffee-light hover:text-coffee-dark underline">
                  Wholesale
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

