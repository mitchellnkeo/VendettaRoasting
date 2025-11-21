import { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient, urlFor } from '../../../lib/sanity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch the homepage content (there should only be one document)
    const query = `*[_type == "homepage"][0] {
      title,
      heroSubtitle,
      heroImage,
      heroCtaPrimary,
      heroCtaSecondary,
      aboutTitle,
      aboutContent,
      aboutCtaText,
      subscriptionTitle,
      subscriptionDescription,
      subscriptionCtaText
    }`;

    const homepage = await sanityClient.fetch(query);

    if (!homepage) {
      // Return default content if no homepage content exists yet
      return res.status(200).json({
        success: true,
        data: {
          title: 'Vendetta Roasting',
          heroSubtitle: 'Crafting exceptional coffee with passion and precision',
          heroImage: null,
          heroCtaPrimary: 'Shop Coffee',
          heroCtaSecondary: 'Subscribe',
          aboutTitle: 'Our Story',
          aboutContent: [
            {
              paragraph:
                'Vendetta Roasting was born from a passion for exceptional coffee and a commitment to ethical sourcing. Our journey began in a small garage in Seattle, where we experimented with different roasting techniques to bring out the unique characteristics of each bean.',
            },
            {
              paragraph:
                'Today, we work directly with farmers around the world to source the finest beans, paying fair prices and supporting sustainable farming practices.',
            },
          ],
          aboutCtaText: 'Learn More',
          subscriptionTitle: 'Never Run Out of Great Coffee',
          subscriptionDescription:
            'Subscribe to regular deliveries and save 15%. Choose your frequency, beans, and grind.',
          subscriptionCtaText: 'Start a Subscription',
        },
      });
    }

    // Transform hero image if it exists
    const transformedData = {
      ...homepage,
      heroImage: homepage.heroImage ? urlFor(homepage.heroImage).width(1920).height(1080).url() : null,
    };

    res.status(200).json({
      success: true,
      data: transformedData,
    });
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}

