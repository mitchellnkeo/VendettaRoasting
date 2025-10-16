import { NextApiRequest, NextApiResponse } from 'next';
import { uploadToBlob, validateFile } from '../../../lib/blob';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if BLOB_READ_WRITE_TOKEN is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(500).json({
        success: false,
        message: 'Blob storage not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.'
      });
    }

    // Get the file from the request
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const productId = formData.get('productId') as string;
    const isPrimary = formData.get('isPrimary') === 'true';

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.error
      });
    }

    // Generate filename with product ID prefix if provided
    const filename = productId 
      ? `${productId}-${file.name}`
      : file.name;

    // Upload to Vercel Blob
    const result = await uploadToBlob(file, filename);

    // Return success response
    res.status(200).json({
      success: true,
      data: {
        url: result.url,
        pathname: result.pathname,
        filename: file.name,
        size: file.size,
        type: file.type,
        productId: productId || null,
        isPrimary: isPrimary || false
      }
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
