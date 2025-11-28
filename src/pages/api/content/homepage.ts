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
      subscriptionCtaText,
      featuredProductsTitle,
      featuredProductsDescription,
      featuredProducts[]->{
        _id,
        name,
        slug,
        description,
        shortDescription,
        price,
        wholesalePrice,
        sku,
        category->{
          _id,
          name,
          slug
        },
        weightGrams,
        origin,
        roastLevel,
        flavorNotes,
        images,
        isActive,
        isFeatured,
        inventoryQuantity,
        metaTitle,
        metaDescription
      }
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
    // Transform featured products if they exist
    const transformedFeaturedProducts = homepage.featuredProducts
      ? homepage.featuredProducts
          .filter((product: any) => product && product.isActive !== false) // Only include active products
          .map((product: any) => {
            // Get primary image or first image
            const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
            const imageUrl = primaryImage
              ? urlFor(primaryImage).width(800).height(800).url()
              : '/images/placeholder-coffee.jpg';

            return {
              id: product._id,
              name: product.name,
              slug: product.slug?.current || '',
              description: product.description || '',
              short_description: product.shortDescription || '',
              price: product.price || 0,
              wholesale_price: product.wholesalePrice || undefined,
              sku: product.sku || '',
              category_id: product.category?._id || '',
              category_name: product.category?.name || '',
              weight_grams: product.weightGrams || undefined,
              origin: product.origin || undefined,
              roast_level: product.roastLevel || undefined,
              flavor_notes: product.flavorNotes || undefined,
              image_url: imageUrl,
              is_active: product.isActive !== false,
              is_featured: product.isFeatured || false,
              inventory_quantity: product.inventoryQuantity || 0,
              meta_title: product.metaTitle || undefined,
              meta_description: product.metaDescription || undefined,
            };
          })
      : [];

    const transformedData = {
      ...homepage,
      heroImage: homepage.heroImage ? urlFor(homepage.heroImage).width(1920).height(1080).url() : null,
      featuredProducts: transformedFeaturedProducts,
    };

    // Set cache headers for better performance
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

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

