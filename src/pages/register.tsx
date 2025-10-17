import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import RegistrationForm from '../components/RegistrationForm'

export default function Register() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSuccess = () => {
    setSuccess(true)
    setError(null)
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setSuccess(false)
  }

  if (success) {
    return (
      <>
        <Head>
          <title>Registration Successful | Vendetta Roasting</title>
        </Head>
        
        <div className="bg-cream-light py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="text-green-600 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-green-800 mb-2">Registration Successful!</h1>
                <p className="text-green-700 mb-6">
                  Your account has been created successfully. You can now log in to your account.
                </p>
                <Link 
                  href="/login"
                  className="bg-coffee text-cream-light px-6 py-3 rounded-md hover:bg-coffee-light transition-colors"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Create Account | Vendetta Roasting</title>
        <meta name="description" content="Create your Vendetta Roasting account" />
      </Head>

      <div className="bg-cream-light py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-coffee-dark mb-2">Create Account</h1>
              <p className="text-coffee">
                Join our coffee community and start your journey with exceptional coffee.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <RegistrationForm 
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </div>

            <div className="text-center mt-6">
              <p className="text-coffee">
                Already have an account?{' '}
                <Link href="/login" className="text-coffee hover:text-coffee-light font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
