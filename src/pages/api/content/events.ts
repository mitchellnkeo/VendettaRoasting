import { NextApiRequest, NextApiResponse } from 'next';
import { getEvents, getUpcomingEvents } from '../../../lib/sanity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { upcoming } = req.query;
    
    let events;
    if (upcoming === 'true') {
      events = await getUpcomingEvents();
    } else {
      events = await getEvents();
    }

    res.status(200).json({
      success: true,
      data: events
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}
