import { useState, useRef } from 'react'

interface ImageUploadProps {
  onUpload: (url: string, pathname: string) => void
  onError: (error: string) => void
  productId?: string
  isPrimary?: boolean
  className?: string
}

export default function ImageUpload({ 
  onUpload, 
  onError, 
  productId, 
  isPrimary = false,
  className = '' 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return

    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (productId) formData.append('productId', productId)
      if (isPrimary) formData.append('isPrimary', 'true')

      const response = await fetch('/api/upload/blob', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        onUpload(data.data.url, data.data.pathname)
      } else {
        throw new Error(data.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      onError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-coffee bg-coffee-light bg-opacity-10'
            : 'border-gray-300 hover:border-coffee'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coffee mb-2"></div>
            <p className="text-coffee">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-gray-600 mb-2">
              {dragActive ? 'Drop image here' : 'Drag and drop an image here'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click to select a file
            </p>
            <button
              type="button"
              onClick={onButtonClick}
              className="bg-coffee text-cream-light px-4 py-2 rounded-md hover:bg-coffee-light transition-colors"
            >
              Choose File
            </button>
            <p className="text-xs text-gray-400 mt-2">
              PNG, JPG, WEBP up to 5MB
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
