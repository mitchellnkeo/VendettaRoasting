import { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient, urlFor } from '../../../lib/sanity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch the wholesale page content (there should only be one document)
    const query = `*[_type == "wholesalePage"][0] {
      heroTitle,
      heroSubtitle,
      whyPartnerTitle,
      benefits,
      additionalContent
    }`;

    const wholesalePage = await sanityClient.fetch(query);

    if (!wholesalePage) {
      // Return default content if no wholesale page content exists yet
      return res.status(200).json({
        success: true,
        data: {
          heroTitle: 'Wholesale Coffee Solutions',
          heroSubtitle: 'Partner with Vendetta Roasting to bring exceptional coffee to your business. We offer competitive pricing, reliable delivery, and dedicated support.',
          whyPartnerTitle: 'Why Partner With Us?',
          benefits: [
            {
              title: 'Quality & Consistency',
              description: 'Our rigorous quality control ensures that every batch of coffee meets our high standards. Your customers will enjoy the same exceptional experience with every cup.',
              icon: 'checkmark',
            },
            {
              title: 'Freshly Roasted',
              description: 'Coffee is roasted to order and delivered within days of roasting, ensuring maximum freshness and flavor.',
              icon: 'clock',
            },
            {
              title: 'Dedicated Support',
              description: 'Our team is here to help you succeed. From product selection to marketing materials, we provide the support you need.',
              icon: 'users',
            },
          ],
          additionalContent: [],
        },
      });
    }

    // Transform images in additional content
    const transformedData = {
      ...wholesalePage,
      additionalContent: wholesalePage.additionalContent?.map((section: any) => ({
        ...section,
        image: section.image ? urlFor(section.image).width(800).height(600).url() : null,
      })) || [],
    };

    res.status(200).json({
      success: true,
      data: transformedData,
    });
  } catch (error) {
    console.error('Error fetching wholesale page content:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}

