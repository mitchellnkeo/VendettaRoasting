import { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../../lib/sanity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const query = `*[_type == "announcement" && _id == $id][0] {
      _id,
      title,
      content,
      slug,
      isActive,
      isFeatured,
      publishedAt,
      expiresAt
    }`;

    const announcement = await sanityClient.fetch(query, { id });

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    res.status(200).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
