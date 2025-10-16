import { put } from '@vercel/blob';

// Blob configuration
export const blobConfig = {
  // Maximum file size (5MB)
  maxFileSize: 5 * 1024 * 1024,
  // Allowed image types
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  // Blob store path prefix
  pathPrefix: 'products'
};

// Upload file to Vercel Blob
export async function uploadToBlob(file: File, filename?: string): Promise<{ url: string; pathname: string }> {
  try {
    // Validate file size
    if (file.size > blobConfig.maxFileSize) {
      throw new Error(`File too large. Maximum size is ${blobConfig.maxFileSize / (1024 * 1024)}MB`);
    }

    // Validate file type
    if (!blobConfig.allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${blobConfig.allowedTypes.join(', ')}`);
    }

    // Generate filename if not provided
    const finalFilename = filename || `${Date.now()}-${file.name}`;
    const pathname = `${blobConfig.pathPrefix}/${finalFilename}`;

    // Upload to Vercel Blob
    const blob = await put(pathname, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return {
      url: blob.url,
      pathname: blob.pathname
    };
  } catch (error) {
    console.error('Error uploading to blob:', error);
    throw error;
  }
}

// Validate file before upload
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > blobConfig.maxFileSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${blobConfig.maxFileSize / (1024 * 1024)}MB`
    };
  }

  // Check file type
  if (!blobConfig.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${blobConfig.allowedTypes.join(', ')}`
    };
  }

  return { valid: true };
}

// Generate optimized filename
export function generateFilename(originalName: string, prefix?: string): string {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop();
  const baseName = originalName.replace(/\.[^/.]+$/, '');
  const sanitizedName = baseName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  const finalPrefix = prefix ? `${prefix}-` : '';
  return `${finalPrefix}${sanitizedName}-${timestamp}.${extension}`;
}
