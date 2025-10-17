import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '@/components/layout/Layout'
import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/lib/auth/AuthContext'
import { CartProvider } from '@/lib/cart/CartContext'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter()
  const isAdminRoute = router.pathname.startsWith('/admin')
  
  // Use layout for non-admin routes only
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
  )
  
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <CartProvider>
          <PageContent />
        </CartProvider>
      </AuthProvider>
    </SessionProvider>
  )
}
