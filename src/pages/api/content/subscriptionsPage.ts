import { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient, urlFor } from '../../../lib/sanity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch the subscriptions page content (there should only be one document)
    const query = `*[_type == "subscriptionsPage"][0] {
      heroTitle,
      heroSubtitle,
      howItWorksTitle,
      steps,
      additionalContent
    }`;

    const subscriptionsPage = await sanityClient.fetch(query);

    if (!subscriptionsPage) {
      // Return default content if no subscriptions page content exists yet
      return res.status(200).json({
        success: true,
        data: {
          heroTitle: 'Coffee Subscription Service',
          heroSubtitle: 'Never run out of freshly roasted coffee. Get your favorite beans delivered right to your door on your schedule.',
          howItWorksTitle: 'How It Works',
          steps: [
            {
              stepNumber: 1,
              title: 'Choose Your Plan',
              description: 'Select from our subscription options based on your coffee consumption and preferences.',
            },
            {
              stepNumber: 2,
              title: 'Customize Your Coffee',
              description: 'Pick your favorite beans, roast level, and grind type. Change your selections anytime.',
            },
            {
              stepNumber: 3,
              title: 'Enjoy Fresh Coffee',
              description: 'Receive your coffee on schedule, freshly roasted and delivered to your door.',
            },
          ],
          additionalContent: [],
        },
      });
    }

    // Transform images in additional content
    const transformedData = {
      ...subscriptionsPage,
      additionalContent: subscriptionsPage.additionalContent?.map((section: any) => ({
        ...section,
        image: section.image ? urlFor(section.image).width(800).height(600).url() : null,
      })) || [],
    };

    res.status(200).json({
      success: true,
      data: transformedData,
    });
  } catch (error) {
    console.error('Error fetching subscriptions page content:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}

