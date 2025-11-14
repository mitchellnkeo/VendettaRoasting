import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function AccountSettings() {
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Coffee Street',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'United States'
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  })

  useEffect(() => {
    // TODO: Fetch user data from API
    setTimeout(() => {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        street: user.address.street,
        city: user.address.city,
        state: user.address.state,
        zipCode: user.address.zipCode,
        country: user.address.country
      })
      setLoading(false)
    }, 1000)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      // TODO: Update user data via API
      console.log('Updating user data:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage({ type: 'success', text: 'Account updated successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update account. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <Head>
          <title>Account Settings | Vendetta Roasting</title>
        </Head>
        <div className="bg-cream-light py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-coffee-light rounded w-1/4 mb-6"></div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="space-y-4">
                    <div className="h-4 bg-coffee-light rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-coffee-light rounded w-full mb-4"></div>
                    <div className="h-10 bg-coffee-light rounded w-full mb-4"></div>
                    <div className="h-10 bg-coffee-light rounded w-full"></div>
                  </div>
                </div>
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
        <title>Account Settings | Vendetta Roasting</title>
        <meta name="description" content="Manage your account settings and personal information" />
      </Head>

      <div className="bg-cream-light py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-coffee-dark">Account Settings</h1>
                <Link 
                  href="/account"
                  className="text-coffee hover:text-coffee-light font-medium"
                >
                  ← Back to Dashboard
                </Link>
              </div>
              <p className="text-coffee">
                Update your personal information and account preferences.
              </p>
            </div>

            {/* Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-md ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            {/* Settings Form */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h2 className="text-xl font-semibold text-coffee-dark mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-coffee-dark mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                        required
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-coffee-dark mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                        required
                        disabled={saving}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="email" className="block text-sm font-medium text-coffee-dark mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                      required
                      disabled={saving}
                    />
                  </div>

                  <div className="mt-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-coffee-dark mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                      disabled={saving}
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h2 className="text-xl font-semibold text-coffee-dark mb-4">Address Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="street" className="block text-sm font-medium text-coffee-dark mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                        required
                        disabled={saving}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-coffee-dark mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                          required
                          disabled={saving}
                        />
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-coffee-dark mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                          required
                          disabled={saving}
                        />
                      </div>

                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-coffee-dark mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                          required
                          disabled={saving}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-coffee-dark mb-2">
                        Country *
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                        required
                        disabled={saving}
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Password Section */}
                <div>
                  <h2 className="text-xl font-semibold text-coffee-dark mb-4">Password</h2>
                  <div className="bg-cream p-4 rounded-lg">
                    <p className="text-coffee mb-4">
                      To change your password, you'll need to verify your current password.
                    </p>
                    <Link 
                      href="/account/change-password"
                      className="bg-coffee text-cream-light px-4 py-2 rounded-md hover:bg-coffee-light transition-colors"
                    >
                      Change Password
                    </Link>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Link 
                    href="/account/dashboard"
                    className={`px-6 py-3 border border-coffee-light text-coffee rounded-md hover:bg-cream transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-coffee text-cream-light rounded-md hover:bg-coffee-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
