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

interface SavedAddressesProps {
  onAddressSelect: (address: Address) => void
  className?: string
}

const SavedAddresses = ({ onAddressSelect, className = '' }: SavedAddressesProps) => {
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

  // Mock saved addresses - in a real app, these would come from user's account
  useEffect(() => {
    const mockAddresses: Address[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main Street',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'US',
        phone: '(555) 123-4567',
        isDefault: true
      },
      {
        id: '2',
        firstName: 'John',
        lastName: 'Doe',
        address: '456 Oak Avenue',
        city: 'Portland',
        state: 'OR',
        zipCode: '97201',
        country: 'US',
        phone: '(555) 987-6543',
        isDefault: false
      }
    ]
    setSavedAddresses(mockAddresses)
  }, [])

  const handleAddressSelect = (address: Address) => {
    setSelectedAddressId(address.id)
    onAddressSelect(address)
  }

  const formatAddress = (address: Address) => {
    return `${address.address}, ${address.city}, ${address.state} ${address.zipCode}`
  }

  if (savedAddresses.length === 0) {
    return null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-coffee-dark">Saved Addresses</h3>
      
      <div className="space-y-3">
        {savedAddresses.map((address) => (
          <div
            key={address.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedAddressId === address.id
                ? 'border-coffee bg-cream'
                : 'border-gray-200 hover:border-coffee-light'
            }`}
            onClick={() => handleAddressSelect(address)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-grow">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-coffee-dark">
                    {address.firstName} {address.lastName}
                  </h4>
                  {address.isDefault && (
                    <span className="px-2 py-1 text-xs bg-coffee text-cream-light rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-coffee text-sm">{formatAddress(address)}</p>
                {address.phone && (
                  <p className="text-coffee text-sm">{address.phone}</p>
                )}
              </div>
              <div className="flex-shrink-0 ml-4">
                <input
                  type="radio"
                  name="savedAddress"
                  checked={selectedAddressId === address.id}
                  onChange={() => handleAddressSelect(address)}
                  className="text-coffee focus:ring-coffee"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedAddressId && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800 text-sm">Address selected for shipping</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default SavedAddresses
