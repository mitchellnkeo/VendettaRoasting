import { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../lib/sanity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch the site settings (there should only be one document)
    const query = `*[_type == "siteSettings"][0] {
      title,
      footerAddress {
        street,
        city,
        state,
        zipCode,
        email,
        phone
      },
      socialMedia {
        instagram,
        facebook,
        twitter,
        youtube,
        tiktok
      }
    }`;

    const siteSettings = await sanityClient.fetch(query);

    if (!siteSettings) {
      // Return default content if no site settings exist yet
      return res.status(200).json({
        success: true,
        data: {
          title: 'Vendetta Roasting',
          footerAddress: {
            street: '123 Coffee Street',
            city: 'Seattle',
            state: 'WA',
            zipCode: '98101',
            email: 'info@vendettaroasting.com',
            phone: '(206) 555-1234',
          },
          socialMedia: {
            instagram: 'https://instagram.com',
            facebook: null,
            twitter: null,
            youtube: null,
            tiktok: null,
          },
        },
      });
    }

    res.status(200).json({
      success: true,
      data: siteSettings,
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}

