import { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../../lib/sanity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const query = `*[_type == "event" && _id == $id][0] {
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

    const event = await sanityClient.fetch(query, { id });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

