import { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../../lib/sanity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const query = `*[_type == "faq" && _id == $id][0] {
      _id,
      question,
      answer,
      category,
      sortOrder,
      isActive
    }`;

    const faq = await sanityClient.fetch(query, { id });

    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    res.status(200).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
