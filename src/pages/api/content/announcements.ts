import { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../lib/sanity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const query = `*[_type == "announcement" && isActive == true && (!defined(expiresAt) || expiresAt > now())] | order(publishedAt desc) {
      _id,
      title,
      content,
      slug,
      isActive,
      isFeatured,
      publishedAt,
      expiresAt
    }`;

    const announcements = await sanityClient.fetch(query);

    res.status(200).json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}

