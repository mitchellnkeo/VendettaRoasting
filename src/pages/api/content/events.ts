import { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../lib/sanity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const query = `*[_type == "event" && isActive == true && eventDate >= now()] | order(eventDate asc) {
      _id,
      title,
      description,
      slug,
      eventDate,
      location,
      address,
      price,
      maxAttendees,
      isActive
    }`;

    const events = await sanityClient.fetch(query);

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}

