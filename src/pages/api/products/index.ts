import { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient, urlFor } from '../../../lib/sanity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      category,
      search,
      min_price,
      max_price,
      is_featured,
      sort_by,
      sort_order,
      limit,
      offset
    } = req.query;

    // Build GROQ query with all fields we need
    let groqQuery = `*[_type == "product" && isActive == true`;
    
    // Apply filters
    if (category && typeof category === 'string') {
      groqQuery += ` && category->slug.current == "${category}"`;
    }

    if (search && typeof search === 'string') {
      groqQuery += ` && (name match "*${search}*" || description match "*${search}*" || sku match "*${search}*")`;
    }

    if (min_price) {
      groqQuery += ` && price >= ${parseFloat(min_price as string)}`;
    }

    if (max_price) {
      groqQuery += ` && price <= ${parseFloat(max_price as string)}`;
    }

    if (is_featured === 'true') {
      groqQuery += ` && isFeatured == true`;
    }

    groqQuery += `] {
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
      images[]{
        _key,
        _type,
        alt,
        isPrimary,
        asset->{
          _id,
          _type,
          url,
          metadata {
            dimensions
          }
        }
      },
      isActive,
      isFeatured,
      inventoryQuantity,
      metaTitle,
      metaDescription,
      _createdAt,
      _updatedAt
    }`;

    // Apply sorting
    const sortBy = (sort_by && typeof sort_by === 'string') ? sort_by : '_createdAt';
    const sortOrder = (sort_order && typeof sort_order === 'string') ? sort_order : 'desc';
    
    if (sortBy === 'name') {
      groqQuery += ` | order(name ${sortOrder})`;
    } else if (sortBy === 'price') {
      groqQuery += ` | order(price ${sortOrder})`;
    } else {
      groqQuery += ` | order(_createdAt ${sortOrder})`;
    }

    // Apply limit and offset
    const limitNum = limit ? parseInt(limit as string) : 100;
    const offsetNum = offset ? parseInt(offset as string) : 0;
    groqQuery += ` [${offsetNum}...${offsetNum + limitNum}]`;

    // Fetch products with category reference resolved
    const products = await sanityClient.fetch(groqQuery);

    // Transform Sanity results to match Product interface
    const transformedProducts = products.map((product: any) => {
      // Get primary image or first image
      const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
      let imageUrl = '/images/placeholder-coffee.jpg';
      
      if (primaryImage) {
        try {
          const urlBuilder = urlFor(primaryImage);
          imageUrl = urlBuilder.width(800).height(800).url();
          
          if (process.env.NODE_ENV === 'development') {
            console.log('Generated image URL for product:', product.name, imageUrl);
          }
          
          // Validate URL
          if (!imageUrl || imageUrl === '' || imageUrl.includes('undefined')) {
            console.error('Invalid image URL generated:', imageUrl);
            imageUrl = '/images/placeholder-coffee.jpg';
          }
        } catch (error) {
          console.error('Error generating image URL:', error);
          if (process.env.NODE_ENV === 'development') {
            console.error('Primary image object:', primaryImage);
          }
          imageUrl = '/images/placeholder-coffee.jpg';
        }
      }

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
        created_at: product._createdAt,
        updated_at: product._updatedAt,
        // Include full image array for product detail pages
        images: product.images?.map((img: any) => {
          let imageUrl = '/images/placeholder-coffee.jpg';
          if (img) {
            try {
              const urlBuilder = urlFor(img);
              imageUrl = urlBuilder.width(1200).height(1200).url();
              
              // Validate URL
              if (!imageUrl || imageUrl === '' || imageUrl.includes('undefined')) {
                console.error('Invalid image URL generated for image:', img._key, imageUrl);
                imageUrl = '/images/placeholder-coffee.jpg';
              }
            } catch (error) {
              console.error('Error generating image URL for image:', img._key, error);
              if (process.env.NODE_ENV === 'development') {
                console.error('Image object:', img);
              }
              imageUrl = '/images/placeholder-coffee.jpg';
            }
          }
          return {
            id: img._key,
            image_url: imageUrl,
            alt_text: img.alt || product.name,
            is_primary: img.isPrimary || false,
          };
        }) || [],
      };
    });

    // Set cache headers for better performance
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

    res.status(200).json({
      success: true,
      data: transformedProducts,
      count: transformedProducts.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  }
}
