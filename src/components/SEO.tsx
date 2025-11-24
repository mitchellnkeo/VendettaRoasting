import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: object | object[];
  noindex?: boolean;
  canonical?: string;
}

const defaultTitle = 'Vendetta Roasting - Premium Coffee Roasters';
const defaultDescription = 'Premium coffee roasting company offering exceptional coffee beans, subscriptions, and wholesale solutions.';
const defaultImage = '/images/og-image.jpg'; // You can add this image later
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vendettaroasting.com';

export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  structuredData,
  noindex = false,
  canonical,
}: SEOProps) {
  const fullTitle = title ? `${title} | Vendetta Roasting` : defaultTitle;
  const metaDescription = description || defaultDescription;
  const metaImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}${defaultImage}`;
  const metaUrl = url ? (url.startsWith('http') ? url : `${siteUrl}${url}`) : siteUrl;
  const canonicalUrl = canonical ? (canonical.startsWith('http') ? canonical : `${siteUrl}${canonical}`) : metaUrl;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content="Vendetta Roasting" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={metaUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#8B4513" />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(Array.isArray(structuredData) ? structuredData : [structuredData]),
          }}
        />
      )}
    </Head>
  );
}

