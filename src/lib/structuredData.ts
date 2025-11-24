// Helper functions to generate structured data (JSON-LD)

export interface OrganizationData {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  contactPoint?: {
    telephone?: string;
    email?: string;
    contactType?: string;
  };
  sameAs?: string[]; // Social media URLs
}

export interface ProductData {
  name: string;
  description: string;
  image?: string | string[];
  sku?: string;
  price: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  brand?: {
    name: string;
  };
  category?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export interface BreadcrumbData {
  items: Array<{
    name: string;
    url: string;
  }>;
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema(data: OrganizationData) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vendettaroasting.com';
  
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
  };

  if (data.logo) {
    schema.logo = data.logo.startsWith('http') ? data.logo : `${siteUrl}${data.logo}`;
  }

  if (data.description) {
    schema.description = data.description;
  }

  if (data.address) {
    schema.address = {
      '@type': 'PostalAddress',
      ...(data.address.street && { streetAddress: data.address.street }),
      ...(data.address.city && { addressLocality: data.address.city }),
      ...(data.address.state && { addressRegion: data.address.state }),
      ...(data.address.zipCode && { postalCode: data.address.zipCode }),
      ...(data.address.country && { addressCountry: data.address.country }),
    };
  }

  if (data.contactPoint) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      ...(data.contactPoint.telephone && { telephone: data.contactPoint.telephone }),
      ...(data.contactPoint.email && { email: data.contactPoint.email }),
      ...(data.contactPoint.contactType && { contactType: data.contactPoint.contactType }),
    };
  }

  if (data.sameAs && data.sameAs.length > 0) {
    schema.sameAs = data.sameAs;
  }

  return schema;
}

/**
 * Generate Product structured data
 */
export function generateProductSchema(data: ProductData) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vendettaroasting.com';
  
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.description,
  };

  if (data.image) {
    const images = Array.isArray(data.image) ? data.image : [data.image];
    schema.image = images.map((img) => 
      img.startsWith('http') ? img : `${siteUrl}${img}`
    );
  }

  if (data.sku) {
    schema.sku = data.sku;
  }

  if (data.brand) {
    schema.brand = {
      '@type': 'Brand',
      name: data.brand.name,
    };
  }

  if (data.category) {
    schema.category = data.category;
  }

  // Offer/Price
  schema.offers = {
    '@type': 'Offer',
    price: data.price,
    priceCurrency: data.currency || 'USD',
    availability: `https://schema.org/${data.availability || 'InStock'}`,
    url: siteUrl, // Product URL should be passed in if available
  };

  if (data.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.aggregateRating.ratingValue,
      reviewCount: data.aggregateRating.reviewCount,
    };
  }

  return schema;
}

/**
 * Generate Breadcrumb structured data
 */
export function generateBreadcrumbSchema(data: BreadcrumbData) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vendettaroasting.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: data.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

/**
 * Generate Website structured data (for homepage)
 */
export function generateWebsiteSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vendettaroasting.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Vendetta Roasting',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/shop?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

