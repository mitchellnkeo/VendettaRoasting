import { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient, urlFor } from '../../../lib/sanity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { slug } = req.query;

    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Product slug is required'
      });
    }

    // Fetch product from Sanity by slug
    const query = `*[_type == "product" && slug.current == $slug][0] {
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
      metaDescription,
      _createdAt,
      _updatedAt
    }`;

    const product = await sanityClient.fetch(query, { slug });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Transform Sanity product to match Product interface
    const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
    const imageUrl = primaryImage 
      ? urlFor(primaryImage).width(800).height(800).url() 
      : '/images/placeholder-coffee.jpg';

    const transformedProduct = {
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
      created_at: product._createdAt,
      updated_at: product._updatedAt,
      // Include full image array
      images: product.images?.map((img: any) => ({
        id: img._key,
        image_url: urlFor(img).width(1200).height(1200).url(),
        alt_text: img.alt || product.name,
        is_primary: img.isPrimary || false,
      })) || [],
    };

    res.status(200).json({
      success: true,
      data: transformedProduct
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  }
}
