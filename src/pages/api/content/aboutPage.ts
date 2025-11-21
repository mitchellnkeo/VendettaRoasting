import { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient, urlFor } from '../../../lib/sanity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch the about page content (there should only be one document)
    const query = `*[_type == "aboutPage"][0] {
      heroTitle,
      heroSubtitle,
      heroImage,
      howWeStartedTitle,
      howWeStartedContent,
      howWeStartedImage,
      missionTitle,
      missionContent,
      values,
      visitUsTitle,
      visitUsAddress,
      visitUsHours,
      visitUsContact
    }`;

    const aboutPage = await sanityClient.fetch(query);

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

    if (!aboutPage) {
      // Return default content if no about page content exists yet
      const defaultAddress = siteSettings?.footerAddress
        ? `${siteSettings.footerAddress.street}, ${siteSettings.footerAddress.city}, ${siteSettings.footerAddress.state} ${siteSettings.footerAddress.zipCode}`
        : '123 Coffee Street, Seattle, WA 98101';
      
      const defaultContact = siteSettings?.footerAddress
        ? `Email: ${siteSettings.footerAddress.email}\nPhone: ${siteSettings.footerAddress.phone}`
        : 'Email: info@vendettaroasting.com\nPhone: (206) 555-1234';

      return res.status(200).json({
        success: true,
        data: {
          heroTitle: 'Our Story',
          heroSubtitle: 'Crafting exceptional coffee with passion, precision, and a commitment to ethical sourcing',
          heroImage: null,
          howWeStartedTitle: 'How We Started',
          howWeStartedContent: [
            {
              paragraph: 'Vendetta Roasting was born from a passion for exceptional coffee and a commitment to ethical sourcing. Our journey began in a small garage in Seattle, where we experimented with different roasting techniques to bring out the unique characteristics of each bean.',
            },
            {
              paragraph: 'What started as a weekend hobby quickly grew into a mission to share the world\'s finest coffees with our community. We discovered that great coffee isn\'t just about the beans—it\'s about the relationships we build with farmers, the care we take in roasting, and the joy we bring to every cup.',
            },
          ],
          howWeStartedImage: null,
          missionTitle: 'Our Mission',
          missionContent: [
            {
              paragraph: 'Today, we work directly with farmers around the world to source the finest beans, paying fair prices and supporting sustainable farming practices. We believe that great coffee should be accessible to everyone, which is why we\'re committed to transparency in our sourcing and fair pricing in our business.',
            },
            {
              paragraph: 'Every batch we roast is carefully crafted to highlight the unique flavors and characteristics of each origin. We\'re not just selling coffee—we\'re sharing stories, building community, and celebrating the art of roasting.',
            },
          ],
          values: [
            {
              title: 'Quality First',
              description: 'We source only the finest beans and roast them with precision to bring out their best flavors.',
              icon: null,
            },
            {
              title: 'Ethical Sourcing',
              description: 'We work directly with farmers, ensuring fair prices and supporting sustainable practices.',
              icon: null,
            },
            {
              title: 'Community Focus',
              description: 'We\'re committed to building a coffee community that celebrates great coffee and great people.',
              icon: null,
            },
          ],
          visitUsTitle: 'Visit Us',
          visitUsAddress: defaultAddress,
          visitUsHours: 'Monday - Friday: 7:00 AM - 6:00 PM\nSaturday - Sunday: 8:00 AM - 5:00 PM',
          visitUsContact: defaultContact,
        },
      });
    }

    // Transform images
    const transformedData = {
      ...aboutPage,
      heroImage: aboutPage.heroImage ? urlFor(aboutPage.heroImage).width(1200).height(600).url() : null,
      howWeStartedImage: aboutPage.howWeStartedImage ? urlFor(aboutPage.howWeStartedImage).width(800).height(600).url() : null,
      values: aboutPage.values?.map((value: any) => ({
        ...value,
        icon: value.icon ? urlFor(value.icon).width(200).height(200).url() : null,
      })) || [],
    };

    // Use site settings for address/contact if not provided in about page
    if (!transformedData.visitUsAddress && siteSettings?.footerAddress) {
      transformedData.visitUsAddress = `${siteSettings.footerAddress.street}, ${siteSettings.footerAddress.city}, ${siteSettings.footerAddress.state} ${siteSettings.footerAddress.zipCode}`;
    }
    if (!transformedData.visitUsContact && siteSettings?.footerAddress) {
      transformedData.visitUsContact = `Email: ${siteSettings.footerAddress.email}\nPhone: ${siteSettings.footerAddress.phone}`;
    }

    res.status(200).json({
      success: true,
      data: transformedData,
    });
  } catch (error) {
    console.error('Error fetching about page content:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}

