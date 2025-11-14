import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/auth/AuthContext';

export default function Account() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If authenticated, redirect to dashboard for better UX
    // But we'll keep this page as a fallback/landing
    if (!isLoading && isAuthenticated) {
      // Optionally redirect, or keep as landing page
      // router.push('/account/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <ProtectedRoute>
      <Head>
        <title>My Account | Vendetta Roasting</title>
        <meta name="description" content="Manage your Vendetta Roasting account" />
      </Head>

      <div className="bg-cream-light min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-coffee-dark mb-2">
                {isAuthenticated && user?.firstName ? `Welcome, ${user.firstName}!` : 'My Account'}
              </h1>
              <p className="text-coffee">
                Manage your account, orders, subscriptions, and preferences
              </p>
            </div>

            {/* Account Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Dashboard */}
              <Link 
                href="/account/dashboard"
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start mb-4">
                  <div className="bg-coffee-light p-3 rounded-lg mr-4 group-hover:bg-coffee transition-colors">
                    <svg className="w-6 h-6 text-cream-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-coffee-dark mb-2 group-hover:text-coffee transition-colors">
                      Dashboard
                    </h3>
                    <p className="text-coffee text-sm">
                      View your account overview, recent orders, and subscription status
                    </p>
                  </div>
                </div>
                <div className="text-coffee group-hover:text-coffee-light font-medium text-sm">
                  Go to Dashboard →
                </div>
              </Link>

              {/* Orders */}
              <Link 
                href="/account/orders"
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start mb-4">
                  <div className="bg-coffee-light p-3 rounded-lg mr-4 group-hover:bg-coffee transition-colors">
                    <svg className="w-6 h-6 text-cream-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-coffee-dark mb-2 group-hover:text-coffee transition-colors">
                      Order History
                    </h3>
                    <p className="text-coffee text-sm">
                      View and track all your past orders and deliveries
                    </p>
                  </div>
                </div>
                <div className="text-coffee group-hover:text-coffee-light font-medium text-sm">
                  View Orders →
                </div>
              </Link>

              {/* Settings */}
              <Link 
                href="/account/settings"
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start mb-4">
                  <div className="bg-coffee-light p-3 rounded-lg mr-4 group-hover:bg-coffee transition-colors">
                    <svg className="w-6 h-6 text-cream-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-coffee-dark mb-2 group-hover:text-coffee transition-colors">
                      Account Settings
                    </h3>
                    <p className="text-coffee text-sm">
                      Update your profile, password, and preferences
                    </p>
                  </div>
                </div>
                <div className="text-coffee group-hover:text-coffee-light font-medium text-sm">
                  Manage Settings →
                </div>
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-coffee-dark mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link 
                  href="/shop"
                  className="flex flex-col items-center p-4 border border-coffee-light rounded-lg hover:bg-cream transition-colors text-center"
                >
                  <svg className="w-8 h-8 text-coffee mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="font-medium text-coffee-dark">Shop Coffee</span>
                </Link>

                <Link 
                  href="/subscriptions"
                  className="flex flex-col items-center p-4 border border-coffee-light rounded-lg hover:bg-cream transition-colors text-center"
                >
                  <svg className="w-8 h-8 text-coffee mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="font-medium text-coffee-dark">Subscriptions</span>
                </Link>

                <Link 
                  href="/cart"
                  className="flex flex-col items-center p-4 border border-coffee-light rounded-lg hover:bg-cream transition-colors text-center"
                >
                  <svg className="w-8 h-8 text-coffee mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-medium text-coffee-dark">Shopping Cart</span>
                </Link>

                <Link 
                  href="/faq"
                  className="flex flex-col items-center p-4 border border-coffee-light rounded-lg hover:bg-cream transition-colors text-center"
                >
                  <svg className="w-8 h-8 text-coffee mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-coffee-dark">Help & FAQ</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

