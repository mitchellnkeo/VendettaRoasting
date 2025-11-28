import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '@/components/layout/Layout'
import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/lib/auth/AuthContext'
import { CartProvider } from '@/lib/cart/CartContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { initGA, trackPageView } from '@/lib/analytics'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  // Initialize Google Analytics
  useEffect(() => {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (measurementId) {
      initGA(measurementId);
    }
  }, []);

  // Track page views on route change
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
        trackPageView(url);
      }
      
      // Track performance with Sentry (if available)
      if (typeof window !== 'undefined' && window.performance && process.env.NEXT_PUBLIC_SENTRY_DSN) {
        try {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigation && typeof window !== 'undefined' && (window as any).Sentry) {
            (window as any).Sentry.addBreadcrumb({
              category: 'navigation',
              message: `Page loaded: ${url}`,
              level: 'info',
              data: {
                url,
                loadTime: navigation.loadEventEnd - navigation.fetchStart,
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
              },
            });
          }
        } catch (error) {
          // Silently fail if Sentry isn't available
        }
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  
  // Don't use Layout for admin routes
  const PageContent = () => (
    <>
      {isAdminRoute ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </>
  );
  
  return (
    <ErrorBoundary>
      <SessionProvider session={session}>
        <AuthProvider>
          <CartProvider>
            <PageContent />
          </CartProvider>
        </AuthProvider>
      </SessionProvider>
    </ErrorBoundary>
  )
}
