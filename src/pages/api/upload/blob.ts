import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
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

    // Parse the form data using formidable
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: ({ mimetype }) => {
        return ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(mimetype || '');
      }
    });

    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const productId = Array.isArray(fields.productId) ? fields.productId[0] : fields.productId;
    const isPrimary = Array.isArray(fields.isPrimary) ? fields.isPrimary[0] === 'true' : fields.isPrimary === 'true';

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    // Validate file
    const validation = validateFile({
      size: file.size,
      type: file.mimetype || 'application/octet-stream'
    } as File);
    
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.error
      });
    }

    // Generate filename with product ID prefix if provided
    const filename = productId 
      ? `${productId}-${file.originalFilename || 'image'}`
      : file.originalFilename || 'image';

    // Read file buffer
    const fileBuffer = fs.readFileSync(file.filepath);
    const fileObj = new File([fileBuffer], file.originalFilename || 'image', {
      type: file.mimetype || 'application/octet-stream'
    });

    // Upload to Vercel Blob
    const result = await uploadToBlob(fileObj, filename);

    // Return success response
    res.status(200).json({
      success: true,
      data: {
        url: result.url,
        pathname: result.pathname,
        filename: file.originalFilename || 'image',
        size: file.size,
        type: file.mimetype || 'application/octet-stream',
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

// Configure API for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
