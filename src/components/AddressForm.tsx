import React, { useState, useEffect } from 'react'

interface Address {
  id: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  isDefault: boolean
}

interface AddressFormProps {
  onAddressChange: (address: Partial<Address>) => void
  initialAddress?: Partial<Address>
  className?: string
}

const AddressForm = ({ onAddressChange, initialAddress = {}, className = '' }: AddressFormProps) => {
  const [formData, setFormData] = useState<Partial<Address>>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
    ...initialAddress
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    onAddressChange(formData)
  }, [formData, onAddressChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim().length < 2 ? 'Must be at least 2 characters' : ''
      case 'address':
        return value.trim().length < 5 ? 'Must be at least 5 characters' : ''
      case 'city':
        return value.trim().length < 2 ? 'Must be at least 2 characters' : ''
      case 'state':
        return value.trim().length < 2 ? 'Must be at least 2 characters' : ''
      case 'zipCode':
        return !/^\d{5}(-\d{4})?$/.test(value) ? 'Invalid ZIP code format' : ''
      case 'phone':
        return value && !/^\(\d{3}\) \d{3}-\d{4}$/.test(value) ? 'Invalid phone format' : ''
      default:
        return ''
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length >= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
    } else if (numbers.length >= 3) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
    }
    return numbers
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const formatted = formatPhoneNumber(value)
    setFormData(prev => ({
      ...prev,
      phone: formatted
    }))
  }

  const isFormValid = () => {
    const requiredFields: (keyof Address)[] = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode']
    return requiredFields.every(field => {
      const value = formData[field]
      return typeof value === 'string' && value.trim().length > 0
    })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-coffee-dark mb-1">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            value={formData.firstName || ''}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-coffee-dark mb-1">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            value={formData.lastName || ''}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Address Field */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-coffee-dark mb-1">
          Street Address *
        </label>
        <input
          type="text"
          id="address"
          name="address"
          required
          value={formData.address || ''}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="123 Main Street"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
        )}
      </div>

      {/* City, State, ZIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-coffee-dark mb-1">
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            required
            value={formData.city || ''}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-coffee-dark mb-1">
            State *
          </label>
          <input
            type="text"
            id="state"
            name="state"
            required
            value={formData.state || ''}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee ${
              errors.state ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state}</p>
          )}
        </div>
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-coffee-dark mb-1">
            ZIP Code *
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            required
            value={formData.zipCode || ''}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="12345"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee ${
              errors.zipCode ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.zipCode && (
            <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
          )}
        </div>
      </div>

      {/* Country and Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-coffee-dark mb-1">
            Country
          </label>
          <select
            id="country"
            name="country"
            value={formData.country || 'US'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="MX">Mexico</option>
          </select>
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-coffee-dark mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handlePhoneChange}
            onBlur={handleBlur}
            placeholder="(555) 123-4567"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Form Validation Status */}
      <div className="flex items-center space-x-2 text-sm">
        {isFormValid() ? (
          <div className="flex items-center text-green-600">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Address information complete
          </div>
        ) : (
          <div className="flex items-center text-coffee">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Please complete all required fields
          </div>
        )}
      </div>
    </div>
  )
}

export default AddressForm
