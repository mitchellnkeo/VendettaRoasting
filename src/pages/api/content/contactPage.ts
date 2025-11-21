import { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient, urlFor } from '../../../lib/sanity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch the contact page content (there should only be one document)
    const query = `*[_type == "contactPage"][0] {
      heroTitle,
      heroSubtitle,
      getInTouchTitle,
      locationTitle,
      locationAddress,
      hoursTitle,
      hours,
      contactTitle,
      contactInfo,
      mapImage,
      mapEmbedUrl,
      formTitle,
      formSuccessMessage
    }`;

    const contactPage = await sanityClient.fetch(query);

    // Also fetch site settings for fallback address/contact info
    const siteSettingsQuery = `*[_type == "siteSettings"][0] {
      footerAddress {
        street,
        city,
        state,
        zipCode,
        email,
        phone
      }
    }`;
    const siteSettings = await sanityClient.fetch(siteSettingsQuery);

    if (!contactPage) {
      // Return default content if no contact page content exists yet
      const defaultAddress = siteSettings?.footerAddress
        ? `${siteSettings.footerAddress.street}\n${siteSettings.footerAddress.city}, ${siteSettings.footerAddress.state} ${siteSettings.footerAddress.zipCode}`
        : '123 Coffee Street\nSeattle, WA 98101';
      
      const defaultContact = siteSettings?.footerAddress
        ? `Email: ${siteSettings.footerAddress.email}\nPhone: ${siteSettings.footerAddress.phone}`
        : 'Email: info@vendettaroasting.com\nPhone: (206) 555-1234';

      return res.status(200).json({
        success: true,
        data: {
          heroTitle: 'Contact Us',
          heroSubtitle: 'Have a question? Want to learn more about our coffee? We\'d love to hear from you!',
          getInTouchTitle: 'Get in Touch',
          locationTitle: 'Location',
          locationAddress: defaultAddress,
          hoursTitle: 'Hours',
          hours: 'Monday - Friday: 7:00 AM - 6:00 PM\nSaturday - Sunday: 8:00 AM - 5:00 PM',
          contactTitle: 'Contact',
          contactInfo: defaultContact,
          mapImage: null,
          mapEmbedUrl: null,
          formTitle: 'Send us a Message',
          formSuccessMessage: "Thank you for your message! We'll get back to you soon.",
        },
      });
    }

    // Transform images
    const transformedData = {
      ...contactPage,
      mapImage: contactPage.mapImage ? urlFor(contactPage.mapImage).width(800).height(400).url() : null,
    };

    // Use site settings for address/contact if not provided in contact page
    if (!transformedData.locationAddress && siteSettings?.footerAddress) {
      transformedData.locationAddress = `${siteSettings.footerAddress.street}\n${siteSettings.footerAddress.city}, ${siteSettings.footerAddress.state} ${siteSettings.footerAddress.zipCode}`;
    }
    if (!transformedData.contactInfo && siteSettings?.footerAddress) {
      transformedData.contactInfo = `Email: ${siteSettings.footerAddress.email}\nPhone: ${siteSettings.footerAddress.phone}`;
    }

    res.status(200).json({
      success: true,
      data: transformedData,
    });
  } catch (error) {
    console.error('Error fetching contact page content:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}

