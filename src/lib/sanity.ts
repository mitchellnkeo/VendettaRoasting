import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Sanity client configuration
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production for faster responses
  apiVersion: '2024-01-01', // Use a recent API version
  token: process.env.SANITY_API_TOKEN, // Only needed for write operations
});

// Image URL builder for Sanity images
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Helper function to fetch data with error handling
export async function fetchSanityData<T>(query: string, params?: Record<string, any>): Promise<T> {
  try {
    const data = await sanityClient.fetch<T>(query, params || {});
    return data;
  } catch (error) {
    console.error('Sanity fetch error:', error);
    throw error;
  }
}

