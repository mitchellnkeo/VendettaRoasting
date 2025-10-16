import Image from 'next/image'
import { ProductImage as ProductImageType } from '../types/product'

interface ProductImageProps {
  productId: string
  images?: ProductImageType[]
  alt?: string
  className?: string
  priority?: boolean
}

export default function ProductImage({ 
  productId, 
  images = [], 
  alt = 'Product image',
  className = '',
  priority = false 
}: ProductImageProps) {
  // Find the primary image or use the first image
  const primaryImage = images.find(img => img.is_primary) || images[0]
  
  // If no images, use a placeholder
  if (!primaryImage) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <p className="text-sm">No image available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={primaryImage.image_url}
        alt={primaryImage.alt_text || alt}
        fill
        className="object-cover"
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
